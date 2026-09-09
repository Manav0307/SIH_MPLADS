---
name: Sovereign Audit Intelligence
colors:
  surface: '#0f131f'
  surface-dim: '#0f131f'
  surface-bright: '#353946'
  surface-container-lowest: '#0a0e1a'
  surface-container-low: '#171b28'
  surface-container: '#1b1f2c'
  surface-container-high: '#262a37'
  surface-container-highest: '#313442'
  on-surface: '#dfe2f3'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2f3'
  inverse-on-surface: '#2c303d'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ffb3ad'
  on-secondary: '#68000a'
  secondary-container: '#a40217'
  on-secondary-container: '#ffaea8'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#00a74b'
  on-tertiary-container: '#003111'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ad'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#930013'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#0f131f'
  on-background: '#dfe2f3'
  surface-variant: '#313442'
typography:
  display-command:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-panel:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  headline-panel-mobile:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  metric-headline:
    fontFamily: JetBrains Mono
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.03em
  metric-subtext:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.01em
  body-default:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-dense:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  body-dense-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  badge-status:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.06em
  table-header:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-margin-desktop: 1rem
  grid-gutter-desktop: 0.75rem
  grid-margin-mobile: 0.5rem
  grid-gutter-mobile: 0.5rem
  panel-padding-condensed: 0.5rem
  panel-padding-standard: 0.75rem
  panel-padding-relaxed: 1rem
  row-height-condensed: 1.75rem
  row-height-standard: 2.25rem
  control-height-compact: 1.75rem
  control-height-standard: 2rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.5rem
  space-lg: 0.75rem
  space-xl: 1rem
---

## Brand & Style

This design system is engineered for high-stakes governmental auditing, statutory oversight, and forensic anomaly detection under the Member of Parliament Local Area Development Scheme (MPLADS). Built as a command-and-control operations center, the aesthetic synthesizes the architectural discipline of Palantir Foundry with the telemetry density of Grafana and real-time sovereign risk monitors.

### Aesthetic Persona & Philosophy
- **Precision & Authority:** Uncompromising clarity and austere functionalism. The interface establishes institutional trust through structured data density rather than decorative ornamentation.
- **Tactical Real-Time Monitoring:** Optimized for long operational watches in security operations centers (SOC) and statutory oversight cells. High-contrast status alerts against a deep, non-glare obsidian field minimize cognitive load while highlighting deviations instantly.
- **Forensic Rigor:** Every node, transaction hash, contractor ID, and fiscal allocation is treated as evidentiary data, demanding immediate traceability, tabular stability, and clear hierarchical segmentation.

### Design Movement
**Technical Brutalism meets Sovereign Telemetry.** The interface relies on tight 1px borders, muted structural foundations, dense tabular displays, and tactical phosphor glows reserved solely for severity anomalies.

## Colors

The palette is calibrated strictly for dark-adapted operational environments. Chromatic energy is heavily regulated: neutrals handle 90% of the surface architecture, ensuring that status and risk indicators cut through the dark field with unmistakable urgency.

### Base Structural Tokens
- **Application Surface (`#0A0E1A`):** Pure telemetry void; establishes maximum dynamic range.
- **Card & Panel Layer (`#10182B`):** Base structural container color for inspection widgets and data clusters.
- **Interactive / Elevated Layer (`#161F36`):** Active selections, row hovers, popovers, and elevated inspector trays.
- **Structural Boundary (`#232D47`):** 1px boundary grid defining all panels, dividers, and data cells.

### Text Contrast Tiers
- **Primary Readout (`#E7EBF5`):** Reserved for statutory metrics, active IDs, and primary analytical headers.
- **Secondary Readout (`#9AA5C1`):** Metadata labels, contextual secondary values, and column keys.
- **Muted Readout (`#667090`):** Timestamps, structural breadcrumbs, and inactive table borders.

