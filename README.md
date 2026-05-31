# Task Manager App

A complete internship-level full-stack Task Manager application built with React, Vite, Axios, FastAPI, SQLAlchemy, PostgreSQL, and JWT authentication.

Users can register, log in, and manage their own tasks across three stages: `Todo`, `In Progress`, and `Done`.

## Live Links

- Frontend: [https://task-manager-pied-three-21.vercel.app](https://task-manager-pied-three-21.vercel.app)
- Backend API: [https://task-manager-1-ah3a.onrender.com](https://task-manager-1-ah3a.onrender.com)
- API Docs: [https://task-manager-1-ah3a.onrender.com/docs](https://task-manager-1-ah3a.onrender.com/docs)

## Features

- User registration and login
- JWT-based authentication
- Protected dashboard route
- Create, read, update, and delete tasks
- Change task stage from the dashboard
- User-specific task ownership
- Responsive three-column dashboard
- Loading, empty, validation, and error states
- Clean project structure suitable for internship evaluation

## Tech Stack

Frontend:

- React
- Vite
- Axios
- React Router

Backend:

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT with `python-jose`
- Password hashing with `passlib`

## Folder Structure

```text
task-manager-app/
  backend/
    routers/
      __init__.py
      auth_routes.py
      task_routes.py
    .env.example
    auth.py
    database.py
    main.py
    models.py
    requirements.txt
    schemas.py
  frontend/
    src/
      api/
        authApi.js
        axios.js
        taskApi.js
      components/
        ProtectedRoute.jsx
        TaskCard.jsx
        TaskColumn.jsx
        TaskForm.jsx
      context/
        AuthContext.jsx
      pages/
        DashboardPage.jsx
        LoginPage.jsx
        RegisterPage.jsx
      App.jsx
      main.jsx
      styles.css
    .env.example
    eslint.config.js
    index.html
    package-lock.json
    package.json
    vercel.json
    vite.config.js
  .gitignore
  INTERVIEW_PREP_GUIDE.md
  README.md
```

`.gitignore`

- Keeps generated files out of Git.
- Excludes Python caches, virtual environments, frontend dependencies, build output, local database files, and private environment files.

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs at:

```text
http://localhost:8000
```

FastAPI docs are available at:

```text
http://localhost:8000/docs
```

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Environment Variables

Backend `.env.example`:

```text
DATABASE_URL=postgresql://username:password@host:5432/taskmanager
SECRET_KEY=replace-with-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_ORIGIN=http://localhost:5173
```

Frontend `.env.example`:

```text
VITE_API_URL=http://localhost:8000
```

For production, set `VITE_API_URL` to the Render backend URL.

## API Endpoints

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| POST | `/register` | No | Register a new user and return a JWT |
| POST | `/login` | No | Log in and return a JWT |
| GET | `/tasks` | Yes | Fetch the current user's tasks |
| POST | `/tasks` | Yes | Create a task for the current user |
| PUT | `/tasks/{id}` | Yes | Update a current user's task |
| DELETE | `/tasks/{id}` | Yes | Delete a current user's task |

## Database Tables

Users table:

- `id`
- `username`
- `email`
- `password_hash`

Tasks table:

- `id`
- `title`
- `description`
- `stage`
- `owner_id`
- `created_at`

Allowed task stages:

- `Todo`
- `In Progress`
- `Done`

## File Explanations

### Backend Files

`backend/requirements.txt`

- Lists all Python packages needed by the backend.
- Render uses this file to install dependencies before starting the FastAPI app.

`backend/database.py`

- Creates the PostgreSQL database connection from `DATABASE_URL`.
- Defines the SQLAlchemy `Base` class used by models.
- Provides `get_db()`, which gives each API request a database session.

`backend/models.py`

- Defines the `User` and `Task` database tables.
- Connects users and tasks with a relationship.
- Each task has an `owner_id`, so tasks belong to one user.

`backend/schemas.py`

- Defines Pydantic request and response models.
- Validates incoming data like email, password length, task title, and task stage.
- Controls which fields are returned to the frontend.

`backend/auth.py`

- Hashes passwords before saving them.
- Verifies passwords during login.
- Creates JWT access tokens.
- Reads the `Authorization` header and finds the currently logged-in user.

`backend/routers/auth_routes.py`

- Contains `POST /register` and `POST /login`.
- Registers new users, checks duplicate email or username, verifies login credentials, and returns JWT tokens.

`backend/routers/task_routes.py`

- Contains all task CRUD endpoints.
- Requires a valid JWT for every task route.
- Filters every task query by `owner_id` so users only access their own tasks.

`backend/main.py`

- Creates the FastAPI app.
- Creates database tables.
- Configures CORS so the React app can call the backend.
- Connects the authentication and task routers.

`backend/.env.example`

- Shows the backend environment variables needed for local and production setup.
- `SECRET_KEY` must be changed in production.

### Frontend Files

`frontend/package.json`

- Lists frontend dependencies and scripts.
- `npm run dev` starts development.
- `npm run build` creates the production build for Vercel.

`frontend/index.html`

- The HTML entry point for Vite.
- Loads React through `src/main.jsx`.

`frontend/vite.config.js`

- Configures Vite with the React plugin.

`frontend/vercel.json`

- Configures Vercel rewrites so refreshing `/login`, `/register`, or `/dashboard` serves the React app instead of returning a 404.

`frontend/.env.example`

- Shows the frontend API URL variable.
- `VITE_API_URL` tells Axios where the FastAPI backend is hosted.

`frontend/eslint.config.js`

- Provides linting rules for React code quality.

`frontend/src/main.jsx`

- Starts the React app.
- Sets up routes for register, login, and dashboard.
- Wraps the app in `AuthProvider`.

`frontend/src/App.jsx`

- Provides the route outlet used by React Router.

`frontend/src/api/axios.js`

- Creates a shared Axios client.
- Reads the JWT token from local storage.
- Adds `Authorization: Bearer <token>` to protected API requests.

`frontend/src/api/authApi.js`

- Contains frontend functions for `/register` and `/login`.
- Keeps authentication API calls separate from UI components.

`frontend/src/api/taskApi.js`

- Contains frontend functions for task CRUD endpoints.
- Used by the dashboard page to fetch, create, update, and delete tasks.

`frontend/src/context/AuthContext.jsx`

- Stores authentication state.
- Saves and removes the JWT token and user data in local storage.
- Gives pages access to `isAuthenticated`, `user`, `saveSession`, and `logout`.

`frontend/src/components/ProtectedRoute.jsx`

- Prevents unauthenticated users from opening the dashboard.
- Redirects logged-out users to `/login`.

`frontend/src/components/TaskForm.jsx`

- Handles creating and editing tasks.
- Includes basic validation and saving state.

`frontend/src/components/TaskCard.jsx`

- Displays a single task card.
- Includes title, description, stage, edit button, delete button, and stage selector.

`frontend/src/components/TaskColumn.jsx`

- Displays one dashboard column.
- Groups task cards under `Todo`, `In Progress`, or `Done`.

`frontend/src/pages/RegisterPage.jsx`

- Shows the registration form.
- Calls the backend register endpoint.
- Stores the returned JWT token after successful registration.

`frontend/src/pages/LoginPage.jsx`

- Shows the login form.
- Calls the backend login endpoint.
- Stores the returned JWT token after successful login.

`frontend/src/pages/DashboardPage.jsx`

- Fetches the logged-in user's tasks.
- Manages create, edit, delete, and stage changes.
- Displays the three-column board.

`frontend/src/styles.css`

- Contains all app styling.
- Handles responsive layout, forms, cards, loading states, and error states.

## How Frontend Communicates With Backend

The frontend uses Axios. The base backend URL is configured in:

```text
frontend/src/api/axios.js
```

During development, it uses:

```text
http://localhost:8000
```

In production, Vercel should define:

```text
VITE_API_URL=https://your-render-service.onrender.com
```

The API files call backend endpoints:

- `authApi.js` calls `/register` and `/login`
- `taskApi.js` calls `/tasks`

For protected requests, Axios automatically attaches the saved JWT token in the request header:

```text
Authorization: Bearer your-token-here
```

## How JWT Authentication Works

1. A user registers or logs in.
2. The backend verifies the data.
3. The backend creates a JWT token with the user's id inside the token subject.
4. The frontend stores the token in `localStorage`.
5. Protected frontend routes check whether a token exists.
6. Protected API calls send the token in the `Authorization` header.
7. The backend decodes the token in `get_current_user()`.
8. If the token is valid, the backend loads the user from the database.
9. If the token is missing or invalid, the backend returns `401 Unauthorized`.

## How Task CRUD Works

Create:

- The dashboard sends `title`, `description`, and `stage` to `POST /tasks`.
- The backend adds the current user's id as `owner_id`.
- The new task is returned and added to the board.

Read:

- The dashboard calls `GET /tasks`.
- The backend returns only tasks where `owner_id` matches the logged-in user.

Update:

- Editing a task sends changed fields to `PUT /tasks/{id}`.
- Changing the stage also uses `PUT /tasks/{id}` with only the `stage` field.
- The backend checks ownership before updating.

Delete:

- The dashboard calls `DELETE /tasks/{id}`.
- The backend checks ownership before deleting.
- The frontend removes the deleted task from the UI.

## Deployment Instructions

### Backend on Render

1. Push the project to GitHub.
2. Create a new Render Web Service.
3. Select the repository.
4. Set the root directory to `backend`.
5. Use this build command:

```bash
pip install -r requirements.txt
```

6. Use this start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

7. Add environment variables:

```text
DATABASE_URL=your-postgresql-connection-url
SECRET_KEY=your-production-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```

### Frontend on Vercel

1. Import the GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Use the default Vite build settings.
4. Add environment variable:

```text
VITE_API_URL=https://your-render-service.onrender.com
```

5. Deploy.

After deployment, update the backend `FRONTEND_ORIGIN` in Render to match the final Vercel URL.

Note: free backend services can sleep when inactive. If the first login/register request is slow, wait briefly and try again.

## Assumptions

- Email is used for login.
- Usernames and emails must be unique.
- PostgreSQL is used for local development and Render deployment compatibility.
- Tasks are private to the user who created them.
- Allowed stages are exactly `Todo`, `In Progress`, and `Done`.

## Technical Decisions

- SQLAlchemy ORM keeps database access clear and beginner-friendly.
- Pydantic schemas separate request validation from database models.
- Routers keep auth and task endpoints organized.
- Axios API modules keep network logic out of React pages.
- Auth context centralizes login, logout, and token storage.
- Local storage is used for simplicity in an internship-level project.

## Tradeoffs

- PostgreSQL requires more setup than SQLite, but it is better aligned with hosted production deployment.
- JWT is stored in local storage for simplicity. HttpOnly cookies can be safer for advanced production systems.
- The app avoids drag-and-drop to keep dependencies minimal and the code easier to review.
- Database migrations are not included because the assignment asks for a small clean implementation, not enterprise architecture.

## Future Improvements

- Add task due dates and priorities.
- Add search and filters.
- Add drag-and-drop stage changes.
- Add Alembic database migrations.
- Add automated backend and frontend tests.
- Add refresh tokens or HttpOnly cookie authentication.
