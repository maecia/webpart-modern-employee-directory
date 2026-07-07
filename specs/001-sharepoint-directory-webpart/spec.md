# Feature Specification: Annuaire SharePoint

**Feature Branch**: `001-sharepoint-directory-webpart`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Construis une Web Part SharePoint Framework (SPFx) qui affichera un annuaire sur notre tenant SharePoint. Le but est de récupérer les membres du site et de les afficher sous forme de cards ou de liste. Il faudra faire attention aux différents droits pour que l'utilisateur ait accès à l'annuaire ou non et s'il doit remonter dessus. Le descriptif de l'attendu est dans le ticket Jira CP-1505, que tu peux charger grâce au MCP Jira."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consulter l'annuaire en mode Carte (Priority: P1)

Un collaborateur autorisé ouvre la page contenant l'annuaire et voit les membres du site affichés sous forme de cartes avec leur photo, nom et prénom. Il peut cliquer sur une carte pour voir les informations détaillées, et utiliser les boutons Teams ou Outlook pour contacter un collègue directement.

**Why this priority**: Mode d'affichage par défaut, il constitue l'expérience utilisateur principale. Sans lui, l'annuaire n'a pas de valeur.

**Independent Test**: Déployer le composant avec des données de test. Vérifier l'affichage des cartes, le clic pour les détails, et les boutons de contact.

**Acceptance Scenarios**:

1. **Given** l'utilisateur a les droits d'accès et l'annuaire est en vue Carte, **When** la page se charge, **Then** les membres apparaissent en grille avec photo, nom, prénom, boutons Teams et Outlook.
2. **Given** la vue Carte est affichée, **When** l'utilisateur clique sur une carte, **Then** les informations détaillées configurées s'affichent (email, téléphone, poste, département, etc.).
3. **Given** une carte est affichée, **When** l'utilisateur clique sur le bouton Teams, **Then** une conversation Teams avec ce collaborateur s'ouvre.
4. **Given** une carte est affichée, **When** l'utilisateur clique sur le bouton Outlook, **Then** un email pré-adressé au collaborateur s'ouvre.
5. **Given** les données sont en cours de chargement, **When** l'utilisateur accède à la page, **Then** un indicateur de chargement visuel est affiché.
6. **Given** aucun membre ne correspond aux critères, **When** la vue Carte est affichée, **Then** un message clair indique l'absence de résultat avec une suggestion d'action.

---

### User Story 2 - Consulter l'annuaire en mode Liste (Priority: P1)

Un collaborateur bascule en vue Liste pour voir les membres sous forme de tableau complet avec tri et filtrage par colonne.

**Why this priority**: Complément indispensable de la vue Carte, offrant une navigation dense et une recherche plus fine.

**Independent Test**: Basculer en vue Liste, vérifier l'affichage du tableau avec toutes les colonnes. Tester le tri et le filtrage par colonne.

**Acceptance Scenarios**:

1. **Given** la vue Carte est active, **When** l'utilisateur bascule en vue Liste, **Then** un tableau s'affiche avec les colonnes : photo, nom, prénom, email, téléphone, poste, département, manager.
2. **Given** la vue Liste est affichée, **When** l'utilisateur clique sur un en-tête de colonne, **Then** les lignes sont triées (1er clic croissant, 2e décroissant).
3. **Given** la vue Liste est affichée, **When** l'utilisateur filtre une colonne, **Then** seules les lignes correspondantes sont visibles.
4. **Given** des filtres sont actifs, **When** l'utilisateur bascule en vue Carte, **Then** les filtres restent appliqués.

---

### User Story 3 - Contrôle d'accès et visibilité (Priority: P2)

Le système vérifie les droits de chaque utilisateur : seuls les utilisateurs autorisés accèdent à l'annuaire, et parmi les membres, seuls ceux dont la visibilité est activée apparaissent.

**Why this priority**: La sécurité et la confidentialité sont fondamentales. Afficher des personnes non autorisées ou bloquer des utilisateurs légitimes a un impact direct.

**Independent Test**: Configurer deux groupes de test (accès autorisé / refusé) et deux profils (visible / masqué). Vérifier que l'accès et la visibilité sont respectés.

**Acceptance Scenarios**:

