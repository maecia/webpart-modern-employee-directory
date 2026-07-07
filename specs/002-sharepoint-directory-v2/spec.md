# Feature Specification: Annuaire SharePoint V2

**Feature Branch**: `002-sharepoint-directory-v2`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "Construis une Web Part SharePoint Framework (SPFx) qui affichera un annuaire sur notre tenant SharePoint. Le but est de récupérer les membres du site et de les afficher sous forme de cards ou de liste."

## User Scenarios & Testing

### User Story 1 - Consultation de l'annuaire en vue Carte avec pagination (Priority: P1)

Un collaborateur ouvre la page SharePoint contenant l'annuaire. Il voit une grille de 4 colonnes de cartes avec photo, nom, prénom, et boutons Teams/Outlook. Si plus de 24 membres existent, un bouton "Voir plus de collaborateurs" permet de charger la page suivante. En cliquant sur une carte, une modale s'ouvre au centre de l'écran avec toutes les informations du collaborateur (photo, nom, prénom, email, téléphone, poste, département, localisation) et des boutons d'action Teams/Outlook.

**Why this priority**: C'est le mode d'affichage par défaut et la porte d'entrée de l'expérience utilisateur. Sans cette vue, l'annuaire n'a pas de valeur.

**Independent Test**: Déployer le web part avec la vue Carte par défaut, charger 50 membres et vérifier que 24 cartes s'affichent avec le bouton "Voir plus", qu'un clic ouvre la modale, et que les champs affichés correspondent au paramétrage du Property Pane.

**Acceptance Scenarios**:

1. **Given** l'annuaire est chargé avec 50 membres, **When** la vue Carte est active, **Then** 24 cartes maximum sont affichées avec un bouton "Voir plus de collaborateurs"
2. **Given** 24 cartes sont affichées, **When** l'utilisateur clique sur "Voir plus de collaborateurs", **Then** 24 cartes supplémentaires apparaissent
3. **Given** une carte est affichée, **When** l'utilisateur clique dessus, **Then** une modale s'ouvre au centre de l'écran avec toutes les informations du membre
4. **Given** la modale est ouverte, **When** l'utilisateur clique sur le bouton Teams, **Then** une conversation Teams s'ouvre avec ce collaborateur
5. **Given** la modale est ouverte, **When** l'utilisateur clique sur le bouton Outlook, **Then** un email pré-adressé s'ouvre
6. **Given** l'annuaire charge, **When** les données sont en cours de récupération, **Then** un indicateur de chargement est affiché
7. **Given** l'annuaire est vide (aucun membre), **When** la page s'affiche, **Then** un message "Aucun collaborateur trouvé" est affiché

---

### User Story 2 - Consultation de l'annuaire en vue Liste avec pagination (Priority: P1)

Un collaborateur bascule en vue Liste via l'icône dédiée. Il voit un tableau paginé (15 lignes maximum) avec photo, nom, prénom, email, téléphone, poste, département, manager. Chaque colonne est triable/filtrable au clic sur son en-tête. En cliquant sur une ligne, la modale s'ouvre avec les détails du collaborateur.

**Why this priority**: La vue liste est essentielle pour les utilisateurs qui préfèrent une présentation tabulaire et le tri/filtrage avancé. C'est un mode d'affichage alternatif critique.

**Independent Test**: Basculer en vue Liste, vérifier le tri par colonne, le filtrage par colonne, la pagination à 15 lignes, l'ouverture de la modale au clic sur une ligne.

**Acceptance Scenarios**:

1. **Given** l'utilisateur est en vue Carte, **When** il clique sur l'icône Liste, **Then** le tableau s'affiche avec 15 lignes maximum
2. **Given** le tableau est affiché, **When** l'utilisateur clique sur l'en-tête "Nom", **Then** les lignes sont triées par nom (ascendant, puis descendant au second clic)
3. **Given** le tableau est affiché, **When** l'utilisateur saisit un texte dans le champ de filtrage d'une colonne, **Then** seules les lignes correspondantes sont affichées
4. **Given** plus de 15 membres existent, **When** la vue Liste est active, **Then** le bouton "Voir plus de collaborateurs" est affiché
5. **Given** l'utilisateur clique sur une ligne du tableau, **When** la modale s'ouvre, **Then** les informations configurées pour la modale sont affichées

---

