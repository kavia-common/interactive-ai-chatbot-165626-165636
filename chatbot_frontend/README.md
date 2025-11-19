# Ocean Professional AI Chatbot Frontend

This is a [Next.js](https://nextjs.org) web app for interacting with the Ocean Professional AI chatbot.

## Features

- Modern, responsive chat UI themed per "Ocean Professional" (blues/amber, gradients, rounded, shadows)
- Interactive chat window, scrollable messages, fixed input—all accessible and ARIA-friendly
- Detects env vars for API/WS endpoints, gracefully falls back to a realistic local mock if unset
- Streaming/real-time handling if NEXT_PUBLIC_WS_URL is set, or normal REST (or mock)
- Minimal test coverage with easy-to-run browser tests

## Environment Variables

- `NEXT_PUBLIC_API_BASE`: (optional) REST API endpoint (e.g. http://localhost:5000/api). If unset/empty, a built-in mock is used.
- `NEXT_PUBLIC_WS_URL`: (optional) WebSocket endpoint for real-time/streaming chat. If set, will connect.
- No backend required for local testing/demo.

## Theming & Style

- Uses an Ocean Professional palette: primary #2563EB, secondary/success #F59E0B, error #EF4444, gradient from-blue-500/10 to-gray-50, background #f9fafb, surface #fff, text #111827.
- Modern minimalist with subtle gradients, rounded corners, smooth transitions (see `src/app/globals.css`).

## How API/WS Are Detected

- **REST mode**: If `NEXT_PUBLIC_API_BASE` env is provided, sends POSTs to `{API_BASE}/chat`; else uses local mock simulating AI responses.
- **WebSocket mode**: If `NEXT_PUBLIC_WS_URL` is provided (and browser supports), client connects for streaming-like UI. This is optional.

## Running and Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Open browser at http://localhost:3000

# Run unit tests
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
npm test
```
- See `src/types.d.ts` for TypeScript types.
- Update your `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_WS_URL` as needed.

## Folder Structure

- `src/components/`: ChatWindow, MessageList, MessageInput
- `src/utils/`: API client (with fallback mock), WebSocket client
- `__tests__/`: Example test

