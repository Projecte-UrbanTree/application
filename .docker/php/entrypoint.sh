#!/bin/sh
set -e

# Permissions for PHPMyAdmin
mkdir -p /sessions
chmod 777 /sessions

# Disable filemode for git (permission tracking)
cd /var/www
git config core.filemode false

# Install dependencies and run vite dev server
npm install &

# Set permissions for Laravel directories
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

exec "$@"
