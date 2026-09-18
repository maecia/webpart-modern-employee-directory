# Implementation Plan: Annuaire SharePoint

**Branch**: `001-sharepoint-directory-webpart` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-sharepoint-directory-webpart/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a native SPFx Web Part serving as an organizational directory on the Maecia SharePoint tenant. Users browse site members in two interchangeable views (Card grid and List table), search by name, apply up to 3 configurable filters, and export results as CSV. Access is gated by SharePoint/Azure AD group membership, and individual member visibility is configurable. Data is sourced from Microsoft Entra ID (Azure AD) via Microsoft Graph.

**Technical approach**: SPFx 1.20.x scaffolded with Yeoman generator, TypeScript + React 17, PnPjs libraries (@pnp/sp, @pnp/graph, @pnp/spfx-controls-react) for data access and controls, Fluent UI React v8 for consistent Microsoft 365 look-and-feel, SPFx Fast Serve for hot-reload development, SharePoint Workbench for local testing without redeployment.

## Technical Context

**SPFx 1.20.x, Node.js 20 LTS (>=20.11.0 <21.0.0), React 17, TypeScript 4.7.4, @microsoft/rush-stack-compiler-4.7 0.1.1**

**Primary Dependencies**: @pnp/sp ^2.15, @pnp/spfx-controls-react ^3.19, @pnp/graph ^2.15, Fluent UI React v8 (@fluentui/react ^8.118)

**Storage**: SharePoint Property Pane (web part configuration serialized in page), Microsoft Entra ID / Azure AD (user directory data via Microsoft Graph)

**Testing**: Jest (included in SPFx scaffold), @microsoft/spfx-test, React Testing Library

**Target Platform**: SharePoint Online, desktop-first with functional mobile rendering

**Project Type**: SPFx Web Part (single project, client-side only)

**Performance Goals**: < 2s initial load for 500 members, < 200ms view toggle, < 500ms search/filter update, < 3s CSV export

**Constraints**: WCAG 2.1 Level AA, Fluent UI design system, SharePoint App Catalog deployment, offline resilience with cached stale indicator, no unhandled exceptions reach user

**Scale/Scope**: ~500–1000 members per directory, 2 view modes, 6 user stories, 18 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. User-Centered Design | ✅ PASS | 6 user stories with acceptance criteria mapped to real user workflows (employees browsing, searching, administrators configuring). Figma mockups provided. |
| II. Delightful Interactivity | ✅ PASS | FR-013 (loading indicator), FR-014 (error + retry), FR-015 (initials fallback), FR-019 (empty state with guidance). Performance targets < 200ms for interactions. |
| III. Clean Information Architecture | ✅ PASS | Search ranked by relevance, filters follow 80/20 rule (top 3 fields configurable), consistent labels across Card/List views. Two-mode navigation with preserved state. |
| IV. Simplicity by Default | ✅ PASS | Default Card view works out-of-box. Advanced config (filters, field selection) behind Property Pane. Max 3 filters enforced. Works for 80% without customization. |
| V. Accessible & Inclusive | ✅ PASS | FR-016 enforces WCAG 2.1 AA (keyboard navigation, contrast ratios). Initials fallback for missing photos. Color not sole differentiator. |

| Standard | Status | Evidence |
|----------|--------|----------|
| Performance Budget | ✅ PASS | SC-002 (2s load), SC-003 (200ms toggle), SC-004 (500ms search). Constitution requires < 2s on 3G, < 500ms p95 API. |
| Offline Resilience | ⚠️ DEFERRED | Cached content with staleness indicator recommended but not in v1 scope. Will be tracked as tech debt. |
| Error Handling | ✅ PASS | FR-014 requires explicit error message + retry action. No stack traces reach user. Error boundary pattern mandated. |
| Testing Discipline | ✅ PASS | Jest scaffold included. Each component will test: happy path, empty state, error state, loading state. |
| Instrumentation | ⚠️ DEFERRED | Anonymous telemetry on search/navigation recommended but not in v1 scope. Tracked as follow-up. |

**Gate Result**: ✅ PASS — No blocking violations. Two deferrals (offline resilience, instrumentation) documented for v2.

## Project Structure

### Documentation (this feature)

```text
specs/001-sharepoint-directory-webpart/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── webparts/
│   └── sharepointDirectory/
│       ├── SharepointDirectoryWebPart.ts       # Entry point, property pane config
│       ├── SharepointDirectoryWebPart.manifest.json
│       └── components/
│           ├── Directory.tsx                    # Root component (view router + access gate)
│           ├── Directory.types.ts               # Shared TypeScript types
│           ├── cardView/
│           │   ├── CardView.tsx                 # Card grid container
│           │   ├── CardView.types.ts
│           │   ├── MemberCard.tsx               # Individual card
│           │   └── MemberCardDetail.tsx         # Expanded card detail panel
│           ├── listView/
│           │   ├── ListView.tsx                 # Table container
│           │   ├── ListView.types.ts
│           │   └── ListViewColumns.tsx          # Column definitions + sorting
│           ├── search/
│           │   ├── SearchBar.tsx                # Text search input
│           │   └── FilterBar.tsx                # Dynamic filter dropdowns (max 3)
│           ├── shared/
│           │   ├── PersonaAvatar.tsx            # Photo with initials fallback
│           │   ├── LoadingState.tsx             # Skeleton/spinner
│           │   ├── ErrorState.tsx               # Error + retry
│           │   ├── EmptyState.tsx               # No results message
│           │   └── AccessDenied.tsx             # Unauthorized message
│           └── export/
│               └── CsvExport.ts                 # CSV generation logic
├── services/
│   ├── GraphService.ts                          # Microsoft Graph calls (users, photos)
│   ├── AccessControlService.ts                  # Permission checks (SP groups / AAD)
│   └── CsvService.ts                            # CSV serialization
├── models/
│   ├── Member.ts                                # Member entity interface
│   ├── DirectoryConfig.ts                       # Property pane config model
│   └── Filter.ts                                # Filter criteria model
├── hooks/
│   ├── useMembers.ts                            # Data fetching hook (pagination, caching)
│   ├── useDirectoryConfig.ts                    # Property pane state
│   └── useAccessControl.ts                      # Access check hook
└── utils/
    ├── teamsDeepLink.ts                         # Teams conversation URL builder
    └── formatUtils.ts                           # Phone/email formatters

tests/
├── webparts/
│   └── sharepointDirectory/
│       ├── components/
│       │   ├── cardView/
│       │   │   ├── CardView.test.tsx
│       │   │   └── MemberCard.test.tsx
│       │   ├── listView/
│       │   │   └── ListView.test.tsx
│       │   ├── search/
│       │   │   └── SearchBar.test.tsx
│       │   └── shared/
│       │       ├── LoadingState.test.tsx
│       │       ├── ErrorState.test.tsx
│       │       └── EmptyState.test.tsx
│       └── SharepointDirectoryWebPart.test.ts
└── services/
    ├── GraphService.test.ts
    └── AccessControlService.test.ts
```

**Structure Decision**: Single SPFx Web Part project following standard SPFx scaffold conventions. Component tree organized by feature area (cardView, listView, search, shared, export). Services layer abstracts data access (Microsoft Graph) and business logic (access control, CSV). Hooks encapsulate React state management.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | — | — |
