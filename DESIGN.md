---
name: Regulatory & Mining Safety Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#565d7a'
  on-secondary: '#ffffff'
  secondary-container: '#d5dbfd'
  on-secondary-container: '#59607c'
  tertiary: '#bb0112'
  on-tertiary: '#ffffff'
  tertiary-container: '#e02928'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#bfc5e6'
  on-secondary-fixed: '#131a33'
  on-secondary-fixed-variant: '#3f4661'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  mono-metric:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.03em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  mono-hash:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system serves high-stakes enterprise regulatory intelligence, statutory inspection governance, and life-critical mining telemetry for the Directorate General of Mines Safety (DGMS) and the Ministry of Coal. The interface targets statutory safety inspectors, mine directors, geological technicians, and enforcement officers who require real-time clarity under intense operational scrutiny.

The design movement is **Technical Modern Utilitarianism**:
- Uncompromised clarity with zero decorative ornamentation.
- Authoritative institutional weight through high-contrast structural demarcation.
- Mission-critical alerts and regulatory mandates prioritized through clinical color distribution.
- Telemetry-grade precision using mono-spaced alignments for statutory logs, methane/seismic telemetry, chain-of-custody SHA-256 hashes, and geo-coordinates.

## Colors

The palette balances government-grade institutional authority with immediate visual prioritization for hazardous underground and open-cast operations.

### Core Swatches
- **Canvas Base (`#F4F6FA`)**: A cool, clinical off-white canvas that minimizes screen glare in low-light command centers while preserving contrast against pure white cards.
- **Surface Elevation (`#FFFFFF`)**: Pristine white container surface for maximum contrast against data points and telemetry readouts.
- **Primary / Regulatory Blue (`#0284C7`)**: Designates statutory actions, active interactive elements, and official regulatory citations.
- **Secondary / Deep Slate Navy (`#181F38`)**: Anchor color reserved for persistent navigation sidebars, mastheads, and formal statutory document hierarchy.
- **Tertiary / Evacuation Alert Red (`#DC2626`)**: Critical safety threshold breaches, emergency ventilation failures, immediate evacuation triggers, and fatal hazard logging.

### Functional Status Tokens
- **Caution / Warning Amber (`#D97706`)**: Elevated particulate counts, statutory inspection deadlines under 48 hours, and non-fatal permit violations.
- **Success / Compliance Emerald (`#16A34A`)**: Certified clearances, active ventilation parity, biometric muster sign-offs, and verified digital signatures.
- **Structural Border Stroke (`#CBD5E1`)**: Precise, invariant 1px boundary dividing data grids and cards.
- **Text Primary (`#0F172A`)**: High-contrast slate-black for legal text, regulatory codes, and critical metrics.
- **Text Muted / Data Labels (`#64748B`)**: Secondary slate for units of measurement, non-critical metadata, and column headers.

## Typography

The dual-type hierarchy cleanly divides administrative intelligence from physical telemetry:
- **Inter** executes all administrative documentation, statutory gazettes, user workflows, and structural navigation with neutral optical authority.
- **JetBrains Mono** governs machine readouts, real-time sensor streams (CH4, CO, strata displacement), digital signatures, ledger hashes, seam identifiers, and GPS coordinates.

Tabular figures (`tnum`) must be enforced across all quantitative representations to prevent jitter during live telemetry updates.

## Layout & Spacing

The structural layout relies on an anchored desktop-first, telemetry-dense 12-column fluid grid, locked to a fixed 260px navigation rail on the left.

### Density & Breakpoints
- **Desktop (1440px and above)**: Full operational overview. 12-column grid, 1.25rem (`20px`) gutters, and 1.5rem (`24px`) margins. Sidebar pinned.
- **Tablet / Field Terminal (768px – 1439px)**: 8-column layout. Navigation folds into an expandable mini-rail (64px width). Margins reduce to `1.25rem`.
- **Mobile Handheld (320px – 767px)**: Single-column linear stack. Grid collapses to 4 columns. Gutter shrinks to `0.75rem`, margins collapse to `1rem`. Critical alert tickers pin directly to viewport top.

Internal component spacing follows an absolute 4px baseline rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 32px) to guarantee deterministic alignment of statutory data grids.

## Elevation & Depth

