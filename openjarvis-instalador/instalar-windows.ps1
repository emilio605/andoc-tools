# Instalador de OpenJarvis para Windows, con voz en español y encendido por aplausos.
# Uso (PowerShell):  powershell -ExecutionPolicy Bypass -File .\instalar-windows.ps1
# Opcional: $env:JARVIS_DIR="D:\jarvis"; $env:JARVIS_MODEL="gemma4:e2b"

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$Aqui   = $PSScriptRoot
$Base   = if ($env:JARVIS_DIR) { $env:JARVIS_DIR } else { Join-Path $HOME "jarvis" }
$Modelo = if ($env:JARVIS_MODEL) { $env:JARVIS_MODEL } else { "gemma4:e4b" }

function Paso($t)  { Write-Host "`n> $t" -ForegroundColor Cyan }
function Ok($t)    { Write-Host "  OK $t" -ForegroundColor Green }
function Aviso($t) { Write-Host "  !  $t" -ForegroundColor Yellow }
function Falla($t) { Write-Host "`nX $t" -ForegroundColor Red; exit 1 }
function Tiene($c) { [bool](Get-Command $c -ErrorAction SilentlyContinue) }
# Equivale a abrir una terminal nueva: recarga el PATH después de instalar.
function Recargar-Path {
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
              [Environment]::GetEnvironmentVariable("Path", "User")
}

# ---------------------------------------------------------------- herramientas
Paso "Etapa 2 (primero, porque sin Git no se puede clonar): reviso uv, Git, Node y Ollama e instalo lo que falte."
if (-not (Tiene winget)) { Falla "Falta winget. Instala 'App Installer' desde la Microsoft Store y vuelve a correr el script." }

$paquetes = @{ uv = "astral-sh.uv"; git = "Git.Git"; node = "OpenJS.NodeJS.LTS"; ollama = "Ollama.Ollama" }
foreach ($cmd in $paquetes.Keys) {
  if (-not (Tiene $cmd)) {
    winget install -e --id $paquetes[$cmd] --accept-source-agreements --accept-package-agreements
    if ($LASTEXITCODE -ne 0) { Falla "winget no pudo instalar $($paquetes[$cmd])." }
  }
}
Recargar-Path

$nodeVer = [version]((node -v) -replace '^v', '')
if ($nodeVer -lt [version]"22.22.0") {
  Aviso "Tu Node ($nodeVer) es más antiguo que 22.22. Lo actualizo."
  winget upgrade -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
  Recargar-Path
  $nodeVer = [version]((node -v) -replace '^v', '')
  if ($nodeVer -lt [version]"22.22.0") { Falla "Node sigue en $nodeVer. Desinstala otras versiones de Node (nvm-windows, etc.) y reintenta." }
}
Ok "Git $((git --version) -replace 'git version ','') · Node $nodeVer · $(uv --version)"

# Ollama en Windows corre como app en segundo plano; si no responde, la arranco.
ollama list *> $null
if ($LASTEXITCODE -ne 0) {
  Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
  for ($i = 0; $i -lt 30; $i++) { Start-Sleep 1; ollama list *> $null; if ($LASTEXITCODE -eq 0) { break } }
  if ($LASTEXITCODE -ne 0) { Falla "Ollama no arrancó. Ábrelo desde el menú Inicio y reintenta." }
}
Ok "Ollama corriendo"

# ---------------------------------------------------------------------- clonar
Paso "Etapa 1: clono OpenJarvis en $Base y entro en la carpeta."
if (Test-Path (Join-Path $Base ".git")) {
  git -C $Base pull --ff-only
} else {
  git clone https://github.com/open-jarvis/OpenJarvis $Base
  if ($LASTEXITCODE -ne 0) { Falla "Falló git clone. ¿Hay internet?" }
}
Set-Location $Base
Ok "Código en $Base"

