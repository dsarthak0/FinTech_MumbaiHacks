"use client"

import { useState, useRef, useEffect } from "react"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChatMessage, ForecastData, Transaction } from "@/types"
import { generateChatResponse } from "@/lib/ai/chatAgents"

interface Props {
  transactions: Transaction[]
  forecast: ForecastData[]
  onClose: () => void
}

export default function ChatBot({ transactions, forecast, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your financial AI coach. I can help you understand your spending, answer questions about your budget, and provide personalized tips. What would you like to know?",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Generate mock AI response
    const response = generateChatResponse(input, transactions, forecast)
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-response`,
      role: "assistant",
      content: response,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setLoading(false)
  }

  return (
    <div className="fixed bottom-24 right-4 w-80 h-96 bg-card rounded-lg shadow-2xl border border-border flex flex-col z-40">
      <CardHeader className="border-b border-border py-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Financial AI Coach</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close chat">
            ✕
          </button>
        </div>
      </CardHeader>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-3 py-2 rounded-lg text-sm">Thinking...</div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3 shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="text-sm"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
