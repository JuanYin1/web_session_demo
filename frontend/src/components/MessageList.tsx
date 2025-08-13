// MessageList component for displaying chat messages
import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/api';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-xl font-medium mb-2">Start a conversation</p>
          <p>Send a message to begin chatting with the AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={`${message.timestamp}-${index}`}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-end gap-2 max-w-[80%] ${
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mb-1">
              {message.role === 'user' ? 'U' : 'AI'}
            </div>
            
            {/* Message bubble */}
            <div
              className={`p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-lg rounded-br-sm shadow-sm'
                  : 'bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm shadow-sm border border-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              {message.timestamp && (
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Loading indicator for AI response */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-end gap-2 max-w-[80%]">
            {/* AI Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mb-1">
              AI
            </div>
            
            {/* Loading bubble */}
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm shadow-sm border border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};