// MessageInput component for sending chat messages
import React, { useState } from 'react';
import type { FormEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-t border-gray-200 bg-white">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          disabled={isLoading || disabled}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={2}
          aria-label="Chat message input"
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Sending...</span>
          </div>
        ) : (
          <span>Send</span>
        )}
      </button>
    </form>
  );
};