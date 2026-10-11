# OpenJarvis en español, encendido por aplausos

Copia esta carpeta completa a tu computadora y corre el instalador que corresponda.
Todo queda local; no necesita claves de API.

## Mac
```bash
cd ~/Downloads/openjarvis-instalador
bash instalar-mac.sh
```
Si falta Homebrew, el instalador lo pone y te pide la contraseña de tu Mac **en la terminal**.

## Windows (PowerShell)
```powershell
cd $HOME\Downloads\openjarvis-instalador
powershell -ExecutionPolicy Bypass -File .\instalar-windows.ps1
```

Opcional, antes de correrlo: `JARVIS_DIR` (dónde instalar, por defecto `~/jarvis`) y
`JARVIS_MODEL` (por defecto `gemma4:e4b`; con menos de 16 GB de RAM usa `gemma4:e2b` solo).

## jarvis-show: encender con dos aplausos

Dentro de la carpeta `jarvis`:

| | Mac | Windows |
|---|---|---|
| Escuchar aplausos | `./jarvis-show` | `.\jarvis-show` |
| Ver micrófonos | `./jarvis-show --listar` | `.\jarvis-show --listar` |
| Calibrar | `./jarvis-show --medir` | `.\jarvis-show --medir` |

Al oír dos aplausos (entre 0,12 y 0,9 s de separación): suena `voz/assets/jingle.mp3` si existe,
se enciende el servidor, se abre http://127.0.0.1:8000 y empieza `uv run jarvis chat --voice`.
Al cerrar el chat vuelve a esperar aplausos. `Ctrl+C` para salir.

### Sensibilidad (`JARVIS_CLAP_THRESH`, de 0.05 a 1.0, por defecto 0.35)
1. Corre `jarvis-show --medir`, aplaude y mira el número que marca.
2. Usa un valor un poco **menor** que tus aplausos y **mayor** que tu voz o el ruido.
   - No reacciona → baja el número (ej. 0.2).
   - Se enciende solo con ruidos → súbelo (ej. 0.5).

```bash
JARVIS_CLAP_THRESH=0.2 ./jarvis-show            # Mac, solo esta vez
echo 'export JARVIS_CLAP_THRESH=0.2' >> ~/.zshrc  # Mac, permanente
```
```powershell
$env:JARVIS_CLAP_THRESH="0.2"; .\jarvis-show     # Windows, solo esta vez
setx JARVIS_CLAP_THRESH 0.2                      # Windows, permanente (terminal nueva)
```

### Micrófono (`JARVIS_MIC`)
Número o parte del nombre que muestra `--listar`, por ejemplo `JARVIS_MIC=AirPods`.
Vacío = micrófono por defecto. El chat de voz de OpenJarvis usa siempre el micrófono
por defecto del sistema, así que conviene elegir el mismo en Ajustes de sonido.
