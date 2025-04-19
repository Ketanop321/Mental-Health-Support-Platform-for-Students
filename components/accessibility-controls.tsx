"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, ZoomIn, Contrast } from "lucide-react"

export default function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)

  // Apply accessibility settings
  useEffect(() => {
    // Font size
    document.documentElement.style.setProperty("--font-size-multiplier", `${fontSize}%`)

    // Contrast
    if (contrast !== 100) {
      document.documentElement.style.setProperty("--contrast-multiplier", `${contrast}%`)
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }

    // Dyslexic font
    if (dyslexicFont) {
      document.documentElement.classList.add("dyslexic-font")
    } else {
      document.documentElement.classList.remove("dyslexic-font")
    }

    // Save settings to localStorage
    localStorage.setItem(
      "accessibility",
      JSON.stringify({
        fontSize,
        contrast,
        reducedMotion,
        dyslexicFont,
      }),
    )
  }, [fontSize, contrast, reducedMotion, dyslexicFont])

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setFontSize(settings.fontSize || 100)
      setContrast(settings.contrast || 100)
      setReducedMotion(settings.reducedMotion || false)
      setDyslexicFont(settings.dyslexicFont || false)
    }
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" aria-label="Accessibility settings">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Accessibility Settings</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ZoomIn className="h-4 w-4" />
                <Label htmlFor="font-size">Font Size: {fontSize}%</Label>
              </div>
              <span className="text-xs text-muted-foreground">{fontSize}%</span>
            </div>
            <Slider
              id="font-size"
              min={80}
              max={150}
              step={10}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="h-4 w-4" />
                <Label htmlFor="contrast">Contrast: {contrast}%</Label>
              </div>
              <span className="text-xs text-muted-foreground">{contrast}%</span>
            </div>
            <Slider
              id="contrast"
              min={100}
              max={200}
              step={10}
              value={[contrast]}
              onValueChange={(value) => setContrast(value[0])}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
            <Label htmlFor="reduced-motion">Reduced Motion</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="dyslexic-font" checked={dyslexicFont} onCheckedChange={setDyslexicFont} />
            <Label htmlFor="dyslexic-font">Dyslexia-Friendly Font</Label>
          </div>

          <p className="text-xs text-muted-foreground">These settings will be saved for your next visit.</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
