import { FilterField } from './Filter'

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

export interface DirectoryConfig {
  defaultView: 'card' | 'list';
  filters: FilterField[];
  cardFields: CardFieldName[];
  listFields: CardFieldName[];
  modalFields: CardFieldName[];
}
