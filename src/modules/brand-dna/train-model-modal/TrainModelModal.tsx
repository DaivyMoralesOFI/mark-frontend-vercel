import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { X, SkipForward, Sparkles, Send } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import { Input } from "@/shared/components/ui/Input"

interface TrainModelModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: Date
}

const SAMPLE_IMAGES = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg",
  "/image5.jpg",
  "/image6.jpg",
]

const TOTAL_TRAINING_IMAGES = 18

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your AI Style Coach. I'll help you train the model to understand your preferences.",
    timestamp: new Date(),
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Swipe right on images you like, left on ones you don't. Feel free to tell me about your style preferences anytime!",
    timestamp: new Date(),
  },
]

export function TrainModelModal({ isOpen, onClose }: TrainModelModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
      setReviewedCount(0)
      setIsComplete(false)
      setMessages(INITIAL_MESSAGES)
      setInputValue("")
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addAssistantMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  const handleLike = useCallback(() => {
    if (currentIndex >= SAMPLE_IMAGES.length) return

    setReviewedCount((prev) => prev + 1)

    if (currentIndex % 3 === 0) {
      const encouragementMessages = [
        "Great choice! I can see you appreciate that style.",
        "Nice! I'm learning what you prefer.",
        "Excellent taste! Adding this to your profile.",
      ]
      addAssistantMessage(encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)])
    }

    if (currentIndex === SAMPLE_IMAGES.length - 1) {
      setIsComplete(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, addAssistantMessage])

  const handleDislike = useCallback(() => {
    if (currentIndex >= SAMPLE_IMAGES.length) return

    setReviewedCount((prev) => prev + 1)

    addAssistantMessage(
      "I noticed you disliked that image. Can you tell me what specifically you didn't like? (e.g., colors, composition, style, subject matter)",
    )

    if (currentIndex === SAMPLE_IMAGES.length - 1) {
      setIsComplete(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, addAssistantMessage])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowRight") {
        handleLike()
      } else if (e.key === "ArrowLeft") {
        handleDislike()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isOpen, handleLike, handleDislike])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        "Thanks for sharing! That helps me understand your preferences better.",
        "Got it! I'm noting that for your style profile.",
        "Interesting! I'll make sure the model learns from this.",
        "Perfect! This will help personalize your content.",
        "Great feedback! The more I know, the better I can help you.",
      ]
      addAssistantMessage(responses[Math.floor(Math.random() * responses.length)])
    }, 800)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-7xl mx-4 h-[90vh]"
      >
        <div className="bg-background rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col border border-border">
          {isComplete ? (
            <CompletionScreen onClose={onClose} />
          ) : (
            <div className="flex h-full overflow-hidden">
              {/* Left Panel - Training Interface */}
              <div className="flex flex-col flex-1 p-6 bg-muted/30 overflow-y-auto">
                {/* Header */}
                <div className="mb-4">
                  <div className="mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-1">Train Your Style</h1>
                      <p className="text-muted-foreground text-sm">Swipe right if you like it, left if you don&apos;t</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-primary font-semibold">
                        {reviewedCount}/{TOTAL_TRAINING_IMAGES} reviewed
                      </p>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(reviewedCount / TOTAL_TRAINING_IMAGES) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Stack - Centered with better sizing */}
                <div className="flex-1 flex items-center justify-center min-h-0 py-4">
                  <div className="relative w-full max-w-md aspect-square">
                    {SAMPLE_IMAGES.map((image, index) => {
                      if (index < currentIndex) return null

                      return (
                        <SwipeCard
                          key={index}
                          image={image}
                          index={index}
                          currentIndex={currentIndex}
                          cardNumber={`${index + 1} / ${SAMPLE_IMAGES.length}`}
                          onLike={handleLike}
                          onDislike={handleDislike}
                          isActive={index === currentIndex}
                        />
                      )
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      onClick={handleDislike}
                      variant="outline"
                      className="w-16 h-16 rounded-full border-2 border-destructive hover:bg-destructive/10 hover:border-destructive shadow-lg hover:shadow-xl transition-all"
                    >
                      <X className="h-6 w-6 text-destructive" />
                    </Button>

                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-14 h-14 rounded-full shadow-md hover:shadow-lg transition-all"
                      onClick={() => {
                        handleLike()
                      }}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>

                    <Button
                      size="lg"
                      onClick={handleLike}
                      className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 border-0 shadow-lg hover:shadow-xl transition-all"
                    >
                      <svg
                        className="h-6 w-6 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">Pro tip: Use arrow keys (← →) for faster training</p>
                </div>
              </div>

              {/* Right Panel - AI Style Coach Chat */}
              <div className="bg-card border-l border-border flex flex-col w-96 flex-shrink-0">
                {/* AI Coach Header */}
                <div className="p-4 border-b border-border flex-shrink-0 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-foreground">AI Style Coach</h3>
                      <p className="text-xs text-muted-foreground">Learning your preferences</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-2 right-2 rounded-full h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-xs leading-relaxed">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tell me what you like or dislike..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                      className="flex-1 rounded-full px-4 text-sm h-9"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="rounded-full w-9 h-9"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

interface SwipeCardProps {
  image: string
  index: number
  currentIndex: number
  cardNumber: string
  onLike: () => void
  onDislike: () => void
  isActive: boolean
}

function SwipeCard({ image, index, currentIndex, cardNumber, onLike, onDislike, isActive }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        onLike()
      } else {
        onDislike()
      }
    }
  }

  const zIndex = SAMPLE_IMAGES.length - (index - currentIndex)
  const scale = 1 - (index - currentIndex) * 0.05

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : 0,
        opacity: isActive ? opacity : 1,
        zIndex,
        scale,
      }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={isActive ? handleDragEnd : undefined}
      animate={isActive ? {} : { y: (index - currentIndex) * -8 }}
    >
      <Card className="relative w-full h-full overflow-hidden border shadow-2xl bg-card rounded-3xl">
        <img
          src={image || "/placeholder.svg"}
          alt={`Training image ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Card counter badge */}
        {isActive && (
          <div className="absolute top-6 right-6 bg-foreground text-background px-4 py-2 rounded-full font-semibold shadow-lg">
            {cardNumber}
          </div>
        )}

        {/* Like overlay */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-[2px] pointer-events-none"
        >
          <div className="absolute top-12 right-12 border-8 border-green-500 rounded-3xl px-8 py-4 rotate-12 shadow-2xl">
            <span className="text-5xl font-black text-green-500">LIKE</span>
          </div>
        </motion.div>

        {/* Dislike overlay */}
        <motion.div
          style={{ opacity: dislikeOpacity }}
          className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-pink-500/30 backdrop-blur-[2px] pointer-events-none"
        >
          <div className="absolute top-12 left-12 border-8 border-red-500 rounded-3xl px-8 py-4 -rotate-12 shadow-2xl">
            <span className="text-5xl font-black text-red-500">NOPE</span>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}

function CompletionScreen({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full py-12 px-6 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6 shadow-xl">
        <svg
          className="h-12 w-12 text-primary-foreground"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>

      <h2 className="text-4xl font-bold mb-4 text-foreground">Training Complete!</h2>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Great job! Your AI model is now learning from your preferences and will create content that matches your unique
        style.
      </p>

      <Button
        size="lg"
        className="px-8 py-6 text-lg rounded-full shadow-xl"
        onClick={onClose}
      >
        Done
      </Button>
    </motion.div>
  )
}
