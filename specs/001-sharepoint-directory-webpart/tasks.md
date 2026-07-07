# Tasks: Annuaire SharePoint

**Input**: Design documents from `/specs/001-sharepoint-directory-webpart/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md, quickstart.md

**Tests**: Not explicitly requested in specification — test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **SPFx project root**: `src/webparts/sharepointDirectory/`
- **Components**: `src/webparts/sharepointDirectory/components/`
- **Services**: `src/services/`
- **Models**: `src/models/`
- **Hooks**: `src/hooks/`
- **Utils**: `src/utils/`
- Paths based on plan.md project structure.

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold SPFx project, install dependencies, configure tooling

- [x] T001 Scaffold SPFx 1.20.x web part project with Yeoman generator (`yo @microsoft/sharepoint` — solution name: `sharepoint-directory`, web part name: `SharepointDirectory`, framework: React)
- [x] T002 [P] Install production dependencies: `npm install @pnp/sp @pnp/graph @pnp/spfx-controls-react @fluentui/react-components`
- [x] T003 [P] Install dev dependencies: `npm install spfx-fast-serve papaparse --save-dev`
- [x] T004 Configure spfx-fast-serve with `npx spfx-fast-serve` and verify `gulp trust-dev-cert`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core models, services, hooks, and shared components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Models (shared across all stories)

- [x] T005 [P] Create `Member` interface in `src/models/Member.ts` — all fields from data-model.md (id, displayName, givenName, surname, email, jobTitle, department, officeLocation, mobilePhone, managerId, managerDisplayName, photoUrl, isVisible, teamsId)
- [x] T006 [P] Create `DirectoryConfig` interface in `src/models/DirectoryConfig.ts` — defaultView, filters, cardFields, accessGroupId
- [x] T007 [P] Create `Filter` model (FilterField, CardField, AccessControl types) in `src/models/Filter.ts`

### Services (shared across all stories)

- [x] T008 Create `GraphService` in `src/services/GraphService.ts` — Microsoft Graph calls via `@pnp/graph`:
  - `getUsers(selectFields, filter): Promise<Member[]>` — paginated user fetch with `$select`, `$top`, `$filter`
  - `getUserPhoto(userId): Promise<string | null>` — blob URL or null
  - `getUserBatch(userIds): Promise<Member[]>` — batched user fetch
- [x] T009 Create `AccessControlService` in `src/services/AccessControlService.ts` — check current user's SharePoint group membership via `@pnp/sp`

### Utils (shared across all stories)

- [x] T010 [P] Create `teamsDeepLink.ts` in `src/utils/teamsDeepLink.ts` — build `https://teams.microsoft.com/l/chat/0/0?users={upn}` link
- [x] T011 [P] Create `formatUtils.ts` in `src/utils/formatUtils.ts` — phone formatting, `mailto:` link builder

### Hooks (shared across all stories)

- [x] T012 Create `useMembers` hook in `src/hooks/useMembers.ts` — data fetching with loading/error/data states, client-side cache, `useMemo` for filtered members
- [x] T013 Create `useDirectoryConfig` hook in `src/hooks/useDirectoryConfig.ts` — expose web part property pane config as React state
- [x] T014 Create `useAccessControl` hook in `src/hooks/useAccessControl.ts` — calls AccessControlService, returns `hasAccess | isLoading | error`

### Shared UI Components

- [x] T015 [P] Create `LoadingState` in `src/webparts/sharepointDirectory/components/shared/LoadingState.tsx` — Fluent UI `<Spinner>` with skeleton cards for initial load
- [x] T016 [P] Create `ErrorState` in `src/webparts/sharepointDirectory/components/shared/ErrorState.tsx` — Fluent UI `<MessageBar intent="error">` with retry `<Button>`
- [x] T017 [P] Create `EmptyState` in `src/webparts/sharepointDirectory/components/shared/EmptyState.tsx` — "Aucun résultat trouvé" message with action suggestion
- [x] T018 [P] Create `AccessDenied` in `src/webparts/sharepointDirectory/components/shared/AccessDenied.tsx` — Fluent UI `<MessageBar intent="warning">` with lock icon
- [x] T019 [P] Create `PersonaAvatar` in `src/webparts/sharepointDirectory/components/shared/PersonaAvatar.tsx` — Fluent UI `<Avatar>` with photo URL or initials fallback

**Checkpoint**: Foundation ready — all models, services, hooks, and shared components available. User story implementation can now begin.

---

## Phase 3: User Story 1 - Vue Carte (Priority: P1) 🎯 MVP

**Goal**: Collaborateur autorisé voit les membres en grille de cartes avec photo, nom, prénom, boutons Teams/Outlook, et détails configurables au clic.

