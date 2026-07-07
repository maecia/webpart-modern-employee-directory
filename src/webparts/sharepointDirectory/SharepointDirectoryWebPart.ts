import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneCheckbox,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneLabel,
  IPropertyPaneDropdownOption,
} from '@microsoft/sp-webpart-base';
import Directory from './components/Directory';
import { DirectoryConfig, CardFieldName } from '../../models/DirectoryConfig';
import { FilterField } from '../../models/Filter';
import { useMembers } from '../../hooks/useMembers';
import { useDirectoryConfig } from '../../hooks/useDirectoryConfig';

export interface ISharepointDirectoryWebPartProps {
  defaultView: 'card' | 'list'
  cardFields: CardFieldName[]
  listFields: CardFieldName[]
  modalFields: CardFieldName[]
  filterCount: number
  filterField1: string
  filterLabel1: string
  filterField2: string
  filterLabel2: string
  filterField3: string
  filterLabel3: string
}

const AVAILABLE_FILTER_FIELDS: IPropertyPaneDropdownOption[] = [
  { key: '', text: 'Aucun' },
  { key: 'givenName', text: 'Prénom' },
  { key: 'surname', text: 'Nom' },
  { key: 'email', text: 'E-mail' },
  { key: 'mobilePhone', text: 'Téléphone' },
  { key: 'jobTitle', text: 'Poste' },
  { key: 'department', text: 'Département' },
  { key: 'officeLocation', text: 'Localisation' },
  { key: 'managerDisplayName', text: 'Manager' },
]

const CARD_FIELDS: { key: CardFieldName; text: string }[] = [
  { key: 'photo', text: 'Photo' },
  { key: 'name', text: 'Nom' },
  { key: 'firstName', text: 'Prénom' },
  { key: 'email', text: 'E-mail' },
  { key: 'phone', text: 'Téléphone' },
  { key: 'jobTitle', text: 'Poste' },
  { key: 'department', text: 'Département' },
  { key: 'officeLocation', text: 'Localisation' },
  { key: 'manager', text: 'Manager' },
  { key: 'outlook', text: 'Outlook' },
  { key: 'teams', text: 'Teams' },
]

const LIST_FIELDS: { key: CardFieldName; text: string }[] = [
  { key: 'photo', text: 'Photo' },
  { key: 'name', text: 'Nom' },
  { key: 'firstName', text: 'Prénom' },
  { key: 'email', text: 'E-mail' },
  { key: 'phone', text: 'Téléphone' },
  { key: 'jobTitle', text: 'Poste' },
  { key: 'department', text: 'Département' },
  { key: 'officeLocation', text: 'Localisation' },
  { key: 'manager', text: 'Manager' },
  { key: 'outlook', text: 'Outlook' },
  { key: 'teams', text: 'Teams' },
]

const MODAL_FIELDS: { key: CardFieldName; text: string }[] = [
  { key: 'photo', text: 'Photo' },
  { key: 'name', text: 'Nom' },
  { key: 'firstName', text: 'Prénom' },
  { key: 'email', text: 'E-mail' },
  { key: 'phone', text: 'Téléphone' },
  { key: 'jobTitle', text: 'Poste' },
  { key: 'department', text: 'Département' },
  { key: 'officeLocation', text: 'Localisation' },
  { key: 'manager', text: 'Manager' },
  { key: 'outlook', text: 'Outlook' },
  { key: 'teams', text: 'Teams' },
]

const CARD_DEFAULTS: CardFieldName[] = ['photo', 'name', 'firstName', 'outlook', 'teams'];
const LIST_DEFAULTS: CardFieldName[] = ['photo', 'name', 'firstName', 'email', 'phone', 'jobTitle', 'department', 'manager'];
const MODAL_DEFAULTS: CardFieldName[] = ['photo', 'name', 'firstName', 'outlook', 'teams'];

function getCheckedFields(
  properties: any,
  prefix: string,
  availableFields: { key: CardFieldName; text: string }[],
  defaults: CardFieldName[],
): CardFieldName[] {
  const checked: CardFieldName[] = [];
  const hasExplicitValues = availableFields.some((f) => (properties as any)[`${prefix}_${f.key}`] !== undefined);
  availableFields.forEach((f) => {
    const val = (properties as any)[`${prefix}_${f.key}`];
    if (val === true || (val === undefined && !hasExplicitValues && defaults.includes(f.key))) {
      checked.push(f.key);
    }
  });
  return checked;
}

const DirectoryContainer: React.FC<{ context: any; config: DirectoryConfig }> = ({ context, config }) => {
  const { members, isLoading, error, retry } = useMembers(context);

  return React.createElement(Directory, {
    config,
    members,
    isLoading,
    error,
    onRetry: retry,
  });
};

export default class SharepointDirectoryWebPart extends BaseClientSideWebPart<ISharepointDirectoryWebPartProps> {

  public render(): void {
    const cardFields = (this.properties.cardFields && this.properties.cardFields.length > 0)
      ? this.properties.cardFields : CARD_DEFAULTS;
    const listFields = (this.properties.listFields && this.properties.listFields.length > 0)
      ? this.properties.listFields : LIST_DEFAULTS;
    const modalFields = (this.properties.modalFields && this.properties.modalFields.length > 0)
      ? this.properties.modalFields : MODAL_DEFAULTS;

    const rawConfig: Partial<DirectoryConfig> = {
      defaultView: this.properties.defaultView || 'card',
      cardFields,
      listFields,
      modalFields,
      filters: this.getFiltersFromProperties(),
    };

    const config = useDirectoryConfig(rawConfig);

    ReactDom.render(
      React.createElement(DirectoryContainer, { context: this.context, config }),
      this.domElement,
    );
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('2.0');
  }

