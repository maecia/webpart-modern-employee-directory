# Implementation Plan: Annuaire SharePoint V2

**Branch**: `002-sharepoint-directory-v2` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-sharepoint-directory-v2/spec.md`

## Summary

Refonte complète de l'annuaire SharePoint avec : vue modale remplaçant l'expansion inline, pagination (24 cartes / 15 lignes avec "Voir plus"), compteur de résultats, bannière unifiée (filtres + compteur + icônes de vue), Property Pane en 3 sections (Carte/Liste/Modale), et style conforme aux composants Fluent UI.

## Technical Context

**Language/Version**: TypeScript 4.7.4 (rush-stack-compiler-4.7), React 17.0.1

**Primary Dependencies**: SPFx 1.20.2 (build) + 1.20.1 (runtime), `@pnp/sp` v4, `@pnp/graph` v4, `@fluentui/react` v8, `@pnp/spfx-controls-react` v3

**Storage**: N/A (données lues depuis Microsoft Graph, pas de persistance locale)

**Testing**: Jest 26 + ts-jest 26 + `@testing-library/react`

**Target Platform**: SharePoint Online (SPFx WebPart), tenant Microsoft 365

**Project Type**: SPFx WebPart (single package)

**Performance Goals**: Chargement initial <3s (100 membres), pagination <2s, ouverture modale <300ms

**Constraints**: `dom` uniquement (pas de Node.js server-side), pas de backend, 100% client-side via Graph API

**Scale/Scope**: Jusqu'à 5000 membres par annuaire (pagination Graph), 3 vues, 10 champs configurables par vue

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. User-Centered Design | ✅ PASS | Modale centrée, pagination, responsive — tout orienté utilisateur final |
| II. Delightful Interactivity | ✅ PASS | Loading states, transitions de modale, feedback immédiat sur filtres |
| III. Clean Information Architecture | ✅ PASS | Recherche avec ranking, filtres ET logique, labels cohérents |
| IV. Simplicity by Default | ✅ PASS | Vue carte par défaut (4 colonnes), progressive disclosure des options |
| V. Accessible & Inclusive | ✅ PASS | Support clavier (Échap, Tab), aria-labels, contrastes Fluent UI natifs |

**Technical Quality Standards:**

| Standard | Status | Notes |
|----------|--------|-------|
| Performance Budget (<2s 3G) | ⚠️ DEFERRED | Optimisation post-implémentation si nécessaire |
| Offline Resilience | ⚠️ DEFERRED | Non critique pour un annuaire en ligne ; ajoutable en v3 |
| Error Handling | ✅ PASS | Error boundaries, bouton Réessayer, fallback initiales |
| Testing Discipline | ✅ PASS | Jest + ts-jest configuré ; tests CsvService passent (2/2) ; tests composants à étendre |
| Instrumentation | ⚠️ DEFERRED | Télémétrie non prioritaire pour v2 |

## Project Structure

### Documentation (this feature)

```text
specs/002-sharepoint-directory-v2/
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
├── models/
│   ├── Member.ts              # Entité membre (inchangé)
│   ├── DirectoryConfig.ts     # Config étendue : cardFields, listFields, modalFields
│   └── Filter.ts              # Type FilterField (inchangé)
├── services/
│   ├── GraphService.ts        # Microsoft Graph (pagination déjà en place)
│   ├── AccessControlService.ts # Contrôle d'accès (inchangé)
│   └── CsvService.ts          # Export CSV (inchangé)
├── hooks/
│   ├── useMembers.ts          # Hook chargement membres + photos (déjà pagination/cleanup)
│   ├── useDirectoryConfig.ts  # Normalisation config (à étendre pour 3 sections)
│   ├── useAccessControl.ts    # Vérification droits (inchangé)
│   └── usePagination.ts       # NOUVEAU : pagination client 24/15
├── utils/
│   ├── teamsDeepLink.ts       # Deep link Teams (inchangé)
│   └── formatUtils.ts         # mailto: (inchangé)
└── webparts/
    └── sharepointDirectory/
        ├── SharepointDirectoryWebPart.ts          # Refonte Property Pane (3 sections)
        ├── SharepointDirectoryWebPart.manifest.json
        ├── components/
        │   ├── Directory.tsx                       # Refonte : banner + pagination + modal
        │   ├── Directory.types.ts
        │   ├── Banner.tsx                          # NOUVEAU : filtre + compteur + icônes vue
        │   ├── cardView/
        │   │   ├── CardView.tsx                    # Mis à jour : grille responsive, 24 max
        │   │   └── MemberCard.tsx                  # Mis à jour : clic → ouvre modale
        │   ├── listView/
        │   │   └── ListView.tsx                    # Mis à jour : 15 max, clic → modale
        │   ├── modal/
        │   │   └── MemberModal.tsx                 # NOUVEAU : modale détail membre
        │   ├── search/
        │   │   ├── SearchBar.tsx                   # Inchangé
        │   │   └── FilterBar.tsx                   # Inchangé
        │   ├── shared/
        │   │   ├── LoadingState.tsx
        │   │   ├── ErrorState.tsx
        │   │   ├── EmptyState.tsx
        │   │   ├── AccessDenied.tsx
        │   │   └── PersonaAvatar.tsx
        │   └── export/
        │       └── CsvExport.tsx                   # Inchangé

tests/
├── services/
│   └── CsvService.test.ts      # 2 tests passant
└── webparts/
    └── sharepointDirectory/
        └── components/
            └── shared/         # Tests composants (à faire passer)
```

**Structure Decision**: Architecture hybride — on réutilise les services, hooks, et composants shared existants de la V1. Les nouveaux composants (Banner, Modal, usePagination) s'ajoutent sans casser l'existant. Les composants cardView, listView, Directory sont refondés pour intégrer la pagination et la modale.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Property Pane 3 sections (au lieu de 2) | Spec V2 exige des configs séparées Carte/Liste/Modale | 2 sections ne suffisent pas pour 3 contextes de vue distincts |
| Pagination client-side | Éviter les rechargements serveur lourds pour de grands annuaires | Pagination serveur-only dégraderait l'UX sur les changements de page |
