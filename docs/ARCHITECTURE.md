# React Architecture

This project now keeps the two product surfaces separate while sharing only the parts that are intentionally common.

## App Entry Points

| App | Entry | URL |
| --- | --- | --- |
| HR Dashboard | `apps/hr-dashboard/App.jsx` | `/HR_AI_Dashboard/` |
| Personnel App | `apps/personnel-app/App.jsx` | `/HR_AI_Dashboard/apps/personnel-app/` |

## Source Boundaries

| Area | Path | Owns |
| --- | --- | --- |
| HR Dashboard | `src/features/hr-dashboard/` | Dashboard layout, tabs, dashboard-only state |
| Personnel App | `src/features/personnel/` | Regular personnel workflow, candidate data, personnel-only state |
| Shared UI | `src/shared/ui/` | Reusable presentational primitives |
| Shared Store | `src/shared/store/` | Cross-app UI state such as Copilot open/messages |
| Shared Services | `src/services/` | API clients and context builders |

## State Boundary

- `src/features/hr-dashboard/store/dashboardStore.js` owns dashboard filters, active dashboard tab, view mode, and dashboard simulation state.
- `src/features/personnel/store/personnelStore.js` owns personnel workflow state.
- `src/shared/store/copilotStore.js` owns the shared Copilot panel state and message history.

Feature code should avoid importing another feature's store directly. If state must be reused by both apps, move it to `src/shared/store/`.

## Personnel Rules

Personnel eligibility logic lives outside the bulk data file:

- `src/features/personnel/data/personnelData.js` owns candidate data, scenario data, constants, and presets.
- `src/features/personnel/rules/eligibilityRules.js` owns promotion eligibility rules and the `checkEligibility` function.

Keep business rules in `rules/` so they can be reviewed and tested independently from the large anonymized candidate dataset.

## Copilot Routing

The client sends app-scoped requests:

```text
POST /api/copilot/dashboard
POST /api/copilot/personnel
```

`POST /api/chat` remains as a legacy dashboard-compatible route.

During local Vite development, `/api` is proxied to `http://localhost:8080`, where `copilot_server.py` runs.

Context builders live in `src/services/copilot/`:

- `dashboardContext.js`
- `personnelContext.js`
- `copilotClient.js`
- `copilotRoutes.js`

## Import Guideline

Prefer feature or shared index exports for app shell imports:

```js
import { CopilotPanel, FilterBar, TopBar, useDashboardStore } from '../../src/features/hr-dashboard';
import { useCopilotStore } from '../../src/shared/store';
```

Inside a feature, local relative imports are still fine for nearby implementation files.
