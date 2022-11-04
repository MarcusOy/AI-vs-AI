/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { Strategy } from './strategy';
import { BugReport } from './bug-report';
import { Game } from './game';

export interface User extends BaseEntity {
    id?: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    salt: string;
    bio: string;
    active: boolean;
    strategies: Strategy[];
    bugReports: BugReport[];
    favoriteGameId: number;
    favoriteGame: Game;
}
