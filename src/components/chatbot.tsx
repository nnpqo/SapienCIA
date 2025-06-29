"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mic, Send, Bot, User } from "lucide-react"
import { studentChatbotAssistance } from "@/ai/flows/student-chatbot-assistance"
import { cn } from "@/lib/utils"

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  courseMaterial: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function Chatbot({ courseMaterial }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte con tu curso?", isUser: false }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.lang = 'es-ES'
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim()
        setInput(transcript)
      }

      recognitionRef.current = recognition
    }
  }, [])


  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages])

  const handleSend = async () => {
    if (input.trim() === "") return
    
    const userMessage: Message = { text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input;
    setInput("")
    setIsLoading(true)

    try {
      const result = await studentChatbotAssistance({ question: currentInput, courseMaterial })
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
  
  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput(''); // Clear input before starting
      recognitionRef.current.start();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg transition-transform duration-300 hover:scale-110">
          <Bot size={28} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="font-headline flex items-center gap-2"><Bot/> Asistente de Aprendizaje IA</SheetTitle>
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
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Escuchando..." : "Haz una pregunta..."}
            disabled={isLoading}
          />
          <Button variant="ghost" size="icon" onClick={handleMicClick} disabled={isLoading || !recognitionRef.current}>
            <Mic className={cn(isListening && "text-destructive")} />
          </Button>
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}><Send /></Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
