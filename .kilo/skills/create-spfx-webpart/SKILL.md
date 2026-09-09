---
name: spfx-webpart
description: Complete guide for SharePoint Framework (SPFx) webpart development at Maecia — environment setup, scaffolding, project structure, React architecture, PnPjs, Microsoft Graph, multi-language property pane, testing, CI/CD packaging, deployment, and Spec Kit AI-driven workflow.
---

# SPFx Webpart Development — Maecia Guide

This skill covers the full lifecycle of a SharePoint Framework (SPFx) client-side webpart at Maecia: from local environment setup to production deployment. It reflects **SPFx 1.23.x with Heft**, **React 17.0.1** (pinned by SPFx), **TypeScript**, and **PnPjs v4** for data access.

---

## 1. Environment Setup (macOS)

### 1.1 Node.js via nvm

SPFx is strictly tied to a specific Node.js version. Use **nvm** to manage multiple versions:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Restart terminal, then:
nvm install 22
nvm use 22
node --version  # Verify
```

| SPFx   | Node.js  | React  |
| ------ | -------- | ------ |
| 1.23.x | 22 (LTS) | 17.0.1 |
| 1.22.x | 22 (LTS) | 17.0.1 |
| 1.21.x | 22 (LTS) | 17.0.1 |
| 1.20.x | 18 (LTS) | 17.0.1 |
| 1.19.x | 18 (LTS) | 17.0.1 |
| 1.18.x | 16, 18   | 17.0.1 |
| 1.17.x | 16.13+   | 17.0.1 |
| 1.16.x | 16.13+   | 17.0.1 |

For any new project, use the latest SPFx with Node.js 22 LTS. See the [official compatibility matrix](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility).

### 1.2 Global Packages

```bash
npm install -g @rushstack/heft yo @microsoft/generator-sharepoint
```

> **Important**: Global npm packages are linked to the active Node.js version. In every new terminal, run `nvm use 22` before `yo`, or the command won't be found.

### 1.3 Tenant Domain Variable

Set the environment variable so `{tenantDomain}` in `serve.json` is automatically resolved:

```bash
export SPFX_SERVE_TENANT_DOMAIN=maecia.sharepoint.com
```

Add this to `~/.zshrc` for persistence.

### 1.4 Verify

```bash
yo --generators
# @microsoft/sharepoint must appear in the list
```

---

## 2. Scaffolding a New Project

```bash
mkdir my-webpart && cd my-webpart
nvm use 22            # Ensure correct Node.js version
yo @microsoft/sharepoint
```

| Prompt               | Recommended answer        |
| -------------------- | ------------------------- |
| Solution name        | `my-webpart` (kebab-case) |
| Component type       | **WebPart**               |
| Web part name        | `MyWebPart` (PascalCase)  |
| Web part description | Brief description         |
| Template             | **React**                 |

**Why React?** It's the standard at Maecia and the recommended choice by Microsoft. "No framework" produces vanilla JS that's harder to maintain. "Minimal" is an empty shell for prototyping only.

The generator scaffolds a project configured for **Heft** (the default since SPFx 1.20+). No manual upgrade from Gulp is needed.

---

## 3. Project Structure

After scaffolding, the expected tree — enhanced with Maecia conventions for hooks, services, models, and utils at the `src/` root:

```
my-webpart/
├── config/
│   ├── config.json              # Bundle entry points + localizedResources
│   ├── serve.json               # Dev server port (4321), page URL
│   ├── package-solution.json    # Solution metadata, API permissions
│   ├── rig.json                 # Points to @microsoft/spfx-web-build-rig
│   ├── sass.json
│   └── typescript.json
├── src/
│   ├── hooks/                   # Shared React hooks (data fetching, caching)
│   │   ├── useMyData.ts
│   │   └── usePagination.ts
│   ├── services/                # Data access layer (PnPjs, Graph, CSV)
│   │   ├── GraphService.ts
│   │   └── SpService.ts
│   ├── models/                  # TypeScript interfaces & config models
│   │   └── MyModel.ts
│   ├── utils/                   # Pure utility functions
│   │   └── helpers.ts
│   └── webparts/
│       └── myWebPart/
│           ├── MyWebPartWebPart.manifest.json
│           ├── MyWebPartWebPart.ts         # Thin SPFx bridge
│           ├── components/
│           │   ├── MyComponent.tsx         # Main React component
│           │   ├── MyComponent.types.ts
│           │   ├── shared/                 # Shared UI (LoadingState, ErrorState, etc.)
│           │   └── ...
│           └── loc/
│               ├── mystrings.ts            # Locale registry + Proxy
│               ├── en.ts                   # English strings
│               └── fr.ts                   # French strings
├── tests/
│   └── webparts/
│       └── myWebPart/
│           └── MyComponent.test.tsx
├── sharepoint/
│   └── solution/                # Generated .sppkg output
├── .github/
│   └── workflows/
│       └── build.yml            # CI/CD packaging
├── babel.config.js
├── jest.config.js
├── jest.setup.js
├── tsconfig.json
├── tsconfig.jest.json
└── package.json
```

**Key convention**: `hooks/`, `services/`, `models/`, and `utils/` live at `src/` root, NOT inside `src/webparts/myWebPart/`. This keeps the data layer reusable across multiple webparts in the same solution.

---

## 4. Key Configuration Files

### 4.1 `config/config.json` — Bundle Registration

```jsonc
{
  "bundles": {
    "my-web-part-bundle": {
      "components": [
        {
          "entrypoint": "./lib/webparts/myWebPart/MyWebPartWebPart.js",
          "manifest": "./src/webparts/myWebPart/MyWebPartWebPart.manifest.json",
        },
      ],
    },
  },
  "localizedResources": {
    "MyWebPartStrings": "lib/webparts/myWebPart/loc/{locale}.js",
    "ControlStrings": "node_modules/@pnp/spfx-controls-react/lib/loc/{locale}.js",
  },
}
```

- `entrypoint` → compiled `.js` in `lib/`
- `manifest` → source `.manifest.json`
- Include `ControlStrings` if using `@pnp/spfx-controls-react`

### 4.2 `config/serve.json` — Dev Server

```jsonc
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/spfx-serve.schema.json",
  "port": 4321,
  "https": true,
  "initialPage": "https://{tenantDomain}/SitePages/MyPage.aspx?debugManifestsFile=https://localhost:4321/temp/build/manifests.js&debug=true&noredir=true",
}
```

- `{tenantDomain}` is resolved from the `SPFX_SERVE_TENANT_DOMAIN` env var
- Point to a real SharePoint page, NOT the deprecated Workbench
- Port 4321 — free it with `lsof -ti :4321 | xargs kill` if needed

### 4.3 `config/package-solution.json` — Solution Package

```jsonc
{
  "solution": {
    "name": "my-webpart-client-side-solution",
    "id": "<new-guid>",
    "version": "1.0.0.0",
    "includeClientSideAssets": true,
    "skipFeatureDeployment": true,
    "isDomainIsolated": false,
    "developer": {
      "name": "Maecia",
      "websiteUrl": "https://maecia.sharepoint.com",
      "privacyUrl": "",
      "termsOfUseUrl": "",
      "mpnId": "",
    },
    "webApiPermissionRequests": [
      { "resource": "Microsoft Graph", "scope": "User.Read.All" },
    ],
    "metadata": {
      "shortDescription": { "default": "My WebPart" },
      "longDescription": { "default": "Description" },
      "screenshotPaths": [],
      "videoUrl": "",
      "categories": [],
    },
    "features": [
      {
        "title": "My WebPart Feature",
        "description": "Deploys the web part",
        "id": "<new-guid>",
        "version": "1.0.0.0",
      },
    ],
  },
  "paths": {
    "zippedPackage": "solution/my-webpart.sppkg",
  },
}
```

- Generate fresh GUIDs for every `id`
- `skipFeatureDeployment: true` → available tenant-wide without site-by-site activation
- `webApiPermissionRequests` → Graph/SPO scopes; must be approved by a tenant admin

### 4.4 `package.json` — Dependencies & Scripts

```jsonc
{
  "scripts": {
    "build": "heft build --clean",
    "clean": "heft clean",
    "test": "heft test",
    "start": "heft start",
  },
}
```

**Runtime dependencies** (always present):

- `@microsoft/sp-core-library`, `@microsoft/sp-lodash-subset`
- `@microsoft/sp-property-pane`, `@microsoft/sp-webpart-base`
- `react` / `react-dom` (version pinned by SPFx)

**PnPjs** (add as needed):
| Need | Package |
|------|---------|
| SharePoint REST API | `@pnp/sp` (latest) |
| Microsoft Graph API | `@pnp/graph` (latest) |
| Rich controls (PeoplePicker, FilePicker) | `@pnp/spfx-controls-react` (latest) |
| CSV parsing | `papaparse` + `@types/papaparse` |

**Build toolchain** (devDependencies — versions pinned by SPFx):

- `@microsoft/eslint-config-spfx`, `@microsoft/eslint-plugin-spfx`
- `@microsoft/spfx-heft-plugins`, `@microsoft/spfx-web-build-rig`
- `@rushstack/heft`, `@rushstack/eslint-config`
- `typescript` (version pinned by SPFx)

**Testing** (devDependencies — use latest compatible):

- `jest`, `ts-jest`, `babel-jest`, `jest-environment-jsdom`
- `@testing-library/react`, `@testing-library/jest-dom`
- `@types/jest`, `@types/react`, `@types/react-dom`, `@types/webpack-env`

> **To get exact pinned versions**: scaffold a temporary project with `yo @microsoft/sharepoint` using the same SPFx version, then copy `devDependencies` and `@microsoft/*` runtime versions from its `package.json`.

---

## 5. Webpart Anatomy

### 5.1 Manifest (`*WebPart.manifest.json`)

```jsonc
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-web-part-manifest.schema.json",
  "id": "<new-guid>",
  "alias": "MyWebPart",
  "componentType": "WebPart",
  "version": "1.0.0",
  "manifestVersion": 2,
  "requiresCustomScript": false,
  "supportsFullBleed": true,
  "supportedHosts": ["SharePointWebPart"],
  "preconfiguredEntries": [
    {
      "groupId": "5c03119e-3074-46fd-976b-c60198311f70",
      "group": { "default": "Other" },
      "title": { "default": "My Web Part" },
      "description": { "default": "Description" },
      "iconImageUrl": "data:image/svg+xml;base64,...",
      "properties": {
        "myProp": "defaultValue",
      },
    },
  ],
}
```

- `id` and `alias` must be unique per webpart
- `supportsFullBleed: true` → webpart spans full page width
- `iconImageUrl` → use an inline base64 SVG (16x16 to 48x48) for best results; external URLs may not load in the App Catalog
- `preconfiguredEntries[0].properties` → default property pane values (serializable primitives + JSON strings only)

### 5.2 Webpart Class (`*WebPart.ts`)

The webpart class is a **thin bridge** between SPFx and React. It handles lifecycle, property pane, and locale — all business logic lives in hooks and services.

```typescript
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { Version } from '@microsoft/sp-core-library'
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
} from '@microsoft/sp-webpart-base'
import { setLanguage, strings } from './loc/mystrings'
import MyComponent from './components/MyComponent'
import type { IMyComponentProps } from './components/MyComponent.types'

export interface IMyWebPartProps {
  myProp: string
}

export default class MyWebPart extends BaseClientSideWebPart<IMyWebPartProps> {
  protected onInit(): Promise<void> {
    // Set locale based on SharePoint's current culture
    setLanguage(this.context.pageContext.cultureInfo.currentCultureName)
    return super.onInit()
  }

  public render(): void {
    const element = React.createElement(MyComponent, {
      context: this.context,
      myProp: this.properties.myProp,
    })
    ReactDom.render(element, this.domElement)
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement)
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0')
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneHeader },
          groups: [
            {
              groupName: strings.GeneralGroup,
              groupFields: [
                PropertyPaneDropdown('myProp', {
                  label: strings.MyPropLabel,
                  options: [
                    { key: 'option1', text: 'Option 1' },
                    { key: 'option2', text: 'Option 2' },
                  ],
                  selectedKey: this.properties.myProp,
                }),
              ],
            },
          ],
        },
      ],
    }
  }
}
```

**Lifecycle methods**:

| Method                           | Purpose                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `onInit()`                       | One-time setup: locale, PnPjs init, SPFx context checks. Return `super.onInit()`. |
| `render()`                       | Called on every property change. Create and mount the React tree.                 |
| `onDispose()`                    | Unmount React from the DOM.                                                       |
| `getPropertyPaneConfiguration()` | Build the property pane UI dynamically.                                           |

### 5.3 React Component Architecture

The Maecia standard is a **layered architecture**:

```
WebPart class  →  React component  →  hooks / services / models
    (thin)          (UI + logic)        (data layer)
```

**Component props interface** (in a separate `.types.ts` file):

```typescript
import type { BaseComponentContext } from '@microsoft/sp-component-base'
import type { DirectoryConfig } from '../../../models/DirectoryConfig'
import type { Member } from '../../../models/Member'

export interface IMyComponentProps {
  context: BaseComponentContext // SPFx context (never access directly in UI)
  config: DirectoryConfig // Normalized config from property pane
  members: Member[] // Fetched data
  isLoading: boolean // Loading state
  error: string | null // Error message (null = no error)
  onRetry: () => void // Retry callback
}
```

**Pattern**: Always pass `isLoading`, `error`, and `onRetry` — every component must handle all three states.

### 5.4 Multi-Language Property Pane

For webparts deployed on multilingual SharePoint sites, labels in the property pane must be configurable per language.

**Property serialization** — store labels as `Record<string, Record<string, string>>` JSON-serialized:

```typescript
// Property definition
listFieldLabelsJson: string // JSON => { "fieldKey": { "fr": "Label FR", "en": "Label EN" } }
```

**Detecting supported languages** in `onInit()`:

```typescript
protected onInit(): Promise<void> {
  setLanguage(this.context.pageContext.cultureInfo.currentCultureName)

  // Get all supported UI languages from the site
  const supportedLCIDs = this.context.pageContext.web.supportedUILanguageIds
  // Map LCID to language code (e.g. 1036 → 'fr', 1033 → 'en')
  // Store for building per-language label fields in the property pane

  return super.onInit()
}
```

**Building per-language fields** in `getPropertyPaneConfiguration()`:

For each configurable label, create one `PropertyPaneTextField` per supported language. Label them with the language tag so the admin knows which is which.

### 5.5 Complex Property Pane with Custom Controls

For configurations beyond simple dropdowns (e.g., drag-and-drop field ordering), use `PropertyPaneCustomField`:

```typescript
import { PropertyPaneCustomField } from '@microsoft/sp-webpart-base'

// In getPropertyPaneConfiguration():
PropertyPaneCustomField({
  key: 'dndFieldSelector',
  onRender: (domElement, context, changeCallback) => {
    ReactDom.render(
      React.createElement(DnDFieldSelector, {
        fields: this.properties.listFieldOrder,
        labels: this.properties.listFieldLabels,
        languages: this.supportedLanguages,
        onChange: (newOrder, newLabels) => {
          this.properties.listFieldsJson = JSON.stringify(newOrder)
          this.properties.listFieldLabelsJson = JSON.stringify(newLabels)
          changeCallback(this.properties.listFieldOrder, newOrder)
          ReactDom.unmountComponentAtNode(domElement)
        },
      }),
      domElement,
    )
  },
  onDispose: (domElement) => {
    ReactDom.unmountComponentAtNode(domElement)
  },
})
```

### 5.6 Property Pane Refresh

After programmatic property changes (e.g., detecting new extension attributes at runtime), force a property pane refresh:

```typescript
this.context.propertyPane.refresh()
```

This re-renders the property pane with updated field lists.

---

## 6. Localization (`loc/`)

Uses a `Proxy`-based pattern for zero-overhead runtime lookups:

**`loc/mystrings.ts`** — registry:

```typescript
import en from './en'
import fr from './fr'

export type Strings = typeof fr // canonical type

const locales: Record<string, Strings> = { en, fr }
let current: Strings = fr

export const strings: Strings = new Proxy({} as Strings, {
  get(_target, prop: keyof Strings) {
    return current[prop]
  },
})

export function setLanguage(locale: string): void {
  const lang = (locale || '').split('-')[0].toLowerCase()
  current = locales[lang] ?? en
}
```

**`loc/fr.ts`** — French strings (canonical):

```typescript
const fr = {
  PropertyPaneHeader: 'Paramètres',
  MyLabel: 'Mon libellé',
  ErrorMessage: 'Une erreur est survenue.',
}
export default fr
```

**`loc/en.ts`** — English strings:

```typescript
const en: typeof import('./fr').default = {
  PropertyPaneHeader: 'Settings',
  MyLabel: 'My Label',
  ErrorMessage: 'Something went wrong.',
}
export default en
```

Usage: `strings.MyLabel` — always returns the localized value for the active language.

To add a new language:

1. Create `loc/de.ts` (copy `fr.ts`, translate values)
2. Import and register it in `loc/mystrings.ts`

> **Note**: SPFx also generates legacy `en-us.js` / `fr-fr.js` AMD modules. These exist for framework compatibility but the Proxy pattern above is what your code should use.

---

## 7. Working with PnPjs

### 7.1 Initialization

Initialize PnPjs once in `onInit()`:

```typescript
import { spfi, SPFx } from '@pnp/sp'
import { graphfi, SPFx as GraphSPFx } from '@pnp/graph'
import '@pnp/sp/webs'
import '@pnp/sp/lists'
import '@pnp/sp/items'

protected onInit(): Promise<void> {
  const sp = spfi().using(SPFx(this.context))
  const graph = graphfi().using(GraphSPFx(this.context))
  // Store in a service instance, pass via props
  return super.onInit()
}
```

### 7.2 Service Pattern

Create a dedicated service class per API surface:

```typescript
// src/services/GraphService.ts
import { graphfi, SPFx as GraphSPFx } from '@pnp/graph'
import '@pnp/graph/users'
import type { BaseComponentContext } from '@microsoft/sp-component-base'

export class GraphService {
  private graph: ReturnType<typeof graphfi>

  constructor(context: BaseComponentContext) {
    this.graph = graphfi().using(GraphSPFx(context))
  }

  async getUsers(): Promise<User[]> {
    const users = await this.graph.users
      .select('id', 'displayName', 'mail', 'jobTitle')
      .filter('accountEnabled eq true')
      .top(100)()
    return users
  }

  dispose(): void {
    // Clean up blob URLs, abort controllers, etc.
  }
}
```

### 7.3 Lazy Imports

Only import the PnPjs behaviors you actually use:

- `@pnp/sp/webs` — only if querying webs
- `@pnp/sp/items` — only if querying list items
- `@pnp/graph/users` — only if querying Graph users

This keeps the bundle small through tree-shaking.

---

## 8. Microsoft Graph Integration

### 8.1 Permissions

Declare required scopes in `config/package-solution.json`:

```jsonc
"webApiPermissionRequests": [
  { "resource": "Microsoft Graph", "scope": "User.Read.All" },
  { "resource": "Microsoft Graph", "scope": "User.ReadBasic.All" }
]
```

These are **application-level** permissions. After deploying the `.sppkg`, a tenant admin must approve them in SharePoint Admin → Advanced → API Access.

### 8.2 Batch Requests

For fetching per-user details, batch requests to avoid hundreds of individual calls:

```typescript
import { graphfi, SPFx as GraphSPFx, GraphBatch } from '@pnp/graph'

// Process users in chunks of 10-20 concurrent requests
const chunks = chunk(userIds, 10)
for (const batch of chunks) {
  const results = await Promise.all(
    batch.map((id) =>
      this.graph.users.getById(id).select('aboutMe', 'skills')(),
    ),
  )
}
```

### 8.3 Photo Handling

Photos are fetched as blobs and cached as object URLs:

```typescript
async getMemberPhoto(userId: string): Promise<string | null> {
  try {
    const blob = await this.graph.users.getById(userId).photo.getBlob()
    const url = URL.createObjectURL(blob)
    this._blobUrls.push(url)  // Track for cleanup
    return url
  } catch {
    return null  // User has no photo
  }
}

dispose(): void {
  for (const url of this._blobUrls) {
    URL.revokeObjectURL(url)
  }
  this._blobUrls = []
}
```

Cache photo URLs in a hook to avoid repeated Graph calls. For lazy loading, use `IntersectionObserver` — only fetch photos when the avatar enters the viewport.

---

## 9. Hooks Pattern

Each data concern gets its own hook. Hooks manage loading, error, and retry states:

```typescript
// src/hooks/useMembers.ts
export function useMembers(
  context: BaseComponentContext,
  customFieldKeys: string[],
): {
  members: Member[]
  isLoading: boolean
  error: string | null
  retry: () => void
} {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const service = new GraphService(context)
    setIsLoading(true)
    setError(null)
    service
      .getMembers(customFieldKeys)
      .then(setMembers)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false))
    return () => service.dispose()
  }, [context, customFieldKeys, retryCount])

  const retry = useCallback(() => setRetryCount((c) => c + 1), [])

  return { members, isLoading, error, retry }
}
```

**Common hooks**:

| Hook                 | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `useMembers`         | Fetch members from Graph, manage loading/error/retry             |
| `usePhotoCache`      | Lazy photo loading with cache and request deduplication          |
| `usePagination`      | Client-side pagination (24 items/page cards, 15 items/page list) |
| `useAccessControl`   | Check SharePoint group membership for access control             |
| `useDirectoryConfig` | Normalize raw property pane config with defaults                 |

---

## 10. Shared UI Components

Every webpart should include reusable state components:

| Component       | Purpose                                     |
| --------------- | ------------------------------------------- |
| `LoadingState`  | Centered `Spinner` during data fetch        |
| `ErrorState`    | `MessageBar` with error text + retry button |
| `EmptyState`    | "No results" message with icon and hint     |
| `ErrorBoundary` | Class-based boundary catching render errors |
| `AccessDenied`  | Lock icon + warning for unauthorized users  |

Use them like this in your main component:

```tsx
if (isLoading) return <LoadingState />
if (error) return <ErrorState message={error} onRetry={onRetry} />
if (members.length === 0) return <EmptyState />
return (
  <ErrorBoundary>
    <DataView members={members} />
  </ErrorBoundary>
)
```

---

## 11. Development Workflow

### 11.1 Local Dev Server

```bash
npm start            # "heft start" — compiles, starts HTTPS on :4321, watches
npm run build        # "heft build --clean" — production build
npm run test         # "heft test" — run Jest
npm run clean        # "heft clean" — remove build artifacts
```

### 11.2 Testing with the Debug Toolbar (NOT Workbench)

The hosted Workbench (`_layouts/workbench.aspx`) is **deprecated since May 13, 2026** and will be **removed December 1, 2026**. Use the SPFx Debug Toolbar instead:

1. Run `npm start` (keep the terminal open)
2. Open a SharePoint page on your dev tenant
3. Append to the URL: `?debugManifestsFile=https://localhost:4321/temp/build/manifests.js&debug=true&noredir=true`
4. Accept loading debug scripts if prompted
5. The Debug Toolbar appears at the top — click **+** to add your webpart

This runs your webpart on a real SharePoint page with live user context, site lists, and libraries — the most faithful test environment.

### 11.3 Debugging Tips

- Accept the self-signed certificate warning on first launch (required for HTTPS)
- Port conflict: `lsof -ti :4321 | xargs kill`
- Test at different screen widths (SharePoint pages are responsive)
- Test the property pane in edit mode
- Test with different data sets and edge cases (empty, error, no permissions)
- Use browser DevTools to verify network calls and bundle size

---

## 12. Packaging & Deployment

### 12.1 Manual (Local)

```bash
# Production build
npx heft build --clean --production

# Generate .sppkg
npx heft package-solution --production

# Find the package
find sharepoint/solution -name "*.sppkg"
```

### 12.2 Automated (GitHub Actions)

Recommended workflow — generates `.sppkg` as a downloadable artifact:

```yaml
# .github/workflows/build.yml
name: Build SPFx Webpart
on: workflow_dispatch

jobs:
  build:
    name: Build SPFx Webpart
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Bundle solution
        run: npx heft build --clean --production

      - name: Package solution
        run: npx heft package-solution --production

      - name: Verify .sppkg
        run: find . -name "*.sppkg" -type f 2>/dev/null || echo "Aucun .sppkg trouvé"

      - name: Upload .sppkg artifact
        uses: actions/upload-artifact@v4
        with:
          name: maecia-webpart-sppkg
          path: sharepoint/solution/*.sppkg
          if-no-files-found: error
```

Run from the **Actions** tab on GitHub, then download the artifact.

### 12.3 Deploying to App Catalog

1. Navigate to the App Catalog: `https://maecia.sharepoint.com/sites/appcatalog/AppCatalog/Forms/AllItems.aspx`
2. Upload the `.sppkg` to **Apps for SharePoint**
3. Check **Make this solution available to all sites in the organization**
4. Approve API permissions in SharePoint Admin if required
5. The webpart is now available on all sites in the tenant

### 12.4 Updating an Existing Webpart

1. **Increment the version** in `config/package-solution.json`
2. Rebuild and repackage (locally or via CI)
3. Upload the new `.sppkg` to the App Catalog — it replaces the previous version
4. Verify existing pages still work

---

## 13. Maecia Demo Sites

| Site             | URL                                    | Purpose                                              |
| ---------------- | -------------------------------------- | ---------------------------------------------------- |
| **Site vitrine** | `maecia.sharepoint.com`                | Client demos — always clean, no direct testing       |
| **Bac à sable**  | `maecia.sharepoint.com/sites/Bacsable` | Internal testing — use dedicated pages, not homepage |

- Both accessible with a Maecia Microsoft 365 account
- Use the bac à sable for all development testing
- Create dedicated test pages — keep the homepage clean
- Test with different user profiles (varied permissions) before production deployment

---

## 14. Spec Kit — AI-Driven Development

See the full guide at `/sharepoint/developpement/03-creer-webpart-spec-kit` in the Maecia docs.

Spec Kit is an open-source toolkit that transforms functional specifications into working code via AI agents. At Maecia, it's used with **Kilo** (CLI) and **DeepSeek** (AI model).

### 14.1 Prerequisites

- **uv**: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Python 3.11+** (auto-installed by uv)
- **Kilo** configured with the SPFx skill

### 14.2 Installation

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.12.17
specify init my-webpart --integration copilot
cd my-webpart
```

### 14.3 Workflow (5 Steps)

```
Constitution →  Specification  →  Plan  →  Tasks  →  Implementation
(/speckit.constitution)  (/speckit.specify)  (/speckit.plan)  (/speckit.tasks)  (/speckit.implement)
```

1. **Constitution** — define project standards (`/speckit.constitution`): TypeScript strict, React hooks, @pnp/sp, Fluent UI v9, Jest, responsive
2. **Specification** — describe WHAT the webpart does in French (`/speckit.specify`)
3. **Plan** — AI translates spec into technical architecture (`/speckit.plan`)
4. **Tasks** — AI generates ordered task list (`/speckit.tasks`)
5. **Implementation** — AI executes all tasks (`/speckit.implement`)

Additional commands: `/speckit.clarify`, `/speckit.analyze`, `/speckit.checklist`, `/speckit.converge`

When using Spec Kit, still follow the architecture patterns in this skill (hooks, services, models, multi-language property pane, etc.). The AI respects the constitution you define.

---

## 15. Adding a Second Webpart

A single SPFx solution can host multiple webparts:

1. Create the folder: `src/webparts/mySecondWebPart/`
2. Create the manifest: `MySecondWebPartWebPart.manifest.json` (fresh GUID)
3. Create the webpart class: `MySecondWebPartWebPart.ts`
4. Register in `config/config.json` under `bundles` with a new key
5. Register localized resources in `config/config.json` under `localizedResources`
6. Update `config/package-solution.json` if new API permissions are needed

Shared `hooks/`, `services/`, and `models/` at `src/` root are reusable across all webparts.

---

## 16. Common Pitfalls & Best Practices

### Property Pane

- Values must be **JSON-serializable primitives**. Complex objects → `JSON.stringify`/`JSON.parse`.
- For multi-language webparts, store labels as `Record<string, Record<string, string>>` serialized to JSON.
- Call `this.context.propertyPane.refresh()` after programmatic property changes.
- Use `PropertyPaneCustomField` for non-standard controls (drag-and-drop, multi-select with custom UI).

### Performance

- Batch Graph/SharePoint calls with `Promise.all`.
- Use `React.memo`, `useMemo`, and `useCallback` to avoid unnecessary re-renders.
- Lazy-load PnPjs behaviors — only import what you use.
- Lazy-load photos with `IntersectionObserver` — don't fetch off-screen avatars.
- Paginate client-side (24 cards, 15 list rows per page) rather than loading all at once.

### State Management

- Pass `context` to services — never access `this.context` directly in React components.
- Use custom hooks to encapsulate data fetching and state.
- Each data hook should manage its own loading/error/retry states.
- Prefer pure functions in `utils/` for transformations.

### Security

- Never hard-code tenant URLs, client IDs, or secrets.
- API permissions in `package-solution.json` must be approved by a tenant admin.
- Use SharePoint groups for access control — check membership via `@pnp/sp`.

### Versioning

- Bump version in `config/package-solution.json` when releasing.
- Bump version in `package.json` to match.
- Upload the new `.sppkg` to the App Catalog to replace the old version.

### Node.js

- Always run `nvm use 22` before `yo` or `npm` commands in a new terminal.
- Global packages (`yo`, `heft`) are linked to the active Node.js version.
- Never use `sudo` with npm.

---

## 17. Quick Checklist for a New Webpart

- [ ] Ensure `nvm use 22` is active
- [ ] Scaffold with `yo @microsoft/sharepoint` (React template)
- [ ] Generate fresh GUIDs for manifest, solution, and feature
- [ ] Configure `config/config.json` with bundle entry + localized resources
- [ ] Configure `config/serve.json` with `{tenantDomain}` + real page URL
- [ ] Set `SPFX_SERVE_TENANT_DOMAIN` env var
- [ ] Add `webApiPermissionRequests` if using Graph
- [ ] Create locale files (`en.ts`, `fr.ts`) and register in `mystrings.ts`
- [ ] Wire up `onInit()`: set language, init PnPjs
- [ ] Implement `render()` and `onDispose()` with React mount/unmount
- [ ] Implement `getPropertyPaneConfiguration()` for configurable properties
- [ ] Create at least `LoadingState`, `ErrorState`, `EmptyState` shared components
- [ ] Structure data layer: `hooks/` → `services/` → `models/`
- [ ] Add Jest tests covering happy path, empty state, error state, loading state
- [ ] Create `.github/workflows/build.yml` for CI/CD packaging
- [ ] Run `npm start` and test via Debug Toolbar on bac à sable
- [ ] Run `npm run build` to verify production build succeeds
- [ ] Package and deploy to App Catalog: `npx heft build --clean --production && npx heft package-solution --production`
- [ ] Approve API permissions in SharePoint Admin if required

---

## 18. Maintaining This Skill

### When to update

| Trigger                         | What to review                                                  |
| ------------------------------- | --------------------------------------------------------------- |
| New SPFx major version          | Check Node.js requirement, React version, Heft breaking changes |
| New PnPjs major version         | Verify `spfi()`/`graphfi()` API, update import paths            |
| TypeScript major version bump   | Check `compilerOptions` compatibility                           |
| Yeoman generator prompts change | Re-scaffold a test project, update Section 2                    |
| Workbench fully removed         | Remove any remaining Workbench references                       |
| New Maecia conventions adopted  | Update architecture patterns, add to checklist                  |

### How to update

1. **Scaffold a fresh reference project**:
   ```bash
   mkdir /tmp/spfx-ref && cd /tmp/spfx-ref
   nvm use 22
   yo @microsoft/sharepoint  # pick latest SPFx + React
   ```
2. **Diff the generated files** against this skill's examples — check for new/removed config files, changed dependencies, new compiler options.
3. **Update patterns and conventions** — never hardcode specific version numbers. Use relative references like "the version pinned by SPFx".
4. **Keep architecture patterns stable** — the lifecycle (`onInit`, `render`, `onDispose`), the React bridge, and the hook/service/model layering are unlikely to change across SPFx versions.

### What NOT to put in this skill

- Specific version numbers (use relative references)
- Tenant-specific URLs (except the Maecia demo sites, which are organizational constants)
- Business logic or domain-specific patterns
- CSS/styling patterns (these are webpart-specific)
