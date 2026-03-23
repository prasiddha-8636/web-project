# DevTrack

DevTrack is a high-end, minimalist project and task management system built with Django and React. It features a modern dark-themed UI, secure JWT authentication, and full CRUD operations for Projects, Tasks, and Comments.

## Features

- **Project Management**: Create, view, and organize multiple projects.
- **Task Tracking**: Manage tasks within projects with custom priority and status levels.
- **Collaboration**: Add comments to tasks to keep track of progress and discussions.
- **Secure Auth**: Modern authentication flow using JWT (JSON Web Tokens).
- **Responsive Design**: Fully optimized for both desktop and mobile devices.
- **Modern UI**: Polished aesthetic with glassmorphism and smooth transitions.

## Tech Stack

- **Backend**: Django, Django REST Framework, SimpleJWT.
- **Frontend**: React (Vite), Axios, React Router.
- **Database**: SQLite (Development) / PostgreSQL (Production ready).
- **Styling**: Vanilla CSS with modern custom properties.

## Getting Started

### Backend Setup

1. Navigate to the `backend/` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `source venv/bin/activate` (Linux) or `venv\Scripts\activate` (Windows).
4. Install dependencies: `pip install -r requirements.txt`. (Note: Ensure requirements.txt is present or install manually: django djangorestframework djangorestframework-simplejwt django-cors-headers dj-database-url whitenoise python-dotenv)
5. Run migrations: `python manage.py migrate`.
6. Start the server: `python manage.py runserver`.

### Frontend Setup

1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## API Endpoints

- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `GET /api/projects/` - List all projects for authenticated user
- `POST /api/projects/` - Create a new project
- `GET /api/projects/{id}/tasks/` - List all tasks for a project
- `PATCH /api/tasks/{id}/` - Update task status, priority, or details
- `POST /api/tasks/{id}/comments/` - Add a comment to a task