**Independent Test**: Déployer le webpart sur SharePoint, vérifier la grille de cartes, le clic pour les détails, et les boutons Teams/Outlook.

### Implementation for User Story 1

- [x] T020 [US1] Create `Directory.tsx` root component in `src/webparts/sharepointDirectory/components/Directory.tsx` — view router (card/list), access gate, state management (searchQuery, filterValues, sort, view mode), error/loading/empty state dispatching
- [x] T021 [US1] Create shared types in `src/webparts/sharepointDirectory/components/Directory.types.ts` — `DirectoryProps`, `DirectoryState` per ui-contracts.md
- [x] T022 [P] [US1] Create `CardView.tsx` in `src/webparts/sharepointDirectory/components/cardView/CardView.tsx` — CSS Grid container rendering `MemberCard` for each member
- [x] T023 [P] [US1] Create `CardView.types.ts` in `src/webparts/sharepointDirectory/components/cardView/CardView.types.ts`
- [x] T024 [US1] Create `MemberCard.tsx` in `src/webparts/sharepointDirectory/components/cardView/MemberCard.tsx` — Fluent UI `<Card>` with `<Avatar>`, name, Teams/Outlook `<Button>` icons, `onClick` for detail expansion
- [x] T025 [US1] Create `MemberCardDetail.tsx` in `src/webparts/sharepointDirectory/components/cardView/MemberCardDetail.tsx` — expandable panel rendering configured `cardFields` from DirectoryConfig
- [x] T026 [US1] Wire `SharepointDirectoryWebPart.ts` entry point — instantiate services, pass config to `Directory.tsx`, configure `onPropertyPaneFieldChanged` for reactive refresh
- [x] T027 [US1] Add view toggle button in `Directory.tsx` — Fluent UI `<ToggleButton>` with Card/List icons, preserves state on toggle (FR-018)

**Checkpoint**: Vue Carte fully functional — users can browse cards, see details, click Teams/Outlook

---

## Phase 4: User Story 2 - Vue Liste (Priority: P1)

**Goal**: Collaborateur bascule en mode tableau avec colonnes triables/filtrables.

**Independent Test**: Basculer en vue Liste, vérifier les colonnes, le tri par en-tête, le filtrage par colonne.

### Implementation for User Story 2

- [x] T028 [P] [US2] Create `ListView.tsx` in `src/webparts/sharepointDirectory/components/listView/ListView.tsx` — Fluent UI `<DataGrid>` rendering members in rows
- [x] T029 [P] [US2] Create `ListView.types.ts` in `src/webparts/sharepointDirectory/components/listView/ListView.types.ts`
- [x] T030 [US2] Create `ListViewColumns.tsx` in `src/webparts/sharepointDirectory/components/listView/ListViewColumns.tsx` — column definitions (photo, name, firstName, email, phone, jobTitle, department, manager) with sort icon and onColumnHeaderClick handler
- [x] T031 [US2] Wire `ListView` into `Directory.tsx` view router — conditional render based on `view` state, pass members/sort/filter props

**Checkpoint**: Vue Liste fully functional — users can switch views, sort columns, filter columns

---

## Phase 5: User Story 3 - Contrôle d'accès et visibilité (Priority: P2)

**Goal**: Utilisateurs non autorisés voient un message d'accès refusé. Membres marqués non visibles sont masqués.

**Independent Test**: Configurer deux groupes (accès autorisé/refusé), deux profils (visible/masqué), vérifier comportement.

### Implementation for User Story 3

- [x] T032 [US3] Implement `AccessControlService` logic in `src/services/AccessControlService.ts` — `checkAccess(groupId): Promise<AccessControl>` using `sp.web.currentUser.groups()` and `sp.web.siteGroups.getById(groupId).users()`
- [x] T033 [US3] Implement visibility filtering in `useMembers` hook — add `filter(member => member.isVisible)` to `useMembers.ts` after fetching
- [x] T034 [US3] Wire `AccessDenied` gate in `Directory.tsx` — if `hasAccess === false`, render `<AccessDenied>` instead of member data (FR-005, FR-006)
- [x] T035 [US3] Add `accessGroupId` property to web part manifest and Property Pane in `SharepointDirectoryWebPart.ts`

**Checkpoint**: Access control working — unauthorized users get denied, hidden members not shown

---

## Phase 6: User Story 4 - Recherche et filtres (Priority: P2)

**Goal**: Barre de recherche textuelle + jusqu'à 3 filtres configurables, combinables.

**Independent Test**: Saisir un nom, configurer des filtres dans le Property Pane, tester combinaison recherche+filtres.

