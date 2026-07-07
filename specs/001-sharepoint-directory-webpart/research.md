# Research: Annuaire SharePoint

**Date**: 2026-07-06

## R1: Microsoft Graph API Access Layer

**Decision**: Use `@pnp/graph` as the primary data access layer for Azure AD user queries.

**Rationale**:
- `@pnp/graph` provides a fluent, typed API over Microsoft Graph REST endpoints, eliminating manual `fetch` calls, URL construction, and response parsing.
- Built-in pagination support via `.top()`, `.skip()`, and `getPaged()` methods.
- Automatic batching via `graph.batch()` for parallel queries (e.g., fetching user profiles + photos simultaneously).
- Consistent error handling pattern aligned with `@pnp/sp` (already used for SharePoint context).
- Selective property expansion (`$select`) reduces payload size — critical for 500+ user directories.

**Alternatives considered**:
- Raw `fetch` to Graph REST: Verbose, no typing, manual pagination. Rejected due to maintenance burden.
- `@microsoft/microsoft-graph-client`: Official Microsoft SDK. More heavyweight, requires separate auth token handling. Rejected in favor of PnPjs ecosystem consistency.

## R2: Access Control Strategy

**Decision**: Gate access via SharePoint site group membership checked through `@pnp/sp`.

**Rationale**:
- SharePoint site groups (`siteGroups`) are already managed by site owners — no additional Entra ID admin required.
- Check is a single `sp.web.currentUser.groups()` call, no extra permissions beyond what SPFx already has.
- Aligns with assumption that access control uses existing SharePoint groups.
- Azure AD group check (`@pnp/graph`) requires `GroupMember.Read.All` permission, which is broader. Opting for the simpler, more scoped SharePoint group check for v1.

**Alternatives considered**:
- Azure AD group membership via MS Graph: More centralized but requires additional API permission scopes. To be re-evaluated if cross-site access becomes a requirement.
- Custom permission list in property pane: Fragile, duplicates AD data. Rejected.

## R3: Member Visibility Mechanism

**Decision**: Use an Azure AD user custom attribute or extension attribute to flag visibility, with fallback to a SharePoint list of visible group members.

**Rationale**:
- The "clean" approach depends on what fields are available in the tenant's Azure AD schema.
- **Preferred path**: A custom attribute (e.g., `extension_<appId>_showInDirectory`) set on user profiles, queryable via `$filter` on `/users`. This avoids maintaining a separate list.
- **Fallback path**: If custom attributes are not available, use a SharePoint list (`DirectoryVisibility`) containing user IDs/emails of members who should appear. This is less ideal (dual source of truth) but works without tenant-level schema changes.

**Alternatives considered**:
- Azure AD group membership for visibility: Works but conflates visibility with access control. A member could be in the "visible" group but not have site access, or vice versa.
- Hardcoded property pane list: Unmaintainable at scale. Rejected.

## R4: Pagination Strategy

**Decision**: Server-side pagination via Microsoft Graph `$top` / `$skiptoken`, with client-side caching.

**Rationale**:
- Target scale is 500–1000 users. Microsoft Graph default page size is 100 results.
- `@pnp/graph` `getPaged()` method iterates `@odata.nextLink` automatically.
- Initial load fetches first page (100 users) for fast time-to-interactive, then streams remaining pages.
- Client-side cache stores full result set after first complete fetch, enables instant search/filter without additional API calls.
- Photo requests are batched (20 per batch via Graph batching) to avoid N+1 queries.

**Alternatives considered**:
- Fetch all users in single call: Graph caps at 999 results with `$top=999`. Acceptable for v1 scale. Simpler implementation.
- Delta queries for incremental sync: Too complex for v1, defers to v2 if real-time updates needed.

## R5: Photo Handling

**Decision**: Use Microsoft Graph `/users/{id}/photo/$value` with `@pnp/graph`, fallback to initials with Fluent UI `<Avatar>` component.

