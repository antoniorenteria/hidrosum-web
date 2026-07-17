#!/usr/bin/env bash
# Build de Vercel: descarga el sitio completo (HTML, CSS, JS, fotos,
# logos, íconos y fuentes) desde la rama main del repositorio de GitHub
# y lo deja en public/ (nunca sobrescribe este script mientras corre).
# Redeploy trigger: 8b8d765 (Instagram -> @hidrosumx)
set -e
curl -fsSL https://github.com/antoniorenteria/hidrosum-web/archive/refs/heads/main.tar.gz -o repo.tgz
tar xzf repo.tgz
mkdir -p public
cp -r hidrosum-web-main/. public/
rm -rf repo.tgz hidrosum-web-main public/build.sh public/README.md public/.gitignore
echo "Sitio listo:" && find public -type f | sort
