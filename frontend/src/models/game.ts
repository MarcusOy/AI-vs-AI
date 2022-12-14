/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { Strategy } from './strategy';
import { User } from './user';

export interface Game extends BaseEntity {
    id: number;
    name: string;
    shortDescription: string;
    longDescription: string;
    boilerplateCode: string;
    helperCode: string;
    strategies: Strategy[];
    usersWhoFavorited: User[];
}
