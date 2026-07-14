#!/usr/bin/env bash
# Descarga todos los assets binarios (fotos, logos SVG, íconos y fuentes)
# desde el repositorio de GitHub durante el build de Vercel.
set -e
curl -fsSL https://github.com/antoniorenteria/hidrosum-web/archive/refs/heads/main.tar.gz -o repo.tgz
tar xzf repo.tgz
mkdir -p assets
cp -r hidrosum-web-main/assets/. assets/
rm -rf repo.tgz hidrosum-web-main
echo "Assets listos:" && find assets -type f | sort
