import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import useCanvas from '../hooks/useCanvas'
import { Turn } from '../models/turn'
import ChessBoard, {
    cellToCol,
    cellToRow,
    generateBoardFromTurns,
    moveToTurn,
} from '../data/ChessBoard'
import { BOARD_SIZES } from '../pages/ReplayPage'

interface IPiece {
    isWhite: boolean
    number: number
    cellX?: number
    cellY?: number

    posX?: number
    posY?: number
}

const GAME_COLORS = {
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

const ANIMATION_DURATION = 60

interface IGameboardViewerProps {
    type: 'Replay' | 'Interactive' | 'Non-interactive'
    size: number
    turns: Turn[]
    currentTurn: number
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

    // const pow = 1 - Math.pow(1 - t, 5)
    const pow = t
    const x = (newX - oldX) * pow + oldX
    const y = (newY - oldY) * pow + oldY
    return [x, y]
}

const GameboardViewer = (props: IGameboardViewerProps) => {
    const [board, setBoard] = useState<string[][]>([])
    const [turnData, setTurnData] = useState<string[]>([])
    const [prevTurn, setPrevTurn] = useState(0)

    // animation state
    const [isAnimating, setIsAnimating] = useState(false)
    const [movingPiece, setMovingPiece] = useState('')
    const [sourceCol, setSourceCol] = useState(-1)
    const [sourceRow, setSourceRow] = useState(-1)
    const [targetCol, setTargetCol] = useState(-1)
    const [targetRow, setTargetRow] = useState(-1)
    const [startFrame, setStartFrame] = useState(-1)
    const [endFrame, setEndFrame] = useState(-1)

    // update board when turn data changes
    useEffect(() => {
        const { board, turnData } = generateBoardFromTurns(props.turns)
        setBoard(board)
        setTurnData(turnData)
    }, [props.turns])

    // update board when turn changes
    useEffect(() => {
        // if move slider is moved by one turn
        if (props.currentTurn == prevTurn + 1) {
            // do piece move animation
            const turn = props.turns[props.currentTurn]
            const turnData = turn.turnData.split(', ')

            if (turnData.length != 2) return
            const [from, to] = turnData

            console.log({ from, to })

            setIsAnimating(true)
            setMovingPiece(from)
            setSourceCol(cellToCol(from))
            setSourceRow(cellToRow(from))
            setTargetCol(cellToCol(to))
            setTargetRow(cellToRow(to))
            setStartFrame(-1)
            setEndFrame(-1)

            console.log({ sourceCol, sourceRow, targetCol, targetRow })
        } else {
            // exchange entire board state out
            const { board, turnData } = moveToTurn(props.turns, props.currentTurn)
            setBoard(board)
            setTurnData(turnData)
        }
        setPrevTurn(props.currentTurn)
    }, [props.currentTurn])

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        // Clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Animation control
        if (isAnimating && startFrame == -1 && endFrame == -1) {
            setStartFrame(frameCount)
            setStartFrame(frameCount + ANIMATION_DURATION)
        }
        // if (isAnimating && frameCount >= endFrame) {
        //     setIsAnimating(false)
        //     setMovingPiece('')
        //     setSourceCol(-1)
        //     setSourceRow(-1)
        //     setTargetCol(-1)
        //     setTargetRow(-1)
        //     setStartFrame(-1)
        //     setEndFrame(-1)
        // }

        // Draw gameboard
        drawBoard(ctx, frameCount)

        // Draw pieces on the board
        drawPieces(ctx, frameCount, board)
    }

    const drawPieces = (ctx: CanvasRenderingContext2D, frameCount: number, board: string[][]) => {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const cell = board[col][row]
                if (cell.length != 2) continue

                const opts: IPiece = {
                    isWhite: cell[0].toLowerCase() == 'w',
                    number: Number.parseInt(cell[1]),
                }

                if (isAnimating && col == sourceCol && row == sourceRow) {
                    const [sourceX, sourceY] = rowColToXY(row, col)
                    const [targetX, targetY] = rowColToXY(targetRow, targetCol)
                    const [x, y] = easeOutQuintPos(
                        sourceX,
                        sourceY,
                        targetX,
                        targetY,
                        (frameCount - startFrame) / ANIMATION_DURATION,
                    )
                    // console.log({ x, y, sourceX, sourceY, targetX, targetY, frameCount })
                    opts.posX = x
                    opts.posY = y
                } else {
                    opts.cellX = col
                    opts.cellY = row
                }

                drawPiece(ctx, frameCount, opts)
            }
        }
    }

    const drawPiece = (ctx: CanvasRenderingContext2D, frameCount: number, options: IPiece) => {
        const canvasW = ctx.canvas.width
        const canvasH = ctx.canvas.height
        // const cellSize = canvasW / 10

        const currentColors = options.isWhite ? GAME_COLORS.WHITE_PIECE : GAME_COLORS.BLACK_PIECE

        // save the previous translation context
        ctx.save()

        // scale canvas to fit piece in cell
        ctx.scale(0.23 * (canvasW / BOARD_SIZES.DEFAULT), 0.23 * (canvasH / BOARD_SIZES.DEFAULT))

        // move canvas to correct position
        const ml = 55
        const mt = 20
        const cell = 261
        // for snap rendering
        if (options.cellX != undefined && options.cellY != undefined)
            ctx.translate(options.cellX * cell + ml, options.cellY * cell + mt)

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
            ctx.font = 'bold 120px Courier New'
            ctx.fillStyle = currentColors.TEXT
            ctx.textAlign = 'center'
            ctx.fillText(options.number.toString(), 73, 180)
        }

        // restore the context before drawing piece
        ctx.restore()
    }

    const canvasRef = useCanvas({ draw })

    return <canvas width={props.size} height={props.size} ref={canvasRef} />
}

export const rowColToXY = (row: number, col: number): number[] => {
    const ml = 55
    const mt = 20
    const cell = 261

    const x = row * cell + ml
    const y = col * cell + mt

    return [x, y]
}

export default GameboardViewer