### Risk & Telemetry Engine
- **Critical Risk:** Fill `#401515`, Border `#EF444440`, Ink `#EF4444` (Sanction deviations, duplicate contractor allotments, dead fund loops).
- **High Risk:** Fill `#3A2A0C`, Border `#F59E0B40`, Ink `#F59E0B` (Unreconciled work progress, overdue milestones).
- **Medium Risk:** Fill `#362E0C`, Border `#EAB30840`, Ink `#EAB308` (Budget variance outliers, administrative delay alerts).
- **Low / Nominal:** Fill `#0F3020`, Border `#22C55E40`, Ink `#22C55E` (Verified disbursement, physical verification clearance).
- **Telemetry Info / System Accent:** Fill `#10233F`, Border `#3B82F640`, Ink `#3B82F6` (Active filters, inspected nodes, neutral audit logs).

## Typography

The typographic engine uses **Inter** for structural headers and contextual labels alongside **JetBrains Mono** for numerical matrices, status indicators, and tracking codes. 

### Implementation Rules
- **Tabular Figures & Alignment:** All numerical outputs, financial sums, work order IDs, and statutory coordinates must leverage `font-feature-settings: "tnum" 1, "zero" 1` or explicitly use the label font token (`JetBrains Mono`). Columns containing financial amounts or percentages must always align right; codes, dates, and identifiers must align left.
- **Case Rules:** Table headers, metric sub-labels, and risk badges must strictly render in uppercase with positive letter spacing (`0.05em` to `0.08em`) to guarantee quick recognition under high data density.
- **Hierarchy Stacking:** Panel headers must pair an Inter 14–16px title with a secondary JetBrains Mono 11px system tracker directly underneath or adjacent.

## Layout & Spacing

The interface employs a continuous full-viewport fluid grid designed for dual-screen and wide-screen SOC workstations, collapsing into stacked functional panes on lower resolutions.

### Grid Architecture
- **Desktop (1440px+):** Fluid 12- or 24-column CSS grid with uniform `0.75rem` (12px) gutters and `1rem` edge margins. Default layout splits into:
  - Global Navigation & Audit Telemetry Strip (Fixed: 56px left vertical rail).
  - Primary Filter & Work-Cluster Matrix (3 Columns or 320px).
  - Central Geospatial & Anomaly Flow Workspace (Fluid 6 to 15 Columns).
  - Deep Forensic Inspection Dossier (Fixed: 380px right collapsable drawer).
- **Tablet / Lower Display (768px – 1439px):** Inspector drawer docks to a bottom slide-up tray. The main anomaly ledger and map transition into toggleable tab panes.
- **Mobile (< 768px):** Single-column stacked mode. Complex visual graphs convert to summarized anomaly priority cards with `0.5rem` outer margins.

### Spacing Discipline
A rigid 4px base rhythm dictates internal element packaging. Standard cards operate on `0.75rem` (12px) padding, with ultra-dense data grids stepping down to `0.5rem` (8px). Vertical gaps between sibling controls within toolbars must not exceed `0.375rem` (6px).

## Elevation & Depth

This design system intentionally rejects drop shadows and blurred depth illusions. Visual hierarchy is established via **architectural surface layering** and **sharp luminance boundaries**.

### Surface-Container Tiers
1. **Level 0 (Floor):** `#0A0E1A` — The base application background canvas hosting layout tracks and structural scaffolding.
2. **Level 1 (Card & Module Foundation):** `#10182B` — Primary surface for metric tiles, data grids, intelligence timelines, and canvas containers. Always outlined with a crisp 1px `#232D47` border.
3. **Level 2 (Active/Elevated Intermediary):** `#161F36` — Active table rows, interactive flyouts, popovers, and sticky headers. Outlined with 1px `#3B82F633` or `#232D47`.
4. **Level 3 (Modal & Audit Inspector Overlay):** `#161F36` — Forensics modals and contextual right-click audit inspector planes. Outlined with 1px `#3B82F6` accent borders with no drop shadow, relying on a backdrop dimming scrim of `rgba(10, 14, 26, 0.85)`.

### Border Discipline
All panels, status tags, table cells, and buttons must display structural boundaries via a calibrated 1px solid border. Shadows are used only as monochromatic glows on severe anomaly notifications (e.g., `0 0 12px rgba(239, 68, 68, 0.25)`).

## Shapes

The design system employs a restrained **Soft Corner Geometry** standardizing between 8px and 10px on major structural boundaries, dropping to 4px–6px on dense internal elements.

