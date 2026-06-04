"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Sparkles, X, User, Bot, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface WritingAssistantProps {
  type: string;
  level: string;
  onUseSchema: (schema: string) => void;
  onClose: () => void;
}

export default function WritingAssistant({ type, level, onUseSchema, onClose }: WritingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ciao! Sono il tuo assistente per la scrittura. Di cosa vorresti scrivere oggi?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/writing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          level,
          type
        }),
      });

      if (!response.ok) throw new Error("Error logic");
      const data = await response.json();

      setMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSchema = (content: string) => {
    // Basic heuristic to detect if AI generated the schema
    const keywords = ["apertura", "sviluppo", "conclusione", "espressioni utili"];
    const lower = content.toLowerCase();
    return keywords.every(k => lower.includes(k)) || lower.includes("schema:");
  };

  return (
    <Card className="border-primary/20 shadow-xl bg-white overflow-hidden animate-in slide-in-from-right-8 duration-300">
      <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">Assistente di Scrittura</CardTitle>
            <p className="text-[10px] text-gray-500 font-medium">Ti aiuto a generare idee in italiano</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[500px]">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30"
        >
          {messages.map((m, i) => (
            <div key={i} className={cn(
              "flex gap-3 max-w-[85%]",
              m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                m.role === "user" ? "bg-blue-100" : "bg-primary/10"
              )}>
                {m.role === "user" ? <User className="h-4 w-4 text-blue-600" /> : <Bot className="h-4 w-4 text-primary" />}
              </div>
              <div className="space-y-3">
                <div className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm",
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white border border-gray-100 rounded-tl-none text-gray-800"
                )}>
                  {m.content}
                </div>

                {m.role === "assistant" && isSchema(m.content) && (
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-dark text-white rounded-full gap-2 text-xs font-bold"
                    onClick={() => onUseSchema(m.content)}
                  >
                    <Check className="h-3 w-3" />
                    Usa questo schema
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 mr-auto">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-gray-400 font-medium">L&apos;insegnante sta pensando...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="relative">
            <Textarea
              placeholder="Rispondi qui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="pr-12 min-h-[60px] rounded-xl resize-none focus:ring-primary border-gray-200"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="absolute right-2 bottom-2 rounded-lg"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Consiglio: prova a rispondere in italiano, anche se in modo semplice!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
