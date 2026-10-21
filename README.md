# Toolora: Small Tools. Big Productivity.

A Laravel 12 + Blade + Tailwind 4 + vanilla-JS online tools site. This package is **Phase 1–3 plus basic accounts** of the master spec: the foundation, the 15 launch tools, search/SEO, and optional accounts with favorites. See [Status](#status-and-limitations) for exactly what is and is not built.

It ships as an overlay applied to a fresh `laravel/laravel` 12 skeleton, so you always get a current, maintained framework and lockfile.

## Requirements
PHP 8.2+ (with `mbstring`, `pdo_mysql`, `xml`, `curl`), Composer 2, Node 20+, MySQL 8 (or MariaDB 10.6+).

## Install
```bash
unzip toolora.zip && cd toolora
./install.sh toolora-app        # creates the Laravel app, applies Toolora, installs npm deps, builds assets
cd toolora-app
```
Create a database and user, then edit `.env`:
```sql
CREATE DATABASE toolora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'toolora'@'localhost' IDENTIFIED BY 'a-strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES ON toolora.* TO 'toolora'@'localhost';
```
```bash
php artisan migrate --seed      # tables + categories + the 15 tools
php artisan serve               # http://localhost:8000   (use `npm run dev` for hot reload)
```
Quick trial without MySQL: set `DB_CONNECTION=sqlite`, remove the other `DB_*` lines, run `touch database/database.sqlite`.

## Tests
```bash
php artisan test                          # PHPUnit: pages, search, SEO, auth, rate limit, favorites, contact, registry integrity
node --test tests/js/core.test.js         # tool logic: JSON, text, Base64, URL, diff, percentage, passwords, UUID, timestamps, regex, meta, QR
```

## Architecture
| Piece | Location |
|---|---|
| Tool registry (names, SEO copy, how-to, FAQs, related) | `config/tools.php`, copied to the DB by `ToolSeeder` |
| Pure tool logic (no DOM, unit-tested) | `resources/js/core.js` |
| Tool UIs, one module per slug, code-split and loaded only on that page | `resources/js/tools/{slug}.js` |
| Shared UI helpers / image pipeline | `resources/js/ui.js`, `resources/js/lib/image.js` |
| Routes / controllers | `routes/web.php`, `app/Http/Controllers` |
| Layout and pages | `resources/views` |

**Adding a tool** (no other code changes): add an entry to `config/tools.php`, create `resources/js/tools/{slug}.js` exporting `default function mount(root)`, run `php artisan db:seed --class=ToolSeeder`. `RegistryTest` fails if a registry entry has no module or content. Existing rows keep their `status`; to hide a tool set `status` to `draft` or `archived` in the DB.

## Production deployment
1. `composer install --no-dev --optimize-autoloader`, `npm ci && npm run build`.
2. `.env`: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://yourdomain`, `SESSION_SECURE_COOKIE=true`, real DB credentials (least-privilege user, see SQL above).
3. `php artisan key:generate --force` (once), `php artisan migrate --force --seed`, `php artisan config:cache route:cache view:cache event:cache`.
4. Point the web root at `public/`. Nginx: `try_files $uri $uri/ /index.php?$query_string;` and deny dotfiles. Serve over HTTPS only (the app forces HTTPS URLs in production).
5. Run `php artisan queue:work` under a supervisor only once you add queued work (none is needed yet).
6. Backups: nightly `mysqldump --single-transaction toolora | gzip` stored off-server; test a restore monthly. The DB holds only users, favorites, tool metadata and contact messages. Tool inputs are never stored.
7. Submit `https://yourdomain/sitemap.xml` in Google Search Console. `robots.txt` is generated and disallows `/dashboard`, `/auth/` and filtered/search URLs.

## Security checklist
- [x] CSRF on all forms (Laravel), server-side validation, Blade output escaping, no `innerHTML` in tool code
- [x] Passwords hashed (bcrypt via model cast), min length 10, session regeneration on login/logout
- [x] Rate limiting on login, registration and contact (`throttle`), covered by a test
- [x] Auth middleware on account pages; favorites scoped to the signed-in user
- [x] Security headers (nosniff, frame, referrer, permissions, HSTS on HTTPS)
- [x] No server-side processing of user files or URLs, so no upload, SSRF or path-traversal surface exists yet
- [x] LIKE wildcards escaped in search; Eloquent bindings throughout
- [x] Secrets only in `.env`, which is git-ignored by Laravel
- [ ] **Add a Content-Security-Policy** once you finalize third-party scripts (ads); start in report-only mode
- [ ] Email verification, password reset, account deletion (see below)
- [ ] Before taking payments or issuing API keys: webhook signature verification, hashed key storage, quotas, audit log

## Privacy and data retention
Tools run entirely in the browser. Server stores: account (name, email, password hash), favorites, contact messages, standard web-server logs. Suggested retention: delete contact messages after 12 months, rotate server logs at 30 days, delete user data on request. `privacy.blade.php` describes the current behavior accurately; update it before adding analytics or ads.

## Monetization guidance (not yet implemented)
- **Ads:** apply to Google AdSense only after the site has real content and traffic; approval is not guaranteed. Then add a CSP-compatible, configurable ad component outside the tool workspace, plus a consent banner where required (EU/UK). Update the privacy page.
- **Payments:** pick a provider that supports your legal entity and country (Stripe where available; otherwise Paddle or Lemon Squeezy as merchant-of-record). Grant premium only from signature-verified webhooks. Never trust client-side success pages. Treat $5.99/mo and $49.99/yr as hypotheses to test.
- **API:** do not expose until keys are hashed, quotas enforced and abuse controls exist. No API endpoints exist in this version.

## Status and limitations
Verified in the build environment: tool logic (14 Node tests), every tool module bundles and mounts in jsdom, interaction checks for 8 tools, QR payloads decode with an independent decoder (jsQR), the Tailwind stylesheet compiles, all PHP files parse. **Not verified here:** the Laravel application itself (PHPUnit, migrations, Blade rendering) and real-browser behavior (image Canvas encoding, downloads, clipboard). The sandbox could not reach Packagist and has no PHP. Run the two test commands above after installing and expect to fix small issues.

| Area | Status |
|---|---|
| 15 launch tools (JSON, image compress/convert, QR, word counter, case, Base64, URL, UUID, password, percentage, meta tags, regex, diff, timestamp) | Implemented |
| Homepage, /tools, categories, search, sort, related tools, sitemap, robots, canonical, OG, JSON-LD, breadcrumbs | Implemented |
| Register / login / logout, favorites, contact form, About / Privacy / Terms | Implemented |
| Light/dark theme, sticky header, mobile menu, accessible skip link | Implemented |
| Remaining ~100 tools (PDF, other image/dev/text/SEO/everyday tools) | **Not built** |
| Email verification, password reset, profile edit, account deletion, preferences | **Not built** |
| Pricing page, subscriptions, payments, premium gating, ads | **Not built** |
| API keys / quotas / API docs | **Not built** |
| Admin dashboard, blog, analytics, usage events, history | **Not built** |
| Image tools: JPEG/PNG/WebP only, no batch ZIP, EXIF is stripped | Limitation |
| `/dashboard/*` routes, not `/dashboard/history` or `/dashboard/api` | Limitation |
| Review `terms` and `privacy` text with a lawyer before launch | Required |

Nothing here guarantees traffic or revenue; both depend on content quality, distribution and demand.
