# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2026-09-18

### Added

- Real pagination (page numbers, previous/next) for the card and list views, with a configurable page size (12/24/36/48, default 24).
- Light and dark SharePoint theme support (theme-aware color tokens, dark palette applied automatically).
- 64x64 PNG web part icon.
- Solution metadata: developer links, categories and descriptions.
- Unit-test and CI setup (Jest config, test suite, GitHub Actions build/test/package workflow).
- Public documentation: README, LICENSE, CHANGELOG, `.editorconfig`, `.nvmrc`.

### Changed

- Renamed the solution to `modern-employee-directory-client-side-solution` and the web part to **Modern Employee Directory** / **Annuaire moderne des collaborateurs**.
- Reduced Microsoft Graph permission requests to `User.Read.All` only.
- Removed global DOM style injection and stopped touching `document.body` (SPFx contract conformance).
- Users are now loaded in pages of 999 to reduce the number of Microsoft Graph requests.

### Removed

- Unused `@pnp/spfx-controls-react` dependency, which brought multiple vulnerable transitive packages (production dependency audit is now clean).

### Fixed

- `useMembers` hook dependency handling and lint warnings.
- Broken Jest setup and unit tests.
- Developer and legal links pointing to non-existent pages (404).

## [1.6.0] - 2026-09-18

### Added

- Multi-language labels driven by the SharePoint UI languages (`fr-FR`, `en-US`, extensible).
- Drag-and-drop field ordering for the card, list and modal views in the property pane.
- Automatic detection of Entra ID `extensionAttribute1..15` values and custom Entra ID fields.
- CSV export of the currently filtered list.

### Changed

- Migrated the build to SPFx 1.23 and Heft.
- Added French and English property pane strings.
- Solution metadata prepared for distribution.

### Fixed

- Light/dark theme primary colour is read from the page theme.

## [1.5.0] - 2026-07-24

### Added

- List view with sortable columns and pagination.
- Member detail modal with manager navigation.
- Microsoft Teams and Outlook contact actions.

## [1.0.0] - 2026-07-06

### Added

- Initial card (trombinoscope) directory web part built on SPFx, React and PnPjs.
- Real-time search and configurable multi-select filters.
- Microsoft Graph integration to read user profiles and photos.
