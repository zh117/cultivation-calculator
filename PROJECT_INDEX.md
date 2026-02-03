# Project Index: Cultivation-Calculator

**Generated**: 2026-02-03
**Type**: Next.js Web Application
**Purpose**: 修仙世界观量化计算器 - 检测修仙小说世界观数值的自洽性和崩坏风险

---

## 📁 Project Structure

```
Cultivation-Calculator/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (metadata, HTML structure)
│   ├── page.tsx           # Home page (mounts CultivationCalculator)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── CultivationCalculator.tsx   # Main calculator component (395 lines)
│   ├── ParameterPanel.tsx          # Parameter input controls
│   ├── RealmTable.tsx              # Results table display
│   ├── AlertList.tsx               # Alert/warning display
│   ├── CollapsibleSection.tsx      # Collapsible UI sections
│   └── SchemeManager.tsx           # Save/load scheme management
├── lib/                   # Core logic
│   ├── types/index.ts     # TypeScript type definitions
│   ├── calculator/core.ts # Calculation engine (pure functions)
│   ├── data/realms.ts     # 9 cultivation realm configs
│   ├── data/presets.ts    # 4 preset schemes
│   └── storage/schemes.ts # localStorage persistence
├── docs/                  # Documentation
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.ts         # Next.js config
└── postcss.config.mjs     # Tailwind CSS config
```

---

## 🚀 Entry Points

| Entry | Path | Description |
|-------|------|-------------|
| **Home Page** | `app/page.tsx` | Renders CultivationCalculator component |
| **Root Layout** | `app/layout.tsx` | HTML wrapper, metadata (title: 修仙世界观量化计算器) |
| **Main Component** | `components/CultivationCalculator.tsx` | Core UI with state management |
| **Calculation Engine** | `lib/calculator/core.ts` | `calculateAll()` - main calculation function |

---

## 📦 Core Modules

### Module: `lib/types/index.ts` (171 lines)
**Purpose**: TypeScript type definitions for the entire application

**Key Types**:
- `CalculationParams` - 9 calculation parameters (baseCost, multipliers, factors)
- `ResourceConfig` - Resource grades and levels
- `CalculationResult` - Complete calculation output
- `RealmConfig` - Cultivation realm configuration
- `Alert` - Warning/alert data structure
- `SavedScheme` - Persisted user schemes

### Module: `lib/calculator/core.ts` (363 lines)
**Purpose**: Pure calculation engine - no side effects

**Key Exports**:
- `calculateAll(params, resource)` - Main calculation function
- `calculateSubLevelCost()` - Calculate resource cost per sub-level
- `calculateEfficiencyFactor()` - Compute efficiency multiplier
- `calculateDuration()` - Convert cost to time (years)
- `calculateResourceProduction()` - Compute annual resource output
- `validateParams()` - Parameter validation
- `formatSpiritStones()` - Format large numbers
- `formatDuration()` - Format time periods

### Module: `lib/data/realms.ts` (133 lines)
**Purpose**: Standard 9-realm cultivation system

**Exports**:
- `REALM_CONFIGS` - Array of 9 realms (炼气→渡劫)
- Realm helper functions: `getRealmConfig()`, `getRealmName()`, etc.

**Realms**: 炼气(12层), 筑基, 金丹, 元婴, 化神, 炼虚, 合体, 大乘, 渡劫

### Module: `lib/data/presets.ts` (138 lines)
**Purpose**: Pre-configured calculation schemes

**Presets**:
- `MORTAL_PRESET` - 凡人流 (classic cultivation novel style)
- `HIGH_MARTIAL_PRESET` - 高武流 (fast progression)
- `FAST_CULTIVATION_PRESET` - 速成流 (rapid advancement)
- `HARD_MODE_PRESET` - 困难模式

### Module: `lib/storage/schemes.ts` (143 lines)
**Purpose**: localStorage persistence for user schemes

**Functions**:
- `saveScheme()`, `getAllSchemes()`, `deleteScheme()`
- `exportScheme()`, `importScheme()` - JSON import/export

### Module: `components/CultivationCalculator.tsx` (395 lines)
**Purpose**: Main application component with state management

**State**:
- `params` - Calculation parameters
- `resource` - Resource configuration
- `result` - Calculation results
- `selectedPreset` - Active preset

**Sub-components**: ParameterPanel, RealmTable, AlertList, SchemeManager, CollapsibleSection

### Module: `components/ParameterPanel.tsx` (~500 lines)
**Purpose**: Input form for all calculation parameters

### Module: `components/RealmTable.tsx` (~240 lines)
**Purpose**: Display calculation results in table format

### Module: `components/AlertList.tsx` (~150 lines)
**Purpose**: Display warnings/errors (lifespan, resource, exponential)

### Module: `components/SchemeManager.tsx` (~330 lines)
**Purpose**: Save/load/delete custom schemes

---

## 🔧 Configuration

| File | Purpose |
|------|---------|
| `package.json` | Dependencies: next@15, react@19, tailwindcss@4 |
| `tsconfig.json` | TypeScript configuration |
| `next.config.ts` | Next.js build configuration |
| `postcss.config.mjs` | Tailwind CSS PostCSS setup |
| `.eslintrc.json` | ESLint rules (next config) |

---

## 🔗 Key Dependencies

```json
{
  "next": "^15.1.3",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwindcss": "^4.1.18",
  "typescript": "^5"
}
```

---

## 📝 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

---

## 🧮 Calculation Logic

The calculator models cultivation progression through:
1. **Resource Cost**: Exponential scaling per realm/sub-level
2. **Time Duration**: Cost ÷ (baseRate × efficiencyFactors)
3. **Lifespan Check**: Detects when cultivation exceeds realm lifespan
4. **Resource Check**: Detects when single breakthrough cost exceeds annual production
5. **Exponential Warning**: Warns when multipliers may cause失控

---

## 📊 Token Efficiency

- **Index size**: ~3KB
- **Estimated savings**: 94% token reduction vs reading all files
- **Use case**: Reference this file instead of reading entire codebase