### User Story 3 - Recherche et filtrage des membres (Priority: P2)

Un collaborateur utilise la barre de recherche pour trouver un membre par nom ou prénom. Il peut également utiliser jusqu'à 3 filtres configurables (ex: département, poste, localisation) pour affiner les résultats. Le nombre de résultats est affiché en temps réel (ex: "Résultats : 28 collaborateurs"). Les filtres et la recherche se combinent (ET logique).

**Why this priority**: La recherche et le filtrage sont essentiels dans un annuaire de grande taille, mais l'annuaire reste utilisable sans eux sur de petits effectifs.

**Independent Test**: Configurer 2 filtres dans le Property Pane, saisir un nom dans la barre de recherche, sélectionner une valeur dans un filtre, vérifier que les résultats sont filtrés et que le compteur se met à jour.

**Acceptance Scenarios**:

1. **Given** l'annuaire est affiché, **When** l'utilisateur tape un nom dans la barre de recherche, **Then** la liste/cartes se filtre en temps réel
2. **Given** une recherche est active, **When** l'utilisateur efface la barre de recherche, **Then** la liste complète est restaurée
3. **Given** des filtres sont configurés, **When** l'utilisateur sélectionne une valeur dans un filtre, **Then** les résultats sont filtrés et le compteur "Résultats : X collaborateurs" se met à jour
4. **Given** une recherche et un filtre sont actifs simultanément, **When** les résultats s'affichent, **Then** seuls les membres satisfaisant les deux critères sont visibles
5. **Given** aucun résultat ne correspond aux critères, **When** la recherche est effectuée, **Then** un message "Aucun résultat trouvé" est affiché avec une suggestion de modifier les critères

---

### User Story 4 - Ouverture de la modale détaillée (Priority: P2)

Depuis la vue Carte ou la vue Liste, un clic sur un membre ouvre une modale centrée. La modale affiche la photo, le nom, le prénom, et les boutons Teams/Outlook par défaut. Les champs supplémentaires affichés sont configurables par l'administrateur. La modale peut être fermée via un bouton de fermeture (croix), un clic en dehors, ou la touche Échap.

**Why this priority**: La modale est le point d'entrée unique vers le détail d'un collaborateur, remplaçant l'expansion inline des cartes. Elle centralise l'expérience de consultation.

**Independent Test**: Cliquer sur une carte, vérifier que la modale s'ouvre avec les champs configurés. Cliquer sur Échap, vérifier la fermeture. Cliquer en dehors, vérifier la fermeture.

**Acceptance Scenarios**:

1. **Given** la modale est ouverte, **When** l'utilisateur appuie sur Échap, **Then** la modale se ferme
2. **Given** la modale est ouverte, **When** l'utilisateur clique en dehors de la modale, **Then** la modale se ferme
3. **Given** la modale est ouverte, **When** l'utilisateur clique sur le bouton de fermeture (✕), **Then** la modale se ferme
4. **Given** la modale est ouverte, **When** un collaborateur n'a pas de téléphone, **Then** le champ téléphone n'est pas affiché dans la modale
5. **Given** la modale est ouverte, **When** l'utilisateur clique sur le bouton Teams, **Then** une conversation Teams s'ouvre dans un nouvel onglet

---

### User Story 5 - Export CSV (Priority: P3)

Un collaborateur clique sur le bouton "Exporter en CSV" pour télécharger la liste des membres actuellement affichés (respectant les filtres et la recherche actifs). Le fichier CSV inclut les colonnes Nom, Prénom, Email, Téléphone, Poste, Département, Localisation, Manager et est compatible avec Excel (encodage UTF-8 BOM, séparateur point-virgule).

**Why this priority**: L'export est utile mais n'est pas critique pour la consultation quotidienne de l'annuaire.

**Independent Test**: Appliquer une recherche, cliquer sur "Exporter en CSV", ouvrir le fichier dans Excel et vérifier que seuls les membres filtrés sont présents.

**Acceptance Scenarios**:

1. **Given** des membres sont affichés, **When** l'utilisateur clique sur "Exporter en CSV", **Then** un fichier CSV est téléchargé avec les colonnes attendues
2. **Given** une recherche est active, **When** l'utilisateur exporte, **Then** seuls les membres correspondant à la recherche sont exportés
3. **Given** des filtres sont actifs, **When** l'utilisateur exporte, **Then** seuls les membres filtrés sont exportés
4. **Given** aucun filtre ni recherche, **When** l'utilisateur exporte, **Then** tous les membres sont exportés

