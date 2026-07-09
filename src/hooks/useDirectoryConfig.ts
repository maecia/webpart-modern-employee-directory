import { DirectoryConfig } from '../models/DirectoryConfig'

const DEFAULT_CARD_ORDER: string[] = [
  'photo',
  'firstName',
  'name',
  'outlook',
  'teams',
]
const DEFAULT_LIST_ORDER: string[] = [
  'photo',
  'firstName',
  'name',
  'email',
  'phone',
  'jobTitle',
  'department',
  'manager',
]
const DEFAULT_MODAL_ORDER: string[] = [
  'photo',
  'firstName',
  'name',
  'email',
  'phone',
  'jobTitle',
  'department',
  'officeLocation',
  'outlook',
  'teams',
]

export { DEFAULT_CARD_ORDER, DEFAULT_LIST_ORDER, DEFAULT_MODAL_ORDER }

export function useDirectoryConfig(
  rawConfig: Partial<DirectoryConfig>,
): DirectoryConfig {
  return {
    defaultView: rawConfig.defaultView || 'card',
    sortOrder: rawConfig.sortOrder || 'lastNameAsc',
    filters: rawConfig.filters || [],
    cardFieldOrder: rawConfig.cardFieldOrder || DEFAULT_CARD_ORDER,
    listFieldOrder: rawConfig.listFieldOrder || DEFAULT_LIST_ORDER,
    modalFieldOrder: rawConfig.modalFieldOrder || DEFAULT_MODAL_ORDER,
    listFieldLabels: rawConfig.listFieldLabels || {},
    modalFieldLabels: rawConfig.modalFieldLabels || {},
  }
}
