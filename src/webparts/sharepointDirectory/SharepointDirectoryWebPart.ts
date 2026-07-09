import * as React from 'react'
import * as ReactDom from 'react-dom'
import { Version } from '@microsoft/sp-core-library'
import { useTheme } from '@fluentui/react/lib/Theme'
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneLabel,
  PropertyPaneChoiceGroup,
  IPropertyPaneDropdownOption,
} from '@microsoft/sp-webpart-base'
import {
  IPropertyPaneField,
  IPropertyPaneCustomFieldProps,
  PropertyPaneFieldType,
} from '@microsoft/sp-property-pane'
import Directory from './components/Directory'
import {
  DirectoryConfig,
  STANDARD_FIELD_KEYS,
  getAvailableEntraIdFieldGroups,
  getAvailableEntraIdFields,
} from '../../models/DirectoryConfig'
import { FilterField } from '../../models/Filter'
import { useMembers } from '../../hooks/useMembers'
import {
  useDirectoryConfig,
  DEFAULT_CARD_ORDER,
  DEFAULT_LIST_ORDER,
  DEFAULT_MODAL_ORDER,
} from '../../hooks/useDirectoryConfig'
import { setLanguage, strings } from './loc/mystrings'
import DnDFieldSelector from './components/propertyPane/DnDFieldSelector'

export interface ISharepointDirectoryWebPartProps {
  [key: string]: any
  defaultView: 'card' | 'list'
  sortOrder: string
  /** Active tab in the property pane — drives which view is being configured */
  activeViewTab: 'card' | 'list' | 'modal'
  /** JSON-serialised ordered string[] of field keys for each view */
  cardFieldsJson: string
  listFieldsJson: string
  modalFieldsJson: string
  /** JSON-serialised Record<string, Record<string, string>> for labels */
  listFieldLabelsJson: string
  modalFieldLabelsJson: string
  /** Filters */
  filterCount: number
  filterField1: string
  filterField2: string
  filterField3: string
}

const ALL_FIELD_KEYS_SET = STANDARD_FIELD_KEYS

// Backward-compat references used only by migrateOldFieldOrder
const CARD_DEFAULTS = DEFAULT_CARD_ORDER
const LIST_DEFAULTS = DEFAULT_LIST_ORDER
const MODAL_DEFAULTS = DEFAULT_MODAL_ORDER

const DirectoryContainer: React.FC<{
  context: any
  config: DirectoryConfig
  onDetectedExtAttrs: (attrs: string[]) => void
}> = ({ context, config, onDetectedExtAttrs }) => {
  const customFieldKeys = React.useMemo(() => {
    const all = [
      ...config.cardFieldOrder,
      ...config.listFieldOrder,
      ...config.modalFieldOrder,
    ]
    const filtered = all.filter((k) => !ALL_FIELD_KEYS_SET.has(k))
    const seen: Record<string, boolean> = {}
    return filtered.filter((k) => {
      if (seen[k]) return false
      seen[k] = true
      return true
    })
  }, [config.cardFieldOrder, config.listFieldOrder, config.modalFieldOrder])

  const { members, isLoading, error, retry } = useMembers(
    context,
    customFieldKeys,
    onDetectedExtAttrs,
  )

  return React.createElement(Directory, {
    config,
    members,
    isLoading,
    error,
    onRetry: retry,
  })
}

export default class SharepointDirectoryWebPart extends BaseClientSideWebPart<ISharepointDirectoryWebPartProps> {
  private _themePrimary: string = '#1B7A6E'

  protected onInit(): Promise<void> {
    setLanguage(this.context.pageContext.cultureInfo.currentCultureName)
    if (!this.properties.activeViewTab) this.properties.activeViewTab = 'card'
    return super.onInit()
  }

  private detectedExtAttrs: string[] = []

