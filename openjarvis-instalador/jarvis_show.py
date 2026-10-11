"""jarvis-show: enciende OpenJarvis con dos aplausos.

Escucha el micrófono; al detectar dos aplausos seguidos:
  1. reproduce voz/assets/jingle.mp3 (si existe),
  2. levanta el servidor (uv run jarvis start) y abre la interfaz web,
  3. inicia la conversación por voz (uv run jarvis chat --voice).
Al salir del chat vuelve a escuchar aplausos. Ctrl+C para terminar.

Variables de entorno:
  JARVIS_CLAP_THRESH  sensibilidad, de 0.05 a 1.0 (por defecto 0.35).
                      Más bajo = más sensible; más alto = exige aplauso más fuerte.
  JARVIS_MIC          micrófono: número de dispositivo o parte de su nombre.
                      Vacío = micrófono por defecto del sistema.
  JARVIS_URL          interfaz web (por defecto http://127.0.0.1:8000).

Opciones:
  --listar   muestra los micrófonos disponibles y sale.
  --medir    muestra el volumen en vivo para calibrar JARVIS_CLAP_THRESH.
"""

from __future__ import annotations

import os
import platform
import queue
import shutil
import socket
import subprocess
import sys
import time
import webbrowser
from pathlib import Path
from urllib.parse import urlparse

import numpy as np

RATE = 16000
BLOCK = 512  # 32 ms por bloque
MIN_GAP = 0.12  # segundos mínimos entre aplausos (evita contar el eco)
MAX_GAP = 0.9  # segundos máximos entre el primer y el segundo aplauso
SPIKE = 4.0  # el aplauso debe superar 4 veces el ruido de fondo

JARVIS_DIR = Path(__file__).resolve().parent
JINGLE = JARVIS_DIR / "voz" / "assets" / "jingle.mp3"


class ClapDetector:
    """Detecta dos aplausos seguidos a partir de bloques de audio (float32, -1..1)."""

    def __init__(self, thresh: float, rate: int = RATE) -> None:
        self.thresh = thresh
        self.rate = rate
        self.noise = 0.01  # ruido de fondo (RMS) que se va adaptando
        self.t = 0.0
        self.last_clap: float | None = None

    def feed(self, block: np.ndarray) -> bool:
        """Procesa un bloque. Devuelve True cuando completa un doble aplauso."""
        now = self.t
        self.t += len(block) / self.rate
        peak = float(np.max(np.abs(block))) if len(block) else 0.0
        rms = float(np.sqrt(np.mean(block.astype(np.float64) ** 2))) if len(block) else 0.0

        is_clap = peak >= self.thresh and rms >= SPIKE * self.noise
        if not is_clap:
            # Solo los bloques "tranquilos" actualizan el ruido de fondo.
            self.noise = 0.95 * self.noise + 0.05 * max(rms, 1e-4)
            if self.last_clap is not None and now - self.last_clap > MAX_GAP:
                self.last_clap = None
            return False

        if self.last_clap is None:
            self.last_clap = now
            return False
        gap = now - self.last_clap
        if gap < MIN_GAP:
            return False  # mismo aplauso (cola o eco)
        if gap <= MAX_GAP:
            self.last_clap = None
            return True
        self.last_clap = now  # demasiado lejos: cuenta como un nuevo primer aplauso
        return False


def _env_thresh() -> float:
    raw = os.environ.get("JARVIS_CLAP_THRESH", "0.35")
    try:
        value = float(raw.replace(",", "."))
    except ValueError:
        sys.exit(f"JARVIS_CLAP_THRESH='{raw}' no es un número. Usa algo como 0.35")
    return min(max(value, 0.05), 1.0)


def _env_mic(sd):
    raw = os.environ.get("JARVIS_MIC", "").strip()
    if not raw:
        return None
    if raw.isdigit():
        return int(raw)
    for i, dev in enumerate(sd.query_devices()):
        if dev["max_input_channels"] > 0 and raw.lower() in dev["name"].lower():
            return i
    sys.exit(f"No encontré un micrófono que contenga '{raw}'. Corre: jarvis-show --listar")


