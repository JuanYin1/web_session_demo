# Chat Application Frontend

A React/TypeScript frontend for the chat application that connects to the backend API.

## Features

- **Real-time Chat Interface**: Send messages and receive AI responses
- **Session Management**: Create new chat sessions and maintain conversation history
- **Responsive Design**: Modern UI built with Tailwind CSS
- **TypeScript Support**: Full type safety and better development experience
- **Error Handling**: Graceful handling of API errors and loading states
- **Accessibility**: ARIA labels and keyboard navigation support

## Backend API Integration

The frontend connects to the backend API running on `http://localhost:5001` with the following endpoints:

- **POST /api/session** - Creates new chat session, returns `{"session_id": "uuid"}`
- **POST /api/chat** - Sends chat message, expects `{"session_id": "uuid", "message": "text"}`, returns `{"response": "ai_response"}`
- **GET /api/history/{session_id}** - Gets chat history, returns `{"messages": [{"content": "text", "role": "user|assistant", "timestamp": "date"}]}`

## Getting Started

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn
- Backend API running on http://localhost:5001

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Chat.tsx        # Main chat component with session management
│   ├── MessageList.tsx # Message display component
│   └── MessageInput.tsx# Message input component
├── services/           # API service functions
│   └── api.ts         # Backend API integration
├── types/             # TypeScript type definitions
│   └── api.ts         # API response types
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## Usage

1. **Starting a Chat**: The application automatically creates a new session when you first load it
2. **Sending Messages**: Type your message in the input field and press Enter or click Send
3. **New Session**: Click the "New Session" button to start a fresh conversation
4. **Message History**: Previous messages are automatically loaded when you refresh or return to a session

## Error Handling

The application includes comprehensive error handling for:
- Network connection issues
- API endpoint failures
- Invalid session states
- Loading states during API calls

## Accessibility Features

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management
- Screen reader compatible

## Browser Support

The application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
