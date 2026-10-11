@echo off
rem jarvis-show (Windows): enciende OpenJarvis con dos aplausos.
rem Uso: jarvis-show            escuchar aplausos
rem      jarvis-show --listar   ver microfonos
rem      jarvis-show --medir    calibrar sensibilidad
cd /d "%~dp0"
uv run python jarvis_show.py %*
