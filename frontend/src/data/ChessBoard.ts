import { Turn } from '../models/turn'

const WHITE = 1
const BLACK = 0
const NO_PIECE = -1

const WHITE_CHAR = 'w'
const BLACK_CHAR = 'b'

export const initialState = [
    ['00b1', '01b1', '', '', '', '', '', '', '02w1', '03w3'],
    ['04b3', '05b2', '', '', '', '', '', '', '06w2', '07w3'],
    ['08b2', '09b2', '', '', '', '', '', '', '10w2', '11w2'],
    ['12b1', '13b1', '', '', '', '', '', '', '14w1', '15w1'],
    ['16b4', '17b1', '', '', '', '', '', '', '18w1', '19w4'],
    ['20b4', '21b1', '', '', '', '', '', '', '22w1', '23w4'],
    ['24b1', '25b1', '', '', '', '', '', '', '26w1', '27w1'],
    ['28b2', '29b2', '', '', '', '', '', '', '30w2', '31w2'],
    ['32b3', '33b2', '', '', '', '', '', '', '34w2', '35w3'],
    ['36b3', '37b1', '', '', '', '', '', '', '38w1', '39w1'],
]
export interface IPiece {
    id: number
    isWhite: boolean
    rank: number
    isDead: boolean

    col: number
    row: number

    posX?: number
    posY?: number

    opacity: number
}
export interface IChessBoardData {
    pieces: IPiece[]
    turnData: string[]
}

export const generateBoardFromTurns = (turns: Turn[]): IChessBoardData => {
    const board = new ChessBoard()
    board.pushTurns(turns)
    return { pieces: board.getPieces(), turnData: board.getTurnData() }
}

export const moveToTurn = (turns: Turn[], turn: number): IChessBoardData => {
    const board = new ChessBoard()
    board.pushTurns(turns.slice(0, turn))
    return { pieces: board.getPieces(), turnData: board.getTurnData() }
}

export const generatePieceListFromBoard = (
    state: string[][],
    prevPieceList: IPiece[],
): IChessBoardData => {
    const board = new ChessBoard(state)

    // copy opacity and pos from prevPieceList
    for (let i = 0; i < prevPieceList.length; i++) {
        const prevPiece: IPiece = prevPieceList[i]
        const curNewPiece: IPiece = board.getPieces()[i]

        if (curNewPiece.isDead) {
            curNewPiece.id = i
            curNewPiece.isWhite = prevPiece.isWhite
            if (curNewPiece.col < 0) {
                curNewPiece.col = prevPiece.col
                curNewPiece.row = prevPiece.row
            }
            curNewPiece.rank = prevPiece.rank
            curNewPiece.row = prevPiece.row
        }
    }

    return { pieces: board.getPieces(), turnData: board.getTurnData() }
}

class ChessBoard {
    private board: string[][]
    private turnData: string[] = []
    private pieces: IPiece[] = []
    constructor(board: string[][] = initialState) {
        // deep copy
        this.board = JSON.parse(JSON.stringify(board))
        this.turnData = []
        this.pieces = []

        // initialize pieceArray
        for (let i = 0; i < 40; i++) {
            this.pieces.push({
                id: i,
                isDead: true,
                rank: -1,
                isWhite: false,
                col: -1,
                row: -1,
                opacity: 0,
            })
        }

        for (let c = 0; c < this.board.length; c++) {
            for (let r = 0; r < this.board[c].length; r++) {
                if (this.board[c][r] != '') {
                    const curId = getPieceId(c, r, this.board)
                    this.pieces[curId] = {
                        id: curId,
                        rank: getPieceRank(c, r, this.board),
                        col: c,
                        row: r,
                        isWhite: !!getPieceColor(c, r, this.board),
                        isDead: false,
                        opacity: 1,
                    }
                }
            }
        }
    }

    public pushTurn(t: Turn) {
        const turnData = t.turnData.split(', ')
        if (turnData.length != 2) return

        const [from, to] = turnData

        const oldCol = cellToCol(from)
        const oldRow = cellToRow(from)

        const newCol = cellToCol(to)
        const newRow = cellToRow(to)

        const attackerString = this.board[oldCol][oldRow]
        const defenderString = this.board[newCol][newRow]

        const attackerPiece = this.pieces[getPieceId(oldCol, oldRow, this.board)]
        const defenderID = getPieceId(newCol, newRow, this.board)
        const defenderPiece = defenderID < 0 ? null : this.pieces[defenderID]

        // console.dir({ attackerString, defenderString, attackerPiece, defenderPiece, turnData })

        if (
            defenderString == '' ||
            getPieceRankFromString(attackerString) > getPieceRankFromString(defenderString)
        ) {
            // (regular movement) or (defender dies)

            // updates pieceList
            attackerPiece.col = newCol
            attackerPiece.row = newRow
            if (defenderPiece != null) defenderPiece.isDead = true

            // updates board
            this.board[newCol][newRow] = this.board[oldCol][oldRow]
            this.board[oldCol][oldRow] = ''
        } else if (
            getPieceRankFromString(attackerString) < getPieceRankFromString(defenderString)
        ) {
            // defender defends itself, attacker dies

            // updates pieceList
            attackerPiece.col = newCol
            attackerPiece.row = newRow
            attackerPiece.isDead = true

            // updates board
            this.board[oldCol][oldRow] = ''
        } else if (
            getPieceRankFromString(attackerString) == getPieceRankFromString(defenderString)
        ) {
            // attacker and defender both die

            // updates pieceList
            attackerPiece.col = newCol
            attackerPiece.row = newRow
            attackerPiece.isDead = true
            if (defenderPiece != null) defenderPiece.isDead = true

            // updates board
            this.board[newCol][newRow] = ''
            this.board[oldCol][oldRow] = ''
        }
        this.turnData.push(t.turnData)
    }

    public pushTurns(ts: Turn[]) {
        ts.map((t) => this.pushTurn(t))
    }

    public getPieces(): IPiece[] {
        return this.pieces
    }
    public getTurnData(): string[] {
        return this.turnData
    }
    public getBoard(): string[][] {
        return this.board
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

function getPieceColor(col: number, row: number, board: string[][]): number {
    if (board[col][row] == '') return NO_PIECE

    const cellVal = board[col][row]
    const colorChar = cellVal.charAt(2)

    let returnColor
    if (colorChar == WHITE_CHAR) returnColor = WHITE
    else if (colorChar == BLACK_CHAR) returnColor = BLACK
    else returnColor = NO_PIECE

    return returnColor
}

function getPieceRank(col: number, row: number, board: string[][]): number {
    if (board[col][row] == '') return 0

    const cellVal = board[col][row]

    return getPieceRankFromString(cellVal)
}

function getPieceRankFromString(pieceString: string): number {
    if (pieceString == '') return 0

    return parseInt(pieceString.substring(3))
}

function getPieceId(col: number, row: number, board: string[][]): number {
    if (board[col][row] == '') return -1

    const cellVal = board[col][row]

    return parseInt(cellVal.substring(0, 2))
}

export default ChessBoard