Visual hierarchy uses low-amplitude, high-clarity surface containment rather than heavy drop shadows:
- **Baseline Surface**: Canvas (`#F4F6FA`) sits at level 0.
- **Data Containers & Cards**: White cards (`#FFFFFF`) rest with a continuous structural `1px solid #CBD5E1` border and a crisp micro-shadow: `0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)`.
- **Active Inspection Trays & Contextual Drawers**: Elevated overlays utilize `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)` flanked by an explicit `1px solid #CBD5E1` border.
- **Critical Evacuation / Emergency Modals**: High-contrast layered backdrop at 60% opacity (`#0F172A99`) with a direct white card framed in a mandatory `2px solid #DC2626` threshold line. No blur filters are used; edge contrast remains razor-sharp.

## Shapes

The design system enforces a disciplined, engineering-centric geometric form factor. Radii are kept small (`0.25rem` / `4px` baseline) to maintain structural density and eliminate wasted whitespace in data-heavy inspection grids.

- **Standard Containers, Panels, & Cards**: `4px` (`rounded-sm`).
- **Data Chips, Status Pills, & Input Controls**: `4px` (`rounded-sm`).
- **Telemetry Indicators & Badges**: `2px` to preserve rectangular metric bounding.
- **Emergency Overlays**: `4px` with sharp internal visual anchors.

## Components

### Buttons
- **Primary Statutory Action**: Fill `#0284C7`, text `#FFFFFF`, height 36px, radius 4px, padding 0 16px, font `Inter` 13px weight 600. Focus ring: 2px offset with `#0284C7`.
- **Secondary / Action Secondary**: Fill `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`. Hover: `#F8FAFC`.
- **Critical / Stop-Work Order**: Fill `#DC2626`, text `#FFFFFF`. Hover: `#B91C1C`.
- **Terminal State Disabled**: Fill `#E2E8F0`, border none, text `#94A3B8`.

### Chips & Badges
- **Statutory Status Badges**: Height 20px, font `JetBrains Mono` 11px weight 500, uppercase, radius 2px, padding 2px 6px.
  - *Compliant*: Background `#DCFCE7`, border `1px solid #86EFAC`, text `#166534`.
  - *Attention*: Background `#FEF3C7`, border `1px solid #FCD34D`, text `#92400E`.
  - *Danger / Violation*: Background `#FEE2E2`, border `1px solid #FCA5A5`, text `#991B1B`.

### Lists & Data Tables
- **Grid Tables**: Cell height 40px for dense telemetry, 48px for standard statutory audits. Alternate row background alternating between `#FFFFFF` and `#F8FAFC`.
- **Table Headers**: Background `#F1F5F9`, border-bottom `2px solid #CBD5E1`, text `#475569`, font `Inter` 11px weight 700, uppercase letter-spacing `0.05em`.
- **Monospace Cells**: Telemetry, geolocations, and SHA-256 hashes render strictly in `JetBrains Mono` 12px `#0F172A`.

### Checkboxes & Radio Buttons
- **Checkboxes**: 16x16px, border `1.5px solid #94A3B8`, radius 3px. Checked state: `#0284C7` with white checkmark.
- **Radio Buttons**: 16x16px circle, active state features a 4px solid `#0284C7` internal dot within a pure white field.

### Input Fields
- **Text Inputs & Selects**: Height 36px, background `#FFFFFF`, border `1px solid #CBD5E1`, radius 4px, padding 0 12px, text `Inter` 14px `#0F172A`.
- **Focused State**: Border `1.5px solid #0284C7`, box-shadow `0 0 0 3px rgba(2, 132, 199, 0.15)`.
- **Error State**: Border `1.5px solid #DC2626`, box-shadow `0 0 0 3px rgba(220, 38, 38, 0.15)`.

### Cards & Panels
- **Telemetry Card**: Pure white background, `1px solid #CBD5E1` border, 16px internal padding. Header displays metric label in `Inter` 12px uppercase slate, followed by large metric readout in `JetBrains Mono` 20px weight 700, followed by inline timestamp.
- **Sidebar Navigation**: Solid `#181F38` background, full screen height. Inactive navigation items `#94A3B8`, active items `#FFFFFF` with `#0284C7` left border indicator (3px) and background `#1E294B`.

### Domain-Specific Components
- **Telemetry Stream Ticker**: Fixed-height continuous strip pinned to active mine viewports; displays sensor node ID, gas concentrations (CO/CH4 in ppm), and ventilation airspeed.
- **Statutory Audit Stamp**: A sealed card displaying the Inspector's cryptographic signature, DGMS officer ID, and SHA-256 block hash formatted in `JetBrains Mono` with copy-to-clipboard functionality.