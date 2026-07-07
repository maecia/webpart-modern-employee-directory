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
  'accountEnabled'
];

const PAGE_SIZE = 100;

export interface IGraphService {
  getMembers(): Promise<Member[]>;
  getMemberPhoto(userId: string): Promise<string | null>;
  dispose(): void;
}

export class GraphService implements IGraphService {
  private graph: GraphFI;
  private photoUrls: string[] = [];

  constructor(context: WebPartContext) {
    this.graph = graphfi().using(GraphSPFx(context));
  }

  async getMembers(): Promise<Member[]> {
    const allUsers: any[] = [];
    const rawUsers = this.graph.users
      .select(...SELECT_FIELDS)
      .expand('manager($select=id,displayName)')
      .filter("accountEnabled eq true and userType eq 'Member'")
      .top(PAGE_SIZE);

    for await (const page of (rawUsers as any)) {
      allUsers.push(...page);
    }

    const members: Member[] = [];

    for (const user of allUsers) {
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
        teamsId: user.userPrincipalName || undefined
      });
    }

    return members;
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
