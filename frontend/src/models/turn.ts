/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { Battle } from './battle';
import { BattleGame } from './battle-game';

export interface Turn extends BaseEntity {
    turnNumber?: number;
    isAttackTurn?: boolean;
    turnData: string;
    printInfo?: string;
    linesExecuted?: string;
    battleId?: string;
    battle?: Battle;
    battleGameNumber?: number;
    battleGame?: BattleGame;
}
