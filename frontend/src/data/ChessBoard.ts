import { Turn } from '../models/turn'

export const initialState = [
    ['b1', 'b1', '', '', '', '', '', '', 'w1', 'w3'],
    ['b3', 'b2', '', '', '', '', '', '', 'w2', 'w3'],
    ['b2', 'b2', '', '', '', '', '', '', 'w2', 'w2'],
    ['b1', 'b1', '', '', '', '', '', '', 'w1', 'w1'],
    ['b4', 'b1', '', '', '', '', '', '', 'w1', 'w4'],
    ['b4', 'b1', '', '', '', '', '', '', 'w1', 'w4'],
    ['b1', 'b1', '', '', '', '', '', '', 'w1', 'w1'],
    ['b2', 'b2', '', '', '', '', '', '', 'w2', 'w2'],
    ['b3', 'b2', '', '', '', '', '', '', 'w2', 'w3'],
    ['b3', 'b1', '', '', '', '', '', '', 'w1', 'w1'],
]

interface IChessBoardData {
    board: string[][]
    turnData: string[]
}

export const generateBoardFromTurns = (turns: Turn[]): IChessBoardData => {
    const board = new ChessBoard()
    board.pushTurns(turns)
    return { board: board.getBoard(), turnData: board.getTurnData() }
}

export const moveToTurn = (turns: Turn[], turn: number): IChessBoardData => {
    const board = new ChessBoard()
    board.pushTurns(turns.slice(0, turn))
    return { board: board.getBoard(), turnData: board.getTurnData() }
}

class ChessBoard {
    private board: string[][] = []
    private turnData: string[] = []
    constructor(board: string[][] = initialState, turnData: string[] = []) {
        this.board = JSON.parse(JSON.stringify(board))
        this.turnData = JSON.parse(JSON.stringify(turnData))
    }

    public pushTurn(t: Turn) {
        const turnData = t.turnData.split(', ')
        if (turnData.length != 2) return

        const [from, to] = turnData

        const oldCol = cellToCol(from)
        const oldRow = cellToRow(from)

        const newCol = cellToCol(to)
        const newRow = cellToRow(to)

        const attackingPiece = this.board[oldCol][oldRow]
        const defendingPiece = this.board[newCol][newRow]

        if (defendingPiece == '' || attackingPiece.charAt(1) > defendingPiece.charAt(1)) {
            // (regular movement) or (defender dies)
            this.board[newCol][newRow] = this.board[oldCol][oldRow]
            this.board[oldCol][oldRow] = ''
        } else if (attackingPiece.charAt(1) < defendingPiece.charAt(1)) {
            // defender defends itself, attacker dies
            this.board[oldCol][oldRow] = ''
        } else if (attackingPiece.charAt(1) == defendingPiece.charAt(1)) {
            // attacker and defender both die
            this.board[newCol][newRow] = ''
            this.board[oldCol][oldRow] = ''
        }
        this.turnData.push(t.turnData)
    }

    public pushTurns(ts: Turn[]) {
        ts.map((t) => this.pushTurn(t))
    }

    public getBoard(): string[][] {
        return this.board
    }
    public getTurnData(): string[] {
        return this.turnData
    }

    public reset() {
        this.board = initialState
        this.turnData = []
    }
}

export const cellToCol = (cell: string): number => {
    if (!isCellValid(cell)) throw Error(`Cell ${cell} is invalid.`)

    return cellToColChar(cell) - 'A'.charCodeAt(0)
}

export const cellToRow = (cell: string): number => {
    if (!isCellValid(cell)) throw Error(`Cell ${cell} is invalid.`)

    return parseInt(cell.substring(1))
}

export const isCellValid = (cell: string): boolean => {
    if (cell == null || cell.length != 2) return false

    const colChar = cell.charAt(0)
    const rowChar = cell.charAt(1)

    if (colChar < 'A' || colChar > 'J') return false

    if (rowChar < '0' || rowChar > '9') return false

    return true
}

export const cellToColChar = (cell: string): number => {
    return cell.charCodeAt(0)
}

export const cellToRowChar = (cell: string): number => {
    return cell.charCodeAt(1)
}

export default ChessBoard
