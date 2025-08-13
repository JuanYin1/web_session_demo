// TypeScript interfaces for backend API integration

export interface SessionResponse {
  session_id: string;
}

export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface HistoryResponse {
  messages: ChatMessage[];
}

export interface ApiError {
  error: string;
  message?: string;
}