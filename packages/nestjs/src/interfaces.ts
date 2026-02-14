import type { PermifyClientOptions } from "@permify-toolkit/core";
import type { ExecutionContext, ModuleMetadata, Type } from "@nestjs/common";

export interface PermifySubject {
  type: string;
  id: string;
}

export type TenantResolver = (
  context: ExecutionContext
) => string | Promise<string>;

export type SubjectResolver = (
  context: ExecutionContext
) => string | PermifySubject | Promise<string | PermifySubject>;

export interface PermifyResolvers {
  tenant: TenantResolver;
  subject?: SubjectResolver;
}

export interface PermifyModuleOptions {
  client: PermifyClientOptions;
  resolvers: PermifyResolvers;
}

export interface PermifyModuleOptionsFactory {
  createPermifyOptions(): Promise<PermifyModuleOptions> | PermifyModuleOptions;
}

export interface PermifyModuleAsyncOptions extends Pick<
  ModuleMetadata,
  "imports"
> {
  useExisting?: Type<PermifyModuleOptionsFactory>;
  useClass?: Type<PermifyModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PermifyModuleOptions> | PermifyModuleOptions;
  inject?: any[];
}
