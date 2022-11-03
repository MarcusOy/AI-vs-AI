import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import useCanvas from '../hooks/useCanvas'
import { Turn } from '../models/turn'
import ChessBoard, {
    generateBoardFromTurns,
    generatePieceListFromBoard,
    getNewlyDeadPieces,
    initialState,
    IPiece,
    moveToTurn,
} from '../data/ChessBoard'
import { BOARD_SIZES } from '../pages/ReplayPage'
import {
    getValidMoves,
    Grid2D,
    isPosOnPiece,
    Point2D,
    scaleMousePos,
    colAndRowToCell,
    prettyPrintBoard,
} from '../helpers/ChessboardHelpers'

export const GAME_COLORS = {
    WHITE_PIECE: {
        FILL: '#FFF',
        STROKE: '#000',
        TEXT: '#000',
    },
    BLACK_PIECE: {
        FILL: '#363636',
        STROKE: '#000',
        TEXT: '#FFF',
    },
    LIGHT_CELL: '#C3C3C3',
    DARK_CELL: '#6E6E6E',
    HELPER_TEXT: '#111',
}

const ANIMATION_DURATION = 30

type GameboardViewerType = 'Replay' | 'Interactive' | 'Non-interactive'
interface IGameboardViewerProps {
    type: GameboardViewerType
    size: number
    turns?: Turn[]
    board?: string[][]
    currentTurn?: number
    onBoardChange?: (newBoard: string[][]) => void
}

const drawBoard = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const canvasW = ctx.canvas.width
    const canvasH = ctx.canvas.height
    const cellSize = canvasW / 10

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            // pick the color based on position
            const cellColorOffset = y % 2
            const cellColor =
                (x + cellColorOffset) % 2 == 0 ? GAME_COLORS.LIGHT_CELL : GAME_COLORS.DARK_CELL

            // fill the cell
            ctx.fillStyle = cellColor
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)

            // show cell coords (if canvas is big enough)
            if (ctx.canvas.width < 500) continue

            // show col letter if on first row AND
            // show row number if on first col
            let cellHelper = ''
            if (y == 0) cellHelper += String.fromCharCode('A'.charCodeAt(0) + x)
            if (x == 0) cellHelper += y.toString()

            // calculate letter height for proper layout
            const letterMetrics = ctx.measureText(cellHelper)
            const letterHeight =
                letterMetrics.actualBoundingBoxAscent + letterMetrics.actualBoundingBoxDescent

            // draw helper cell text
            ctx.font = `bold ${12 * (ctx.canvas.width / BOARD_SIZES.DEFAULT)}px Courier New`
            ctx.fillStyle = GAME_COLORS.HELPER_TEXT
            ctx.textAlign = 'left'
            ctx.fillText(cellHelper, x * cellSize + 2, y * cellSize + letterHeight + 2)
        }
    }
}

const drawPiece = (ctx: CanvasRenderingContext2D, frameCount: number, options: IPiece) => {
    const canvasW = ctx.canvas.width
    const canvasH = ctx.canvas.height

    const currentColors = options.isWhite ? GAME_COLORS.WHITE_PIECE : GAME_COLORS.BLACK_PIECE

    // save the previous translation context
    ctx.save()

    // set opacity based on if a piece is alive
    ctx.globalAlpha = options.opacity

    // scale canvas to fit piece in cell
    ctx.scale(0.23 * (canvasW / BOARD_SIZES.DEFAULT), 0.23 * (canvasH / BOARD_SIZES.DEFAULT))

    // move canvas to correct position
    // for animation rendering
    if (options.posX != undefined && options.posY != undefined)
        ctx.translate(options.posX, options.posY)

    // stroke piece
    const path = new Path2D(
        `M78.379,190.031H.074C-2.253,93.492,51.411,95.1,51.411,95.1S21.619,85.943,
        22.1,62.716c.888-19.454,8.391-30.133,29.315-32.214C47.586,2.491,68.589.187,
        73.072.013V0s.146,0,.414,0S73.9,0,73.9,0V.013C78.385.187,99.388,2.491,95.563,
        30.5c20.925,2.08,28.428,12.76,29.315,32.214C125.354,85.943,95.563,95.1,95.563,
        95.1s53.664-1.611,51.337,94.928Z`,
    )
    ctx.strokeStyle = currentColors.STROKE
    ctx.lineWidth = 25
    ctx.lineJoin = 'miter'
    ctx.stroke(path)

    // fill piece
    ctx.fillStyle = currentColors.FILL
    ctx.fill(path)

    // stroke bottom line
    ctx.lineWidth = 20
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-20, 220)
    ctx.lineTo(170, 220)
    ctx.stroke()

    // add piece number
    if (ctx.canvas.width >= 500) {
        ctx.font = 'bold 130px Courier New'
        ctx.fillStyle = currentColors.TEXT
        ctx.textAlign = 'center'
        ctx.fillText(options.rank.toString(), 73, 180)
    }

    // restore the context before drawing piece
    ctx.globalAlpha = 1
    ctx.restore()
}

