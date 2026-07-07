# Quickstart: Annuaire SharePoint

**Feature**: 001-sharepoint-directory-webpart

## Prerequisites

- Node.js 20 LTS (install via nvm: `nvm install 20 && nvm use 20`)
- Yeoman: `npm install -g yo`
- Gulp: `npm install -g gulp`
- SharePoint Framework generator: `npm install -g @microsoft/generator-sharepoint`
- **Important** : SPFx 1.20.x nécessite Node.js 20.x (`>=20.11.0 <21.0.0`). Node 22 est incompatible.
- L'installation des dépendances nécessite `npm install --legacy-peer-deps` (conflit @types/react).
- Access to tenant: `https://intranetinside82.sharepoint.com/sites/Bacsable`
- Microsoft Graph API permissions granted in tenant App Catalog

## Project Setup

```bash
# 1. Scaffold the SPFx project
yo @microsoft/sharepoint

# Select options:
#   - Solution name: sharepoint-directory
#   - Baseline packages: SharePoint Online only (latest)
#   - Web part name: SharepointDirectory
#   - Framework: React
#   - Target: SharePoint Online only

# 2. Install dependencies
cd sharepoint-directory
npm install @pnp/sp @pnp/graph @pnp/spfx-controls-react @fluentui/react papaparse
npm install @microsoft/sp-build-web @microsoft/rush-stack-compiler-4.7 spfx-fast-serve --save-dev
npm install spfx-fast-serve --save-dev
npm install @types/papaparse --save-dev  # if CSV library needed

# 3. Configure fast-serve
npx spfx-fast-serve

# 4. Trust dev certificate
gulp trust-dev-cert
```

## Local Development

```bash
# Start local dev server with hot reload
npm run serve

# Open Workbench (authenticated - allows Graph API calls)
# Navigate to:
# https://intranetinside82.sharepoint.com/_layouts/15/workbench.aspx
#
# Add the "SharepointDirectory" web part to the canvas
```

## Validate: Card View (US-1)

1. Load Workbench, add SharepointDirectory web part
2. **Expected**: Loading spinner appears briefly
3. **Expected**: Member cards render in grid with photo, name, Teams/Outlook buttons
4. Click a card → detail panel shows configured fields
5. Click Teams button → Teams conversation opens (deep link)
6. Click Outlook button → mail client opens with pre-addressed email

## Validate: List View (US-2)

1. Click toggle button (top-right) to switch to List view
2. **Expected**: Table renders with columns: photo, nom, prénom, email, téléphone, poste, département, manager
3. Click "Nom" column header → rows sort A-Z
4. Click again → rows sort Z-A
5. Filter a column (e.g., type in department filter)

## Validate: Access Control (US-3)

1. Configure `accessGroupName` property to an existing SharePoint group
2. **Given** user is NOT in that group → **Expected**: "Accès refusé" message, no member data exposed
3. **Given** user IS in that group → **Expected**: Full directory rendered
4. Mark a test member as `isVisible = false`
5. **Expected**: That member does NOT appear in directory

## Validate: Search & Filters (US-4)

1. Type a name in the search bar
2. **Expected**: Results filter in real-time (< 500ms)
3. Clear search → all visible members return
4. Configure 2 filters in property pane (e.g., department, jobTitle)
5. **Expected**: Filter dropdowns appear above member grid
6. Select filter values → results update immediately
7. Combined search + filters → results respect both criteria

## Validate: Configuration Panel (US-5)

1. Edit page, open web part property pane
2. **Expected**: Two sections visible: "Paramètres généraux" and "Paramètres de la vue Carte"
3. Change default view to "Liste", save
4. Reload → List view shown by default
5. Uncheck all card detail fields, save
6. Click a card → "Aucun champ configuré" message shown

## Validate: CSV Export (US-6)

1. Apply a filter (e.g., department = "IT")
2. Click "Exporter en CSV" button
3. **Expected**: File downloads, contains only IT department members
4. Clear filter, click export → all visible members in CSV
5. Search for a name, click export → only matching members in CSV

## Validate: Error & Empty States

1. Disconnect from network or simulate Graph API failure
2. **Expected**: Error message with "Réessayer" button displayed
3. Click retry → attempts to reload data
4. Search for a non-existent name → "Aucun résultat trouvé" message with suggestion

## Validate: Accessibility (US-7 / FR-016)

1. Navigate entire directory using only Tab/Shift+Tab → all elements reachable
2. Verify contrast ratios with browser dev tools (should pass WCAG AA)
3. Test with screen reader → all cards, buttons, and states announced correctly
