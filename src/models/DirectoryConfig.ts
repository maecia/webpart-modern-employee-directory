import { FilterField } from './Filter'
import { strings } from '../webparts/sharepointDirectory/loc/mystrings'

export type CardFieldName =
  | 'photo'
  | 'name'
  | 'firstName'
  | 'email'
  | 'phone'
  | 'jobTitle'
  | 'department'
  | 'officeLocation'
  | 'manager'
  | 'outlook'
  | 'teams'

export type SortOrder =
  | 'firstNameAsc'
  | 'firstNameDesc'
  | 'lastNameAsc'
  | 'lastNameDesc'
  | 'random'

/** All standard CardFieldName keys — not fetched via Graph custom properties */
export const STANDARD_FIELD_KEYS: ReadonlySet<string> = new Set<string>([
  'photo',
  'name',
  'firstName',
  'email',
  'phone',
  'jobTitle',
  'department',
  'officeLocation',
  'manager',
  'outlook',
  'teams',
])

export interface DirectoryConfig {
  defaultView: 'card' | 'list'
  sortOrder: SortOrder
  /** Number of members displayed per page in the card and list views. */
  pageSize: number
  filters: FilterField[]
  /** Ordered list of all field keys (CardFieldName + custom) for card view */
  cardFieldOrder: string[]
  /** Ordered list of all field keys for list view */
  listFieldOrder: string[]
  /** Ordered list of all field keys for modal view */
  modalFieldOrder: string[]
  /** Localized labels for non-standard fields in list view */
  listFieldLabels: Record<string, string>
  /** Localized labels for non-standard fields in modal view */
  modalFieldLabels: Record<string, string>
}

export interface EntraIdField {
  key: string
  label: string
}

export interface EntraIdFieldGroup {
  groupKey: string
  label: string
  fields: EntraIdField[]
}

export function getAvailableEntraIdFieldGroups(): EntraIdFieldGroup[] {
  return [
    {
      groupKey: 'profile',
      label: strings.DnD_Group_Profile,
      fields: [
        { key: 'aboutMe', label: strings.EntraField_aboutMe },
        { key: 'birthday', label: strings.EntraField_birthday },
        { key: 'interests', label: strings.EntraField_interests },
        { key: 'pastProjects', label: strings.EntraField_pastProjects },
        { key: 'responsibilities', label: strings.EntraField_responsibilities },
        { key: 'schools', label: strings.EntraField_schools },
        { key: 'skills', label: strings.EntraField_skills },
      ],
    },
    {
      groupKey: 'contact',
      label: strings.DnD_Group_Contact,
      fields: [
        { key: 'streetAddress', label: strings.EntraField_streetAddress },
        { key: 'city', label: strings.EntraField_city },
        { key: 'state', label: strings.EntraField_state },
        { key: 'postalCode', label: strings.EntraField_postalCode },
        { key: 'country', label: strings.EntraField_country },
        { key: 'businessPhones', label: strings.EntraField_businessPhones },
        { key: 'faxNumber', label: strings.EntraField_faxNumber },
        { key: 'otherMails', label: strings.EntraField_otherMails },
        { key: 'imAddresses', label: strings.EntraField_imAddresses },
        { key: 'mySite', label: strings.EntraField_mySite },
      ],
    },
    {
      groupKey: 'company',
      label: strings.DnD_Group_Company,
      fields: [
        { key: 'companyName', label: strings.EntraField_companyName },
        { key: 'employeeId', label: strings.EntraField_employeeId },
        { key: 'employeeType', label: strings.EntraField_employeeType },
        { key: 'employeeHireDate', label: strings.EntraField_employeeHireDate },
        { key: 'hireDate', label: strings.EntraField_hireDate },
        {
          key: 'employeeLeaveDateTime',
          label: strings.EntraField_employeeLeaveDateTime,
        },
        { key: 'division', label: strings.EntraField_division },
        { key: 'costCenter', label: strings.EntraField_costCenter },
      ],
    },
    {
      groupKey: 'region',
      label: strings.DnD_Group_Region,
      fields: [
        {
          key: 'preferredLanguage',
          label: strings.EntraField_preferredLanguage,
        },
        { key: 'usageLocation', label: strings.EntraField_usageLocation },
      ],
    },
    {
      groupKey: 'other',
      label: strings.DnD_Group_Other,
      fields: [
        { key: 'createdDateTime', label: strings.EntraField_createdDateTime },
        { key: 'ageGroup', label: strings.EntraField_ageGroup },
        {
          key: 'consentProvidedForMinor',
          label: strings.EntraField_consentProvidedForMinor,
        },
        {
          key: 'legalAgeGroupClassification',
          label: strings.EntraField_legalAgeGroupClassification,
        },
        {
          key: 'externalUserState',
          label: strings.EntraField_externalUserState,
        },
        { key: 'mailNickname', label: strings.EntraField_mailNickname },
        {
          key: 'lastPasswordChangeDateTime',
          label: strings.EntraField_lastPasswordChangeDateTime,
        },
      ],
    },
    {
      groupKey: 'onprem',
      label: strings.DnD_Group_OnPrem,
      fields: [
        {
          key: 'onPremisesDistinguishedName',
          label: strings.EntraField_onPremisesDistinguishedName,
        },
        {
          key: 'onPremisesDomainName',
          label: strings.EntraField_onPremisesDomainName,
        },
        {
          key: 'onPremisesSamAccountName',
          label: strings.EntraField_onPremisesSamAccountName,
        },
        {
          key: 'onPremisesUserPrincipalName',
          label: strings.EntraField_onPremisesUserPrincipalName,
        },
      ],
    },
  ]
}

export function getAvailableEntraIdFields(): EntraIdField[] {
  return getAvailableEntraIdFieldGroups().reduce<EntraIdField[]>(
    (acc, g) => acc.concat(g.fields),
    [],
  )
}

/** Return the localized display label for any EntraID or extensionAttribute field key */
export function getEntraFieldLabel(key: string): string {
  for (const group of getAvailableEntraIdFieldGroups()) {
    const found = group.fields.find((f) => f.key === key)
    if (found) return found.label
  }
  const strKey = `EntraField_${key}`
  return (strings as any)[strKey] || key
}

/** @deprecated Use getEntraFieldLabel() instead */
export const AVAILABLE_ENTRAID_FIELDS: EntraIdField[] = new Proxy(
  [] as EntraIdField[],
  {
    get(_target, prop) {
      const live = getAvailableEntraIdFields()
      if (prop === 'find') return live.find.bind(live)
      if (prop === 'filter') return live.filter.bind(live)
      if (prop === 'map') return live.map.bind(live)
      if (prop === 'length') return live.length
      if (typeof prop === 'string' && !isNaN(Number(prop)))
        return live[Number(prop)]
      return (live as any)[prop]
    },
  },
)