# ------------------------------------------------------------------ uv sync
Paso "Etapa 3: instalo las dependencias de Python con escucha (faster-whisper) y voz (Kokoro); uv elige Python 3.10–3.13."
uv sync --extra desktop --extra voice
if ($LASTEXITCODE -ne 0) {
  Aviso "Falló la instalación. Causa más común en Windows: faltan las herramientas de compilación de C++."
  winget install -e --id Microsoft.VisualStudio.2022.BuildTools --accept-source-agreements --accept-package-agreements `
    --override "--quiet --wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
  uv sync --extra desktop --extra voice
  if ($LASTEXITCODE -ne 0) { Falla "uv sync sigue fallando. Copia el error de arriba y pásamelo." }
}
Ok "Python $(uv run python -c 'import platform;print(platform.python_version())')"

# Extensión Rust (instalación manual de la documentación oficial). Opcional: si falla, sigue.
uv run python -c "import openjarvis_rust" *> $null
if ($LASTEXITCODE -ne 0) {
  Aviso "Instalo la extensión Rust (paso manual de la documentación oficial)."
  if (-not (Tiene cargo)) {
    winget install -e --id Rustlang.Rustup --accept-source-agreements --accept-package-agreements
    Recargar-Path
  }
  uv run maturin develop -m rust/crates/openjarvis-python/Cargo.toml
  if ($LASTEXITCODE -eq 0) { Ok "Extensión Rust lista" } else { Aviso "La extensión Rust no compiló; OpenJarvis funciona igual sin ella." }
}

# ----------------------------------------------------------------- modelo
$ramGB = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB)
if (-not $env:JARVIS_MODEL -and $ramGB -lt 16) {
  $Modelo = "gemma4:e2b"
  Aviso "Tu PC tiene $ramGB GB de RAM: uso gemma4:e2b (7,2 GB) en vez de gemma4:e4b para que no quede lento."
}
Paso "Etapa 4: descargo el modelo local $Modelo (puede tardar bastante)."
ollama pull $Modelo
if ($LASTEXITCODE -ne 0) { Falla "No se pudo descargar $Modelo. ¿Hay espacio en disco e internet?" }

# ----------------------------------------------------------------- config
Paso "Etapa 5: creo la configuración con Ollama + $Modelo y el perfil de seguridad personal."
uv run jarvis _bootstrap --write-config --engine ollama --model $Modelo
if ($LASTEXITCODE -ne 0) { Falla "Falló _bootstrap." }
uv run jarvis config set security.profile personal

# ------------------------------------------------------------------- voz
Paso "Etapa 6: configuro la voz en español (Dora) y la escucha en español; eSpeak NG ya vino en la etapa 3."
uv run jarvis config set speech.voice_id ef_dora
uv run jarvis config set speech.language es
$prueba = "from kokoro import KPipeline; p=KPipeline(lang_code='e'); list(p('Hola, soy Jarvis.', voice='ef_dora'))"
$salida = uv run python -c $prueba 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) {
  if ($salida -match "espeak") {
    Aviso "Kokoro se queja de espeak: instalo eSpeak NG aparte y grabo PHONEMIZER_ESPEAK_LIBRARY."
    winget install -e --id eSpeak-NG.eSpeak-NG --accept-source-agreements --accept-package-agreements
    $dll = "C:\Program Files\eSpeak NG\libespeak-ng.dll"
    setx PHONEMIZER_ESPEAK_LIBRARY "$dll" | Out-Null
    $env:PHONEMIZER_ESPEAK_LIBRARY = $dll
  } else {
    Aviso "Kokoro falló por otra causa:`n$salida"
  }
} else { Ok "Kokoro habla en español" }

# --------------------------------------------------------------- frontend
Paso "Etapa 7: compilo la interfaz web y enciendo el servidor en el puerto 8000."
Push-Location frontend
npm install; if ($LASTEXITCODE -eq 0) { npm run build }
if ($LASTEXITCODE -ne 0) { Pop-Location; Falla "Falló la compilación de la interfaz (npm)." }
Pop-Location
uv run jarvis start

# ------------------------------------------------------------- jarvis-show
Paso "Etapa 9: copio el comando de aplausos jarvis-show en $Base."
Copy-Item (Join-Path $Aqui "jarvis_show.py"), (Join-Path $Aqui "jarvis-show.cmd") $Base -Force
New-Item -ItemType Directory -Force (Join-Path $Base "voz\assets") | Out-Null
Ok "Listo: $Base\jarvis-show.cmd (pon tu jingle en $Base\voz\assets\jingle.mp3 si quieres)"

# ---------------------------------------------------------------- validar
Paso "Etapa 8: valido todo con el doctor y una pregunta de prueba."
uv run jarvis doctor
if ($LASTEXITCODE -ne 0) { Aviso "El doctor marcó problemas (arriba). Pásame esa parte si no se entiende." }
uv run jarvis ask "En una frase, ¿quién eres?"
$r = Read-Host "  ¿Probar la voz ahora? Habla cuando aparezca el micrófono, Ctrl+C para salir (s/n)"
if ($r -eq "s") { uv run jarvis chat --voice }

# ---------------------------------------------------------------- resumen
Paso "Etapa 10: resumen."
function Tam($p) {
  if (Test-Path $p) { "{0:N1} GB" -f ((Get-ChildItem $p -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum / 1GB) } else { "-" }
}
$uvCache = Join-Path $env:LOCALAPPDATA "uv\cache"
Write-Host "  Carpeta de OpenJarvis : $Base  ($(Tam $Base))"
Write-Host "  Modelos de Ollama     : $HOME\.ollama\models  ($(Tam "$HOME\.ollama\models"))"
Write-Host "  Caché de uv           : $uvCache  ($(Tam $uvCache))"
Write-Host "  Configuración         : $HOME\.openjarvis"
Write-Host "  Modelo                : $Modelo   ·  Voz: ef_dora (español)"
Write-Host ""
Write-Host "  Comandos del día a día (dentro de $Base):"
Write-Host "    .\jarvis-show              -> encender con dos aplausos"
Write-Host "    uv run jarvis chat --voice -> conversar por voz"
Write-Host "    uv run jarvis start        -> interfaz web en http://127.0.0.1:8000"
