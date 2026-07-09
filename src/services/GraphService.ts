import { graphfi, GraphFI, SPFx as GraphSPFx } from '@pnp/graph';
import '@pnp/graph/users';
import '@pnp/graph/photos';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Member } from '../models/Member';

const SELECT_FIELDS = [
  'id',
  'displayName',
  'givenName',
  'surname',
  'mail',
  'userPrincipalName',
  'jobTitle',
  'department',
  'officeLocation',
  'mobilePhone',
  'userType',
  'accountEnabled',
  'onPremisesExtensionAttributes',
];

const PAGE_SIZE = 100;

const DATE_FIELDS = new Set([
  'birthday',
  'employeeHireDate',
  'hireDate',
  'employeeLeaveDateTime',
  'createdDateTime',
  'lastPasswordChangeDateTime',
]);

function formatValue(key: string, v: any): string {
  if (v === undefined || v === null) return '';
  if (Array.isArray(v)) return v.filter(Boolean).join(', ');
  const s = String(v);
  if (DATE_FIELDS.has(key) && s) {
    const d = new Date(s);
    if (!isNaN(d.getTime()) && d.getFullYear() > 1900) {
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return '';
  }
  return s;
}

export interface IGraphService {
  getMembers(customFieldKeys?: string[]): Promise<{ members: Member[]; detectedExtensionAttrs: string[] }>;
  getMemberPhoto(userId: string): Promise<string | null>;
  dispose(): void;
}

export class GraphService implements IGraphService {
  private graph: GraphFI;
  private photoUrls: string[] = [];

  constructor(context: WebPartContext) {
    this.graph = graphfi().using(GraphSPFx(context));
  }

  async getMembers(customFieldKeys: string[] = []): Promise<{ members: Member[]; detectedExtensionAttrs: string[] }> {
    const allUsers: any[] = [];

    const rawUsers = this.graph.users
      .select(...SELECT_FIELDS)
      .expand('manager($select=id,displayName)')
      .filter("accountEnabled eq true and userType eq 'Member'")
      .top(PAGE_SIZE);

    for await (const page of (rawUsers as any)) {
      allUsers.push(...page);
    }

    let customDataMap: Record<string, Record<string, string>> = {};

    if (customFieldKeys.length > 0) {
      customDataMap = await this.fetchCustomProperties(allUsers, customFieldKeys);
    }

    const detectedExtAttrs = new Set<string>();
    for (const user of allUsers) {
      if (user.onPremisesExtensionAttributes) {
        for (let i = 1; i <= 15; i++) {
          const v = user.onPremisesExtensionAttributes[`extensionAttribute${i}`];
          if (v !== null && v !== undefined && v !== '') {
            detectedExtAttrs.add(`extensionAttribute${i}`);
          }
        }
      }
    }

    const members: Member[] = [];

    for (const user of allUsers) {
      const cp = customDataMap[user.id] || {};

      members.push({
        id: user.id || '',
        displayName: user.displayName || '',
        givenName: user.givenName || '',
        surname: user.surname || '',
        email: user.mail || user.userPrincipalName || '',
        jobTitle: user.jobTitle || '',
        department: user.department || '',
        officeLocation: user.officeLocation || '',
        mobilePhone: user.mobilePhone || '',
        managerId: (user.manager as any)?.id || undefined,
        managerDisplayName: (user.manager as any)?.displayName || undefined,
        isVisible: true,
        teamsId: user.userPrincipalName || undefined,
        customProperties: cp,
      });
    }

    return { members, detectedExtensionAttrs: Array.from(detectedExtAttrs).sort() };
  }

  private async fetchCustomProperties(
    users: any[],
    customFieldKeys: string[],
  ): Promise<Record<string, Record<string, string>>> {
    const result: Record<string, Record<string, string>> = {};

    const selectFields: string[] = [];
    for (const key of customFieldKeys) {
      if (key === 'division' || key === 'costCenter') {
        if (!selectFields.includes('employeeOrgData')) selectFields.push('employeeOrgData');
      } else if (key.startsWith('extensionAttribute')) {
        if (!selectFields.includes('onPremisesExtensionAttributes')) selectFields.push('onPremisesExtensionAttributes');
      } else {
        if (!selectFields.includes(key)) selectFields.push(key);
      }
    }

    const CONCURRENCY = 10;
    for (let i = 0; i < users.length; i += CONCURRENCY) {
      const chunk = users.slice(i, i + CONCURRENCY);
      const promises = chunk.map(async (user) => {
        if (!user.id) return;
        try {
          const detail = await this.graph.users.getById(user.id).select(...selectFields)();
          const cp: Record<string, string> = {};
          for (const key of customFieldKeys) {
            let v: any;
            if (key === 'division') {
              v = detail.employeeOrgData?.division;
            } else if (key === 'costCenter') {
              v = detail.employeeOrgData?.costCenter;
            } else if (key.startsWith('extensionAttribute')) {
              v = detail.onPremisesExtensionAttributes?.[key];
            } else {
              v = detail[key];
            }
            if (v !== undefined && v !== null) {
              cp[key] = formatValue(key, v);
            }
          }
          if (Object.keys(cp).length > 0) {
            result[user.id] = cp;
          }
        } catch {
          // silently skip individual errors
        }
      });
      await Promise.all(promises);
    }

    return result;
  }

  async getMemberPhoto(userId: string): Promise<string | null> {
    try {
      const blob = await this.graph.users.getById(userId).photo.getBlob();
      const url = URL.createObjectURL(blob);
      this.photoUrls.push(url);
      return url;
    } catch {
      return null;
    }
  }

  dispose(): void {
    this.photoUrls.forEach(url => URL.revokeObjectURL(url));
    this.photoUrls = [];
  }
}
