#!/usr/bin/env bash
# Build de Vercel: descarga el sitio completo (HTML, CSS, JS, fotos,
# logos, íconos y fuentes) desde la rama main del repositorio de GitHub.
set -e
curl -fsSL https://github.com/antoniorenteria/hidrosum-web/archive/refs/heads/main.tar.gz -o repo.tgz
tar xzf repo.tgz
cp -r hidrosum-web-main/. .
rm -rf repo.tgz hidrosum-web-main
echo "Sitio listo:" && find . -type f -not -path "./.git*" | sort
