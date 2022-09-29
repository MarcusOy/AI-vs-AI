/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { Battle } from './battle';
import { Turn } from './turn';

export interface BattleGame extends BaseEntity {
    gameNumber: number;
    didAttackerWin: boolean;
    battleId: string;
    battle: Battle;
    turns: Turn[];
}
