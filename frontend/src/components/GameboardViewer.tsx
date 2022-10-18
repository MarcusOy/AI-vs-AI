import * as React from 'react'
import { useEffect, useRef } from 'react'
import useCanvas from '../hooks/useCanvas'

interface IPiece {
    isWhite: boolean
    number: number
    cellX: number
    cellY: number
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
}

interface IReplayViewerProps {
    type: 'Replay' | 'Interactive' | 'Non-interactive'
    size: number
}

const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw gameboard
    drawBoard(ctx, frameCount)

    // Draw pieces on the board
    drawPiece(ctx, frameCount, {
        isWhite: true,
        number: 4,
        cellX: 4,
        cellY: 1,
    })
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
        }
    }
}

const drawPiece = (ctx: CanvasRenderingContext2D, frameCount: number, options: IPiece) => {
    const canvasW = ctx.canvas.width
    const canvasH = ctx.canvas.height
    const cellSize = canvasW / 10

    const currentColors = options.isWhite ? GAME_COLORS.WHITE_PIECE : GAME_COLORS.BLACK_PIECE

    // save the previous translation context
    ctx.save()

    // move canvas to correct position
    const ml = 55
    const mt = 20
    const cell = 261
    ctx.scale(0.23, 0.23)
    ctx.translate(options.cellX * cell + ml, options.cellY * cell + mt)

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
    ctx.font = 'bold 120px Courier New'
    ctx.fillStyle = currentColors.TEXT
    ctx.textAlign = 'center'
    ctx.fillText(options.number.toString(), 73, 180)

    // restore the context before drawing piece
    ctx.restore()
}

const GameboardViewer = (props: IReplayViewerProps) => {
    const canvasRef = useCanvas({ draw })

    return <canvas width={props.size} height={props.size} ref={canvasRef} />
}

export default GameboardViewer
