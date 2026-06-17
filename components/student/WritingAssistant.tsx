"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send, X } from "lucide-react"

interface Message {
  role: "ai" | "user"
  text: string
}

interface WritingAssistantProps {
  textType: string
  level: string
  onSchemaReady: (schema: string) => void
}

export function WritingAssistant({ textType, level, onSchemaReady }: WritingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [schema, setSchema] = useState("")

  const startAssistant = async () => {
    setIsOpen(true)
    setIsLoading(true)
    const firstMessage = await askGemini([], "start")
    setMessages([{ role: "ai", text: firstMessage }])
    setIsLoading(false)
  }

  const askGemini = async (history: Message[], userInput: string) => {
    try {
      const response = await fetch("/api/writing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, textType, level, userInput })
      })

      const data = await response.json()
      if (!response.ok) {
        // Use details if available, else text, else fallback
        const errMsg = data.details || data.text || "Errore dell'IA"
        console.error("AI Assistant Error Details:", errMsg)
        throw new Error(errMsg)
      }

      return data.text
    } catch (e: any) {
      console.error("AI Assistant Fetch Error:", e)
      const friendlyMsg = e.message?.includes("demand")
        ? "Il servizio è molto richiesto al momento. Per favore, attendi un istante e riprova."
        : "Spiacenti, si è verificato un errore di connessione. Per favore riprova tra poco."
      return friendlyMsg
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", text: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const aiResponse = await askGemini(newMessages, input)
      setMessages([...newMessages, { role: "ai", text: aiResponse }])

      if (aiResponse.includes("SCHEMA DEL TUO TESTO")) {
        setSchema(aiResponse)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={startAssistant}
        className="w-full border-primary/30 text-primary hover:bg-primary/5 font-bold gap-2"
      >
        <Sparkles className="h-4 w-4" />
        💡 Aiutami a scrivere
      </Button>
    )
  }

  return (
    <div className="border-2 border-primary/20 rounded-2xl bg-white overflow-hidden">
      <div className="bg-primary/5 px-4 py-3 flex items-center justify-between border-b border-primary/10">
        <span className="font-bold text-primary text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Assistente alla scrittura
        </span>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Chiudi"
          title="Chiudi"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="h-72 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "ai"
                ? "bg-gray-50 text-gray-800 rounded-tl-none"
                : "bg-primary text-white rounded-tr-none"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
              <span className="text-gray-400 text-sm animate-pulse">Sto pensando...</span>
            </div>
          </div>
        )}
      </div>

      {schema && (
        <div className="px-4 pb-3">
          <Button
            onClick={() => onSchemaReady(schema)}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold gap-2 text-sm"
          >
            ✅ Usa questo schema come base
          </Button>
        </div>
      )}

      <div className="border-t border-gray-100 p-3 flex gap-2">
        <label htmlFor="assistant-input" className="sr-only">Rispondi qui</label>
        <Textarea
          id="assistant-input"
          name="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Rispondi qui..."
          className="min-h-[44px] max-h-[120px] text-sm resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-primary-dark shrink-0"
          aria-label="Invia"
          title="Invia"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
