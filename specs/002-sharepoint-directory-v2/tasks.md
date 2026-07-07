# Tasks: Annuaire SharePoint V2

**Input**: Design documents from `/specs/002-sharepoint-directory-v2/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — test tasks omitted. Existing CsvService tests kept.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- SPFx project root: `src/`, `tests/`
- WebPart: `src/webparts/sharepointDirectory/`
- Components: `src/webparts/sharepointDirectory/components/`

---

## Phase 1: Setup (Project Upgrade)

**Purpose**: Upgrader SPFx de 1.20.0 à 1.20.2, basculer Node en 18 LTS

- [x] T001 Switch Node.js to 18.20.x LTS via `nvm install 18.20.5 && nvm use 18.20.5`
- [x] T002 Update `@microsoft/sp-build-web` from `1.20.0` to `1.20.2` in `package.json`
- [x] T003 Run `npm install --legacy-peer-deps` and verify clean install
- [x] T004 Run `npx gulp clean && npx gulp build` to validate SPFx 1.20.2 toolchain compiles

---

## Phase 2: Foundational (Shared Components & Model Updates)

**Purpose**: Core infrastructure that ALL user stories depend on — modals, data model, pagination hook

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Data Model Updates

 - [x] T005 [P] Add `listFields` and `modalFields` to `DirectoryConfig` interface in `src/models/DirectoryConfig.ts`
 - [x] T006 [P] Update `ISharepointDirectoryWebPartProps` interface to support 4 property pane sections in `src/webparts/sharepointDirectory/SharepointDirectoryWebPart.ts`

### Services & Hooks

 - [x] T007 [P] Create `usePagination` hook with configurable page sizes (24 cards / 15 rows) in `src/hooks/usePagination.ts` — exports `{ visibleMembers, hasMore, loadMore }`
 - [x] T008 Update `useDirectoryConfig` hook to normalize `listFields` and `modalFields` with defaults in `src/hooks/useDirectoryConfig.ts`

### Core UI Components

 - [x] T009 [P] Create `MemberModal` component using Fluent UI `Modal` in `src/webparts/sharepointDirectory/components/modal/MemberModal.tsx` — displays photo, name, givenName, Teams/Outlook buttons + configurable `modalFields`, supports dismiss via ✕ / click outside / Escape
 - [x] T010 [P] Create `Banner` component integrating search bar, filter dropdowns, results counter ("Résultats : X collaborateurs"), and view toggle icons in `src/webparts/sharepointDirectory/components/Banner.tsx`

**Checkpoint**: Foundation ready — models updated, modal and banner components exist, pagination hook available

---

## Phase 3: User Story 1 - Vue Carte avec Pagination (Priority: P1) 🎯 MVP

**Goal**: Afficher les membres en grille de cartes (max 24), bouton "Voir plus de collaborateurs", clic ouvre la modale

**Independent Test**: Déployer avec vue Carte par défaut, vérifier 24 cartes max, "Voir plus", clic → modale, champs configurés

### Implementation for User Story 1

 - [x] T011 [US1] Remove `MemberCardDetail` component — delete `src/webparts/sharepointDirectory/components/cardView/MemberCardDetail.tsx`
 - [x] T012 [US1] Update `MemberCard` to call `onClick(member)` instead of inline toggle in `src/webparts/sharepointDirectory/components/cardView/MemberCard.tsx`
 - [x] T013 [US1] Update `CardView` to accept `onMemberClick` prop, integrate `usePagination` (pageSize=24), add "Voir plus de collaborateurs" button, responsive grid 4→2→1 columns in `src/webparts/sharepointDirectory/components/cardView/CardView.tsx`
 - [x] T014 [US1] Integrate `MemberModal` into `Directory` — add `selectedMember` state, pass `onMemberClick` to CardView, render modal when member selected in `src/webparts/sharepointDirectory/components/Directory.tsx`

**Checkpoint**: Vue Carte fonctionnelle — pagination, modale, responsive

---

## Phase 4: User Story 2 - Vue Liste avec Pagination (Priority: P1)

**Goal**: Afficher les membres en tableau (max 15 lignes), tri et filtrage par colonne, clic ouvre la modale, colonnes configurables via `listFields`

**Independent Test**: Basculer en vue Liste, trier par colonne, filtrer par colonne, paginer, clic → modale

### Implementation for User Story 2

 - [x] T015 [US2] Update `ListView` to accept `listFields` prop for dynamic columns, `onMemberClick` prop, integrate `usePagination` (pageSize=15), add "Voir plus de collaborateurs" button in `src/webparts/sharepointDirectory/components/listView/ListView.tsx`
 - [x] T016 [US2] Wire `ListView` into `Directory` — pass `listFields` from config, `onMemberClick` opens MemberModal in `src/webparts/sharepointDirectory/components/Directory.tsx`

**Checkpoint**: Vue Liste fonctionnelle — colonnes dynamiques, tri, filtrage, pagination, modale

---

## Phase 5: User Story 3 - Recherche et Filtres + Compteur de Résultats (Priority: P2)

**Goal**: Barre de recherche, jusqu'à 3 filtres, compteur de résultats en temps réel, banner unifiée

**Independent Test**: Configurer 2 filtres, taper un nom, vérifier compteur, combiner recherche + filtre

### Implementation for User Story 3

 - [x] T017 [US3] Replace top section of `Directory` with `Banner` component — pass searchQuery, filters, resultCount, view state, filterValues in `src/webparts/sharepointDirectory/components/Directory.tsx`
 - [x] T018 [US3] Implement `resultCount` computed from `filteredMembers.length` in `Directory`'s `useMemo` in `src/webparts/sharepointDirectory/components/Directory.tsx`
 - [x] T019 [US3] Wire `Banner` view toggle icons to switch between `'card'` / `'list'` view state in `src/webparts/sharepointDirectory/components/Directory.tsx`

**Checkpoint**: Bannière unifiée — recherche, filtres, compteur, icônes de vue fonctionnels

---

## Phase 6: User Story 6 - Property Pane Configuration (Priority: P2)

**Goal**: Property Pane en 4 sections : Général, Vue Carte, Vue Liste, Vue Modale — chaque section avec ses cases à cocher

**Independent Test**: Ouvrir Property Pane, modifier tous les paramètres, vérifier l'application immédiate

### Implementation for User Story 6

 - [x] T020 [US6] Add `listField_*` properties (10 checkboxes) to `ISharepointDirectoryWebPartProps` in `src/webparts/sharepointDirectory/SharepointDirectoryWebPart.ts`
 - [x] T021 [US6] Add `modalField_*` properties (10 checkboxes) to `ISharepointDirectoryWebPartProps` in `src/webparts/sharepointDirectory/SharepointDirectoryWebPart.ts`
 - [x] T022 [US6] Refactor `getPropertyPaneConfiguration()` to generate 4 pages/sections: Général, Vue Carte, Vue Liste, Vue Modale — each section gets its own `PropertyPaneCheckbox` group in `src/webparts/sharepointDirectory/SharepointDirectoryWebPart.ts`
 - [x] T023 [US6] Update `render()` to build config with `listFields` and `modalFields` from property pane checkboxes in `src/webparts/sharepointDirectory/SharepointDirectoryWebPart.ts`

**Checkpoint**: Property Pane complet — 4 sections, toutes les cases à cocher fonctionnelles

---

## Phase 7: User Story 5 - Export CSV (Priority: P3)

**Goal**: Exporter la liste filtrée en CSV (UTF-8 BOM, séparateur `;`, compatible Excel)

**Independent Test**: Cliquer export, ouvrir CSV dans Excel, vérifier filtres respectés

### Implementation for User Story 5

 - [x] T024 [US5] Update `CsvExport` integration in `Banner` component — move export button from top-right to banner's right section in `src/webparts/sharepointDirectory/components/Banner.tsx`
 - [x] T025 [US5] Verify export respects active filters and search by passing `filteredMembers` from `Directory` in `src/webparts/sharepointDirectory/components/Directory.tsx`

**Checkpoint**: Export CSV fonctionnel depuis la bannière, respecte filtres et recherche

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Responsive, accessibility, cleanup, validation

 - [x] T026 [P] Add responsive CSS media queries for CardView grid: 4 columns (>1200px), 2 columns (768-1199px), 1 column (<768px) in `src/webparts/sharepointDirectory/components/cardView/CardView.tsx`
 - [x] T027 [P] Add `aria-live="polite"` to results counter and `aria-label` on view toggle icons in `src/webparts/sharepointDirectory/components/Banner.tsx`
 - [x] T028 [P] Add keyboard support for pagination button (Enter/Space) in CardView and ListView
 - [x] T029 Run `npx gulp build && npx gulp bundle --ship` to validate production build
 - [x] T030 Run quickstart.md validation scenarios: Card view, List view, Modal, Filters, Export, Property Pane

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 Card View (Phase 3)**: Depends on Foundational — no dependency on other stories
- **US2 List View (Phase 4)**: Depends on Foundational — integrates with US1's Directory, but independently testable
- **US3 Search & Filters (Phase 5)**: Depends on Foundational + US1/US2 (needs Directory wired)
- **US6 Property Pane (Phase 6)**: Depends on Foundational — configures all 3 views
- **US5 Export CSV (Phase 7)**: Depends on Banner from US3
- **Polish (Phase 8)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — can start after Phase 2
- **US2 (P1)**: No dependencies on other stories — can start after Phase 2 (parallel with US1)
- **US3 (P2)**: Depends on US1 + US2 (needs Directory with wired Banner)
- **US6 (P2)**: No dependencies on other stories — can start after Phase 2 (parallel with US1/US2)
- **US5 (P3)**: Depends on US3 (Banner component)

### Within Each User Story

- Models before services before components
- Component implementation before integration into Directory
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 2: T005, T006, T007, T009, T010 can all run in parallel (different files)
- Phase 3: T012 and T013 can run in parallel (different files)
- Phase 8: T026, T027, T028 can all run in parallel
- US1 (Phase 3) and US2 (Phase 4) and US6 (Phase 6) can run in parallel after Phase 2

---

## Parallel Example: Foundational Phase

```bash
# Launch all independent tasks together:
Task: "Add listFields and modalFields to DirectoryConfig in src/models/DirectoryConfig.ts"
Task: "Update ISharepointDirectoryWebPartProps in src/webparts/.../SharepointDirectoryWebPart.ts"
Task: "Create usePagination hook in src/hooks/usePagination.ts"
Task: "Create MemberModal in src/webparts/sharepointDirectory/components/modal/MemberModal.tsx"
Task: "Create Banner in src/webparts/sharepointDirectory/components/Banner.tsx"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (SPFx 1.20.2 + Node 18)
2. Complete Phase 2: Foundational (models, Modal, Banner, usePagination)
3. Complete Phase 3: US1 - Vue Carte
4. **STOP and VALIDATE**: Test card view with pagination and modal
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Card View) → Test independently → MVP!
3. Add US2 (List View) → Test independently → Deploy/Demo
4. Add US3 (Search & Filters) + Banner → Test → Deploy/Demo
5. Add US6 (Property Pane) → Configure everything
6. Add US5 (CSV Export) → Final feature
7. Polish → Production ready

### Key Files Modified Per Phase

| Phase | Modified Files |
|-------|---------------|
| P1: Setup | `package.json` |
| P2: Foundational | `src/models/DirectoryConfig.ts`, `src/hooks/useDirectoryConfig.ts`, `src/hooks/usePagination.ts` (new), `Banner.tsx` (new), `MemberModal.tsx` (new) |
| P3: US1 | `CardView.tsx`, `MemberCard.tsx`, `Directory.tsx`, delete `MemberCardDetail.tsx` |
| P4: US2 | `ListView.tsx`, `Directory.tsx` |
| P5: US3 | `Directory.tsx` (Banner wiring) |
| P6: US6 | `SharepointDirectoryWebPart.ts` |
| P7: US5 | `Banner.tsx`, `Directory.tsx` |
| P8: Polish | `CardView.tsx` (CSS), `Banner.tsx` (aria) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- V1 code (services, hooks, shared components) is largely reused — only UI layer changes significantly
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
