# Data Model: Annuaire SharePoint V2

**Created**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

## Entities

### Member

Représente un collaborateur issu d'Azure AD via Microsoft Graph.

| Field | Type | Required | Source (Graph) | Notes |
|-------|------|----------|----------------|-------|
| `id` | `string` | ✅ | `user.id` | GUID Azure AD |
| `displayName` | `string` | ✅ | `user.displayName` | Nom complet |
| `givenName` | `string` | ❌ | `user.givenName` | Prénom |
| `surname` | `string` | ❌ | `user.surname` | Nom de famille |
| `email` | `string` | ❌ | `user.mail \|\| user.userPrincipalName` | Email principal |
| `jobTitle` | `string` | ❌ | `user.jobTitle` | Poste |
| `department` | `string` | ❌ | `user.department` | Département |
| `officeLocation` | `string` | ❌ | `user.officeLocation` | Localisation |
| `mobilePhone` | `string` | ❌ | `user.mobilePhone` | Téléphone mobile |
| `managerId` | `string` | ❌ | `user.manager?.id` | ID du manager (via `$expand`) |
| `managerDisplayName` | `string` | ❌ | `user.manager?.displayName` | Nom du manager (via `$expand`) |
| `photoUrl` | `string` | ❌ | `/users/{id}/photo/$value` | Blob URL (révoqué au cleanup) |
| `isVisible` | `boolean` | ✅ | N/A | Toujours `true` (filtrage client-side) |
| `teamsId` | `string` | ❌ | `user.userPrincipalName` | UPN pour deep-link Teams |

**Filter**: `accountEnabled eq true AND userType eq 'Member'`

**Pagination**: Pagination serveur via `for await (const page of query)` (pagination Graph automatique via `@pnp/graph`)

---

### DirectoryConfig

Configuration de l'annuaire stockée dans les propriétés SPFx.

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `defaultView` | `'card' \| 'list'` | `'card'` | Vue par défaut |
| `filters` | `FilterField[]` | `[]` | Jusqu'à 3 filtres |
| `cardFields` | `CardFieldName[]` | `['photo','name','firstName','outlook','teams']` | Champs visibles vue Carte |
| `listFields` | `CardFieldName[]` | `['photo','name','firstName','email','phone','jobTitle','department','manager']` | Champs visibles vue Liste |
| `modalFields` | `CardFieldName[]` | `['photo','name','firstName','email','phone','jobTitle','department','officeLocation','outlook','teams']` | Champs visibles Modale |
| `accessGroupId` | `number \| null` | `null` | ID groupe SharePoint pour restriction d'accès |

---

### FilterField

| Field | Type | Notes |
|-------|------|-------|
| `fieldName` | `string` | Nom du champ sur `Member` (ex: `'department'`, `'jobTitle'`) |
| `label` | `string` | Libellé affiché dans le dropdown de filtre |

---

### CardFieldName (union type)

```typescript
type CardFieldName =
  | 'photo'
  | 'name'
  | 'firstName'
  | 'email'
  | 'phone'
  | 'jobTitle'
  | 'department'
  | 'officeLocation'
  | 'outlook'
  | 'teams';
```

---

### ISharepointDirectoryWebPartProps (SPFx Property Pane)

| Field | Type | Default |
|-------|------|---------|
| `defaultView` | `'card' \| 'list'` | `'card'` |
| `filterCount` | `number` | `0` |
| `filterField1..3` | `string` | `''` |
| `filterLabel1..3` | `string` | `''` |
| `cardField_photo..cardField_teams` | `boolean` | varies |
| `listField_photo..listField_teams` | `boolean` | varies |
| `modalField_photo..modalField_teams` | `boolean` | varies |
| `accessGroupId` | `number \| null` | `null` |

---

## State Transitions

### Modal State

```
State: { selectedMember: Member | null }
  
  null ───[click card/row]───► Member
  
  Member ───[Escape key]──────► null
  Member ───[click outside]───► null
  Member ───[click ✕ button]──► null
```

### Pagination State (usePagination)

```
State: { currentPage: number, pageSize: number }
  
  currentPage=1 ───[load more]───► currentPage+1
  [filter/search change] ───────► currentPage=1 (reset)
  [view change] ────────────────► currentPage=1 (reset), pageSize updated
```

### View State

```
State: { view: 'card' | 'list' }
  
  card ───[click list icon]─────► list (preserves filters/search)
  list ───[click card icon]────► card (preserves filters/search)
```
