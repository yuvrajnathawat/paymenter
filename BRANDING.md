## Bazzar Branding Guide

This document summarizes all brand-related variables and where they are configured in the Bazzar application.

### Brand identity

- **App name**: `Bazzar`
- **Company name**: `Bazzar`

Configured in:
- `config/app.php` → `'name' => env('APP_NAME', 'Bazzar')`
- `app/Classes/Settings.php` → General → `company_name` default `Bazzar`

### Brand colors

Primary palette (HEX):
- **Primary**: `#FF6B35` (orange-red)
- **Secondary**: `#004E89` (dark blue)
- **Accent**: `#F7931E` (bright orange)

Approximate HSL values:
- **Primary**: `hsl(16, 100%, 60%)`
- **Secondary**: `hsl(206, 100%, 27%)`
- **Accent**: `hsl(32, 93%, 54%)`

Theme defaults (used by the client theme system):
- `themes/default/theme.php`
  - `primary` (light): `hsl(16, 100%, 60%)`
  - `secondary` (light): `hsl(206, 100%, 27%)`
  - `dark-primary` (dark): `hsl(16, 100%, 60%)`
  - `dark-secondary` (dark): `hsl(206, 100%, 27%)`

CSS variables (used throughout the UI):
- `themes/default/views/layouts/colors.blade.php`
  - `--color-primary` / `--color-secondary` are derived from the theme `primary` and `secondary` values.
  - `--color-warning` is aligned with the **accent** color and is set to `32 93% 54%` (HSL, sans wrapper).

To change brand colors:
1. Update the defaults in `themes/default/theme.php`.
2. If you need to adjust the accent behavior, update `--color-warning` (and other state colors if desired) in `themes/default/views/layouts/colors.blade.php`.

### Logos and favicon

Logos and favicon are fully configurable at runtime via settings:
- `app/Classes/Settings.php` → `general` group:
  - `logo` (light mode logo, stored as `logo-light.webp`)
  - `logo_dark` (dark mode logo, stored as `logo-dark.webp`)
  - `favicon` (browser icon, default filename `favicon.ico`)

Used in:
- `app/Providers/Filament/AdminPanelProvider.php`
  - `->favicon(config('settings.favicon') ? Storage::url(config('settings.favicon')) : null)`
  - `->brandLogo(...)` / `->darkModeBrandLogo(...)`
- `themes/default/views/layouts/app.blade.php`
  - `<link rel="icon" href="{{ Storage::url(config('settings.favicon')) }}">` when a favicon is configured.

To update icons:
1. Upload new logo and favicon assets via the settings UI.
2. The above providers and layouts will automatically pick up the new files.

### Public layout, titles, and meta

- `themes/default/views/layouts/app.blade.php`
  - `<title>` and Open Graph / `<meta name="title">` use `config('app.name', 'Bazzar')` and the current page title.

These values ensure:
- Browser title bars display **Bazzar**.
- Social previews and search meta titles use **Bazzar** as the base brand name.

### Footers and header branding

Main client footer:
- `themes/default/views/components/navigation/footer.blade.php`
  - Brand name displayed via `config('app.name')` (Bazzar).
  - “Powered by” link now points to `https://bazzar.example`.

Admin footer:
- `resources/views/components/admin-footer.blade.php`
  - “Powered by Bazzar © {year}” with link to `https://bazzar.example`.

### API documentation branding

- `config/scramble.php`
  - `info.description` now describes “API documentation for Bazzar” and references Bazzar versioning.

### README / documentation branding

- `README.md`
  - Project title is **Bazzar**.
  - Narrative text (“What is Bazzar?”, feature list, requirements) uses Bazzar as the brand.
  - Upstream Paymenter URLs are preserved where needed to reference original documentation and assets but are labeled as upstream where relevant.

### Where to change branding in the future

For any future rebrand or visual refresh:
- **Names**:
  - Update `config/app.php` and `app/Classes/Settings.php` (`company_name`).
  - Update visible names in `README.md` and any marketing pages/components.
- **Colors**:
  - Update brand color defaults in `themes/default/theme.php`.
  - Adjust state/accent variables in `themes/default/views/layouts/colors.blade.php`.
- **Logos & icons**:
  - Upload new assets via settings (logo, dark logo, favicon).
  - Confirm visual output in the main layout and Filament admin via `AdminPanelProvider`.

