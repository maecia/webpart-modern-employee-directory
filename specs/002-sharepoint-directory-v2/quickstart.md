# Quickstart Guide: Annuaire SharePoint V2

**Created**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

## Prerequisites

- Node.js 18.20.x LTS (via `nvm use 18.20.5`)
- SPFx 1.20.2 (build) + 1.20.1 (runtime)
- SharePoint Online tenant avec droits d'administration
- Compte ayant les permissions `User.Read.All` (Microsoft Graph) via l'API Management dans SharePoint Admin

## Setup

```bash
# 1. Node version
nvm use 18.20.5

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Trust dev certificate (first time only)
npx gulp trust-dev-cert

# 4. Start local dev server (fast-serve)
npm run serve
```

## Local Testing (Workbench)

1. Ouvrir `https://{tenant}.sharepoint.com/_layouts/15/workbench.aspx`
2. Ajouter le web part "Annuaire SharePoint" (icône dans la toolbox)
3. Configurer le Property Pane :
   - **Général** : vue par défaut "Carte", 2 filtres (Département, Poste)
   - **Vue Carte** : cocher Photo, Nom, Prénom, E-mail, Téléphone, Teams, Outlook
   - **Vue Liste** : cocher Photo, Nom, Prénom, E-mail, Téléphone, Poste, Département, Manager
   - **Vue Modale** : cocher tous les champs
4. Sauvegarder la page

## Validation Scenarios

### V1: Vue Carte avec pagination
1. Vérifier que 24 cartes maximum s'affichent
2. Si >24 membres, vérifier le bouton "Voir plus de collaborateurs"
3. Cliquer sur "Voir plus" → 24 cartes supplémentaires
4. Cliquer sur une carte → la modale s'ouvre au centre
5. Fermer la modale via ✕, Échap, ou clic dehors

### V2: Vue Liste avec pagination
1. Cliquer sur l'icône Liste dans la bannière
2. Vérifier que 15 lignes maximum s'affichent
3. Cliquer sur un en-tête de colonne → tri ascendant
4. Re-cliquer → tri descendant
5. Saisir du texte dans le champ de filtre d'une colonne → filtrage
6. Cliquer sur une ligne → la modale s'ouvre

### V3: Recherche et filtres
1. Saisir un nom dans la barre de recherche → résultats filtrés
2. Vérifier le compteur "Résultats : X collaborateurs"
3. Sélectionner une valeur dans un filtre dropdown → résultats filtrés
4. Combiner recherche + filtre → ET logique
5. Effacer → liste complète restaurée, compteur mis à jour

### V4: Export CSV
1. Cliquer sur le bouton d'export
2. Ouvrir le fichier CSV dans Excel
3. Vérifier les colonnes : Nom, Prénom, Email, Téléphone, Poste, Département, Localisation, Manager
4. Si recherche/filtre actif, seuls les résultats filtrés sont exportés

### V5: Property Pane
1. Éditer le web part → Property Pane s'ouvre
2. Vérifier 4 sections : Général, Vue Carte, Vue Liste, Vue Modale
3. Modifier la vue par défaut → appliqué immédiatement
4. Décocher "Téléphone" dans Vue Carte → disparaît des cartes
5. Décocher "E-mail" dans Vue Modale → disparaît de la modale
6. Changer le nombre de filtres de 2 à 3 → 3ème dropdown apparaît

### V6: États limites
1. **Aucun membre** : "Aucun collaborateur trouvé" affiché
2. **Membre sans photo** : initiales affichées (ex: "JD" pour Jean Dupont)
3. **Chargement** : spinner "Chargement de l'annuaire..."
4. **Erreur Graph** : message d'erreur + bouton "Réessayer"
5. **Redimensionnement** : grille passe de 4→2→1 colonnes

### V7: Accessibilité
1. Navigation au clavier : Tab à travers les cartes
2. Échap pour fermer la modale
3. Lecteur d'écran : aria-labels présents sur les cartes, boutons, modale

## Build for Production

```bash
# Build optimisé
npx gulp bundle --ship
npx gulp package-solution --ship

# Déployer sur l'App Catalog
m365 spo app add --filePath ./sharepoint/solution/modern-employee-directory.sppkg --overwrite
m365 spo app deploy --name modern-employee-directory.sppkg --skipFeatureDeployment
```
