// src/common/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enum/roles.enum';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
