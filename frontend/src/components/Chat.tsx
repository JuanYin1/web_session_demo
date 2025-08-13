// Main Chat component with session management and state handling
import React, { useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types/api';
import { apiService } from '../services/api';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const Chat: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a new session
  const createNewSession = useCallback(async () => {
    try {
      setIsInitializing(true);
      setError(null);
      console.log('Creating new chat session...');
      
      const response = await apiService.createSession();
      setSessionId(response.session_id);
      setMessages([]);
      
      console.log(`✅ New session created: ${response.session_id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      setError('Failed to create new session. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Load chat history for current session
  const loadHistory = useCallback(async (sessionId: string) => {
    try {
      console.log(`Loading chat history for session: ${sessionId}`);
      const response = await apiService.getHistory(sessionId);
      setMessages(response.messages);
      console.log(`✅ Loaded ${response.messages.length} messages from history`);
    } catch (error) {
      console.error('Failed to load history:', error);
      // Don't set error state for history loading failure
      // Just start with empty messages
      setMessages([]);
    }
  }, []);

  // Send a message
  const handleSendMessage = useCallback(async (message: string) => {
    if (!sessionId) {
      setError('No active session. Please create a new session.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        content: message,
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      console.log(`Sending message to session ${sessionId}: "${message}"`);
      
      // Send message to backend
      const response = await apiService.sendMessage(sessionId, message);
      
      // Add AI response to UI
      const aiMessage: ChatMessage = {
        content: response.response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);

      console.log('✅ Message sent and response received');
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
      
      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Initialize session on component mount
  useEffect(() => {
    createNewSession();
  }, [createNewSession]);

  // Load history when session changes
  useEffect(() => {
    if (sessionId) {
      loadHistory(sessionId);
    }
  }, [sessionId, loadHistory]);

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Initializing chat session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            AI Chat Assistant
          </h1>
          {sessionId && (
            <p className="text-sm text-gray-500 mt-1">Session: {sessionId.slice(0, 8)}...</p>
          )}
        </div>
        <button
          onClick={createNewSession}
          disabled={isInitializing}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Start new chat session"
        >
          New Session
        </button>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center">
            <div className="text-red-700">
              <p className="font-medium">
                Something went wrong
              </p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-100 transition-colors"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!sessionId}
        />
      </div>
    </div>
  );
};