# Community Forum App

A modern forum application built with React + Vite frontend and json-server backend.

## Features

- Create and view posts
- Add comments to posts
- Like posts and comments
- Search and filter posts
- Dark/Light theme toggle
- Optimistic UI updates
- Responsive design

## Tech Stack

### Frontend
- React 18.2.0
- Vite 5.0.0
- React Router 6.14.1
- React Query (@tanstack/react-query 5.90.20)
- Redux Toolkit 2.11.2

### Backend
- json-server-auth

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/24-Harshdeep/Forum.git
cd Forum
```

2. Install root dependencies
```bash
npm install
```

3. Install client dependencies
```bash
cd client
npm install
cd ..
```

### Running the Application

1. Start the backend server (from root directory):
```bash
npx json-server-auth db.json --port 3001 --host 0.0.0.0
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
Forum/
├── client/                 # React frontend
│   ├── src/
│   │   ├── features/      # Feature-based components
│   │   │   └── posts/     # Post-related components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   ├── api.js         # API functions
│   │   ├── store.js       # Redux store
│   │   └── userSlice.js   # Redux slice
│   ├── index.html
│   ├── vite.config.mjs
│   └── package.json
├── db.json                # Database file
├── api.rest              # API testing file
└── package.json          # Root package.json
```

## Available Scripts

### Backend
- `npm start` - Start json-server on port 3001

### Frontend (in client directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post
- `PATCH /posts/:id` - Update post (like)
- `GET /comments?postId=:id` - Get comments for post
- `POST /comments` - Create new comment
- `PATCH /comments/:id` - Update comment (like)

## License

MIT
