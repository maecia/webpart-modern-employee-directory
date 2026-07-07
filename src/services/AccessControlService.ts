import { spfi, SPFI, SPFx as SpSPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/site-groups/web';
import '@pnp/sp/site-users/web';
import '@pnp/sp/security/web';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface AccessControl {
  hasAccess: boolean;
  userGroups: string[];
}

export interface IAccessControlService {
  checkAccess(groupId: number | null): Promise<AccessControl>;
}

export class AccessControlService implements IAccessControlService {
  private sp: SPFI;

  constructor(context: WebPartContext) {
    this.sp = spfi().using(SpSPFx(context));
  }

  async checkAccess(groupId: number | null): Promise<AccessControl> {
    const userGroups = await this.sp.web.currentUser.groups();

    if (groupId === null || groupId === undefined) {
      return { hasAccess: true, userGroups: userGroups.map(g => g.Title) };
    }

    const hasAccess = userGroups.some(g => g.Id === groupId);
    return { hasAccess, userGroups: userGroups.map(g => g.Title) };
  }
}