---

### User Story 6 - Configuration administrateur via le Property Pane (Priority: P2)

Un administrateur SharePoint édite le web part et configure les paramètres via le Property Pane natif. Il peut définir la vue par défaut, le nombre de filtres (max 3) et leurs champs, ainsi que les champs affichés pour chaque vue (Carte, Liste, Modale) via des cases à cocher.

**Why this priority**: La configuration est nécessaire pour adapter l'annuaire aux besoins spécifiques de chaque équipe/site, mais le web part fonctionne avec des paramètres par défaut.

**Independent Test**: Ouvrir le Property Pane, modifier la vue par défaut, ajouter 2 filtres, décocher "Téléphone" dans la vue Carte, sauvegarder et vérifier que les changements sont appliqués.

**Acceptance Scenarios**:

1. **Given** le Property Pane est ouvert, **When** l'administrateur change la vue par défaut de "Carte" à "Liste", **Then** l'annuaire s'affiche en liste après sauvegarde
2. **Given** le Property Pane est ouvert, **When** l'administrateur sélectionne 2 filtres (ex: Département et Poste), **Then** deux listes déroulantes de filtre apparaissent dans la bannière
3. **Given** le Property Pane est ouvert, **When** l'administrateur décoche "Téléphone" dans les champs de la vue Carte, **Then** le téléphone n'apparaît plus dans le détail des cartes
4. **Given** le Property Pane est ouvert, **When** l'administrateur décoche "E-mail" dans les champs de la vue Modale, **Then** l'email n'apparaît plus dans la modale
5. **Given** aucun champ n'est sélectionné pour une vue, **When** l'affichage est rendu, **Then** un message indique de configurer les champs

---

### Edge Cases

- Que se passe-t-il quand un membre n'a pas de photo ? → Les initiales (prénom + nom) sont affichées à la place
- Que se passe-t-il quand il y a plus de 1000 membres ? → La pagination Graph API charge les pages progressivement ; le bouton "Voir plus" charge la page suivante
- Que se passe-t-il quand la source de données (Microsoft Graph) est inaccessible ? → Un message d'erreur explicite est affiché avec un bouton "Réessayer"
- Que se passe-t-il quand un membre a des champs vides (pas de téléphone, pas de poste) ? → Les champs vides sont masqués dans la modale et les cartes
- Que se passe-t-il quand un compte est désactivé ou supprimé dans Azure AD ? → Les comptes désactivés (`accountEnabled = false`) sont exclus de la récupération
- Que se passe-t-il quand l'utilisateur redimensionne la fenêtre ? → La grille de cartes s'adapte (responsive), passant de 4 à 2 puis 1 colonne selon la largeur
- Que se passe-t-il quand le chargement de la photo échoue ? → Les initiales sont affichées sans interrompre l'affichage du reste de l'annuaire

## Requirements

### Functional Requirements