function easeOutQuintPos(
    oldX: number,
    oldY: number,
    newX: number,
    newY: number,
    t: number,
): number[] {
    // Clamp time ratio
    if (t < 0) t = 0
    if (t > 1) t = 1

    const pow = 1 - Math.pow(1 - t, 5)
    const x = (newX - oldX) * pow + oldX
    const y = (newY - oldY) * pow + oldY
    return [x, y]
}

function easeInQuint(oldX: number, newX: number, t: number): number {
    // Clamp time ratio
    if (t < 0) t = 0
    if (t > 1) t = 1

    const pow = Math.pow(t, 5)
    const x = (newX - oldX) * pow + oldX
    return x
}

interface IPieceState {
    prev: IPiece[]
    curr: IPiece[]
}
export interface ISelectedPiece extends IPiece {
    offset: Point2D
    startPos: Point2D
    validMoves: Grid2D[]
}
const GameboardViewer = (props: IGameboardViewerProps) => {
    const state = useRef<IPieceState>({
        prev: [],
        curr: [],
    })
    const boardRef = useRef<string[][]>(initialState)
    const typeRef = useRef<GameboardViewerType>(props.type)
    const selectedPiece = useRef<ISelectedPiece | null>(null)
    const [updateCounter, setUpdateCounter] = useState(0)

    // board shadow state tracked in ref (cuz eventlisteners)
    useEffect(() => {
        if (props.board) boardRef.current = props.board
    }, [props.board])
    // type shadow state tracked in ref (cuz eventlisteners)
    useEffect(() => {
        if (props.type) typeRef.current = props.type
    }, [props.type])

    // disable interactivity if not interactive
    useEffect(() => {
        if (props.type == 'Interactive') {
            canvasRef.current?.addEventListener('mousedown', onMouseDown, false)
            canvasRef.current?.addEventListener('mousemove', onMouseMove, false)
            canvasRef.current?.addEventListener('mouseup', onMouseUp, false)
        }
    }, [])

    // update board when turn data changes
    useEffect(() => {
        if (props.turns != undefined) {
            // turn mode
            const { pieces } = generateBoardFromTurns(props.turns)
            state.current = {
                prev: [],
                curr: pieces,
            }
        }
        // else if (props.board != undefined) {
        //     // board mode
        //     const { pieces } = generatePieceListFromBoard(props.board, false)
        //     state.current = {
        //         prev: [],
        //         curr: pieces,
        //     }
        // }
    }, [props.turns])

    // update board when turn changes
    useEffect(() => {
        // only execute this function if turn mode is used
        if (props.turns == undefined || props.currentTurn == undefined) return
        // exchange entire board state out
        const { pieces: newPieces } = moveToTurn(props.turns, props.currentTurn)
        state.current = {
            prev: state.current.curr,
            curr: newPieces,
        }
    }, [props.currentTurn])

    // update board when board state changes
    useEffect(() => {
        // only execute this function if board mode is used
        if (props.board == undefined) return
        // exchange entire board state out
        const { pieces: newPieces } = generatePieceListFromBoard(props.board, state.current.curr)

        state.current = {
            prev: state.current.curr,
            curr: newPieces,
        }
    }, [props.board])

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        // prepare canvas for next frame
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // draw gameboard
        drawBoard(ctx, frameCount)

        // draw pieces on the board
        drawPieces(ctx, frameCount)
    }

    const drawPieces = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        const pieceState = state.current
        for (let p = 0; p < pieceState.curr.length; p++) {
            const opts: IPiece = pieceState.curr[p]
            const [targetX, targetY] = rowColToXY(pieceState.curr[p].row, pieceState.curr[p].col)

            // if current piece is being moved
            if (selectedPiece.current != null && selectedPiece.current.id == opts.id) {
                drawPiece(ctx, frameCount, selectedPiece.current)

                for (let i = 0; i < selectedPiece.current.validMoves.length; i++) {
                    const helper = selectedPiece.current.validMoves[i]
                    ctx.globalAlpha = 0.5
                    ctx.fillStyle = '#ffff5b'
                    ctx.beginPath()
                    ctx.arc(
                        (helper.col * ctx.canvas.width) / 10 + ctx.canvas.width / 20,
                        (helper.row * ctx.canvas.height) / 10 + ctx.canvas.height / 20,
                        scaleMousePos(8, canvasRef.current!),
                        0,
                        2 * Math.PI,
                    )
                    ctx.fill()
                    ctx.globalAlpha = 1
                }

                continue
            }

            // if previous state is not stored, snap to new state
            if (pieceState.prev.length <= 0) {
                opts.posX = targetX
                opts.posY = targetY
                opts.opacity = 1
                drawPiece(ctx, frameCount, opts)

                continue
            }

            // else, perform interpolation of positions and opacity
            const [sourceX, sourceY] = rowColToXY(pieceState.prev[p].row, pieceState.prev[p].col)
            const [x, y] = easeOutQuintPos(
                sourceX,
                sourceY,
                targetX,
                targetY,
                (frameCount - 0) / ANIMATION_DURATION,
            )
            opts.posX = x
            opts.posY = y
            opts.opacity = easeInQuint(
                pieceState.prev[p].isDead ? 0 : 1,
                pieceState.curr[p].isDead ? 0 : 1,
                (frameCount - 0) / ANIMATION_DURATION,
            )

            drawPiece(ctx, frameCount, opts)
        }
    }

    const onMouseDown = (e: MouseEvent) => {
        if (typeRef.current != 'Interactive') return

        selectedPiece.current = getSelectedPiece(e) as ISelectedPiece

        if (selectedPiece.current != null) {
            // set mouse offset for better dragging
            selectedPiece.current.offset = {
                x: scaleMousePos(e.offsetX, canvasRef.current!) - selectedPiece.current.posX!,
                y: scaleMousePos(e.offsetY, canvasRef.current!) - selectedPiece.current.posY!,
            }
            // save original position for snapping on invalid move
            selectedPiece.current.startPos = {
                x: selectedPiece.current.posX!,
                y: selectedPiece.current.posY!,
            }
            // determine valid moves for move helpers
            selectedPiece.current.validMoves = getValidMoves(
                boardRef.current!,
                selectedPiece.current,
            )
        }
    }
    const onMouseMove = (e: MouseEvent) => {
        if (selectedPiece.current != null) {
            selectedPiece.current.posX =
                scaleMousePos(e.offsetX, canvasRef.current!) - selectedPiece.current.offset.x
            selectedPiece.current.posY =
                scaleMousePos(e.offsetY, canvasRef.current!) - selectedPiece.current.offset.y
        }
    }
    const onMouseUp = (e: MouseEvent) => {
        const cellMouseIsIn: Grid2D = mousePosToCell(e)

        if (selectedPiece.current != null && props.board != null) {
            // ensures that mousePosToCell is a valid move
            for (let i = 0; i < selectedPiece.current?.validMoves.length; i++) {
                const curValidCell = selectedPiece.current.validMoves[i]

                // snaps to new cell if new cell is valid
                if (
                    cellMouseIsIn.row == curValidCell.row &&
                    cellMouseIsIn.col == curValidCell.col
                ) {
                    // create Chessboard from current state and
                    // create turnData move string and push new turn
                    const newChessBoard = new ChessBoard(boardRef.current)
                    const fromString = colAndRowToCell(
                        selectedPiece.current.col,
                        selectedPiece.current.row,
                    )
                    const toString = colAndRowToCell(cellMouseIsIn.col, cellMouseIsIn.row)
                    newChessBoard.pushTurn({ turnData: `${fromString}, ${toString}` })

                    // deselect selected piece
                    selectedPiece.current = null

                    // Execute onBoardChange callback if not null
                    if (props.onBoardChange) props.onBoardChange(newChessBoard.getBoard())
                    break
                }
            }
        }

        selectedPiece.current = null
    }

    const getSelectedPiece = (e: MouseEvent) => {
        const pieces = state.current.curr
        for (let p = 0; p < state.current.curr.length; p++) {
            if (isPosOnPiece(e, pieces, p, canvasRef.current!) && pieces[p].isWhite) {
                return pieces[p]
            }
        }
        return null
    }

    const mousePosToCell = (e: MouseEvent): Grid2D => {
        let cellCol: number = -1
        let cellRow: number = -1

        if (canvasRef.current != null) {
            const cellSize: number = canvasRef.current?.width / 10

            cellCol = Math.floor(e.offsetX / cellSize)
            cellRow = Math.floor(e.offsetY / cellSize)
        }

        return {
            col: cellCol,
            row: cellRow,
        }
    }

    const canvasRef = useCanvas({ draw })

    return <canvas width={props.size} height={props.size} ref={canvasRef} />
}

export const rowColToXY = (row: number, col: number): number[] => {
    const ml = 55
    const mt = 20
    const cell = 261

    const x = col * cell + ml
    const y = row * cell + mt

    return [x, y]
}

export default React.memo(GameboardViewer)
