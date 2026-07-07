# Data Model: Annuaire SharePoint

**Feature**: 001-sharepoint-directory-webpart

## Entities

### Member

Represents an organizational user displayed in the directory.

| Field | Type | Source | Required | Description |
|-------|------|--------|----------|-------------|
| `id` | `string` (UUID) | Graph `user.id` | ✅ | Unique identifier from Azure AD |
| `displayName` | `string` | Graph `user.displayName` | ✅ | Full display name |
| `givenName` | `string` | Graph `user.givenName` | ❌ | First name |
| `surname` | `string` | Graph `user.surname` | ❌ | Last name |
| `email` | `string` | Graph `user.mail` or `user.userPrincipalName` | ❌ | Email address |
| `jobTitle` | `string` | Graph `user.jobTitle` | ❌ | Position / job title |
| `department` | `string` | Graph `user.department` | ❌ | Department name |
| `officeLocation` | `string` | Graph `user.officeLocation` | ❌ | Physical location / office |
| `mobilePhone` | `string` | Graph `user.mobilePhone` | ❌ | Phone number |
| `managerId` | `string` (UUID) | Graph `user.manager.id` | ❌ | Manager's Azure AD ID |
| `managerDisplayName` | `string` | Graph expanded `manager.displayName` | ❌ | Manager's display name (resolved) |
| `photoUrl` | `string` (URL) | Graph `/users/{id}/photo/$value` | ❌ | Profile photo (blob URL or base64 data URI) |
| `isVisible` | `boolean` | Extension attribute or SP list | ✅ | Whether member appears in directory (default: `true`) |
| `teamsId` | `string` | Graph `user.userPrincipalName` | ❌ | UPN used for Teams deep link |

**Validation rules**:
- `id` must be non-empty
- `email` must be valid email format if present
- `isVisible` defaults to `true` unless explicitly flagged

**State transitions**: None (read-only entity fetched from directory)

### DirectoryConfig

Serialized web part configuration persisted via SharePoint Property Pane.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `defaultView` | `'card' \| 'list'` | `'card'` | Default display mode on page load |
| `filters` | `FilterField[]` | `[]` | Up to 3 filterable fields |
| `cardFields` | `CardField[]` | `['photo', 'name', 'firstName', 'outlook', 'teams']` | Fields displayed when card is clicked |
| `accessGroupId` | `number` | `null` | SharePoint group ID for access control |

### FilterField

A configurable filter dropdown.

| Field | Type | Description |
|-------|------|-------------|
| `fieldName` | `string` | Graph user property to filter on (e.g., `department`, `jobTitle`) |
| `label` | `string` | Display label for the filter dropdown |
| `selectedValue` | `string \| null` | Currently selected filter value (runtime) |

**Validation rules**:
- Maximum 3 active `FilterField` entries in `DirectoryConfig.filters`
- `fieldName` must be a valid Graph user property

### CardField

Field selection for the card detail panel.

| Field | Type | Description |
|-------|------|-------------|
| `fieldName` | `'photo' \| 'name' \| 'firstName' \| 'email' \| 'phone' \| 'jobTitle' \| 'department' \| 'officeLocation' \| 'outlook' \| 'teams'` | Field identifier |
| `isVisible` | `boolean` | Whether this field appears in card detail |

### AccessControl

Runtime access state for the current user.

| Field | Type | Description |
|-------|------|-------------|
| `hasAccess` | `boolean` | Whether current user can view the directory |
| `userGroups` | `string[]` | Groups the current user belongs to |
| `isLoading` | `boolean` | Access check in progress |
| `error` | `string \| null` | Error message if check failed |

## Relationships

```
Member.managerId → Member.id (self-referential, unresolved in list view but resolved for display)
DirectoryConfig.filters[].fieldName → Member field names (dynamic mapping)
AccessControl → DirectoryConfig.accessGroupId (validates membership)
```

## Data Flow

```
[Azure AD] ──Graph API──→ [GraphService] ──→ [useMembers hook]
                                                  │
                          [SharePoint Groups] ──→ [AccessControlService] ──→ [useAccessControl hook]
                                                  │
                          [Property Pane] ──→ [DirectoryConfig] ──→ [useDirectoryConfig hook]
                                                  │
                                                  ▼
                                          [Directory.tsx]
                                           ├── CardView
                                           ├── ListView
                                           └── AccessDenied / Error / Loading
```
