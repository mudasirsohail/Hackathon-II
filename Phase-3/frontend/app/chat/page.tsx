"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !session) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      console.log("Calling backend API:", `${backendUrl}/api/chat`);
      console.log("Sending payload:", {
        message: inputValue,
        user_id: session.user?.id || "unknown",
      });

      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          user_id: session.user?.id || "unknown",
        }),
      });

      console.log("Response received:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unable to connect to the AI service'}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col w-full pt-24 pb-6">
        <div className="bg-white flex-1 flex flex-col max-w-4xl w-full mx-auto">
          {/* Messages Container */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-grow max-w-lg w-full mx-auto space-y-3">
                {/* Main Heading */}
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">How can I help you today?</h2>
                
                {/* Subheading */}
                <p className="text-xs text-gray-600 text-center">
                  I can help you manage tasks, set priorities, add reminders, and keep your workflow organized. Just tell me what you need.
                </p>
                
                {/* Action Cards Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2 w-full">
                  {/* Card 1: Create a task */}
                  <div className="bg-blue-50 rounded-lg p-2 flex flex-col items-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="text-[0.6rem] font-medium text-blue-800 mb-0.5">Create a task</h3>
                    <p className="text-[0.5rem] text-blue-700">Add a new item</p>
                  </div>
                  
                  {/* Card 2: Show my tasks */}
                  <div className="bg-green-50 rounded-lg p-2 flex flex-col items-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-[0.6rem] font-medium text-green-800 mb-0.5">Show my tasks</h3>
                    <p className="text-[0.5rem] text-green-700">View pending</p>
                  </div>
                  
                  {/* Card 3: Filter by tag */}
                  <div className="bg-yellow-50 rounded-lg p-2 flex flex-col items-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h3 className="text-[0.6rem] font-medium text-yellow-800 mb-0.5">Filter by tag</h3>
                    <p className="text-[0.5rem] text-yellow-700">Find by category</p>
                  </div>
                  
                  {/* Card 4: Search tasks */}
                  <div className="bg-purple-50 rounded-lg p-2 flex flex-col items-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-[0.6rem] font-medium text-purple-800 mb-0.5">Search tasks</h3>
                    <p className="text-[0.5rem] text-purple-700">Find specific</p>
                  </div>
                </div>
                
                {/* Tip Line */}
                <p className="text-[0.6rem] text-gray-500 italic text-center">
                  Tip: Try natural language like 'Add a high priority task due next Monday' or 'Show overdue tasks'
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.role === "user" ? "text-indigo-200" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-3 py-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1 animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3">
            <form onSubmit={handleSubmit} className="flex gap-1 w-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder-gray-500 text-sm"
                aria-label="Type your message"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-indigo-600 text-white rounded-full px-4 py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="sr-only">Sending...</span>
                  </span>
                ) : (
                  "Send"
                )}
              </button>
            </form>
            <p className="text-[0.6rem] text-center text-gray-500 mt-1">
              Tip: Try natural language like 'Add a high priority task due next Monday' or 'Show overdue tasks'
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}