**Rationale**:
- Graph photo endpoint returns binary; `@pnp/graph` supports blob response via `graph.users.getById(id).photo.getBlob()`.
- Fluent UI v9 `<Avatar>` natively supports `image` prop with automatic initials fallback via `name` prop → eliminates custom initials logic.
- Batch photo requests via `graph.batch()` for performance.

**Alternatives considered**:
- SharePoint User Profile Service: Legacy API, not recommended for new development.
- Base64 encode photos: Increases payload size unnecessarily.

## R6: CSV Export Strategy

**Decision**: Client-side CSV generation using the in-memory filtered dataset.

**Rationale**:
- Data is already loaded client-side with full result set cached.
- No additional API calls needed — export respects active filters/search.
- Simple: `Array.map()` → CSV rows → `Blob` → download via `URL.createObjectURL()`.
- No external CSV library needed for basic export. If complex escaping needed, `papaparse` is lightweight (~20KB).

**Alternatives considered**:
- Server-side export via Azure Function: Unnecessary for client-side Web Part, adds infrastructure complexity. Rejected.
- SharePoint list export: Limits column control, doesn't respect client-side filters.

## R7: SPFx Build Chain & Fast Serve Configuration

**Decision**: Use `@microsoft/sp-build-web@1.20.0` with `@microsoft/rush-stack-compiler-4.7@0.1.1` for TypeScript compilation, and `spfx-fast-serve@^4.0.2` for hot-reload development.

**Rationale**:
- `@microsoft/sp-build-web` is the mandatory SPFx build toolchain. It requires `@microsoft/rush-stack-compiler-4.7` for lint/tsc tasks — version `0.1.1` is the latest available.
- `spfx-fast-serve` wraps webpack-dev-server for hot reload, cutting rebuild time from ~30s to ~3s.
- `@microsoft/sp-module-interfaces` requires an `overrides` entry (`1.20.1`) because the version pinned by `sp-build-web` (`1.19.0-dev.233`) is a dev-only version not published to npm.
- `npm install --legacy-peer-deps` is necessary due to `@types/react` peer dependency conflicts between SPFx 1.20 and React 17.

**Alternatives considered**:
- Standard `gulp serve`: Too slow. Rejected.
- Node 22: Incompatible with SPFx 1.20 build rig (requires Node >=20.11.0 <21.0.0). Must use Node 20 LTS.

## R8: Fluent UI v8 Component Mapping

**Decision**: Use Fluent UI v8 (`@fluentui/react`) throughout.

**Rationale**:
- SPFx 1.20.x ships with React 17; Fluent UI v9 requires React 18 and is incompatible.
- Fluent UI v8 is the officially supported library for SPFx 1.20.x and provides full SharePoint look-and-feel.
- Key component mappings:

| UI Element | Fluent UI v8 Component |
|------------|----------------------|
| Card grid | Custom `div` styled as cards + CSS Grid |
| Data table | `<DetailsList>` from `@fluentui/react/lib/DetailsList` |
| Search input | `<SearchBox>` from `@fluentui/react/lib/SearchBox` |
| Filter dropdowns | `<Dropdown>` from `@fluentui/react/lib/Dropdown` |
| Person photo | `<Persona>` from `@fluentui/react/lib/Persona` (initials fallback built-in) |
| Toggle Card/List | `<DefaultButton>` with `primary` prop from `@fluentui/react/lib/Button` |
| Property pane fields | SPFx `PropertyPane*` controls (native) |
| Export button | `<DefaultButton iconProps={{ iconName: 'Download' }}>` |
| Loading | `<Spinner>` from `@fluentui/react/lib/Spinner` |
| Error message | `<MessageBar messageBarType={MessageBarType.error}>` |
| Empty state | Custom composition with `<Icon iconName="Search">` |
| Access denied | `<MessageBar messageBarType={MessageBarType.warning}>` + lock icon |

**Alternatives considered**:
- Fluent UI v9 (`@fluentui/react-components`): Requires React 18+, incompatible with SPFx 1.20's React 17 runtime. Rejected for now.
- Custom CSS: Would not match Microsoft 365 ecosystem look-and-feel. Rejected per project requirements.
