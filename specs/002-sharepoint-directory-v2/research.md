# Research Document: Annuaire SharePoint V2

**Created**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

## R1: SPFx Version, Node.js, and React Compatibility

**Decision**: SPFx `1.20.2` (build) + `1.20.1` (runtime) with Node.js `18.20.x` LTS and React `17.0.1`

**Rationale**:
- SPFx `1.20.2` du package `@microsoft/sp-build-web` supporte Node `>=18.17.1 <19.0.0` (Node 18 LTS)
- Les packages runtime (`@microsoft/sp-webpart-base`, `@microsoft/sp-core-library`, etc.) restent en `1.20.1` — pas de version `1.20.2` pour eux
- Le projet actuel est déjà en SPFx `1.20.0` → migration minimale : seul `@microsoft/sp-build-web` passe à `1.20.2`
- **React 18 est incompatible** avec toute version SPFx actuelle (`@microsoft/sp-core-library` peer dep: `react@>=16.13.1 <18.0.0`)
- React `17.0.1` est conservé (identique au projet V1 actuel)
- Fluent UI v8 (`@fluentui/react`) déjà présent dans le projet — natif SharePoint, look Microsoft 365

**Migration from V1 (SPFx 1.20.0 → 1.20.2)**:
- Seul `@microsoft/sp-build-web` passe de `1.20.0` à `1.20.2`
- Les autres `@microsoft/sp-*` restent en `1.20.0` (ou `1.20.1` si dispo)
- Node passe de `20.11.0` à `18.20.x` LTS
- `rush-stack-compiler-4.7`, `@pnp/sp` v4, `@pnp/graph` v4, `spfx-fast-serve` : inchangés

---

## R2: Fluent UI Component Strategy

**Decision**: Fluent UI v8 (`@fluentui/react`) exclusively

**Rationale**:
- SPFx 1.23.2 ships with `@fluentui/react` v8 bundled — components like `DetailsList`, `Persona`, `Dropdown`, `SearchBox` are pre-bundled
- Fluent UI v8 components match the SharePoint/Microsoft 365 native look identically
- New components needed (Modal, Banner) use v8 primitives: `Modal`, `Stack`, `Text`, `Icon`, `IconButton`, `CommandBar`
- No bundle bloat from a second Fluent UI version

**Components mapping**:
| UI Element | Fluent UI v8 Component |
|---|---|
| Modale | `Modal` + `ModalFooter` |
| Bannière | `Stack` horizontal + `CommandBar` (or custom `Stack`) |
| Vue toggle icons | `IconButton` (CardView icon, ListView icon) |
| Compteur résultats | `Text` |
| Filtres | `Dropdown` (existing FilterBar) |
| Grille cartes | CSS Grid custom (pas de composant Fluent UI natif) |
| Tableau | `DetailsList` (existing ListView) |
| Avatar/initiales | `Persona` (existing PersonaAvatar) |

---

## R3: Pagination Strategy

**Decision**: Pagination client-side avec `Array.slice()` + état `page` dans un hook `usePagination`

**Rationale**:
- Les données sont déjà chargées côté client (GraphService charge TOUS les membres)
- Paginer côté client évite les appels réseau supplémentaires
- L'utilisation mémoire est acceptable même pour 5000 membres (~5MB en JSON)
- `usePagination(members, { card: 24, list: 15 })` retourne `{ visibleMembers, hasMore, loadMore }`

**Pagination flow**:
1. `useMembers` charge tous les membres via Graph (avec pagination serveur intégrée)
2. `usePagination` prend `filteredMembers` (déjà filtrés par recherche/filtres) et n'expose que la page courante
3. Bouton "Voir plus de collaborateurs" incrémente la page → `visibleMembers` s'étend de `pageSize` items

---

## R4: Modal Pattern

**Decision**: Composant `MemberModal` utilisant `Modal` de Fluent UI v8, géré par un état React dans `Directory.tsx`

**Rationale**:
- Ouvrir/fermer est contrôlé par `selectedMember: Member | null` dans `Directory.tsx`
- Clic sur une carte → `setSelectedMember(member)` → la modale s'affiche
- Clic sur une ligne liste → même comportement
- Fermeture via `onDismiss` (Échap, clic dehors, bouton ✕)
- Les champs affichés dans la modale sont configurables via `config.modalFields`

**Modal state machine**:
```
[selectedMember = null] → clic carte/ligne → [selectedMember = Member]
[selectedMember = Member] → Échap / clic dehors / ✕ → [selectedMember = null]
```

---

## R5: Banner Layout

**Decision**: Nouveau composant `Banner.tsx` intégrant filtre, compteur résultats, et icônes de vue

**Rationale**: La spec V2 demande une bannière unifiée qui regroupe les éléments auparavant dispersés.

**Banner structure** (gauche → droite):
```
[Barre de recherche] [Filtre 1] [Filtre 2] [Filtre 3] [Résultats: X collaborateurs] [🫱 Carte] [📋 Liste] [⬇ Exporter]
```

- `Stack horizontal` avec `horizontalAlign="space-between"`
- Partie gauche : `SearchBar` + `FilterBar` (conditionnel si filtres configurés) + `Text` compteur
- Partie droite : `IconButton` × 2 (vue Carte, vue Liste) + `IconButton` (export CSV)
- Icônes : `View` (carte), `ViewList` (liste), `Download` (export)
- Icône de la vue active en surbrillance (primary button style), l'autre en normal

---

## R6: Responsive Card Grid

**Decision**: CSS Grid avec breakpoints via media queries

**Breakpoints**:
- `> 1200px` : 4 colonnes (`grid-template-columns: repeat(4, 1fr)`)
- `768px - 1199px` : 2 colonnes (`grid-template-columns: repeat(2, 1fr)`)
- `< 768px` : 1 colonne (`grid-template-columns: 1fr`)

---

## R7: Property Pane Configuration

**Decision**: 4 sections — Général, Carte, Liste, Modale

**Général**: `defaultView`, `filterCount`, `filterField1..3`, `filterLabel1..3`, `accessGroupId`

**Sections Carte / Liste / Modale**: Chacune avec ses propres `PropertyPaneCheckbox` pour les 10 champs configurables (Photo, Nom, Prénom, Email, Téléphone, Poste, Département, Localisation, Outlook, Teams)

**Data model update**: `DirectoryConfig` gagne `listFields: CardFieldName[]` et `modalFields: CardFieldName[]` à côté de `cardFields` existant.
