#!/usr/bin/env bash
# Installs Toolora into a fresh Laravel 12 project.  Usage: ./install.sh [target-dir]
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-toolora-app}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing requirement: $1"; exit 1; }; }
need php; need composer; need node; need npm
php -r 'exit(version_compare(PHP_VERSION, "8.2.0", ">=") ? 0 : 1);' || { echo "PHP 8.2+ required"; exit 1; }
node -e 'process.exit(+process.versions.node.split(".")[0] >= 20 ? 0 : 1)' || { echo "Node 20+ required"; exit 1; }
[ -e "$TARGET" ] && { echo "$TARGET already exists"; exit 1; }

composer create-project laravel/laravel "$TARGET" "^12.0" --prefer-dist --no-interaction
for d in app bootstrap config database resources routes tests; do
  mkdir -p "$TARGET/$d"; cp -R "$HERE/$d/." "$TARGET/$d/"
done
cp "$HERE/.env.example" "$TARGET/.env.example"
rm -f "$TARGET/public/robots.txt" "$TARGET/tests/Feature/ExampleTest.php" "$TARGET/tests/Unit/ExampleTest.php"

cd "$TARGET"
cp .env.example .env
php artisan key:generate --force
npm install
npm install lucide qrcode
npm run build

cat <<MSG

Toolora files are installed in $(pwd)

Next steps:
  1. Create a MySQL database and user, then set DB_* in .env
     (or set DB_CONNECTION=sqlite and create database/database.sqlite for a quick trial).
  2. php artisan migrate --seed
  3. php artisan serve          (and 'npm run dev' in another terminal for hot reload)
  4. php artisan test           and           node --test tests/js/core.test.js
MSG
