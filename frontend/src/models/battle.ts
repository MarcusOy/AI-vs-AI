/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { BattleStatus } from './battle-status';
import { Strategy } from './strategy';
import { BattleGame } from './battle-game';

export interface Battle extends BaseEntity {
    id: string;
    name: string;
    battleStatus: BattleStatus;
    isTestSubmission: boolean;
    iterations: number;
    attackerWins: number;
    defenderWins: number;
    attackingStrategySnapshot: string;
    defendingStrategySnapshot: string;
    attackingStrategyId: string;
    attackingStrategy: Strategy;
    defendingStrategyId: string;
    defendingStrategy: Strategy;
    battleGames: BattleGame[];
}
