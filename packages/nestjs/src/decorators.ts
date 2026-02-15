import { SetMetadata } from "@nestjs/common";

import { PERMIFY_PERMISSION_KEY } from "./constant.js";

/**
 * Decorator to enforce Permify permission checks on a method or controller.
 *
 * @param permission - The permission to check (e.g., "document.view").
 */
export const CheckPermission = (permission: string) =>
  SetMetadata(PERMIFY_PERMISSION_KEY, permission);
