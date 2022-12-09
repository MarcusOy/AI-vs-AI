/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { StarterCode } from './starter-code';
import { Strategy } from './strategy';
import { User } from './user';

export interface Game extends BaseEntity {
    id: number;
    name: string;
    shortDescription: string;
    longDescription: string;
    starterCode: StarterCode[];
    strategies: Strategy[];
    usersWhoFavorited: User[];
}
