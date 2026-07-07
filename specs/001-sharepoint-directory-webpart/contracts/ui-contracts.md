# UI Contracts: Annuaire SharePoint

## Web Part Property Pane Contract

The web part exposes configuration via the standard SPFx Property Pane. This is the contract between the SharePoint page editor and the web part.

### Property: `defaultView`

```typescript
PropertyPaneDropdown('defaultView', {
  label: 'Vue par défaut',
  options: [
    { key: 'card', text: 'Vue Carte' },
    { key: 'list', text: 'Vue Liste' }
  ],
  selectedKey: 'card'
})
```

### Property: `filters`

Dynamic property pane fields (max 3). Each filter consists of:
- A field picker (dropdown listing available Graph user properties: `department`, `jobTitle`, `officeLocation`)
- A label text field

```typescript
PropertyPaneDynamicFieldSet({
  label: 'Filtres',
  maxFields: 3,
  fields: [
    PropertyPaneDropdown('filterField1', { ... }),
    PropertyPaneTextField('filterLabel1', { ... }),
    PropertyPaneDropdown('filterField2', { ... }),
    PropertyPaneTextField('filterLabel2', { ... }),
    PropertyPaneDropdown('filterField3', { ... }),
    PropertyPaneTextField('filterLabel3', { ... })
  ]
})
```

### Property: `cardFields`

Checkbox group for card detail fields.

```typescript
PropertyPaneCheckboxGroup('cardFields', {
  label: 'Champs affichés au clic sur une carte',
  options: [
    { key: 'photo', text: 'Photo' },
    { key: 'name', text: 'Nom' },
    { key: 'firstName', text: 'Prénom' },
    { key: 'email', text: 'E-mail' },
    { key: 'phone', text: 'Téléphone' },
    { key: 'jobTitle', text: 'Poste' },
    { key: 'department', text: 'Département' },
    { key: 'officeLocation', text: 'Localisation' },
    { key: 'outlook', text: 'Outlook' },
    { key: 'teams', text: 'Teams' }
  ],
  defaultSelectedKeys: ['photo', 'name', 'firstName', 'outlook', 'teams']
})
```

### Property: `accessGroupName`

```typescript
PropertyPaneTextField('accessGroupName', {
  label: 'Groupe SharePoint autorisé (laisser vide = tous les utilisateurs du site)',
  placeholder: 'Nom du groupe SharePoint'
})
```

## Component Props Contracts

### Directory

```typescript
interface DirectoryProps {
  config: DirectoryConfig;
  members: Member[];
  isLoading: boolean;
  error: string | null;
  hasAccess: boolean;
  accessCheckLoading: boolean;
  onRetry: () => void;
}
```

### CardView

```typescript
interface CardViewProps {
  members: Member[];
  cardFields: CardField[];
  onMemberClick: (member: Member) => void;
}

interface CardViewState {
  selectedMember: Member | null;
}
```

### ListView

```typescript
interface ListViewProps {
  members: Member[];
  onSort: (columnKey: string, direction: 'asc' | 'desc') => void;
  onColumnFilter: (columnKey: string, value: string) => void;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
}
```

### SearchBar

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

### FilterBar

```typescript
interface FilterBarProps {
  filters: FilterField[];
  values: Record<string, string | null>;
  onChange: (fieldName: string, value: string | null) => void;
}
```

## Service Contracts

### GraphService

```typescript
interface IGraphService {
  getMembers(): Promise<Member[]>;
  getMemberPhoto(userId: string): Promise<string | null>;
  getMemberBatch(userIds: string[]): Promise<Member[]>;
}

interface GraphServiceConfig {
  selectFields: string[];
  pageSize: number;
  filterDisabledAccounts: boolean;
}
```

### AccessControlService

```typescript
interface IAccessControlService {
  checkAccess(groupName: string | null): Promise<AccessControl>;
}

interface AccessControl {
  hasAccess: boolean;
  userGroups: string[];
  isLoading: boolean;
  error: string | null;
}
```

### CsvService

```typescript
interface ICsvService {
  exportToCsv(members: Member[], filename: string): void;
}

interface CsvExportConfig {
  delimiter: string;
  includeHeaders: boolean;
  columns: (keyof Member)[];
}
```

## State Management Contract

The root `Directory` component manages global state:

```typescript
interface DirectoryState {
  view: 'card' | 'list';           // Current display mode
  searchQuery: string;             // Search bar text
  filterValues: Record<string, string | null>;  // Active filter selections
  sortColumn: string | null;       // List view sort column
  sortDirection: 'asc' | 'desc';   // List view sort direction
}
```

State flows down as props. User actions (search, filter, sort, view toggle) update state in `Directory.tsx`. Filtered/sorted member list is derived via `useMemo`.

## Data Flow Diagram

```
┌──────────────────────────────────────────────────┐
│                   SharePoint Page                  │
│  ┌──────────────────────────────────────────────┐ │
│  │           SharepointDirectoryWebPart          │ │
│  │  ┌────────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │ AccessCheck │  │  Config  │  │  Members │ │ │
│  │  │  (groups)   │  │  (props) │  │ (Graph)  │ │ │
│  │  └─────┬───────┘  └────┬─────┘  └────┬─────┘ │ │
│  │        └───────────────┼─────────────┘       │ │
│  │                        ▼                      │ │
│  │               ┌────────────────┐              │ │
│  │               │   Directory     │              │ │
│  │               │  (root comp.)   │              │ │
│  │               └───────┬────────┘              │ │
│  │          ┌────────────┼────────────┐          │ │
│  │          ▼            ▼            ▼          │ │
│  │    ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │    │ SearchBar│ │FilterBar │ │ Toggle   │    │ │
│  │    └──────────┘ └──────────┘ │ Card/List│    │ │
│  │                              └──────────┘    │ │
│  │          ┌──────────────────┐                 │ │
│  │          │   CardView or    │                 │ │
│  │          │    ListView      │                 │ │
│  │          └────────┬─────────┘                 │ │
│  │                   ▼                           │ │
│  │          ┌──────────────────┐                 │ │
│  │          │  CsvExport btn   │                 │ │
│  │          └──────────────────┘                 │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```
