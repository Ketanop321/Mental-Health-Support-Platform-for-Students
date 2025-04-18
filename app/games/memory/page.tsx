"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Clock, RotateCcw, Trophy } from "lucide-react"
import confetti from "canvas-confetti"

// Card icons and their names
const cardIcons = [
  { icon: "🌸", name: "flower" },
  { icon: "🌿", name: "leaf" },
  { icon: "🌊", name: "wave" },
  { icon: "🔥", name: "fire" },
  { icon: "⭐", name: "star" },
  { icon: "🌙", name: "moon" },
  { icon: "☁️", name: "cloud" },
  { icon: "🌈", name: "rainbow" },
  { icon: "🦋", name: "butterfly" },
  { icon: "🐢", name: "turtle" },
  { icon: "🦉", name: "owl" },
  { icon: "🦊", name: "fox" },
]

type Difficulty = "easy" | "medium" | "hard"

type CardType = {
  id: number
  icon: string
  name: string
  flipped: boolean
  matched: boolean
}

type GameState = {
  cards: CardType[]
  flippedCards: number[]
  moves: number
  matches: number
  gameStarted: boolean
  gameCompleted: boolean
  timer: number
  lives: number
}

const initialGameState: GameState = {
  cards: [],
  flippedCards: [],
  moves: 0,
  matches: 0,
  gameStarted: false,
  gameCompleted: false,
  timer: 0,
  lives: 5,
}

const difficultySettings = {
  easy: { pairs: 6, lives: 10 },
  medium: { pairs: 8, lives: 8 },
  hard: { pairs: 12, lives: 5 },
}

