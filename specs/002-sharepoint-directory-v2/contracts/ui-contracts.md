# UI Contracts: Annuaire SharePoint V2

**Created**: 2026-07-07

## Component API Contracts

### Directory (root)

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

**Rendering states** (ordre de priorité):
1. `accessCheckLoading || isLoading` → `<LoadingState />`
2. `error` → `<ErrorState onRetry />`
3. `!hasAccess` → `<AccessDenied />`
4. Normal → `<Banner />` + `<CardView />` ou `<ListView />` + `<MemberModal />`

---

### Banner

```typescript
interface BannerProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: FilterField[];
  members: Member[];
  filterValues: Record<string, string | null>;
  onFilterChange: (fieldName: string, value: string | null) => void;
  resultCount: number;
  activeView: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
  filteredMembers: Member[];
}
```

**Layout**: Stack horizontal responsive, avec wrap sur petits écrans.

---

### CardView

```typescript
interface CardViewProps {
  members: Member[];
  cardFields: CardFieldName[];
  onMemberClick: (member: Member) => void;
}

// Pagination: maximum 24 cartes par page, bouton "Voir plus" si hasMore
```

**Grid**: `repeat(auto-fill, minmax(250px, 1fr))` avec media queries pour 4→2→1 colonnes.

---

### MemberCard

```typescript
interface MemberCardProps {
  member: Member;
  cardFields: CardFieldName[];
  onClick: (member: Member) => void;
}
```

**Rendu**: Avatar, nom complet, jobTitle. Boutons Teams/Outlook. Clic → `onClick(member)`.

---

### ListView

```typescript
interface ListViewProps {
  members: Member[];
  listFields: CardFieldName[];
  onMemberClick: (member: Member) => void;
}

// Pagination: maximum 15 lignes par page, bouton "Voir plus" si hasMore
// Colonnes dynamiques basées sur listFields
// Tri et filtrage natifs sur chaque colonne
```

---

### MemberModal

```typescript
interface MemberModalProps {
  member: Member;
  modalFields: CardFieldName[];
  onDismiss: () => void;
}
```

**Affichage**: Photo + nom + prénom + boutons Teams/Outlook (toujours visibles) + champs configurables via `modalFields`.

**Règles de fermeture**:
- Bouton ✕ (coin supérieur droit)
- Clic en dehors de la modale
- Touche Échap
- Tout appelle `onDismiss()`

---

### FilterBar

```typescript
interface FilterBarProps {
  filters: FilterField[];
  members: Member[];
  values: Record<string, string | null>;
  onChange: (fieldName: string, value: string | null) => void;
}
```

**Comportement**: Affiche jusqu'à 3 Dropdown. Les valeurs distinctes sont extraites des `members`. Si 0 filtre configuré, rend `null`.

---

### CsvExport

```typescript
interface CsvExportProps {
  members: Member[];
}
```

**Fichier**: `annuaire-sharepoint-YYYY-MM-DD.csv`, BOM UTF-8, séparateur `;`.

---

### Shared Components (props inchangées)

- `LoadingState`: aucun prop → spinner centré
- `ErrorState`: `{ message?, onRetry }` → MessageBar erreur + bouton Réessayer
- `EmptyState`: aucun prop → icône + message "Aucun résultat"
- `AccessDenied`: aucun prop → icône cadenas + message refus
- `PersonaAvatar`: `{ photoUrl?, displayName, givenName?, size? }` → Persona avec fallback initiales
