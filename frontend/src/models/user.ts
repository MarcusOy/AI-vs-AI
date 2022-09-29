/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { AuthToken } from './auth-token';
import { Strategy } from './strategy';
import { BugReport } from './bug-report';

export interface User extends BaseEntity {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    salt: string;
    active: boolean;
    tokens: AuthToken[];
    strategies: Strategy[];
    bugReports: BugReport[];
}
