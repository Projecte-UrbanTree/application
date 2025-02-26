# Urbantree Application Development Kit

- Laravel v11.x
- PHP v8.3.x
- MariaDB v10.11.x
- phpMyAdmin v5.x
- Mailpit v1.x
- Node.js v18.x
- NPM v10.x
- Yarn v1.x
- Vite v5.x
- Rector v1.x
- Redis v7.2.x
- React v19 (TypeScript)

# Requirements

- Stable version of [Docker](https://docs.docker.com/engine/install/)
- Compatible version of [Docker Compose](https://docs.docker.com/compose/install/#install-compose)

# How to Run

1. **Run the DevContainer**:
   Make sure you have [Visual Studio Code](https://code.visualstudio.com/) with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed.

   Once installed, open your project in VS Code and reopen it in the dev container using the `Reopen in Container` command.

2. **Initialize the Project**:
   After the dev container starts, run `composer setup` to install dependencies and set up the application. You are now ready to start developing!

# Notes

### Laravel App

- URL: <http://localhost>

### Mailpit

- URL: <http://localhost:8025>

### phpMyAdmin

- URL: <http://localhost:8080>
- Server: `db`
- Username: `urbantree`
- Password: `urbantree`
- Database: `urbantree`

### Basic docker compose commands

- Build or rebuild services
  - `docker compose build`
- Create and start containers
  - `docker compose up -d`
- Stop and remove containers, networks
  - `docker compose down`
- Stop all services
  - `docker compose stop`
- Restart service containers
  - `docker compose restart`
- Run a command inside a container
  - `docker compose exec [container] [command]`

### Useful Laravel Commands

- Display basic information about your application
  - `php artisan about`
- Remove the configuration cache file
  - `php artisan config:clear`
- Flush the application cache
  - `php artisan cache:clear`
- Clear all cached events and listeners
  - `php artisan event:clear`
- Delete all of the jobs from the specified queue
  - `php artisan queue:clear`
- Remove the route cache file
  - `php artisan route:clear`
- Clear all compiled view files
  - `php artisan view:clear`
- Remove the compiled class file
  - `php artisan clear-compiled`
- Remove the cached bootstrap files
  - `php artisan optimize:clear`
- Delete the cached mutex files created by scheduler
  - `php artisan schedule:clear-cache`
- Flush expired password reset tokens
  - `php artisan auth:clear-resets`

### Laravel Pint (Code Style Fixer | PHP-CS-Fixer)

- Format all files
  - `vendor/bin/pint`
- Format specific files or directories
  - `vendor/bin/pint app/Models`
  - `vendor/bin/pint app/Models/User.php`
- Format all files with preview
  - `vendor/bin/pint -v`
- Format uncommitted changes according to Git
  - `vendor/bin/pint --dirty`
- Inspect all files
  - `vendor/bin/pint --test`

### Rector

- Dry Run
  - `vendor/bin/rector process --dry-run`
- Process
  - `vendor/bin/rector process`

# Credits

This development kit is based on the original template kit from [Refactorian's Laravel Docker Starter Kit](https://github.com/refactorian/laravel-docker).
