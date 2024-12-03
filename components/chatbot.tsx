"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react"; // Using MessageCircle for the chat icon

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Button to open/close the chat */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 p-3 bg-blue-500 text-white rounded-full shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chatbox */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-80 h-96 bg-gray-800 text-white shadow-lg rounded-tl-lg z-40">
          <div className="flex justify-between items-center bg-gray-900 text-white p-3 rounded-tl-lg rounded-tr-lg">
            <span>Chatbot</span>
            <button
              onClick={toggleChat}
              className="p-1 bg-transparent text-white rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-start">
                <div className="bg-gray-700 p-2 rounded-lg max-w-xs">
                  Hello! How can I assist you?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-2 rounded-lg max-w-xs">
                  I need help with my order.
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-gray-700 flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 rounded-md bg-gray-600 text-white border border-gray-500"
            />
            <button className="ml-2 p-2 bg-blue-500 text-white rounded-full">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
