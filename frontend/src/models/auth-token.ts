/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { User } from './user';

export interface AuthToken extends BaseEntity {
    id: string;
    type: string;
    token: string;
    expiresOn: Date;
    isExpired: boolean;
    revokedOn: Date;
    isActive: boolean;
    userId: string;
    user: User;
    replacedByTokenId: string;
    replacedByToken: AuthToken;
}