  private getFiltersFromProperties(): FilterField[] {
    const filters: FilterField[] = [];
    const count = this.properties.filterCount || 0;

    if (count >= 1 && this.properties.filterField1) {
      filters.push({ fieldName: this.properties.filterField1, label: this.properties.filterLabel1 || this.properties.filterField1 });
    }
    if (count >= 2 && this.properties.filterField2) {
      filters.push({ fieldName: this.properties.filterField2, label: this.properties.filterLabel2 || this.properties.filterField2 });
    }
    if (count >= 3 && this.properties.filterField3) {
      filters.push({ fieldName: this.properties.filterField3, label: this.properties.filterLabel3 || this.properties.filterField3 });
    }

    return filters;
  }

  private getCheckboxKey(targetProperty: string): { prefix: string; field: CardFieldName } | null {
    for (const prefix of ['cardField', 'listField', 'modalField']) {
      for (const f of [...CARD_FIELDS, ...LIST_FIELDS, ...MODAL_FIELDS]) {
        if (`${prefix}_${f.key}` === targetProperty) {
          return { prefix, field: f.key };
        }
      }
    }
    return null;
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any,
  ): void {
    const checkbox = this.getCheckboxKey(propertyPath);
    if (checkbox) {
      const { prefix, field } = checkbox;
      const propKey = prefix === 'cardField' ? 'cardFields' : prefix === 'listField' ? 'listFields' : 'modalFields';
      const currentArray: CardFieldName[] = (this.properties as any)[propKey] || [];

      if (newValue === true && !currentArray.includes(field)) {
        (this.properties as any)[propKey] = [...currentArray, field];
      } else if (newValue === false && currentArray.includes(field)) {
        (this.properties as any)[propKey] = currentArray.filter((f: CardFieldName) => f !== field);
      }
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.context.propertyPane.refresh();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const filterCount = this.properties.filterCount || 0;

    const filterGroupFields: any[] = [];

    for (let i = 1; i <= filterCount; i++) {
      filterGroupFields.push(
        PropertyPaneLabel(`filterSeparator${i}`, { text: `Filtre ${i}` }),
        PropertyPaneDropdown(`filterField${i}`, {
          label: 'Champ',
          options: AVAILABLE_FILTER_FIELDS,
          selectedKey: (this.properties as any)[`filterField${i}`] || '',
        }),
        PropertyPaneTextField(`filterLabel${i}`, {
          label: 'Libellé',
          value: (this.properties as any)[`filterLabel${i}`] || '',
        }),
        PropertyPaneButton(`removeFilter${i}`, {
          text: 'Supprimer',
          buttonType: PropertyPaneButtonType.Command,
          icon: 'Delete',
          onClick: () => {
            this.properties.filterCount = Math.max(0, filterCount - 1);
            this.context.propertyPane.refresh();
          },
        }),
      );
    }

    if (filterCount < 3) {
      filterGroupFields.push(
        PropertyPaneButton('addFilter', {
          text: 'Ajouter un filtre',
          buttonType: PropertyPaneButtonType.Command,
          icon: 'Add',
          onClick: () => {
            this.properties.filterCount = filterCount + 1;
            this.context.propertyPane.refresh();
          },
        }),
      );
    }

    const buildCheckboxes = (prefix: string, fields: { key: CardFieldName; text: string }[], defaults: CardFieldName[]) => {
      const propKey = prefix === 'cardField' ? 'cardFields' : prefix === 'listField' ? 'listFields' : 'modalFields';
      const currentArray: CardFieldName[] = (this.properties as any)[propKey];
      const effectiveArray: CardFieldName[] = (currentArray && currentArray.length > 0) ? currentArray : defaults;
      return fields.map((f) => {
        return PropertyPaneCheckbox(`${prefix}_${f.key}`, {
          text: f.text,
          checked: effectiveArray.includes(f.key),
          key: `${prefix}_${f.key}`,
        } as any);
      });
    };

    return {
      pages: [
        {
          header: { description: 'Paramètres généraux' },
          groups: [
            {
              groupName: 'Affichage',
              groupFields: [
                PropertyPaneDropdown('defaultView', {
                  label: 'Vue par défaut',
                  options: [
                    { key: 'card', text: 'Vue Carte' },
                    { key: 'list', text: 'Vue Liste' },
                  ],
                  selectedKey: this.properties.defaultView || 'card',
                }),
              ],
            },
            {
              groupName: 'Filtres',
              groupFields: filterGroupFields,
            },
          ],
        },
        {
          header: { description: 'Vue Carte' },
          groups: [
            {
              groupName: 'Champs affichés',
              groupFields: buildCheckboxes('cardField', CARD_FIELDS, CARD_DEFAULTS),
            },
          ],
        },
        {
          header: { description: 'Vue Liste' },
          groups: [
            {
              groupName: 'Champs affichés',
              groupFields: buildCheckboxes('listField', LIST_FIELDS, LIST_DEFAULTS),
            },
          ],
        },
        {
          header: { description: 'Vue Modale' },
          groups: [
            {
              groupName: 'Champs affichés',
              groupFields: buildCheckboxes('modalField', MODAL_FIELDS, MODAL_DEFAULTS),
            },
          ],
        },
      ],
    };
  }
}
