
export interface User extends BaseEntity {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    strategies: Strategy[];
    bugReports: BugReport[];
}
export interface BattleGame extends BaseEntity {
    gameNumber: number;
    didAttackerWin: boolean;
    battleId: string;
    battle: Battle;
    turns: Turn[];
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseEntity {}

export interface Strategy extends BaseEntity {
    id: string;
    name: string;
    sourceCode: string;
    status: StrategyStatus;
    version: number;
    createdByUserId: string;
    createdByUser: User;
    gameId: number;
    game: Game;
    attackerBattles: Battle[];
    defenderBattles: Battle[];
}

export enum StrategyStatus {
    Draft = 0,
    Active = 1,
    Prototype = 2,
    InActive = -1
}

export interface Game extends BaseEntity {
    id: number;
    name: string;
    shortDescription: string;
    longDescription: string;
    boilerplateCode: string;
    strategies: Strategy[];
}

export interface BugReport extends BaseEntity {
    id: string;
    description: string;
    regarding: string;
    createdByUserId: string;
    createdByUser: User;
}

export interface Battle extends BaseEntity {
    id: string;
    name: string;
    battleStatus: BattleStatus;
    iterations: number;
    attackerWins: number;
    defenderWins: number;
    stackTrace: string;
    attackingStrategyId: string;
    attackingStrategy: Strategy;
    defendingStrategyId: string;
    defendingStrategy: Strategy;
    battleGames: BattleGame[];
}

export enum BattleStatus {
    Pending = 0,
    Success = 1,
    Fail = -1
}

export interface Turn extends BaseEntity {
    turnNumber: number;
    isAttackTurn: boolean;
    turnData: string;
    battleId: string;
    battle: Battle;
    battleGameNumber: number;
    battleGame: BattleGame;
}