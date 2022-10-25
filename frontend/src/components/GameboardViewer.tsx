import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import useCanvas from '../hooks/useCanvas'
import { Turn } from '../models/turn'
import { generateBoardFromTurns, IPiece, moveToTurn } from '../data/ChessBoard'
import { BOARD_SIZES } from '../pages/ReplayPage'

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

const ANIMATION_DURATION = 30

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

const GameboardViewer = (props: IGameboardViewerProps) => {
    const [pieceState, setPieceState] = useState<IPieceState>({
        prev: [],
        curr: [],
    })

    // update board when turn data changes
    useEffect(() => {
        const { pieces } = generateBoardFromTurns(props.turns)
        setPieceState({
            prev: [],
            curr: pieces,
        })
    }, [props.turns])

    // update board when turn changes
    useEffect(() => {
        // exchange entire board state out
        const { pieces: newPieces } = moveToTurn(props.turns, props.currentTurn)
        setPieceState({
            prev: pieceState.curr,
            curr: newPieces,
        })
    }, [props.currentTurn])

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        // Clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Draw gameboard
        drawBoard(ctx, frameCount)

        // Draw pieces on the board
        drawPieces(ctx, frameCount)
    }

    const drawPieces = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        for (let p = 0; p < pieceState.curr.length; p++) {
            const opts: IPiece = pieceState.curr[p]
            const [targetX, targetY] = rowColToXY(pieceState.curr[p].row, pieceState.curr[p].col)

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

    const canvasRef = useCanvas({ draw })

    console.log({ prev: pieceState.prev[35], curr: pieceState.curr[35] })

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
