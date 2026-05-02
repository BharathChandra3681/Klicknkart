---
name: Klicknkart

# Core theme tokens map cleanly to the CSS variables already used in src/app/globals.css
colors:
  background: "#ffffff"
  foreground: "#171717"
  background-dark: "#0a0a0a"
  foreground-dark: "#ededed"

  # Brand accents for an e-commerce experience (CTAs, highlights, links)
  primary: "#2563eb"          # blue-600
  on-primary: "#ffffff"
  primary-hover: "#1d4ed8"     # blue-700
  primary-soft: "#dbeafe"      # blue-100

  secondary: "#f59e0b"         # amber-500
  on-secondary: "#111827"      # gray-900
  secondary-hover: "#d97706"   # amber-600
  secondary-soft: "#fffbeb"    # amber-50

  success: "#16a34a"           # green-600
  on-success: "#ffffff"
  danger: "#dc2626"            # red-600
  on-danger: "#ffffff"

  surface: "#ffffff"
  surface-2: "#f9fafb"         # gray-50
  surface-3: "#f3f4f6"         # gray-100
  border: "#e5e7eb"            # gray-200
  muted: "#6b7280"             # gray-500

  link: "{colors.primary}"
  focus-ring: "#60a5fa"        # blue-400

typography:
  # Your app currently uses Geist via next/font/local.
  # Keep these as the default type ramps.
  fontFamilySans: "Geist, var(--font-geist-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
  fontFamilyMono: "Geist Mono, var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"

  display-lg:
    fontFamily: "{typography.fontFamilySans}"
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: "{typography.fontFamilySans}"
    fontSize: 32px
    fontWeight: "650"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: "{typography.fontFamilySans}"
    fontSize: 24px
    fontWeight: "650"
    lineHeight: 32px
  body-md:
    fontFamily: "{typography.fontFamilySans}"
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: "{typography.fontFamilySans}"
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: "{typography.fontFamilySans}"
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: "{typography.fontFamilySans}"
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.04em

rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px

spacing:
  unit: 8px
  container-padding: 24px
  section-gap: 32px
  card-gap: 16px

components:
  # Buttons
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 0 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 0 16px
  button-secondary-hover:
    backgroundColor: "{colors.secondary-hover}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 0 16px

  # Inputs
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    placeholderColor: "{colors.muted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 0 12px
  input-field-focus:
    borderColor: "{colors.focus-ring}"

  # Cards / Product tiles
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    rounded: "{rounded.xl}"
    padding: 16px
  card-muted:
    backgroundColor: "{colors.surface-2}"

  # Badges
  badge:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-success}"
  badge-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
---

## Brand & Style

**Klicknkart** is a modern e-commerce storefront for stationery and computer hardware. The UI should feel:

- **Trustworthy and fast** (clear hierarchy, obvious CTAs)
- **Product-first** (content and imagery lead; UI supports)
- **Minimal but warm** (neutral surfaces with a crisp blue primary)

Use restrained visual effects; prioritize performance and readability.

## Color Usage

- **Primary (Blue):** the main CTA color (Add to cart, Checkout, Continue, Apply).
- **Secondary (Amber):** promotional accents (Sale, Limited time) and highlights that should not compete with primary actions.
- **Neutrals:** keep backgrounds and surfaces clean; prefer borders over heavy shadows.
- **Feedback colors:** green for success (added, paid), red for destructive (remove, failed).

### Light/Dark Mode

The app currently defines theme via CSS variables in `src/app/globals.css` (`--background`, `--foreground`) with a `prefers-color-scheme: dark` override. Keep that mechanism as the source of truth.

## Typography

- Use **Geist Sans** for all UI.
- Use **Geist Mono** only for technical values (order IDs, tokens, code-like snippets).
- Headings should be slightly tighter (negative letter spacing), body copy normal.

## Layout & Spacing

- Base grid: **8px**.
- Prefer max-width containers with generous padding (24px desktop, 16px mobile).
- Product grids: 2 cols (mobile), 3–4 cols (desktop) with 16px gaps.

## Components

### Buttons

- Primary buttons are filled (blue) and reserved for the “next step”.
- Secondary buttons can be amber for promos or neutral ghost buttons for less prominent actions.

### Inputs

- Inputs are bordered, not filled-heavy.
- Focus state uses a visible focus ring color.

### Cards (Product tiles)

- Use rounded-xl and a thin border.
- Shadows are optional; if used, keep subtle (low opacity, small blur) to avoid visual noise.

## Accessibility

- Maintain AA contrast for text on surfaces.
- Ensure focus states are clearly visible (do not rely only on color changes).
- Click targets: at least 44px height for primary touch interactions.
