
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi there! I\'m Melody Assistant. How can I help you with music today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Call the DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-3b92cd167f064a65a2f9a072eabffd76',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are Melody Assistant, a helpful AI that assists users with music. You are knowledgeable about music genres, artists, and can provide recommendations. Keep responses concise and focused on music.' },
            { role: 'user', content: inputValue },
          ],
          max_tokens: 500,
        }),
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.choices[0].message.content,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      
      // Fallback response if API fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="fixed bottom-16 md:bottom-8 right-4 z-50 flex flex-col">
      {isOpen && (
        <div 
          className={cn(
            "bg-card border border-border shadow-lg rounded-lg w-80 md:w-96 transition-all duration-300 flex flex-col overflow-hidden",
            isMinimized ? "h-14" : "h-[500px]"
          )}
        >
          <div 
            className="p-3 border-b border-border bg-muted flex items-center justify-between cursor-pointer" 
            onClick={toggleMinimize}
          >
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              <span className="font-medium">Melody Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              {isMinimized ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={cn(
                        "flex gap-2",
                        message.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.type === 'bot' && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot size={16} className="text-primary" />
                        </div>
                      )}
                      
                      <div className={cn(
                        "max-w-[80%] px-3 py-2 rounded-lg",
                        message.type === 'user' 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}>
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div className={cn(
                          "text-xs mt-1 text-right",
                          message.type === 'user' 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        )}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  
                  {isLoading && (
                    <div className="flex justify-start gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-primary" />
                      </div>
                      <div className="bg-muted max-w-[80%] px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce animation-delay-200">.</span>
                          <span className="animate-bounce animation-delay-400">.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ask about music..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      
      <Button 
        onClick={toggleChat}
        className="self-end mt-4 rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
      >
        <Bot size={20} />
      </Button>
    </div>
  );
}

export default Chatbot;