1. **Given** un utilisateur sans droit d'accès, **When** il charge la page, **Then** un message d'accès refusé est affiché, sans aucune donnée exposée.
2. **Given** un membre marqué comme non visible, **When** un utilisateur autorisé consulte l'annuaire, **Then** ce membre n'apparaît pas.
3. **Given** un utilisateur perd ses droits en cours de session, **When** il recharge l'annuaire, **Then** l'accès lui est refusé immédiatement.
4. **Given** un nouvel utilisateur obtient les droits d'accès, **When** il charge la page, **Then** l'annuaire complet (selon les règles de visibilité) lui est présenté.

---

### User Story 4 - Rechercher et filtrer les membres (Priority: P2)

Un collaborateur utilise la barre de recherche par nom ou des filtres configurables (maximum 3) pour affiner l'affichage de l'annuaire.

**Why this priority**: Essentiel pour naviguer efficacement dans un annuaire volumineux, mais secondaire par rapport aux vues de base.

**Independent Test**: Saisir un nom dans la barre de recherche. Configurer des filtres dans le panneau d'administration et les utiliser.

**Acceptance Scenarios**:

1. **Given** l'annuaire est affiché, **When** l'utilisateur saisit un nom dans la barre de recherche, **Then** les résultats se filtrent dynamiquement.
2. **Given** une recherche est active, **When** l'utilisateur efface le texte, **Then** l'annuaire réaffiche l'ensemble des membres visibles.
3. **Given** des filtres sont configurés, **When** l'utilisateur sélectionne une valeur, **Then** l'affichage se met à jour (combinaison ET logique entre les filtres).
4. **Given** recherche et filtres sont actifs, **When** l'utilisateur modifie l'un d'eux, **Then** les résultats combinent les deux critères.
5. **Given** aucun résultat, **When** la recherche ou les filtres sont appliqués, **Then** un message "Aucun résultat" avec suggestion s'affiche.

---

### User Story 5 - Configurer l'annuaire (Priority: P3)

Un administrateur paramètre l'annuaire via le panneau de configuration : vue par défaut, choix des filtres et champs visibles dans la vue Carte.

**Why this priority**: L'annuaire doit fonctionner avec des valeurs par défaut pertinentes. La configuration permet l'adaptation aux besoins spécifiques.

**Independent Test**: Ouvrir le panneau de configuration, modifier les paramètres, sauvegarder et vérifier l'application des changements.

**Acceptance Scenarios**:

1. **Given** un administrateur en mode édition, **When** il ouvre le panneau de configuration, **Then** deux sections sont visibles : Paramètres généraux et Paramètres de la vue Carte.
2. **Given** le panneau est ouvert, **When** l'administrateur change la vue par défaut ou le nombre/filtres, **Then** l'annuaire reflète ces choix après sauvegarde.
3. **Given** la section vue Carte est ouverte, **When** l'administrateur sélectionne les champs à afficher au clic, **Then** seuls ces champs apparaissent dans le détail d'une carte.
4. **Given** aucun champ n'est coché pour la vue Carte, **When** un utilisateur clique sur une carte, **Then** un message invite l'administrateur à configurer l'affichage.

---

### User Story 6 - Exporter l'annuaire (Priority: P3)

Un collaborateur exporte les données visibles (respectant filtres et recherche) au format CSV.

**Why this priority**: Utilitaire appréciable mais non essentiel au fonctionnement de base.

**Independent Test**: Cliquer sur Exporter, vérifier le fichier téléchargé (contenu, colonnes, respect des filtres actifs).

**Acceptance Scenarios**:

1. **Given** des filtres sont actifs, **When** l'utilisateur exporte en CSV, **Then** seuls les membres correspondant aux filtres sont inclus.
2. **Given** une recherche est active, **When** l'utilisateur exporte, **Then** le fichier ne contient que les résultats de la recherche.
3. **Given** aucun filtre, **When** l'utilisateur exporte, **Then** l'ensemble des membres visibles est exporté.

---

### Edge Cases

