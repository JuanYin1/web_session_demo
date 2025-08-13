// API service functions for backend integration
// Backend API Base URL: http://localhost:5001

import type { 
  SessionResponse, 
  ChatRequest, 
  ChatResponse, 
  HistoryResponse 
} from '../types/api';

const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new chat session
   * Calls: POST /api/session
   * Returns: {"session_id": "uuid"}
   */
  async createSession(): Promise<SessionResponse> {
    console.log('🔗 API Call: POST /api/session - Creating new chat session');
    return this.request<SessionResponse>('/session', {
      method: 'POST',
    });
  }

  /**
   * Sends a chat message
   * Calls: POST /api/chat
   * Expects: {"session_id": "uuid", "message": "text"}
   * Returns: {"response": "ai_response"}
   */
  async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
    console.log(`🔗 API Call: POST /api/chat - Sending message for session ${sessionId}`);
    const requestBody: ChatRequest = {
      session_id: sessionId,
      message: message,
    };

    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  /**
   * Gets chat history for a session
   * Calls: GET /api/history/{session_id}
   * Returns: {"messages": [{"content": "text", "role": "user|assistant", "timestamp": "date"}]}
   */
  async getHistory(sessionId: string): Promise<HistoryResponse> {
    console.log(`🔗 API Call: GET /api/history/${sessionId} - Fetching chat history`);
    return this.request<HistoryResponse>(`/history/${sessionId}`);
  }
}

export const apiService = new ApiService();