/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { User } from './user';

export interface BugReport extends BaseEntity {
    id?: string;
    description: string;
    regarding: string;
    createdByUserId?: string;
    createdByUser?: User;
}