export default function MemoryGamePage() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [bestScores, setBestScores] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null,
  })

  // Initialize game
  useEffect(() => {
    initializeGame(difficulty)

    // Load best scores from localStorage
    const savedScores = localStorage.getItem("memoryGameBestScores")
    if (savedScores) {
      setBestScores(JSON.parse(savedScores))
    }
  }, [difficulty])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameState.gameStarted && !gameState.gameCompleted) {
      interval = setInterval(() => {
        setGameState((prev) => ({ ...prev, timer: prev.timer + 1 }))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState.gameStarted, gameState.gameCompleted])

  // Initialize game with selected difficulty
  const initializeGame = (diff: Difficulty) => {
    const { pairs, lives } = difficultySettings[diff]

    // Shuffle and select icons based on difficulty
    const selectedIcons = [...cardIcons].sort(() => 0.5 - Math.random()).slice(0, pairs)

    // Create pairs and shuffle
    const cardPairs = [...selectedIcons, ...selectedIcons]
      .sort(() => 0.5 - Math.random())
      .map((card, index) => ({
        id: index,
        icon: card.icon,
        name: card.name,
        flipped: false,
        matched: false,
      }))

    setGameState({
      ...initialGameState,
      cards: cardPairs,
      lives,
    })
  }

  // Handle card click
  const handleCardClick = (id: number) => {
    // Prevent clicks if game is completed or card is already flipped/matched
    const card = gameState.cards.find((c) => c.id === id)
    if (gameState.gameCompleted || !card || card.flipped || card.matched || gameState.flippedCards.length >= 2) {
      return
    }

    // Start game on first card click
    if (!gameState.gameStarted) {
      setGameState((prev) => ({ ...prev, gameStarted: true }))
    }

    // Flip the card
    const updatedCards = gameState.cards.map((c) => (c.id === id ? { ...c, flipped: true } : c))

    // Add to flipped cards
    const updatedFlippedCards = [...gameState.flippedCards, id]

    // Check for match if two cards are flipped
    if (updatedFlippedCards.length === 2) {
      const firstCard = gameState.cards.find((c) => c.id === updatedFlippedCards[0])
      const secondCard = gameState.cards.find((c) => c.id === id)

      if (firstCard && secondCard) {
        const isMatch = firstCard.name === secondCard.name

        setTimeout(() => {
          let newCards
          let newMatches = gameState.matches
          let newLives = gameState.lives

          if (isMatch) {
            // Mark cards as matched
            newCards = updatedCards.map((c) =>
              c.id === updatedFlippedCards[0] || c.id === id ? { ...c, matched: true } : c,
            )
            newMatches += 1

            // Check if game is completed
            const allMatched = newCards.every((c) => c.matched)
            if (allMatched) {
              handleGameCompletion()
            }
          } else {
            // Flip cards back
            newCards = updatedCards.map((c) =>
              c.id === updatedFlippedCards[0] || c.id === id ? { ...c, flipped: false } : c,
            )
            newLives -= 1

            // Check if out of lives
            if (newLives <= 0) {
              handleGameOver()
            }
          }

          setGameState((prev) => ({
            ...prev,
            cards: newCards,
            flippedCards: [],
            moves: prev.moves + 1,
            matches: newMatches,
            lives: newLives,
          }))
        }, 1000)
      }
    }

    setGameState((prev) => ({
      ...prev,
      cards: updatedCards,
      flippedCards: updatedFlippedCards,
    }))
  }

  // Handle game completion
  const handleGameCompletion = () => {
    setGameState((prev) => ({ ...prev, gameCompleted: true }))

    // Save best score if better than previous
    const currentScore = gameState.moves
    const previousBest = bestScores[difficulty]

    if (previousBest === null || currentScore < previousBest) {
      const newBestScores = { ...bestScores, [difficulty]: currentScore }
      setBestScores(newBestScores)
      localStorage.setItem("memoryGameBestScores", JSON.stringify(newBestScores))
    }

    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  // Handle game over (out of lives)
  const handleGameOver = () => {
    setGameState((prev) => ({ ...prev, gameCompleted: true }))
  }

  // Reset game
  const resetGame = () => {
    initializeGame(difficulty)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Memory Match</CardTitle>
          <CardDescription>
            Test your memory by matching pairs of cards. Find all matches to complete the game.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Tabs value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
              <TabsList>
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="hard">Hard</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-1" />
                <span className="font-medium">{gameState.lives}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-1" />
                <span className="font-medium">{formatTime(gameState.timer)}</span>
              </div>
              <Badge variant="outline" className="font-medium">
                Moves: {gameState.moves}
              </Badge>
            </div>

            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Game board */}
          <div
            className={`grid gap-4 mx-auto ${
              difficulty === "easy"
                ? "grid-cols-3 sm:grid-cols-4"
                : difficulty === "medium"
                  ? "grid-cols-4"
                  : "grid-cols-4 sm:grid-cols-6"
            }`}
          >
            {gameState.cards.map((card) => (
              <div
                key={card.id}
                className={`aspect-square flex items-center justify-center rounded-lg text-3xl sm:text-4xl cursor-pointer transition-all duration-300 transform ${
                  card.flipped || card.matched
                    ? "bg-primary/10 rotate-0"
                    : "bg-primary/5 hover:bg-primary/10 rotate-y-180"
                } ${card.matched ? "opacity-70" : "opacity-100"}`}
                onClick={() => handleCardClick(card.id)}
              >
                {(card.flipped || card.matched) && (
                  <span className="animate-in zoom-in-50 duration-300">{card.icon}</span>
                )}
              </div>
            ))}
          </div>

          {/* Game completion message */}
          {gameState.gameCompleted && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg p-6 text-center">
              {gameState.lives > 0 ? (
                <>
                  <h3 className="text-xl font-bold mb-2 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-amber-500 mr-2" />
                    Congratulations!
                  </h3>
                  <p className="mb-4">
                    You completed the game in {gameState.moves} moves and {formatTime(gameState.timer)}.
                  </p>
                  {bestScores[difficulty] === gameState.moves && (
                    <Badge className="bg-amber-500 mb-4">New Best Score!</Badge>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">Game Over</h3>
                  <p className="mb-4">You ran out of lives. Try again!</p>
                </>
              )}
              <Button onClick={resetGame}>Play Again</Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>Best Scores:</p>
            <div className="flex gap-4">
              <span>Easy: {bestScores.easy ? `${bestScores.easy} moves` : "N/A"}</span>
              <span>Medium: {bestScores.medium ? `${bestScores.medium} moves` : "N/A"}</span>
              <span>Hard: {bestScores.hard ? `${bestScores.hard} moves` : "N/A"}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