### Implementation for User Story 4

- [x] T036 [P] [US4] Create `SearchBar.tsx` in `src/webparts/sharepointDirectory/components/search/SearchBar.tsx` — Fluent UI `<Input>` with search icon, controlled value, debounced `onChange` (300ms)
- [x] T037 [P] [US4] Create `FilterBar.tsx` in `src/webparts/sharepointDirectory/components/search/FilterBar.tsx` — renders up to 3 Fluent UI `<Dropdown>` components from `filters` config, emits `onChange` with fieldName/value
- [x] T038 [US4] Implement search logic in `Directory.tsx` — `useMemo` filtering members by `searchQuery` across `displayName | givenName | surname` (case-insensitive)
- [x] T039 [US4] Implement filter logic in `Directory.tsx` — `useMemo` combining all active filter values with AND logic, integrated with search
- [x] T040 [US4] Wire `SearchBar` and `FilterBar` into `Directory.tsx` above the view area

**Checkpoint**: Search and filters working — real-time filtering, combined search+filters

---

## Phase 7: User Story 5 - Configuration (Priority: P3)

**Goal**: Administrateur configure l'annuaire via le panneau de propriétés (vue par défaut, filtres, champs carte).

**Independent Test**: Ouvrir le Property Pane, modifier tous les paramètres, sauvegarder, vérifier application.

### Implementation for User Story 5

- [x] T041 [US5] Build "Paramètres généraux" section in `SharepointDirectoryWebPart.ts` — `PropertyPaneDropdown` (defaultView: card/list), dynamic filter configuration (max 3: `PropertyPaneDropdown` for field name + `PropertyPaneTextField` for label)
- [x] T042 [US5] Build "Paramètres de la vue Carte" section in `SharepointDirectoryWebPart.ts` — `PropertyPaneCheckboxGroup` for cardFields (photo, name, firstName, email, phone, jobTitle, department, officeLocation, outlook, teams) with defaults: `['photo', 'name', 'firstName', 'outlook', 'teams']`
- [x] T043 [US5] Wire property changes to `Directory.tsx` via `useDirectoryConfig` hook — reactive refresh on config save

**Checkpoint**: Configuration panel fully functional — admins can customize all aspects

---

## Phase 8: User Story 6 - Export CSV (Priority: P3)

**Goal**: Collaborateur exporte les membres visibles (avec filtres/recherche actifs) en CSV.

**Independent Test**: Cliquer sur Exporter, vérifier le fichier téléchargé.

### Implementation for User Story 6

- [x] T044 [US6] Create `CsvService` in `src/services/CsvService.ts` — `exportToCsv(members, filename)` using `papaparse` for serialization, `Blob` + `URL.createObjectURL()` for download trigger
- [x] T045 [US6] Create `CsvExport.tsx` in `src/webparts/sharepointDirectory/components/export/CsvExport.tsx` — Fluent UI `<Button icon={<ArrowDownloadIcon />}>` labeled "Exporter en CSV", calls CsvService with currently filtered/sorted members
- [x] T046 [US6] Wire `CsvExport` button into `Directory.tsx` header area (next to view toggle)

**Checkpoint**: CSV export working — respects active filters/search, correct columns

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, error boundaries, final validation

- [x] T047 [P] Add React Error Boundary wrapper in `Directory.tsx` — catch unhandled errors, render `<ErrorState>` with stack trace hidden
- [x] T048 [P] Keyboard navigation audit — verify all interactive elements reachable via Tab, Enter/Escape for detail panel, arrow keys for list navigation (WCAG AA)
- [x] T049 [P] Contrast ratio audit — verify all text meets 4.5:1 (normal) / 3:1 (large) using browser dev tools
- [x] T050 [P] Add 200% zoom support validation — ensure no horizontal scroll at 200% zoom on viewport width
- [x] T051 [P] Verify loading states — spinner on initial fetch, skeleton cards for Card view, skeleton rows for List view
- [x] T052 [P] Verify error states — disconnect network, confirm ErrorState with retry appears; confirm no stack traces exposed
- [x] T053 [P] Verify empty states — search for nonexistent name, confirm EmptyState message with suggestion
- [x] T054 Validate full quickstart.md scenarios — run all 7 validation scenarios end-to-end
- [x] T055 Final performance check — verify < 2s initial load, < 200ms toggle, < 500ms search for 500+ members

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories
- **US1 - Card View (Phase 3)**: Depends on Foundational (Phase 2) — No dependencies on other stories
- **US2 - List View (Phase 4)**: Depends on Foundational (Phase 2) — Uses same data/members from US1 but independently testable
- **US3 - Access Control (Phase 5)**: Depends on Foundational (Phase 2) — Can start after Phase 2, independent of US1/US2
- **US4 - Search & Filters (Phase 6)**: Depends on Foundational (Phase 2) — Can start after Phase 2, independent of prior stories
- **US5 - Configuration (Phase 7)**: Depends on Foundational (Phase 2) — Builds on Property Pane, independent of prior stories
- **US6 - CSV Export (Phase 8)**: Depends on Foundational (Phase 2) — Uses filtered members, independent
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **US2 (P1)**: Can start after Phase 2 — Independent of US1, but both integrate into `Directory.tsx`
- **US3 (P2)**: Can start after Phase 2 — Independent
- **US4 (P2)**: Can start after Phase 2 — Independent
- **US5 (P3)**: Can start after Phase 2 — Independent, but Property Pane fields may reference components from US1/US4
- **US6 (P3)**: Can start after Phase 2 — Independent

