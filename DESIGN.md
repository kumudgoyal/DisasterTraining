# DESIGN SYSTEM — Minimalist Warm Canvas

Inspired by modern human-centric control surfaces (e.g. ambient smart home / Braun / Dieter Rams minimalist dashboards):

## 1. Palette
- **Canvas / Ground**: `#FAF8F5` (Cream 50)
- **Cards**: `#FFFFFF` with ultra-subtle border `rgba(0, 0, 0, 0.05)` and soft floating shadow `0 2px 10px rgba(0,0,0,0.03), 0 10px 30px rgba(0,0,0,0.04)`
- **Ink Primary**: `#111317` (Deep graphite, avoid harsh #000)
- **Ink Muted**: `#4B5261` and `#7E8696`
- **Warm Accents**:
  - Alert / Accent: `#E65D2E`
  - Sage / Success: `#4A7C59`
  - Ochre / Warning: `#D97706`

## 2. Typography
- Display & Body: **Plus Jakarta Sans** (Google Fonts)
- Telemetry & Badges: **JetBrains Mono**
- Hierarchy:
  - Big metric hero: 36px–48px bold
  - Section headers: 14px bold
  - Micro-metadata: 10px–11px monospace / medium

## 3. Shape & Components
- **Radius Rule**: Rounded pills (`rounded-full`) for all interactive triggers, buttons, and badges. Rounded 3xl (`rounded-3xl` / 24px) for cards and maps.
- **Micro-interactions**: Subtle hover elevation (`translate-y-[-2px]`), pill toggles for layer filters and map modes.
