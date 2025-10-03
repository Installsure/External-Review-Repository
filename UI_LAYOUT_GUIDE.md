# InstallSure A→Z Demo - UI Layout Guide

## Page Structure

The demo page follows Tony's approved layout specifications:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header: "InstallSure A→Z Demo"                                      │
├──────────┬──────────────────────────────────────────┬───────────────┤
│          │                                          │               │
│  Left    │        Center Viewer (68%)              │     Right     │
│  Nav     │                                          │    Panel      │
│  (12%)   │                                          │    (20%)      │
│          │                                          │               │
│  ┌────┐  │  ┌────────────────────────────────────┐ │  ┌─────────┐ │
│  │Plan│  │  │                                    │ │  │ Pin     │ │
│  │View│  │  │    Plan Viewer or IFC Viewer       │ │  │ Details │ │
│  │    │  │  │                                    │ │  │         │ │
│  ├────┤  │  │    [Plan with pins or 3D model]    │ │  │ • Photo │ │
│  │ 3D │  │  │                                    │ │  │ • Note  │ │
│  │View│  │  │                                    │ │  │ • Status│ │
│  │    │  │  │                                    │ │  │         │ │
│  ├────┤  │  └────────────────────────────────────┘ │  └─────────┘ │
│  │Pins│  │                                          │               │
│  │(3) │  │  [QTO Controls when in 3D mode]         │               │
│  │    │  │                                          │               │
│  └────┘  │                                          │               │
│          │                                          │               │
└──────────┴──────────────────────────────────────────┴───────────────┘
```

## Workflow States

### 1. Initial State (No Plan Uploaded)

```
Center Viewer:
┌─────────────────────────────────────────┐
│                                         │
│         Upload Plan                     │
│                                         │
│   [File Input: name="plan"]             │
│                                         │
│   [Button: "Open Plan"]                 │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Plan Viewer Active

```
Center Viewer:
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │     [Uploaded Plan Image]         │  │
│  │                                   │  │
│  │     ● ← Pin (red circle)          │  │
│  │                                   │  │
│  │                                   │  │
│  │     ● ← Selected pin (blue)       │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

Right Panel:
┌─────────────────────┐
│ Pin Details         │
├─────────────────────┤
│ Photo:              │
│ [File Input]        │
│ [Preview if added]  │
│                     │
│ Note:               │
│ [Textarea]          │
│ "Add note"          │
│                     │
│ Status:             │
│ [Dropdown]          │
│ • Open              │
│ • In Progress       │
│ • Resolved          │
│ • Closed            │
└─────────────────────┘
```

### 3. 3D Viewer Active

```
Center Viewer:
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │    🏗️ IFC Viewer (Demo Mode)     │  │
│  │                                   │  │
│  │    Source: sample.ifc             │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─ QTO Demo ────────────────────────┐  │
│  │ Assembly: [Paint Wall ▼]          │  │
│  │                                   │  │
│  │ Length (m): [12]  Height (m): [3] │  │
│  │                                   │  │
│  │ [Run QTO]                         │  │
│  │                                   │  │
│  │ ✓ Results:                        │  │
│  │   Quantity: 36 m2                 │  │
│  │   Cost: $90.00                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Component Interactions

### Pin Creation Flow
1. User clicks on plan viewer
2. New pin created at click coordinates (normalized 0-1)
3. Pin marker appears (red circle, 24px)
4. Pin becomes selected (turns blue)
5. Right panel shows pin details
6. Pin added to left nav list

### Pin Selection Flow
1. User clicks pin marker or list item
2. Pin turns blue (selected state)
3. Right panel loads pin data
4. Photo preview shown if exists
5. Note and status populate from saved data

### QTO Calculation Flow
1. User switches to 3D view
2. Selects assembly type (paint_wall or concrete_slab)
3. Enters parameters (length, height, width, thickness, unitCost)
4. Clicks "Run QTO"
5. Results display in green box with quantity and cost

### LocalStorage Persistence
All data persists automatically:
- Pins array with coordinates, notes, photos, status
- Plan URL (blob URL from uploaded file)
- QTO assembly type and inputs
- Refreshing page restores all state

## Key Elements & Test Selectors

### For Playwright Tests
- Plan upload: `input[type="file"][name="plan"]`
- Open plan button: `button:has-text("Open Plan")`
- Plan viewer: `#plan-viewer`
- Photo upload: `input[type="file"][name="photo"]`
- Note input: `input[placeholder="Add note"]` or `textarea[placeholder="Add note"]`
- 3D view button: `button:has-text("Open 3D")` or `button:has-text("3D Viewer")`
- Assembly selector: `select[aria-label="Assembly"]` or `combobox[name="Assembly"]`
- QTO inputs: `input[aria-label="length"]`, `input[aria-label="height"]`, etc.
- Run QTO button: `button:has-text("Run QTO")`
- QTO output: `[data-testid="qto-output"]`

## Color Scheme

- Selected pin: Blue (#3b82f6)
- Unselected pin: Red (#ef4444)
- Success indicators: Green (#10b981)
- Borders: Gray (#d1d5db)
- Background: White / Gray-50

## Responsive Behavior

The layout is designed for desktop use with fixed percentages:
- Left Nav: 12% width (192px at 1600px screen)
- Center Viewer: 68% width (1088px at 1600px screen)
- Right Panel: 20% width (320px at 1600px screen)

For mobile, consider implementing a tabbed interface in future iterations.
