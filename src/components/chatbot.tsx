"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"
import { studentChatbotAssistance } from "@/ai/flows/student-chatbot-assistance"
import { cn } from "@/lib/utils"

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  courseMaterial: string;
}

export function Chatbot({ courseMaterial }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "¡Hola! Soy StudiaChat. ¿Cómo puedo ayudarte con tu curso?", isUser: false }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSend = async (textToSend: string) => {
    const messageText = textToSend.trim();
    if (messageText === "") return
    
    const userMessage: Message = { text: messageText, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const result = await studentChatbotAssistance({ question: messageText, courseMaterial })
      const botMessage: Message = { text: result.answer, isUser: false }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error("Error with chatbot:", error)
      const errorMessage: Message = { text: "Lo siento, tengo problemas para conectarme. Por favor, inténtalo más tarde.", isUser: false }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg transition-transform duration-300 hover:scale-110">
          <Bot size={28} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="font-headline flex items-center gap-2"><Bot/> StudiaChat</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4 px-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={cn("flex items-start gap-3", message.isUser ? "justify-end" : "justify-start")}>
                {!message.isUser && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback className="bg-secondary"><Bot size={20}/></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("p-3 rounded-lg max-w-sm text-sm", message.isUser ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                  <p className="font-body whitespace-pre-wrap">{message.text}</p>
                </div>
                 {message.isUser && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback className="bg-accent text-accent-foreground"><User size={20} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                 <Avatar className="w-8 h-8 border">
                    <AvatarFallback className="bg-secondary"><Bot size={20}/></AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-secondary">
                      <p className="text-sm font-body">Pensando...</p>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2 p-6 border-t bg-background">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Haz una pregunta..."
            disabled={isLoading}
          />
          <Button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()}><Send /></Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
