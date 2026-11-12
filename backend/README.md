# Back office API — Hockey Management

PHP 8.1+ and MySQL API for the "Próximos eventos" section. A single admin user signs in and manages events (title, date, description, optional link, optional price, photo). It runs on Hostinger shared hosting with no Composer or Node on the server.

## Endpoints (`/api/...`)

| Method | Route | Access |
|---|---|---|
| `GET` | `/events`: upcoming published events, soonest first | public |
| `POST` | `/auth/login` `{username, password}` | public (5 failed attempts per IP lock it for 15 min) |
| `POST` | `/auth/logout` · `GET /auth/me` | admin |
| `GET` `POST` | `/admin/events` | admin |
| `PUT` `DELETE` | `/admin/events/{id}` | admin |
| `POST` `DELETE` | `/admin/events/{id}/image`: multipart field `image`, JPG/PNG/WebP up to 3 MB, re-encoded to WebP | admin |

- **Event JSON:** `{ id, title, description, date (ISO 8601), link, price ("45000.00" | null), currency, imageUrl, published }`.
- **Errors:** `{ error, fields? }`. Status is 422 for validation, 401 when not signed in, 429 when locked.
- **Method override:** if the host filters PUT/DELETE, send `POST` with `X-HTTP-Method-Override: PUT|DELETE`.

## Layout

```
src/Domain          entities, ports (repositories, storage, throttle)
src/Application     validation and authentication use cases
src/Infrastructure  PDO (MySQL/SQLite) and GD adapters
src/Http            Request/Response, session, routes (Api.php)
bootstrap.php       autoloader + composition root
public/index.php    front controller
```

## Local development

```bash
composer install
composer test                       # PHPUnit, SQLite in memory
cp config.example.php config.php    # set 'db' => ['dsn' => 'sqlite:' . __DIR__ . '/local.sqlite'],
                                    #     'cookie_secure' => false, 'uploads_dir' => __DIR__ . '/public/uploads/events'
php -r "(new PDO('sqlite:local.sqlite'))->exec(file_get_contents('database/schema.sqlite.sql'));"
php bin/create-admin.php admin
composer serve                      # http://localhost:8000/api/events
```

## Deploy to Hostinger

1. **Create the database.** In hPanel, go to Databases → Management and create a database and user. Save the name, user and password.
2. **Create the tables.** Open phpMyAdmin, select the database, go to the SQL tab, and paste and run `database/schema.sql`. If the database already existed, run instead the files in `database/migrations/` that it has not had yet, in order (for example `002_add_country.sql` adds the event country; existing events become Argentina).
3. **Upload the code.** Upload the `backend/` folder as `public_html/api/`. Leave out `tests/`, `vendor/`, `local.sqlite` and `phpunit.xml`.
4. **Configure.** Copy `config.example.php` to `config.php` inside `public_html/api/` and fill in the database values. Keep `cookie_secure => true`, `debug => false` and `uploads_dir => __DIR__ . '/../uploads/events'`.
5. **Create the user.** Over SSH, run `cd public_html/api && php bin/create-admin.php <username>`. It asks for the password, which must be at least 12 characters. Running it again replaces the user, which is also how you change the password.
6. **Check.** `https://your-domain.com/api/events` should return `[]`.
7. **Front end + panel.** From the project root, run `npm run build:hostinger`. Then upload the **contents** of `dist/` into `public_html/`. That includes `index.html` (the landing) and `admin/` (the back office). Do not delete `public_html/api/` or `public_html/uploads/`.
   - Landing: `https://your-domain.com/`. "Próximos eventos" shows published upcoming events.
   - Back office: `https://your-domain.com/admin/`.

### Local full stack

Run `composer serve` inside `backend/`, then `VITE_API_URL=/api npm run dev` in the project root. Open `http://localhost:5173/Hm-Page/admin/`. Vite proxies `/api` and `/uploads` to PHP.

The root `.htaccess` sends every request to `public/index.php`, so `config.php`, `src/` and `database/` can never be downloaded. Photos are saved to `public_html/uploads/events/`, with an `.htaccess` that blocks script execution.
