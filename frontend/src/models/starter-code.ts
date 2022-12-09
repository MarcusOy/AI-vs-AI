/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BaseEntity } from './base-entity';
import { StarterCodeType } from './starter-code-type';
import { ProgrammingLanguage } from './programming-language';
import { Game } from './game';

export interface StarterCode extends BaseEntity {
    type: StarterCodeType;
    language: ProgrammingLanguage;
    code: string;
    gameId: number;
    game: Game;
}
