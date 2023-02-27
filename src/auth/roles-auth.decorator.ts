import { SetMetadata } from "@nestjs/common";

// Define a constant to represent the metadata key for roles
export const ROLES_KEY = "roles";

// Define a decorator function that sets the metadata for roles
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
