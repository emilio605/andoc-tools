#!/usr/bin/env bash
# Instalador de OpenJarvis para Mac, con voz en español y encendido por aplausos.
# Uso:  bash instalar-mac.sh
# Opcional: JARVIS_DIR=/otra/ruta  JARVIS_MODEL=gemma4:e2b  bash instalar-mac.sh
set -uo pipefail

AQUI="$(cd "$(dirname "$0")" && pwd)"
BASE="${JARVIS_DIR:-$HOME/jarvis}"
MODELO="${JARVIS_MODEL:-gemma4:e4b}"

paso()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()    { printf "\033[32m  ✓ %s\033[0m\n" "$1"; }
aviso() { printf "\033[33m  ! %s\033[0m\n" "$1"; }
falla() { printf "\n\033[1;31m✖ %s\033[0m\n" "$1"; exit 1; }

[ "$(uname -s)" = "Darwin" ] || falla "Este script es para Mac. En Windows usa instalar-windows.ps1"

# ---------------------------------------------------------------- herramientas
paso "Etapa 2 (primero, porque sin Git no se puede clonar): reviso uv, Git, Node y Ollama e instalo lo que falte."

if ! command -v brew >/dev/null 2>&1; then
  aviso "Falta Homebrew. Lo instalo; te pedirá la contraseña de tu Mac en esta terminal (no en el navegador)."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" \
    || falla "No se pudo instalar Homebrew. Revisa tu conexión a internet."
  for p in /opt/homebrew/bin/brew /usr/local/bin/brew; do [ -x "$p" ] && eval "$("$p" shellenv)"; done
fi
ok "Homebrew $(brew --version | head -1 | awk '{print $2}')"

for pkg in git node ollama; do
  if ! command -v "$pkg" >/dev/null 2>&1; then
    brew install "$pkg" || falla "brew no pudo instalar $pkg."
  fi
done

node_ok() { node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=22)?0:1)'; }
if ! node_ok; then
  aviso "Tu Node ($(node -v)) es más antiguo que 22.22. Lo actualizo."
  brew upgrade node || brew install node
  hash -r
  node_ok || falla "Node sigue siendo $(node -v). Puede haber otro Node antes en el PATH (nvm, instalador oficial). Desinstálalo o corre 'nvm install 22' y vuelve a intentar."
fi
ok "Git $(git --version | awk '{print $3}') · Node $(node -v)"

if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh || falla "No se pudo instalar uv."
  export PATH="$HOME/.local/bin:$PATH"
fi
ok "uv $(uv --version | awk '{print $2}')"

brew services start ollama >/dev/null 2>&1 || true
for _ in $(seq 1 30); do ollama list >/dev/null 2>&1 && break; sleep 1; done
ollama list >/dev/null 2>&1 || falla "Ollama no arrancó. Prueba: brew services restart ollama"
ok "Ollama $(ollama --version 2>/dev/null | awk '{print $NF}') corriendo"

# ---------------------------------------------------------------------- clonar
paso "Etapa 1: clono OpenJarvis en $BASE y entro en la carpeta."
if [ -d "$BASE/.git" ]; then
  git -C "$BASE" pull --ff-only || aviso "No pude actualizar $BASE; sigo con lo que hay."
else
  git clone https://github.com/open-jarvis/OpenJarvis "$BASE" || falla "Falló git clone. ¿Hay internet?"
fi
cd "$BASE" || falla "No pude entrar en $BASE"
ok "Código en $BASE"

# ------------------------------------------------------------------ uv sync
paso "Etapa 3: instalo las dependencias de Python con escucha (faster-whisper) y voz (Kokoro); uv elige Python 3.10–3.13."
brew install portaudio espeak-ng >/dev/null   # los necesita la voz; adelantado de la etapa 6
if ! uv sync --extra desktop --extra voice; then
  aviso "Falló la instalación. Causa más común en Mac: faltan las herramientas de compilación de Apple."
  xcode-select -p >/dev/null 2>&1 || { xcode-select --install; read -rp "  Cuando termine la ventana de Apple, presiona Enter... "; }
  brew install cmake pkg-config >/dev/null
  uv sync --extra desktop --extra voice || falla "uv sync sigue fallando. Copia el error de arriba y pásamelo."
fi
ok "Python $(uv run python -c 'import platform;print(platform.python_version())')"