- Que se passe-t-il si les données d'un membre sont incomplètes (photo absente, téléphone manquant) ?
- Comment se comporte l'annuaire avec 1000+ membres en termes de performance ?
- Que se passe-t-il si la source de données est inaccessible ? Un message d'erreur et une action de réessai sont-ils prévus ?
- Comment sont gérés les membres sans photo (initiales par défaut) ?
- Que se passe-t-il si un filtre configuré n'a qu'une seule valeur distincte ?
- Comment sont traités les comptes désactivés ou supprimés ?
- Comment gérer la révocation de droits en cours de session ?
- Quel critère détermine si un membre doit être visible ou masqué dans l'annuaire ?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT afficher l'annuaire sous deux modes : vue Carte (grille) et vue Liste (tableau), avec basculement via un bouton.
- **FR-002**: La vue Carte DOIT afficher par défaut : photo, nom, prénom, boutons Teams et Outlook.
- **FR-003**: La vue Carte DOIT afficher des informations détaillées configurables au clic sur une carte.
- **FR-004**: La vue Liste DOIT afficher les colonnes : photo, nom, prénom, email, téléphone, poste, département, manager, avec tri et filtrage par en-tête de colonne.
- **FR-005**: Le système DOIT vérifier les droits d'accès avant tout affichage et présenter un message d'accès refusé aux utilisateurs non autorisés.
- **FR-006**: Le système DOIT masquer les membres dont la visibilité est désactivée (selon une règle configurable basée sur les groupes ou propriétés de profil).
- **FR-007**: Le système DOIT fournir une barre de recherche textuelle par nom/prénom, avec filtrage dynamique.
- **FR-008**: Le système DOIT permettre jusqu'à 3 filtres configurables par l'administrateur (département, poste, localisation, etc.), combinés avec la recherche.
- **FR-009**: Le système DOIT fournir un panneau de configuration avec deux sections : Paramètres généraux (vue par défaut, filtres) et Paramètres de la vue Carte (champs affichés au clic).
- **FR-010**: Le système DOIT permettre l'export CSV des données visibles, respectant les filtres et la recherche actifs.
- **FR-011**: Le bouton Teams DOIT ouvrir une conversation avec le collaborateur sélectionné.
- **FR-012**: Le bouton Outlook DOIT ouvrir un email pré-adressé au collaborateur sélectionné.
- **FR-013**: Le système DOIT afficher un indicateur de chargement pendant la récupération des données.
- **FR-014**: Le système DOIT afficher un message d'erreur avec action de réessai en cas d'échec de chargement.
- **FR-015**: Le système DOIT afficher des initiales à la place de la photo quand celle-ci est absente.
- **FR-016**: Le système DOIT être utilisable au clavier uniquement et respecter les contrastes WCAG 2.1 niveau AA.
- **FR-017**: Le système DOIT récupérer les données des membres depuis l'annuaire Azure AD, en paginant les résultats et en gérant les permissions de manière granulaire.
- **FR-018**: Le basculement entre vues DOIT conserver les filtres et la recherche actifs.

### Key Entities

- **Membre**: Utilisateur de l'organisation avec les attributs : identifiant, nom, prénom, email, téléphone, poste, département, localisation, manager, photo de profil, visibilité dans l'annuaire (oui/non), identifiant Teams.
- **Configuration de l'annuaire**: Paramètres sauvegardés : vue par défaut (carte/liste), liste des champs filtrables (max 3), liste des champs visibles dans la vue Carte.
- **Droit d'accès**: Permission déterminant si un utilisateur peut consulter l'annuaire (basée sur l'appartenance à un groupe SharePoint ou Azure AD).
- **Filtre**: Critère combinant un champ (département, poste, etc.) et une valeur, appliqué dynamiquement.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un collaborateur trouve un membre spécifique en moins de 10 secondes (recherche ou navigation).
- **SC-002**: L'annuaire affiche 500 membres en moins de 2 secondes après chargement.
- **SC-003**: Le basculement Carte ↔ Liste est perçu comme immédiat (moins de 200ms).
- **SC-004**: Recherche et filtres mettent à jour l'affichage en moins de 500ms.
- **SC-005**: 100% des éléments interactifs sont navigables au clavier.
- **SC-006**: Les contrastes respectent WCAG AA (4.5:1 texte normal, 3:1 texte large).
- **SC-007**: Un administrateur configure l'annuaire en moins de 2 minutes.
- **SC-008**: L'export CSV de 500 membres s'effectue en moins de 3 secondes.

## Assumptions

- Les données des membres proviennent de l'Azure AD (Microsoft Entra ID) et sont à jour.
- Les droits d'accès à l'annuaire sont gérés via les groupes SharePoint ou Azure AD existants.
- La visibilité d'un membre est déterminée par son appartenance à un groupe ou une propriété de profil, configurable par l'administrateur.
- Les utilisateurs sont authentifiés via leur compte Microsoft 365, aucun système d'authentification supplémentaire.
- Le périmètre v1 cible le desktop ; le mobile reste fonctionnel mais non optimisé.
- Le déploiement s'effectue sur le tenant SharePoint Maecia existant avec App Catalog déjà en place.
- Les maquettes Figma de référence sont disponibles.
