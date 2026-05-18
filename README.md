# wexa-ai

A full-stack web application featuring a modern React frontend (Next.js) and a robust Python backend (Django).

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS v4, Shadcn UI
- **State Management:** Zustand, React Query (@tanstack/react-query)
- **Form Handling:** React Hook Form, Zod
- **Real-time:** Socket.io-client
- **Package Manager:** Bun

### Backend
- **Framework:** Django 6, Django REST Framework
- **Asynchronous Tasks:** Celery, Redis
- **Real-time:** Django Channels
- **Database:** PostgreSQL (psycopg2)
- **Package Manager:** uv

## 📂 Project Structure

- `/frontend` - Next.js application containing all UI components, pages, and frontend logic.
- `/backend` - Django application containing API endpoints, database models, and background tasks.

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) & [Bun](https://bun.sh/)
- [Python 3.14+](https://www.python.org/)
- [uv](https://github.com/astral-sh/uv) (Python package manager)
- PostgreSQL
- Redis (for Celery and Channels)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies using `uv`:
   ```bash
   uv sync
   ```
3. Set up your environment variables by creating a `.env` file (you can use a `.env.example` if available).
4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
5. Run the development server:
   ```bash
   python manage.py runserver
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies using `bun`:
   ```bash
   bun install
   ```
3. Set up environment variables by copying the example file:
   ```bash
   cp example.env.local .env.local
   ```
4. Run the development server:
   ```bash
   bun run dev
   ```

## 📝 License
This project is licensed under the MIT License.