# Extensión Rust (instalación manual de la documentación oficial). Opcional: si falla, sigue.
if ! uv run python -c "import openjarvis_rust" >/dev/null 2>&1; then
  aviso "Instalo la extensión Rust (paso manual de la documentación oficial)."
  command -v cargo >/dev/null 2>&1 || { curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y; . "$HOME/.cargo/env"; }
  uv run maturin develop -m rust/crates/openjarvis-python/Cargo.toml \
    && ok "Extensión Rust lista" || aviso "La extensión Rust no compiló; OpenJarvis funciona igual sin ella."
fi

# ----------------------------------------------------------------- modelo
RAM_GB=$(( $(sysctl -n hw.memsize) / 1024 / 1024 / 1024 ))
if [ -z "${JARVIS_MODEL:-}" ] && [ "$RAM_GB" -lt 16 ]; then
  MODELO="gemma4:e2b"
  aviso "Tu Mac tiene ${RAM_GB} GB de RAM: uso gemma4:e2b (7,2 GB) en vez de gemma4:e4b para que no quede lento."
fi
paso "Etapa 4: descargo el modelo local $MODELO (puede tardar bastante)."
ollama pull "$MODELO" || falla "No se pudo descargar $MODELO. ¿Hay espacio en disco e internet?"
ok "Modelo $MODELO listo"

# ----------------------------------------------------------------- config
paso "Etapa 5: creo la configuración con Ollama + $MODELO y el perfil de seguridad personal."
uv run jarvis _bootstrap --write-config --engine ollama --model "$MODELO" || falla "Falló _bootstrap."
uv run jarvis config set security.profile personal

# ------------------------------------------------------------------- voz
paso "Etapa 6: configuro la voz en español (Dora) y la escucha en español."
uv run jarvis config set speech.voice_id ef_dora
uv run jarvis config set speech.language es
if uv run python -c "from kokoro import KPipeline; p=KPipeline(lang_code='e'); list(p('Hola, soy Jarvis.', voice='ef_dora'))" >/dev/null 2>&1; then
  ok "Kokoro habla en español"
else
  aviso "Kokoro no pudo sintetizar; reinstalo espeak-ng."
  brew reinstall espeak-ng
fi

# --------------------------------------------------------------- frontend
paso "Etapa 7: compilo la interfaz web y enciendo el servidor en el puerto 8000."
( cd frontend && npm install && npm run build ) || falla "Falló la compilación de la interfaz (npm)."
uv run jarvis start || aviso "jarvis start dio error; el doctor lo revisa a continuación."

# ------------------------------------------------------------- jarvis-show
paso "Etapa 9: copio el comando de aplausos jarvis-show en $BASE."
cp "$AQUI/jarvis_show.py" "$AQUI/jarvis-show" "$BASE/"
chmod +x "$BASE/jarvis-show"
mkdir -p "$BASE/voz/assets"
ok "Listo: $BASE/jarvis-show (pon tu jingle en $BASE/voz/assets/jingle.mp3 si quieres)"

# ---------------------------------------------------------------- validar
paso "Etapa 8: valido todo con el doctor y una pregunta de prueba."
uv run jarvis doctor || aviso "El doctor marcó problemas (arriba). Pásame esa parte si no se entiende."
uv run jarvis ask "En una frase, ¿quién eres?"
read -rp "  ¿Probar la voz ahora? Habla cuando aparezca el micrófono, Ctrl+C para salir (s/n): " r
[ "$r" = "s" ] && uv run jarvis chat --voice

# ---------------------------------------------------------------- resumen
paso "Etapa 10: resumen."
tam() { du -sh "$1" 2>/dev/null | awk '{print $1}'; }
echo "  Carpeta de OpenJarvis : $BASE  ($(tam "$BASE"))"
echo "  Modelos de Ollama     : $HOME/.ollama/models  ($(tam "$HOME/.ollama/models"))"
echo "  Caché de uv           : $HOME/.cache/uv  ($(tam "$HOME/.cache/uv"))"
echo "  Configuración         : $HOME/.openjarvis"
echo "  Modelo                : $MODELO   ·  Voz: ef_dora (español)"
echo
echo "  Comandos del día a día (dentro de $BASE):"
echo "    ./jarvis-show              → encender con dos aplausos"
echo "    uv run jarvis chat --voice → conversar por voz"
echo "    uv run jarvis start        → interfaz web en http://127.0.0.1:8000"
