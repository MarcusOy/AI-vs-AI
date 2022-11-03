/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { StrategyStatus } from './strategy-status';
import { User } from './user';
import { Game } from './game';
import { Battle } from './battle';

export interface Strategy extends BaseEntity {
    id?: string;
    name: string;
    sourceCode: string;
    status?: StrategyStatus;
    version?: number;
    isPrivate: boolean;
    createdByUserId?: string;
    createdByUser?: User;
    gameId?: number;
    game?: Game;
    attackerBattles?: Battle[];
    defenderBattles?: Battle[];
}
