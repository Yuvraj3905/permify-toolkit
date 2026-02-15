import { Reflector } from "@nestjs/core";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable, Inject, ForbiddenException, Logger } from "@nestjs/common";

import { PermifyService } from "./service.js";
import { PERMIFY_PERMISSION_KEY } from "./constant.js";

@Injectable()
export class PermifyGuard implements CanActivate {
  private readonly logger = new Logger(PermifyGuard.name);

  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(PermifyService) private readonly permifyService: PermifyService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<string>(
      PERMIFY_PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!permission) {
      return true;
    }

    const tenantId = await this.permifyService.resolveTenant(context);
    const subject = await this.permifyService.resolveSubject(context);
    const resource = await this.permifyService.resolveResource(context);

    if (!resource) {
      throw new ForbiddenException("Resource could not be resolved");
    }

    let resourceParam: { type: string; id: string };

    if (typeof resource === "string") {
      const [resourceType] = permission.split(".");
      if (!resourceType) {
        throw new ForbiddenException("Invalid permission format");
      }
      resourceParam = { type: resourceType, id: resource };
    } else {
      resourceParam = resource;
    }

    let subjectParam: { type: string; id: string };
    if (typeof subject === "string") {
      subjectParam = { type: "user", id: subject };
    } else {
      subjectParam = subject;
    }

    try {
      const allowed = await this.permifyService.checkPermission({
        tenantId,
        subject: {
          type: subjectParam.type,
          id: subjectParam.id
        },
        entity: {
          type: resourceParam.type,
          id: resourceParam.id
        },
        permission
      });

      return allowed;
    } catch (err) {
      this.logger.error("Permission check failed", err);
      throw new ForbiddenException();
    }
  }
}
