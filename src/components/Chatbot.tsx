import type React from "react";
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import axios from "axios";

// Types for messages and chat
interface Message {
  text: string;
  sender: "user" | "bot";
}

interface Event {
  title: string;
  description: string;
  status_id: number;
}

// Make sure the environment variable is correctly prefixed with "VITE_" for Vite
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:3000/api/events/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.data.success) {
          const filteredEvents = response.data.data.filter((event: Event) => event.status_id === 2);
          setEvents(filteredEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {

      const eventDetails = events
        .map((event) => `${event.title},  ${event.description}, (Location: ${event.location_id}):`)
        .join("\n");
      console.log(JSON.stringify(eventDetails));

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: `You are a helpful college event assistant. Dont mention location id anywhere.example -  Location 4 Dont show it like that.Use the following event information to answer questions:\n${eventDetails}\n\nOnly use the provided event information to answer questions.The events are not correlated with each other. If you don't have relevant information, say so. So Location 1 is Civil Seminar Hall, Location 2 is Chemical Seminar Hall, Location 3 is Mechanical Seminar Hall, Location 4 is Electrical Seminar Hall. Dont mention location id anywhere, just mention location Name in the response. `
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error getting bot response:", error);
      return "I apologize, but I'm having trouble processing your request. Please try again later.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      const userMessage = input.trim();
      setInput("");
      setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

      try {
        const botResponse = await getBotResponse(userMessage);
        setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      } catch (error) {
        console.error("Error in chat:", error);
        setMessages((prev) => [
          ...prev,
          { text: "I'm sorry, I encountered an error. Please try again.", sender: "bot" }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-full h-[500px] flex flex-col border-2 border-gray-200">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">College Event Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-100 text-gray-800"
                } rounded-lg p-3 max-w-[80%]`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 flex items-center space-x-2 transition duration-300"
      >
        <MessageSquare size={24} />
        <span>{isOpen ? "Close Chat" : "Need Help?"}</span>
      </button>
    </div>
  );
};

export default Chatbot;