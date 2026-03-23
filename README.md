# DevTrack | Professional Task Management

**Live Demo**: [Frontend](https://web-project-xi-rose.vercel.app/) | [API Backend](https://web-project-production-1d14.up.railway.app/)

A focused, high-performance project tracking system built with a decoupled Django/React architecture. DevTrack moves beyond basic "todo" apps by implementing a fully normalized relational structure and a premium, responsive interface tailored for developer workflows.

## Technical Architecture

### Relational Data Model
The backend implements a multi-tier database schema designed for data integrity and scalability:
- **Projects**: The root entity for grouping workstreams.
- **Tasks**: Granular action items with strictly typed priority and status states.
- **Comments**: Threaded feedback loop linked to tasks and users.
- **Normalization**: Enforced through primary/foreign key constraints with `CASCADE` and `SET_NULL` logic to prevent orphaned records.

### Database Schema

| Table | Fields | Relations / Constraints |
| :--- | :--- | :--- |
| **Project** | `id`, `name`, `description`, `status`, `created_at`, `updated_at` | `owner` (FK → User, CASCADE) |
| **Task** | `id`, `title`, `description`, `priority`, `status`, `due_date`, `created_at`, `updated_at` | `project` (FK → Project, CASCADE), `assigned_to` (FK → User, SET_NULL) |
| **Comment** | `id`, `body`, `created_at` | `task` (FK → Task, CASCADE), `author` (FK → User, CASCADE) |

### REST API & Security
The API is built on Django REST Framework, prioritizing security and clear contract definition:
- **Stateless Auth**: Implements JWT (JSON Web Tokens) with a secure rotation strategy to manage user sessions without server-side state.
- **Strict Permissions**: Custom `IsOwner` permission classes ensure users can only access or modify their own data.
- **Input Validation**: Layered validation at both the serializer and model levels, with comprehensive error responses for the frontend.

### Frontend Implementation
A modern React application built for speed and responsiveness:
- **State Management**: Uses React Context API for reactive authentication and user session persistence.
- **Component Architecture**: Modular design with reusable UI primitives (cards, modals, form inputs) to ensure consistency across the app.
- **Responsive Systems**: CSS-grid and Flexbox-based layout that adapts fluidly from mobile breakpoints to wide-screen monitors.
- **UX Details**: Built-in glassmorphism effects, smooth transitions, and real-time form validation for a premium feel.

## Local Development

### Backend
Requires Python 3.10+
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
Requires Node.js 18+
```bash
cd frontend
npm install
npm run dev
```

## Environment Configuration

To get the project running, you must configure the environment variables for both the frontend and backend. 

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Create a `.env` file from the provided example:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and set `VITE_API_URL`:
   - **Local Development**: Set to `http://localhost:8000`.
   - **Production (Vercel)**: Set to your Railway backend URL (e.g., `https://web-project-production-1d14.up.railway.app`).

### Backend Setup
The backend uses environment variables for secure production configuration. Ensure the following are set in your environment (or a `.env` file in the `backend/` directory):
- `DATABASE_URL`: Connection string for your database (PostgreSQL recommended for production).
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins (e.g., `https://web-project-xi-rose.vercel.app`).
- `CSRF_TRUSTED_ORIGINS`: Same as above, required for mutation security.
- `SECRET_KEY`: A secure random string for Django's security.
- `DEBUG`: Set to `False` in production.

## Key Endpoints
- `/api/auth/register/` - User registration
- `/api/auth/login/` - JWT token acquisition
- `/api/projects/` - Project CRUD (GET/POST/DELETE)
- `/api/projects/{id}/tasks/` - Task management within specific project context
- `/api/tasks/{id}/comments/` - Interaction and feedback system
