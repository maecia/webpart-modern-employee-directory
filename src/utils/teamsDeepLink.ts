export function getTeamsDeepLink(userPrincipalName: string): string {
  return `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(userPrincipalName)}`;
}
