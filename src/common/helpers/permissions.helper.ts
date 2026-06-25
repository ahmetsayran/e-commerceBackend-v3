export function hasPermission(
  userPermissions: string[],
  permission: string,
): boolean {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(
  userPermissions: string[],
  permissions: string[],
): boolean {
  return permissions.some((p) => userPermissions.includes(p));
}