### Curvature Tokens
- **Container Panels & Data Cards:** `0.5rem` (8px) or `0.625rem` (10px) strictly. Matches technical enterprise standards without feeling circular.
- **Input Controls, Buttons, Select Triggers:** `0.25rem` (4px) to `0.375rem` (6px) to maximize internal text space in compact rows.
- **Risk Badges & Telemetry Chips:** `0.25rem` (4px) inner corner radii; pills are strictly prohibited to avoid playful, consumer-oriented styling.
- **Indicator Nodes & Status Pips:** `9999px` (fully rounded) only when representing circular radar blips or pulsing anomaly detection points (size: 6px–8px).

## Components

### 1. Buttons & Command Triggers
- **Primary System Action:** Fill `#3B82F6`, hover `#2563EB`, text `#FFFFFF`. Border: `1px solid #60A5FA`. Height: `28px` (compact) or `32px` (standard). Padding: `0 10px`. Font: Inter 12px / 600 weight.
- **Secondary Neutral Action:** Fill `#161F36`, hover `#232D47`, text `#E7EBF5`. Border: `1px solid #232D47`.
- **Destructive / Flag Anomaly:** Fill `#401515`, hover `#5A1E1E`, text `#EF4444`. Border: `1px solid #EF444460`.
- **Toolbar Icon Buttons:** 28x28px square, background transparent, hover `#161F36`, border `1px solid transparent`, active border `1px solid #232D47`.

### 2. Status & Anomaly Badges
- **Structure:** Monospace status pill-alternative with `4px` corner radius, `2px 6px` padding, uppercase `10px` JetBrains Mono text.
- **Variants:**
  - *Critical:* Background `#401515`, Border `1px solid #EF444440`, Text `#EF4444`.
  - *High:* Background `#3A2A0C`, Border `1px solid #F59E0B40`, Text `#F59E0B`.
  - *Medium:* Background `#362E0C`, Border `1px solid #EAB30840`, Text `#EAB308`.
  - *Nominal:* Background `#0F3020`, Border `1px solid #22C55E40`, Text `#22C55E`.
  - *Audit Info:* Background `#10233F`, Border `1px solid #3B82F640`, Text `#3B82F6`.
- **Live State Pip:** 6px diameter pulsing dot preceding the badge text on dynamic anomalies.

### 3. Data Tables (Forensic Ledger)
- **Header Cell:** Height `28px`, background `#10182B`, text `#9AA5C1`, border-bottom `1px solid #232D47`, Inter 11px uppercase, font-weight 600.
- **Data Cell:** Height `32px` standard (`26px` dense SOC view). Background `#10182B`, border-bottom `1px solid #161F36`, text `#E7EBF5`, Inter/Mono 12px.
- **Hover State:** Entire row lights to `#161F36` with a `2px solid #3B82F6` left indicator strip on the lead cell.
- **Numeric & ID Columns:** JetBrains Mono tabular numeric format right-aligned.

### 4. Input Fields & Query Filters
- **Text & Numeric Inputs:** Height `28px` or `32px`, background `#0A0E1A`, border `1px solid #232D47`, text `#E7EBF5`, placeholder `#667090`. Focus: Border `#3B82F6`, box-shadow `none`.
- **Segmented Range Sliders & Time Bars:** Background `#10182B`, handle `#3B82F6` (square with 2px radius), track filled with `#232D47`.

### 5. Cards & Intelligence Panels
- **Container Structure:** Background `#10182B`, border `1px solid #232D47`, border-radius `8px`.
- **Panel Header Strip:** Height `36px`, display flex, items-center, justify-between, padding `0 12px`, border-bottom `1px solid #232D47`, background `#0D1424`.
- **Title Block:** Inter 13px bold `#E7EBF5` with trailing system telemetry counter (`JetBrains Mono` 11px `#667090`).

### 6. Specialized SOC Components
- **Telemetry Sparkline:** Single-line vector canvas, 24px height, stroke width 1.5px, zero-fill or subtle translucent gradient (`10% opacity`).
- **Constituency Sanction Node:** Network graph node pill with 1px border `#232D47`, inner background `#161F36`, showing MP constituency code, total outlay (Mono), and color-coded risk flag indicator.
- **Audit Flag Checkbox:** 14x14px square, radius 2px, background `#0A0E1A`, border `1px solid #232D47`. Checked state: Background `#3B82F6`, border `#3B82F6`, icon `#FFFFFF`.