  public render(): void {
    // Extract the Fluent UI theme primary — stored on the class so the
    // property pane (which lives in a separate iframe) can read it.
    const ThemeExtractor: React.FC = () => {
      const theme = useTheme()
      React.useEffect(() => {
        const c = theme?.palette?.themePrimary
        if (c) this._themePrimary = c
      })
      return null
    }

    const rawConfig: Partial<DirectoryConfig> = {
      defaultView: this.properties.defaultView || 'card',
      sortOrder: (this.properties.sortOrder || 'lastNameAsc') as any,
      cardFieldOrder: this.getEffectiveFieldOrder('card'),
      listFieldOrder: this.getEffectiveFieldOrder('list'),
      modalFieldOrder: this.getEffectiveFieldOrder('modal'),
      listFieldLabels: this.getLocalizedLabels('list'),
      modalFieldLabels: this.getLocalizedLabels('modal'),
      filters: this.getFiltersFromProperties(),
    }

    const config = useDirectoryConfig(rawConfig)

    ReactDom.render(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(ThemeExtractor),
        React.createElement(DirectoryContainer, {
        context: this.context,
        config,
        onDetectedExtAttrs: (attrs: string[]) => {
          if (JSON.stringify(this.detectedExtAttrs) !== JSON.stringify(attrs)) {
            this.detectedExtAttrs = attrs
            this.context.propertyPane.refresh()
          }
        },
      }),
      ),
      this.domElement,
    )
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement)
  }

  protected get dataVersion(): Version {
    return Version.parse('2.0')
  }

  private getFiltersFromProperties(): FilterField[] {
    const filters: FilterField[] = []
    const count = this.properties.filterCount || 0
    const lang = (this.context.pageContext.cultureInfo.currentCultureName || '').split('-')[0].toLowerCase()

    for (let i = 1; i <= count; i++) {
      const fieldName = this.properties[`filterField${i}`]
      if (!fieldName) continue
      const props = this.properties as any
      // Try new JSON format first, then fall back to old flat properties
      const json = props[`filterLabels${i}Json`]
      let label: string
      if (json) {
        try {
          const labels = JSON.parse(json)
          label = labels[lang] || ''
        } catch {
          label = props[`filterLabel_${i}_${lang}`] || ''
        }
      } else {
        label = props[`filterLabel_${i}_${lang}`] || props[`filterLabelFr${i}`] || ''
      }
      filters.push({ fieldName, label })
    }
    return filters
  }

  // ─── New helper methods ──────────────────────────────────────────────────

  /** Parse the JSON stored in *FieldsJson — migrate from old flat props if absent */
  private getEffectiveFieldOrder(view: 'card' | 'list' | 'modal'): string[] {
    const prop =
      view === 'card'
        ? 'cardFieldsJson'
        : view === 'list'
          ? 'listFieldsJson'
          : 'modalFieldsJson'
    const json = (this.properties as any)[prop]
    if (json) {
      try {
        return JSON.parse(json)
      } catch {
        /* fall through */
      }
    }
    return this.migrateOldFieldOrder(view)
  }

  /** Build initial order from the old flat customCardField1-5 properties */
  private migrateOldFieldOrder(view: 'card' | 'list' | 'modal'): string[] {
    const defaults =
      view === 'card'
        ? CARD_DEFAULTS
        : view === 'list'
          ? LIST_DEFAULTS
          : MODAL_DEFAULTS
    const fieldsProp =
      view === 'card'
        ? 'cardFields'
        : view === 'list'
          ? 'listFields'
          : 'modalFields'
    const saved: string[] | undefined = (this.properties as any)[fieldsProp]
    const standard = saved && saved.length > 0 ? saved : defaults
    const prefix =
      view === 'card'
        ? 'customCardField'
        : view === 'list'
          ? 'customListField'
          : 'customModalField'
    const count: number = (this.properties as any)[`${prefix}Count`] || 0
    const custom: string[] = []
    for (let i = 1; i <= count; i++) {
      const v = (this.properties as any)[`${prefix}${i}`]
      if (v) custom.push(v)
    }
    return [...standard, ...custom]
  }

  /** Parse labels JSON — migrate from old LabelFr/LabelEn flat props if absent */
  private parseFieldLabelsRecord(
    view: 'list' | 'modal',
  ): Record<string, { fr: string; en: string }> {
    const prop =
      view === 'list' ? 'listFieldLabelsJson' : 'modalFieldLabelsJson'
    const json = (this.properties as any)[prop]
    if (json) {
      try {
        return JSON.parse(json)
      } catch {
        /* fall through */
      }
    }
    // Migrate from old flat properties
    const prefix = view === 'list' ? 'customListField' : 'customModalField'
    const count: number = (this.properties as any)[`${prefix}Count`] || 0
    const result: Record<string, { fr: string; en: string }> = {}
    for (let i = 1; i <= count; i++) {
      const key = (this.properties as any)[`${prefix}${i}`]
      if (key) {
        result[key] = {
          fr: (this.properties as any)[`${prefix}LabelFr${i}`] || '',
          en: (this.properties as any)[`${prefix}LabelEn${i}`] || '',
        }
      }
    }
    return result
  }

  /** Return localized (single string) labels per field key for the given view */
  private getLocalizedLabels(
    view: 'list' | 'modal',
<<<<<<< HEAD
=======
    lang: string,
>>>>>>> 3b8ef05 (feat: <CP-1505> improve)
  ): Record<string, string> {
    const lang = (this.context.pageContext.cultureInfo.currentCultureName || '').split('-')[0].toLowerCase()
    const record = this.parseFieldLabelsRecord(view)
    const result: Record<string, string> = {}
    for (const [key, labels] of Object.entries(record)) {
      result[key] = (labels as any)[lang] || labels.en || ''
    }
    return result
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any,
  ): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue)
    this.context.propertyPane.refresh()
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const filterCount = this.properties.filterCount || 0
    const activeTab = (this.properties.activeViewTab || 'card') as
      | 'card'
      | 'list'
      | 'modal'

    // ── Filter field options (base + EntraID + detected ext attrs) ──────────
    const buildFilterOptions = (): IPropertyPaneDropdownOption[] => {
      const options: IPropertyPaneDropdownOption[] = [
        { key: '', text: strings.None },
        { key: 'givenName', text: strings.FieldFirstName },
        { key: 'surname', text: strings.FieldName },
        { key: 'mail', text: strings.FieldEmail },
        { key: 'mobilePhone', text: strings.FieldPhone },
        { key: 'jobTitle', text: strings.FieldJobTitle },
        { key: 'department', text: strings.FieldDepartment },
        { key: 'officeLocation', text: strings.FieldOfficeLocation },
        { key: 'managerDisplayName', text: strings.FieldManager },
      ]
      for (const group of getAvailableEntraIdFieldGroups()) {
        for (const f of group.fields) {
          options.push({ key: f.key, text: f.label })
        }
      }
      for (const k of this.detectedExtAttrs) {
        options.push({ key: k, text: (strings as any)[`EntraField_${k}`] || k })
      }
      return options
    }

    const FILTER_OPTIONS = buildFilterOptions()

    const filterGroupFields: any[] = []

    for (let i = 1; i <= filterCount; i++) {
      filterGroupFields.push(
        PropertyPaneDropdown(`filterField${i}`, {
          label: `${strings.FilterLabel} ${i} — ${strings.FilterFieldLabel}`,
          options: FILTER_OPTIONS,
          selectedKey: (this.properties as any)[`filterField${i}`] || '',
        }),
      )
      // Dynamic label fields — one per supported language
      for (const lang of this._supportedLanguages) {
        const propName = `filterLabel_${i}_${lang}`
        const langLabel = (strings as any)[`Lang_${lang}`] || lang
        filterGroupFields.push(
          PropertyPaneTextField(propName, {
            label: langLabel,
            value: (this.properties as any)[propName] || '',
          }),
        )
      }
      filterGroupFields.push(
        PropertyPaneButton(`removeFilter${i}`, {
          text: strings.RemoveFilterLabel,
          buttonType: PropertyPaneButtonType.Command,
          icon: 'Delete',
          onClick: () => {
            this.properties.filterCount = Math.max(0, filterCount - 1)
            this.context.propertyPane.refresh()
          },
        }),
      )
    }

    if (filterCount < 3) {
      filterGroupFields.push(
        PropertyPaneButton('addFilter', {
          text: strings.AddFilter,
          buttonType: PropertyPaneButtonType.Command,
          icon: 'Add',
          onClick: () => {
            this.properties.filterCount = filterCount + 1
            this.context.propertyPane.refresh()
          },
        }),
      )
    }

    // ── DnD custom field — remounts when activeTab changes (via key prop) ─────
    const dndCustomField: IPropertyPaneField<IPropertyPaneCustomFieldProps> = {
      type: PropertyPaneFieldType.Custom,
      targetProperty: 'dnd_selector',
      shouldFocus: false,
      properties: {
        key: 'dnd_selector',
        onRender: (elem: HTMLElement) => {
          const primaryColor = this._themePrimary

          // Inject CSS override — use primary color instead of blue for choice group buttons
          const doc = elem.ownerDocument!
          if (!doc.getElementById('spdir-chocegroup-override')) {
            const style = doc.createElement('style')
            style.id = 'spdir-chocegroup-override'
            style.textContent = `
            .ms-ChoiceField--image.is-checked::before { border-color: ${primaryColor} !important; }
            .ms-ChoiceField--image.is-checked .ms-ChoiceField-icon { color: ${primaryColor} !important; }
            .ms-ChoiceField--image:hover::before { border-color: ${primaryColor} !important; }
            .ms-ChoiceField-field.is-checked::before { border-color: ${primaryColor} !important; }
            .ms-ChoiceField-field.is-checked .ms-ChoiceField-icon { color: ${primaryColor} !important; }
          `
            doc.head.appendChild(style)
          }

          const tab = (this.properties.activeViewTab || 'card') as
            | 'card'
            | 'list'
            | 'modal'
          const selectedKeys = this.getEffectiveFieldOrder(tab)
          const labelsJson =
            tab === 'list'
              ? this.properties.listFieldLabelsJson || '{}'
              : tab === 'modal'
                ? this.properties.modalFieldLabelsJson || '{}'
                : '{}'

          const onUpdateKeys = (newKeys: string[]) => {
            const prop =
              tab === 'card'
                ? 'cardFieldsJson'
                : tab === 'list'
                  ? 'listFieldsJson'
                  : 'modalFieldsJson'
            ;(this.properties as any)[prop] = JSON.stringify(newKeys)
            this.render()
          }

          const onUpdateLabels = (newLabelsJson: string) => {
            const prop =
              tab === 'list' ? 'listFieldLabelsJson' : 'modalFieldLabelsJson'
            ;(this.properties as any)[prop] = newLabelsJson
            this.render()
          }

          ReactDom.render(
            React.createElement(DnDFieldSelector, {
              key: tab, // force remount when tab changes
              view: tab,
              selectedKeys,
              labelsJson,
              detectedExtAttrs: this.detectedExtAttrs,
              primaryColor,
              onUpdateKeys,
              onUpdateLabels,
            }),
            elem,
          )
        },
        onDispose: (elem: HTMLElement) => {
          ReactDom.unmountComponentAtNode(elem)
        },
      },
    }

    return {
      pages: [
        {
          header: { description: strings.PropertyPaneHeader },
          groups: [
            {
              groupName: strings.ViewGroupName,
              groupFields: [
                PropertyPaneDropdown('defaultView', {
                  label: strings.DefaultViewLabel,
                  options: [
                    { key: 'card', text: strings.ViewTrombinoscope },
                    { key: 'list', text: strings.ViewList },
                  ],
                  selectedKey: this.properties.defaultView || 'card',
                }),
                PropertyPaneDropdown('sortOrder', {
                  label: strings.SortOrderLabel,
                  options: [
                    { key: 'lastNameAsc', text: strings.SortLastNameAsc },
                    { key: 'lastNameDesc', text: strings.SortLastNameDesc },
                    { key: 'firstNameAsc', text: strings.SortFirstNameAsc },
                    { key: 'firstNameDesc', text: strings.SortFirstNameDesc },
                    { key: 'random', text: strings.SortRandom },
                  ],
                  selectedKey: this.properties.sortOrder || 'lastNameAsc',
                }),
              ],
            },
            {
              groupName: strings.FilterGroupName,
              groupFields:
                filterGroupFields.length > 0
                  ? filterGroupFields
                  : [PropertyPaneLabel('noFilter', { text: strings.NoFilter })],
            },
            {
              // Tab selector — 3 icon buttons Card / List / Modal
              groupName: strings.ViewTabLabel,
              groupFields: [
                PropertyPaneChoiceGroup('activeViewTab', {
                  label: '',
                  options: [
                    {
                      key: 'card',
                      text: strings.TabCard,
                      iconProps: { officeFabricIconFontName: 'GridViewMedium' },
                    },
                    {
                      key: 'list',
                      text: strings.TabList,
                      iconProps: { officeFabricIconFontName: 'BulletedList2' },
                    },
                    {
                      key: 'modal',
                      text: strings.TabModal,
                      iconProps: { officeFabricIconFontName: 'ContactInfo' },
                    },
                  ],
                }),
                dndCustomField,
              ],
            },
          ],
        },
      ],
    }
  }
}