def _list_mics(sd) -> None:
    default_in = sd.default.device[0]
    print("Micrófonos disponibles (usa el número o parte del nombre en JARVIS_MIC):")
    for i, dev in enumerate(sd.query_devices()):
        if dev["max_input_channels"] > 0:
            mark = "  <- por defecto" if i == default_in else ""
            print(f"  {i:>3}  {dev['name']}{mark}")


def _play_jingle(sd) -> None:
    if not JINGLE.exists():
        return
    try:
        import soundfile as sf

        data, rate = sf.read(str(JINGLE), dtype="float32")
        sd.play(data, rate)
        sd.wait()
    except Exception:
        if platform.system() == "Darwin":
            subprocess.call(["afplay", str(JINGLE)])
        else:
            print("(No pude reproducir el jingle; sigo igual.)")


def _uv() -> list[str]:
    uv = shutil.which("uv")
    if not uv:
        sys.exit("No encuentro 'uv' en el PATH. Abre una terminal nueva e intenta otra vez.")
    return [uv, "run", "jarvis"]


def _port_open(host: str, port: int) -> bool:
    try:
        with socket.create_connection((host, port), timeout=0.5):
            return True
    except OSError:
        return False


def _open_ui(url: str) -> None:
    parsed = urlparse(url)
    host, port = parsed.hostname or "127.0.0.1", parsed.port or 8000
    if not _port_open(host, port):
        print("Encendiendo el servidor de OpenJarvis...")
        subprocess.call(_uv() + ["start"], cwd=JARVIS_DIR)
        for _ in range(60):
            if _port_open(host, port):
                break
            time.sleep(1)
        else:
            print(f"El servidor no respondió en {url}. Revisa con: uv run jarvis doctor")
            return
    webbrowser.open(url)


def _listen(sd, detector: ClapDetector, device) -> None:
    blocks: queue.Queue = queue.Queue()

    def callback(indata, frames, time_info, status):  # noqa: ARG001
        blocks.put(indata[:, 0].copy())

    with sd.InputStream(
        samplerate=RATE, blocksize=BLOCK, channels=1, dtype="float32",
        device=device, callback=callback,
    ):
        while True:
            if detector.feed(blocks.get()):
                return


def _measure(sd, device) -> None:
    print("Mostrando el pico de volumen. Aplaude para ver cuánto marca. Ctrl+C para salir.")

    def callback(indata, frames, time_info, status):  # noqa: ARG001
        peak = float(np.max(np.abs(indata)))
        bar = "#" * int(peak * 50)
        print(f"\r{peak:4.2f} {bar:<50}", end="", flush=True)

    with sd.InputStream(samplerate=RATE, blocksize=BLOCK, channels=1,
                        dtype="float32", device=device, callback=callback):
        while True:
            time.sleep(0.1)


def main() -> None:
    try:
        import sounddevice as sd
    except Exception as exc:  # PortAudio ausente, etc.
        sys.exit(f"No pude abrir el audio ({exc}). En Mac: brew install portaudio")

    if "--listar" in sys.argv:
        _list_mics(sd)
        return
    device = _env_mic(sd)
    if "--medir" in sys.argv:
        _measure(sd, device)
        return

    thresh = _env_thresh()
    url = os.environ.get("JARVIS_URL", "http://127.0.0.1:8000")
    mic_name = sd.query_devices(device, "input")["name"]
    while True:
        print(f"\nEsperando dos aplausos... (mic: {mic_name}, sensibilidad: {thresh})")
        _listen(sd, ClapDetector(thresh), device)
        print("¡Aplausos detectados! Encendiendo Jarvis.")
        _play_jingle(sd)
        _open_ui(url)
        # El micrófono ya se liberó: el chat de voz lo puede usar.
        subprocess.call(_uv() + ["chat", "--voice"], cwd=JARVIS_DIR)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nHasta luego.")