### Within Each User Story

- Types/interfaces before components
- Components before wiring into `Directory.tsx`
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003 can run in parallel (different install commands)
- T005, T006, T007 can run in parallel (different model files)
- T010, T011 can run in parallel (different util files)
- T015-T019 can all run in parallel (different shared component files)
- T022, T023 can run in parallel (CardView + CardView types)
- T028, T029 can run in parallel (ListView + ListView types)
- T036, T037 can run in parallel (SearchBar + FilterBar)
- T047-T053 can all run in parallel (different polish checks)

---

## Parallel Example: Foundational Phase

```bash
# Launch all models together:
Task: "Create Member interface in src/models/Member.ts"
Task: "Create DirectoryConfig interface in src/models/DirectoryConfig.ts"
Task: "Create Filter model in src/models/Filter.ts"

# Launch all shared components together:
Task: "Create LoadingState in .../shared/LoadingState.tsx"
Task: "Create ErrorState in .../shared/ErrorState.tsx"
Task: "Create EmptyState in .../shared/EmptyState.tsx"
Task: "Create AccessDenied in .../shared/AccessDenied.tsx"
Task: "Create PersonaAvatar in .../shared/PersonaAvatar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Card View)
4. **STOP and VALIDATE**: Deploy to Workbench, test Card View independently
5. Demo/deploy if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Card View) → Test → MVP ready
3. Add US2 (List View) → Test → Full directory browsing
4. Add US3 (Access Control) → Test → Secure directory
5. Add US4 (Search & Filters) → Test → Complete navigation
6. Add US5 (Configuration) → Test → Admin configurable
7. Add US6 (CSV Export) → Test → Full feature set
8. Each story adds value without breaking previous stories

### Suggested MVP Scope

**Phase 1 + Phase 2 + Phase 3 (US1 only)** = Minimum viable directory: Card grid with member browsing, contact buttons, and details on click. Deployable and valuable immediately.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- SPFx scaffold output goes into `src/webparts/sharepointDirectory/` — adapt paths if Yeoman generates different folder name

---

## Phase 10: Convergence

**Purpose**: Address gaps found by `/speckit.converge` between spec/plan and current implementation.

- [x] T056 [CRITICAL] Create automated tests for all UI components — happy path, empty state, error state, loading state per Constitution Testing Discipline (missing)
- [x] T057 [HIGH] [US2] Implement column sorting in `ListView.tsx` — click header to toggle asc/desc per FR-004, US2/AC2 (missing)
- [x] T058 [HIGH] [US2] Implement column-level filtering in `ListView.tsx` per FR-004, US2/AC3 (missing)
- [x] T059 [HIGH] Add Graph pagination in `src/services/GraphService.ts` — use `getPaged()` instead of `.top(999)` per FR-017, Edge Case "1000+ membres" (partial)
- [x] T060 [HIGH] Audit and fix accessibility: keyboard arrow nav in list, focus management, screen-reader labels, contrast ratios, 200% zoom per FR-016, Constitution V (partial)
- [x] T061 [MEDIUM] Implement relevance-ranked search results instead of simple `includes()` substring match per Constitution III (partial)
- [x] T062 [MEDIUM] Revoke Blob photo URLs on component unmount or photo refresh in `src/services/GraphService.ts` to prevent memory leak per Edge Case "photo" (partial)
- [x] T063 [LOW] Remove dead code: `formatPhone` in `formatUtils.ts` (unused), `DirectoryState` interface (unused or wire into component) (unrequested)
- [x] T064 [LOW] Replace placeholder GUID `b3c4d5e6-f7a8-9012-cdef-123456789012` in `SharepointDirectoryWebPart.manifest.json` with a valid unique GUID (unrequested)
