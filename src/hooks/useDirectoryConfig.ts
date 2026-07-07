import { DirectoryConfig, CardFieldName } from '../models/DirectoryConfig'

const DEFAULT_CARD_FIELDS: CardFieldName[] = [
  'photo',
  'name',
  'firstName',
  'outlook',
  'teams',
]
const DEFAULT_LIST_FIELDS: CardFieldName[] = [
  'photo',
  'name',
  'firstName',
  'email',
  'phone',
  'jobTitle',
  'department',
  'manager',
]
const DEFAULT_MODAL_FIELDS: CardFieldName[] = [
  'photo',
  'name',
  'firstName',
  'email',
  'phone',
  'jobTitle',
  'department',
  'officeLocation',
  'outlook',
  'teams',
]

export function useDirectoryConfig(
  rawConfig: Partial<DirectoryConfig>,
): DirectoryConfig {
  return {
    defaultView: rawConfig.defaultView || 'card',
    filters: rawConfig.filters || [],
    cardFields: rawConfig.cardFields || DEFAULT_CARD_FIELDS,
    listFields: rawConfig.listFields || DEFAULT_LIST_FIELDS,
    modalFields: rawConfig.modalFields || DEFAULT_MODAL_FIELDS,
  }
}
