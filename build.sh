#!/usr/bin/env bash
# Descarga las fotos del local desde el repositorio de GitHub
# (se mantienen fuera del deploy inline por su peso binario).
set -e
BASE="https://raw.githubusercontent.com/antoniorenteria/hidrosum-web/main/assets/img"
mkdir -p assets/img
for img in lavadoras.jpg secadoras.jpg hidropuntos.jpg jabon.jpg maquina-detalle.jpg logo-pared.jpg; do
  curl -fsS -o "assets/img/$img" "$BASE/$img"
done
echo "Imágenes descargadas:" && ls -la assets/img
