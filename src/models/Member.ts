export interface Member {
  id: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  email?: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  mobilePhone?: string;
  managerId?: string;
  managerDisplayName?: string;
  photoUrl?: string;
  isVisible: boolean;
  teamsId?: string;
}
