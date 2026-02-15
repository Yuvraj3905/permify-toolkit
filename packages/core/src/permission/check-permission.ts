export interface CheckPermissionParams {
  tenantId: string;
  metadata?: any;
  subject: { type: string; id: string };
  entity: { type: string; id: string };
  permission: string;
}

/**
 * Checks if a subject has permission on a specific entity.
 *
 * @param client - The Permify gRPC client
 * @param params - The permission check parameters
 * @returns true if access is allowed, false otherwise
 */
export async function checkPermission(
  client: any,
  params: CheckPermissionParams
): Promise<boolean> {
  const allowed = await client.permission.check(params);
  // CheckResult.ALLOWED is usually 1 in Permify gRPC
  return allowed.can === 1;
}
