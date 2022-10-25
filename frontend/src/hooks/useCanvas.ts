import { useRef, useEffect } from 'react'

interface IUseCanvasProps {
    draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void
}

const useCanvas = (props: IUseCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!
        let frameCount = 0
        let animationFrameId = 0

        console.log('Canvas rerender.')

        const render = () => {
            frameCount++
            props.draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [props.draw])

    return canvasRef
}

export default useCanvas
