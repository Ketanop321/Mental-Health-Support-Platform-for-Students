"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Trash2, Volume2, VolumeX } from "lucide-react"

type ElementType = "rock" | "plant" | "sand" | "water"
type Element = {
  id: string
  type: ElementType
  x: number
  y: number
  rotation: number
  scale: number
}

const elementImages = {
  rock: [
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ],
  plant: [
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ],
  sand: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
  water: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
}

export default function ZenGardenPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [elements, setElements] = useState<Element[]>([])
  const [selectedType, setSelectedType] = useState<ElementType>("rock")
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [elementSize, setElementSize] = useState(1)
  const [isPlacing, setIsPlacing] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize canvas and audio
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    setCtx(context)

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Draw background
    drawBackground(context, canvas.width, canvas.height)

    // Initialize audio
    audioRef.current = new Audio("/placeholder.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Redraw canvas when elements change
  useEffect(() => {
    if (!ctx || !canvasRef.current) return

    drawBackground(ctx, canvasRef.current.width, canvasRef.current.height)
    drawElements()
  }, [elements, ctx])

  // Draw background
  const drawBackground = (context: CanvasRenderingContext2D, width: number, height: number) => {
    // Create gradient background
    const gradient = context.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#f0f9ff") // Light blue
    gradient.addColorStop(1, "#e0f2fe") // Lighter blue
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)
  }

  // Draw all elements
  const drawElements = () => {
    if (!ctx || !canvasRef.current) return

    elements.forEach((element) => {
      const img = new Image()
      img.src = elementImages[element.type][selectedVariant % elementImages[element.type].length]
      img.onload = () => {
        if (!ctx || !canvasRef.current) return

        ctx.save()
        ctx.translate(element.x, element.y)
        ctx.rotate((element.rotation * Math.PI) / 180)
        ctx.scale(element.scale, element.scale)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)
        ctx.restore()
      }
    })
  }

  // Handle canvas click to place element
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newElement: Element = {
      id: Date.now().toString(),
      type: selectedType,
      x,
      y,
      rotation: Math.random() * 360,
      scale: 0.5 + elementSize * 0.5, // Scale based on selected size
    }

    setElements([...elements, newElement])
  }

  // Toggle audio playback
  const toggleAudio = () => {
    if (!audioRef.current) return

    if (isAudioPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsAudioPlaying(!isAudioPlaying)
  }

  // Clear all elements
  const clearGarden = () => {
    setElements([])
  }

  // Download canvas as image
  const downloadGarden = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "zen-garden.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Zen Garden</CardTitle>
          <CardDescription>
            Create your own digital zen garden. Arrange rocks, plants, and other elements to design a peaceful space.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-md overflow-hidden shadow-sm bg-blue-50/50 dark:bg-blue-950/20">
            <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-[400px] cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Elements</h3>
              <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as ElementType)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="rock">Rocks</TabsTrigger>
                  <TabsTrigger value="plant">Plants</TabsTrigger>
                  <TabsTrigger value="sand">Sand</TabsTrigger>
                  <TabsTrigger value="water">Water</TabsTrigger>
                </TabsList>
                <TabsContent value="rock" className="pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {elementImages.rock.map((src, index) => (
                      <div
                        key={index}
                        className={`border rounded-md p-2 cursor-pointer ${
                          selectedVariant % elementImages.rock.length === index ? "border-primary bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedVariant(index)}
                      >
                        <img src={src || "/placeholder.svg"} alt={`Rock ${index + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="plant" className="pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {elementImages.plant.map((src, index) => (
                      <div
                        key={index}
                        className={`border rounded-md p-2 cursor-pointer ${
                          selectedVariant % elementImages.plant.length === index ? "border-primary bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedVariant(index)}
                      >
                        <img src={src || "/placeholder.svg"} alt={`Plant ${index + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="sand" className="pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {elementImages.sand.map((src, index) => (
                      <div
                        key={index}
                        className={`border rounded-md p-2 cursor-pointer ${
                          selectedVariant % elementImages.sand.length === index ? "border-primary bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedVariant(index)}
                      >
                        <img src={src || "/placeholder.svg"} alt={`Sand ${index + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="water" className="pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {elementImages.water.map((src, index) => (
                      <div
                        key={index}
                        className={`border rounded-md p-2 cursor-pointer ${
                          selectedVariant % elementImages.water.length === index ? "border-primary bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedVariant(index)}
                      >
                        <img src={src || "/placeholder.svg"} alt={`Water ${index + 1}`} className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Element Size</label>
                  <span className="text-sm text-muted-foreground">{elementSize.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[elementSize]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setElementSize(value[0])}
                />
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full" onClick={toggleAudio}>
                  {isAudioPlaying ? (
                    <>
                      <VolumeX className="mr-2 h-4 w-4" />
                      Mute Ambient Sounds
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      Play Ambient Sounds
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={clearGarden}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Garden
                </Button>
                <Button variant="outline" onClick={downloadGarden}>
                  <Download className="mr-2 h-4 w-4" />
                  Save Garden
                </Button>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Elements placed: <span className="font-medium">{elements.length}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Creating a zen garden can be a meditative practice. Take your time to arrange elements in a way that feels
            balanced and peaceful to you.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
