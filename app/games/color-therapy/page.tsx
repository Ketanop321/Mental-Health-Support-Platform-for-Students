"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Download, Trash2, Undo, Redo } from "lucide-react"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

type DrawingMode = "brush" | "fill"
type DrawingAction = {
  type: "draw" | "fill"
  color: string
  points?: { x: number; y: number }[]
  size?: number
  fillX?: number
  fillY?: number
}

export default function ColorTherapyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [color, setColor] = useState("#6d28d9") // Default purple color
  const [brushSize, setBrushSize] = useState(10)
  const [isDrawing, setIsDrawing] = useState(false)
  const [mode, setMode] = useState<DrawingMode>("brush")
  const [actions, setActions] = useState<DrawingAction[]>([])
  const [redoActions, setRedoActions] = useState<DrawingAction[]>([])
  const [currentAction, setCurrentAction] = useState<DrawingAction | null>(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    setCtx(context)

    // Set canvas dimensions
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    // Fill with white background
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // Handle mouse events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width)
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height)

    if (mode === "brush") {
      ctx.beginPath()
      ctx.moveTo(x, y)
      setIsDrawing(true)
      setCurrentAction({
        type: "draw",
        color,
        points: [{ x, y }],
        size: brushSize,
      })
    } else if (mode === "fill") {
      floodFill(Math.floor(x), Math.floor(y), color)
      setActions([...actions, { type: "fill", color, fillX: Math.floor(x), fillY: Math.floor(y) }])
      setRedoActions([])
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current || mode !== "brush" || !currentAction) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width)
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height)

    ctx.lineTo(x, y)
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    // Update current action with new point
    setCurrentAction({
      ...currentAction,
      points: [...(currentAction.points || []), { x, y }],
    })
  }

  const endDrawing = () => {
    if (!isDrawing || !ctx || mode !== "brush" || !currentAction) return

    ctx.closePath()
    setIsDrawing(false)
    setActions([...actions, currentAction])
    setRedoActions([])
    setCurrentAction(null)
  }

  // Flood fill algorithm
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    if (!ctx || !canvasRef.current) return

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    const data = imageData.data

    // Get the color at the start position
    const startPos = (startY * canvasRef.current.width + startX) * 4
    const startR = data[startPos]
    const startG = data[startPos + 1]
    const startB = data[startPos + 2]
    const startA = data[startPos + 3]

    // Convert fill color from hex to RGBA
    const fillColorObj = hexToRgb(fillColor)
    if (!fillColorObj) return

    // If the start color is the same as the fill color, return
    if (startR === fillColorObj.r && startG === fillColorObj.g && startB === fillColorObj.b && startA === 255) {
      return
    }

    // Queue for flood fill
    const queue: [number, number][] = []
    queue.push([startX, startY])

    while (queue.length > 0) {
      const [x, y] = queue.shift()!
      const pos = (y * canvasRef.current.width + x) * 4

      // Check if this pixel is the start color
      if (data[pos] === startR && data[pos + 1] === startG && data[pos + 2] === startB && data[pos + 3] === startA) {
        // Set the pixel to the fill color
        data[pos] = fillColorObj.r
        data[pos + 1] = fillColorObj.g
        data[pos + 2] = fillColorObj.b
        data[pos + 3] = 255

        // Add neighboring pixels to the queue
        if (x > 0) queue.push([x - 1, y])
        if (x < canvasRef.current.width - 1) queue.push([x + 1, y])
        if (y > 0) queue.push([x, y - 1])
        if (y < canvasRef.current.height - 1) queue.push([x, y + 1])
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  // Undo last action
  const handleUndo = () => {
    if (actions.length === 0) return

    const lastAction = actions[actions.length - 1]
    const newActions = actions.slice(0, -1)
    setActions(newActions)
    setRedoActions([...redoActions, lastAction])

    // Redraw canvas
    redrawCanvas(newActions)
  }

  // Redo last undone action
  const handleRedo = () => {
    if (redoActions.length === 0) return

    const lastRedoAction = redoActions[redoActions.length - 1]
    const newRedoActions = redoActions.slice(0, -1)
    setActions([...actions, lastRedoAction])
    setRedoActions(newRedoActions)

    // Redraw canvas
    redrawCanvas([...actions, lastRedoAction])
  }

  // Clear canvas
  const handleClear = () => {
    if (!ctx || !canvasRef.current) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setActions([])
    setRedoActions([])
  }

  // Redraw canvas based on actions
  const redrawCanvas = (actionsToRedraw: DrawingAction[]) => {
    if (!ctx || !canvasRef.current) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Redraw all actions
    actionsToRedraw.forEach((action) => {
      if (action.type === "draw" && action.points && action.points.length > 0) {
        ctx.beginPath()
        ctx.moveTo(action.points[0].x, action.points[0].y)
        ctx.strokeStyle = action.color
        ctx.lineWidth = action.size || 5
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        for (let i = 1; i < action.points.length; i++) {
          ctx.lineTo(action.points[i].x, action.points[i].y)
        }
        ctx.stroke()
        ctx.closePath()
      } else if (action.type === "fill" && action.fillX !== undefined && action.fillY !== undefined) {
        floodFill(action.fillX, action.fillY, action.color)
      }
    })
  }

  // Download canvas as image
  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "color-therapy-artwork.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  // Predefined colors
  const colorPalette = [
    "#6d28d9", // Purple
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f43f5e", // Rose
    "#ef4444", // Red
    "#f97316", // Orange
    "#f59e0b", // Amber
    "#eab308", // Yellow
    "#84cc16", // Lime
    "#10b981", // Emerald
    "#14b8a6", // Teal
    "#06b6d4", // Cyan
    "#0ea5e9", // Sky
    "#3b82f6", // Blue
    "#000000", // Black
    "#ffffff", // White
  ]

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Color Therapy</CardTitle>
          <CardDescription>
            Express yourself through colors and patterns. Drawing can be a therapeutic way to reduce stress and anxiety.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="border rounded-md overflow-hidden shadow-sm">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                className="touch-none max-w-full h-auto cursor-crosshair"
                style={{ maxHeight: "60vh" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Drawing Mode</h3>
                <RadioGroup
                  value={mode}
                  onValueChange={(value) => setMode(value as DrawingMode)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="brush" id="brush" />
                    <Label htmlFor="brush">Brush</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fill" id="fill" />
                    <Label htmlFor="fill">Fill</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="brush-size">Brush Size</Label>
                  <span className="text-sm text-muted-foreground">{brushSize}px</span>
                </div>
                <Slider
                  id="brush-size"
                  value={[brushSize]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => setBrushSize(value[0])}
                  disabled={mode === "fill"}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Color Palette</h3>
              <div className="grid grid-cols-4 gap-2">
                {colorPalette.map((c) => (
                  <button
                    key={c}
                    className={`w-8 h-8 rounded-full ${
                      color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                    } ${c === "#ffffff" ? "border border-gray-200" : ""}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Label htmlFor="custom-color">Custom:</Label>
                <input
                  type="color"
                  id="custom-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleUndo} disabled={actions.length === 0}>
                  <Undo className="mr-2 h-4 w-4" />
                  Undo
                </Button>
                <Button variant="outline" onClick={handleRedo} disabled={redoActions.length === 0}>
                  <Redo className="mr-2 h-4 w-4" />
                  Redo
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Art therapy can help reduce stress, process emotions, and improve self-awareness. Take your time and enjoy
            the process without worrying about the result.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