- **FR-001**: Le système DOIT afficher les membres en mode Carte (4 colonnes) ou Liste (tableau) selon le choix de l'utilisateur
- **FR-002**: Le système DOIT proposer un bouton de permutation entre les vues sous forme d'icônes
- **FR-003**: La vue Carte DOIT afficher par défaut : photo, nom, prénom, boutons Teams et Outlook
- **FR-004**: La vue Carte DOIT limiter l'affichage à 24 cartes avec un bouton "Voir plus de collaborateurs"
- **FR-005**: La vue Liste DOIT afficher par défaut : photo, nom, prénom, e-mail, téléphone, poste, département, manager
- **FR-006**: La vue Liste DOIT supporter le tri au clic sur chaque en-tête de colonne (ascendant/descendant)
- **FR-007**: La vue Liste DOIT supporter le filtrage par colonne via un champ texte dans l'en-tête
- **FR-008**: La vue Liste DOIT limiter l'affichage à 15 lignes avec un bouton "Voir plus de collaborateurs"
- **FR-009**: Un clic sur une carte OU une ligne de liste DOIT ouvrir une modale centrée avec les détails du membre
- **FR-010**: La modale DOIT afficher par défaut : photo, nom, prénom, boutons Teams et Outlook
- **FR-011**: La modale DOIT pouvoir être fermée via le bouton ✕, un clic en dehors, ou la touche Échap
- **FR-012**: Le système DOIT afficher une barre de recherche textuelle (nom, prénom)
- **FR-013**: Le système DOIT permettre jusqu'à 3 filtres configurables simultanément
- **FR-014**: Le système DOIT afficher le nombre de résultats en temps réel ("Résultats : X collaborateurs")
- **FR-015**: Le système DOIT intégrer les filtres dans une bannière avec le compteur de résultats et les icônes de changement de vue
- **FR-016**: Le système DOIT permettre l'export CSV des membres affichés (respectant filtres et recherche)
- **FR-017**: Le Property Pane DOIT comporter une section "Paramètres généraux" (vue par défaut, nombre de filtres)
- **FR-018**: Le Property Pane DOIT comporter une section "Vue Carte" pour sélectionner les champs affichés via cases à cocher
- **FR-019**: Le Property Pane DOIT comporter une section "Vue Liste" pour sélectionner les champs affichés via cases à cocher
- **FR-020**: Le Property Pane DOIT comporter une section "Vue Modale" pour sélectionner les champs affichés via cases à cocher
- **FR-021**: Les champs configurables pour chaque vue DOIVENT inclure : Photo, Nom, Prénom, E-mail, Téléphone, Poste, Département, Localisation, Outlook, Teams
- **FR-022**: Le système DOIT récupérer les membres depuis Azure AD via Microsoft Graph (comptes activés, type membre)
- **FR-023**: Le système DOIT afficher un indicateur de chargement pendant la récupération des données
- **FR-024**: Le système DOIT afficher un message d'erreur avec bouton "Réessayer" en cas d'échec de chargement
- **FR-025**: Le système DOIT afficher les initiales du membre quand la photo n'est pas disponible
- **FR-026**: Le système DOIT supporter la pagination serveur pour les annuaires de plus de 1000 membres
- **FR-027**: La grille de cartes DOIT être responsive : 4 colonnes → 2 colonnes → 1 colonne selon la largeur d'écran

### Key Entities

- **Membre**: Un utilisateur Azure AD membre du tenant. Attributs : identifiant, nom, prénom, email, téléphone mobile, poste, département, localisation, manager, photo, statut du compte.
- **Configuration de l'annuaire**: Paramètres définis par l'administrateur dans le Property Pane : vue par défaut, filtres actifs, champs affichés par vue (Carte, Liste, Modale).
- **Filtre**: Un critère de filtrage configurable associé à un champ membre (ex: département). Attributs : champ cible, libellé affiché.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Un utilisateur trouve un collaborateur spécifique en moins de 10 secondes via la recherche ou les filtres
- **SC-002**: Le chargement initial de l'annuaire (100 membres) s'effectue en moins de 3 secondes
- **SC-003**: Le changement de vue (Carte ↔ Liste) est instantané (pas de rechargement)
- **SC-004**: L'export CSV d'un annuaire de 500 membres se termine en moins de 5 secondes
- **SC-005**: La pagination ("Voir plus") charge les résultats suivants en moins de 2 secondes
- **SC-006**: La modale s'ouvre en moins de 300ms après le clic sur une carte ou une ligne
- **SC-007**: 100% des champs configurables sont correctement affichés/masqués selon la configuration du Property Pane
- **SC-008**: L'interface est utilisable au clavier (navigation Tab, Échap pour fermer la modale)

## Assumptions

- Les membres sont récupérés via Microsoft Graph API avec les permissions `User.Read.All`
- Le tenant SharePoint est configuré pour autoriser les appels à Microsoft Graph
- Les utilisateurs finaux disposent d'une connexion internet stable
- Le style visuel doit correspondre aux captures d'écran fournies (validation manuelle requise car le modèle ne peut pas lire les images)
- L'export CSV utilise le point-virgule comme séparateur (compatibilité Excel français)
- La responsivité de la grille de cartes suit le comportement standard : 4 colonnes au-dessus de 1200px, 2 colonnes entre 768px et 1200px, 1 colonne en dessous de 768px
- Les données sont affichées côté client après récupération (pas de recherche serveur)
- Le composant `@pnp/graph` est utilisé pour interroger Microsoft Graph dans le contexte SPFx
- Les photos sont récupérées via `/users/{id}/photo/$value`
