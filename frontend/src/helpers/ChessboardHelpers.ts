import { BOARD_SIZES } from './../pages/ReplayPage'
import { IPiece } from '../data/ChessBoard'
import { ISelectedPiece } from '../components/GameboardViewer'

const WHITE: number = 0
const BLACK: number = 1
const NO_PIECE: number = -1

const WHITE_CHAR: string = 'w'
const BLACK_CHAR: string = 'b'

const BOARD_LENGTH: number = 10

export interface Point2D {
    x: number
    y: number
}
export interface Grid2D {
    col: number
    row: number
}

export const isPosOnPiece = (
    e: MouseEvent,
    pieces: IPiece[],
    pieceIndex: number,
    canvas: HTMLCanvasElement,
) => {
    return (
        scaleMousePos(e.offsetX, canvas) > pieces[pieceIndex].posX! &&
        scaleMousePos(e.offsetX, canvas) <
            pieces[pieceIndex].posX! + scaleMousePos(canvas.width / 10, canvas) &&
        scaleMousePos(e.offsetY, canvas) > pieces[pieceIndex].posY! &&
        scaleMousePos(e.offsetY, canvas) <
            pieces[pieceIndex].posY! + scaleMousePos(canvas.height / 10, canvas) &&
        !pieces[pieceIndex].isDead
    )
}

export const scaleMousePos = (i: number, canvas: HTMLCanvasElement) => {
    return i / (0.23 * (canvas.width / BOARD_SIZES.DEFAULT))
}

export const getValidMoves = (board: string[][], piece: ISelectedPiece): Grid2D[] => {
    const col: number = piece.col
    const row: number = piece.row
    const myColor: number = piece.isWhite ? 0 : 1
    const validMoves: Grid2D[] = []

    const moveDistance = piece.rank

    if (moveDistance <= 0) return validMoves

    for (let i = -moveDistance; i <= moveDistance; i += moveDistance) {
        for (let j = -moveDistance; j <= moveDistance; j += moveDistance) {
            const newCol = col + i
            const newRow = row + j

            if (isCellValid(newCol, newRow) && getPieceColor(board, newCol, newRow) != myColor) {
                const pieceColor = getPieceColor(board, col, row)
                // if (isPlayerInCheck(pieceColor) == TRUE && ((pieceColor == WHITE && row != 0) || (pieceColor == BLACK && row != 9)))
                //      continue;
                const columnInCheck = whichColumnIsPlayerInCheck(board, pieceColor)
                if (columnInCheck >= 0) {
                    const rowToCheck = pieceColor == WHITE ? 9 : 0
                    if (newCol != columnInCheck || newRow != rowToCheck) continue
                }
                validMoves.push({ col: newCol, row: newRow })
            }
        }
    }

    return validMoves
}

const isCellValid = (col: number, row: number): boolean => {
    return col >= 0 && col <= 9 && row >= 0 && row <= 9
}

const getCellValue = (board: string[][], col: number, row: number): string => {
    return board[col][row]
}

const getPieceColor = (board: string[][], col: number, row: number): number => {
    const cellVal = getCellValue(board, col, row)

    if (cellVal == '') return NO_PIECE

    const colorChar = cellVal.charAt(2)

    if (colorChar == WHITE_CHAR) return WHITE
    else if (colorChar == BLACK_CHAR) return BLACK
    else return NO_PIECE
}

const getPieceMoveDistance = (board: string[][], col: number, row: number): number => {
    const cellVal = getCellValue(board, col, row)

    if (getCellValue(board, col, row) == '') return 0

    return parseInt(cellVal.substring(3))
}

const whichColumnIsPlayerInCheck = (board: string[][], color: number) => {
    let rowToCheck = -1

    if (color == WHITE) rowToCheck = 9
    else if (color == BLACK) rowToCheck = 0
    else return rowToCheck

    for (let i = 0; i < BOARD_LENGTH; i++) {
        const opponentColor = color == WHITE ? BLACK : WHITE
        if (
            getPieceColor(board, i, rowToCheck) == opponentColor &&
            getPieceMoveDistance(board, i, rowToCheck) == 1
        )
            return i
    }

    return NO_PIECE
}

export const colAndRowToCell = (col: number, row: number): string => {
    const colChar: string = String.fromCharCode(col + 'A'.charCodeAt(0))
    const rowChar: string = row.toString()
    return colChar + rowChar
}

export const prettyPrintBoard = (board: string[][]): string => {
    let output = ''
    for (let row = 0; row < board.length; row++) {
        let outputRow = ''
        for (let col = 0; col < board[row].length; col++) {
            if (board[col][row] != '') outputRow += board[col][row] + ' '
            else outputRow += '---- '
        }
        output += outputRow + '\n\n'
    }
    return output
}
