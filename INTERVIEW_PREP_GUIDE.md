# INDPRO Task Manager App: Learning and Interview Preparation Guide

## Phase 1: Project Explanation

### 1. Project Purpose
This project is a full-stack Task Manager application for the INDPRO internship assignment. It allows a user to register, log in, and manage personal tasks across three stages: `Todo`, `In Progress`, and `Done`.

### 2. Business Problem Solved
The app solves a simple productivity problem: a user needs one place to track tasks and their progress. It also demonstrates real-world application skills: authentication, protected APIs, database persistence, frontend state management, deployment, and error handling.

### 3. User Flow
1. User opens the frontend.
2. User registers or logs in.
3. Backend returns a JWT token.
4. Frontend stores the token.
5. User opens the dashboard.
6. User creates, edits, moves, or deletes tasks.
7. Backend saves task data in PostgreSQL.

### 4. Architecture
```text
React + Vite frontend
        |
        | Axios HTTP requests
        v
FastAPI backend
        |
        | SQLAlchemy ORM
        v
PostgreSQL database
```

### 5. Folder Structure
```text
backend/
  main.py
  database.py
  models.py
  schemas.py
  auth.py
  requirements.txt
  runtime.txt
  .python-version
  routers/
    auth_routes.py
    task_routes.py

frontend/
  src/
    api/
    components/
    context/
    pages/
    main.jsx
    App.jsx
    styles.css
  package.json
  vite.config.js
```

### 6. Frontend Architecture
The frontend uses React components, React Router for pages, Axios for API calls, and an Auth Context for token/user state. Pages handle workflows. Components handle reusable UI. API files isolate backend communication.

### 7. Backend Architecture
The backend uses FastAPI routers, Pydantic schemas for validation, SQLAlchemy models for database tables, a database session dependency, and JWT utilities for authentication.

### 8. Database Architecture
The app uses PostgreSQL in deployment. There are two main tables:
- `users`: stores account details and hashed passwords.
- `tasks`: stores task details and references the owner user.

## Phase 2: File-by-File Explanation

### Root Files

#### `.gitignore`
- Purpose: Prevents secrets, virtual environments, node modules, build files, and local database files from being committed.
- Connects to: Git/GitHub submission hygiene.
- Interview question: Why should `.env` not be committed?
- Best answer: It contains secrets such as database URLs and keys. Committing it can expose credentials.

#### `README.md`
- Purpose: Explains project overview, setup, endpoints, decisions, assumptions, deployment, and tradeoffs.
- Connects to: Recruiter/reviewer first impression.
- Interview question: Why is README important?
- Best answer: It helps reviewers run and understand the project without asking the developer.

#### `INTERVIEW_PREP_GUIDE.md`
- Purpose: Your personal explanation and interview-preparation guide.
- Connects to: Project defense and revision.
- Interview question: How did you prepare to explain your project?
- Best answer: I documented each layer: frontend, backend, database, auth, request flow, and tradeoffs.

### Backend Files

#### `backend/requirements.txt`
- Purpose: Lists Python dependencies.
- Does: Installs FastAPI, Uvicorn, SQLAlchemy, psycopg2, Passlib, bcrypt, JWT, dotenv, and Pydantic email validation.
- Connects to: Render build command `pip install -r requirements.txt`.
- Interview question: Why pin versions?
- Best answer: Pinning reduces deployment surprises and keeps local and production installs consistent.

#### `backend/runtime.txt`
- Purpose: Tells Render which Python version to use.
- Does: Pins Python 3.12.13.
- Connects to: Render deployment.
- Interview question: Why was runtime pinning needed?
- Best answer: Render attempted Python 3.14, and `pydantic-core` failed. Pinning Python 3.12 matched the tested environment.

#### `backend/.python-version`
- Purpose: Also documents the expected Python version.
- Connects to: Local/runtime tooling.
- Interview question: Is this mandatory?
- Best answer: Not always, but it helps platforms and developers use a compatible Python version.

#### `backend/.env.example`
- Purpose: Shows required environment variables without exposing real secrets.
- Connects to: `database.py`, `auth.py`, `main.py`.
- Interview question: Why use environment variables?
- Best answer: They separate configuration from code and keep secrets out of GitHub.

#### `backend/database.py`
- Purpose: Creates the database engine/session and initializes tables.
- Does: Reads `DATABASE_URL`, creates SQLAlchemy engine, defines `SessionLocal`, `Base`, `init_db`, and `get_db`.
- Connects to: `models.py` uses `Base`; routers use `get_db`; `main.py` calls `init_db`.
- Interview question: What is `get_db()`?
- Best answer: It is a FastAPI dependency that creates a database session for each request and closes it afterward.

#### `backend/models.py`
- Purpose: Defines database tables.
- Does: Creates `User` and `Task` SQLAlchemy ORM models.
- Connects to: Routers query these models; schemas serialize them.
- Interview question: What is the relationship between User and Task?
- Best answer: One user can have many tasks. `Task.owner_id` is a foreign key referencing `User.id`.

#### `backend/schemas.py`
- Purpose: Defines request/response validation models.
- Does: Validates user registration, login, task creation/update, token response, and allowed task stages.
- Connects to: FastAPI route `response_model` and request bodies.
- Interview question: Why separate schemas from models?
- Best answer: Models represent database structure; schemas represent API input/output validation.

#### `backend/auth.py`
- Purpose: Handles password hashing, JWT creation, and current-user validation.
- Does: Uses bcrypt via Passlib, creates JWT tokens, reads Bearer token, decodes user id.
- Connects to: Auth routes create tokens; task routes protect endpoints with `get_current_user`.
- Interview question: Why hash passwords?
- Best answer: If the database leaks, hashed passwords are not directly readable like plain text.

#### `backend/main.py`
- Purpose: FastAPI app entry point.
- Does: Configures lifespan startup, CORS, routers, and health check.
- Connects to: Render start command `uvicorn main:app`.
- Interview question: What is CORS?
- Best answer: Browser security that controls which frontend origins can call the backend.

#### `backend/routers/__init__.py`
- Purpose: Marks router directory as a Python package.
- Connects to: Importing routers in `main.py`.
- Interview question: Why split routes?
- Best answer: It keeps authentication and task logic organized and maintainable.

#### `backend/routers/auth_routes.py`
- Purpose: Register and login endpoints.
- Does: Checks duplicate user, hashes password, saves user, verifies password, returns JWT.
- Connects to: `auth.py`, `schemas.py`, `models.py`, `database.py`.
- Interview question: What happens in registration?
- Best answer: The backend validates input, checks uniqueness, hashes the password, saves the user, creates a JWT, and returns user info without password hash.

#### `backend/routers/task_routes.py`
- Purpose: Task CRUD endpoints.
- Does: Fetches, creates, updates, and deletes tasks for the current user only.
- Connects to: `get_current_user`, `Task` model, task schemas.
- Interview question: How do you prevent users from accessing other users' tasks?
- Best answer: Every task query filters by both task id and `owner_id == current_user.id`.

### Frontend Files

#### `frontend/package.json`
- Purpose: Lists npm dependencies and scripts.
- Connects to: Vercel build and local dev.
- Interview question: What does `npm run build` do?
- Best answer: It creates optimized static files in `dist` for deployment.

#### `frontend/package-lock.json`
- Purpose: Locks exact frontend dependency versions.
- Connects to: Reproducible installs.
- Interview question: Why commit lockfiles?
- Best answer: So everyone installs the same dependency tree.

#### `frontend/vite.config.js`
- Purpose: Configures Vite with React plugin.
- Connects to: Development server and production build.
- Interview question: Why Vite?
- Best answer: Fast dev server, simple setup, good React support.

#### `frontend/index.html`
- Purpose: HTML entry point.
- Connects to: Loads `src/main.jsx`.
- Interview question: Where does React mount?
- Best answer: Into the `div` with id `root`.

#### `frontend/eslint.config.js`
- Purpose: Code quality configuration.
- Connects to: `npm run lint`.
- Interview question: Why use ESLint?
- Best answer: It catches code issues and enforces consistency.

#### `frontend/src/main.jsx`
- Purpose: React app entry.
- Does: Sets up BrowserRouter, AuthProvider, routes, and protected dashboard route.
- Connects to: All pages and context.
- Interview question: Where are routes defined?
- Best answer: In `main.jsx`, using React Router.

#### `frontend/src/App.jsx`
- Purpose: Provides `Outlet` for nested routes.
- Connects to: React Router route layout.
- Interview question: What is `Outlet`?
- Best answer: It renders the matched child route.

#### `frontend/src/styles.css`
- Purpose: Global styling.
- Does: Handles responsive layout, forms, dashboard, task cards, errors, and loading states.
- Interview question: How is responsiveness handled?
- Best answer: CSS grid and media queries stack columns on smaller screens.

#### `frontend/src/api/axios.js`
- Purpose: Shared Axios instance.
- Does: Sets `baseURL` from `VITE_API_URL` and attaches JWT token to requests.
- Connects to: `authApi.js`, `taskApi.js`, localStorage.
- Interview question: Why use an Axios interceptor?
- Best answer: To add the Authorization header automatically for protected requests.

#### `frontend/src/api/authApi.js`
- Purpose: Auth API service layer.
- Does: Calls `/register` and `/login`.
- Connects to: Register/Login pages.
- Interview question: Why separate API services?
- Best answer: It keeps network logic separate from UI components.

#### `frontend/src/api/taskApi.js`
- Purpose: Task API service layer.
- Does: Calls GET, POST, PUT, DELETE `/tasks`.
- Connects to: Dashboard page.
- Interview question: What payload is sent to create a task?
- Best answer: `title`, `description`, and `stage`.

#### `frontend/src/context/AuthContext.jsx`
- Purpose: Central auth state.
- Does: Stores token/user in localStorage, exposes login session and logout.
- Connects to: ProtectedRoute, pages, Axios token storage.
- Interview question: Why use Context?
- Best answer: Auth state is needed across multiple components, so Context avoids prop drilling.

#### `frontend/src/components/ProtectedRoute.jsx`
- Purpose: Blocks dashboard access if not logged in.
- Connects to: `AuthContext`.
- Interview question: Is frontend route protection enough?
- Best answer: No. It improves UX, but backend protected endpoints provide real security.

#### `frontend/src/components/TaskForm.jsx`
- Purpose: Create/edit task form.
- Does: Manages form state and validation.
- Connects to: Dashboard submit handler.
- Interview question: How does edit mode work?
- Best answer: If `editingTask` exists, form fields are prefilled and submit calls update instead of create.

#### `frontend/src/components/TaskCard.jsx`
- Purpose: Displays one task.
- Does: Shows title, description, stage, date, edit/delete buttons, and stage selector.
- Connects to: TaskColumn and Dashboard handlers.
- Interview question: How is stage changed?
- Best answer: The select dropdown calls `onStageChange`, which sends a PUT request.

#### `frontend/src/components/TaskColumn.jsx`
- Purpose: Displays one stage column.
- Does: Renders tasks under Todo, In Progress, or Done.
- Connects to: Dashboard grouping logic.
- Interview question: Where are tasks grouped?
- Best answer: In Dashboard using `useMemo`, then passed into each column.

#### `frontend/src/pages/RegisterPage.jsx`
- Purpose: Registration UI.
- Does: Validates form, calls `registerUser`, saves token, redirects to dashboard.
- Connects to: `authApi`, `AuthContext`.
- Interview question: What happens after successful register?
- Best answer: Token and user are saved, then user is redirected to dashboard.

#### `frontend/src/pages/LoginPage.jsx`
- Purpose: Login UI.
- Does: Calls `loginUser`, saves token, redirects.
- Connects to: `authApi`, `AuthContext`.
- Interview question: Where is the JWT stored?
- Best answer: In localStorage under `task_manager_token`.

#### `frontend/src/pages/DashboardPage.jsx`
- Purpose: Main task board.
- Does: Fetches tasks, groups them by stage, handles create/update/delete/stage changes.
- Connects to: Task API service, task components, AuthContext.
- Interview question: Why use `useMemo`?
- Best answer: To avoid recalculating grouped tasks unless the task list changes.

## Phase 3: Request Flow

### Register Flow
```text
RegisterPage
→ authApi.registerUser()
→ Axios POST /register
→ FastAPI auth_routes.register()
→ Pydantic validates UserCreate
→ SQLAlchemy checks duplicate user
→ password is hashed
→ user is saved in PostgreSQL
→ JWT is created
→ React stores token and redirects
```

### Login Flow
```text
LoginPage
→ authApi.loginUser()
→ Axios POST /login
→ FastAPI auth_routes.login()
→ DB finds user by email
→ bcrypt verifies password
→ JWT created
→ frontend stores token
```

### Fetch Tasks Flow
```text
DashboardPage useEffect
→ taskApi.fetchTasks()
→ Axios GET /tasks with Authorization header
→ FastAPI get_current_user()
→ DB queries tasks by owner_id
→ tasks returned to React
```

### Create Task Flow
```text
TaskForm submit
→ Dashboard handleSubmit
→ POST /tasks
→ JWT identifies current user
→ task saved with owner_id
→ new task added to UI state
```

### Update Task / Stage Flow
```text
Edit form or stage dropdown
→ PUT /tasks/{id}
→ backend verifies owner
→ updates provided fields
→ frontend replaces updated task in state
```

### Delete Task Flow
```text
Delete button
→ confirmation
→ DELETE /tasks/{id}
→ backend verifies owner
→ deletes row
→ frontend removes task from state
```

## Phase 4: Database Deep Dive

### Users Table
Columns: `id`, `username`, `email`, `password_hash`.

### Tasks Table
Columns: `id`, `title`, `description`, `stage`, `owner_id`, `created_at`.

### Relationship
One user has many tasks. `tasks.owner_id` references `users.id`.

### Primary Key
A primary key uniquely identifies each row. In this project, `users.id` and `tasks.id` are primary keys.

### Foreign Key
A foreign key connects one table to another. `tasks.owner_id` links each task to a user.

### Indexes
Indexes help the database search faster. This project indexes user id/email/username and task fields like owner/stage/title.

### Why PostgreSQL?
PostgreSQL is reliable, relational, production-friendly, and supported by free providers like Neon and Render.

### Why Not MongoDB?
The data has clear relationships: users own tasks. SQL is a natural fit for relational data and ownership checks.

### Why SQLAlchemy?
SQLAlchemy lets Python code interact with SQL tables using ORM models while still supporting PostgreSQL cleanly.

## Phase 5: Authentication Deep Dive

### JWT
A JWT is a signed token that proves a user has logged in. Your token stores the user id in `sub`.

### Access Token
The access token is sent in the `Authorization: Bearer <token>` header for protected APIs.

### Password Hashing
Passwords are never stored directly. `passlib` + bcrypt converts passwords into secure hashes.

### Authorization
Authentication checks who the user is. Authorization checks what the user can access. Your task routes authorize by checking `owner_id`.

### Protected Routes
Frontend `ProtectedRoute` blocks UI access. Backend `get_current_user` protects actual data.

## Phase 6: FastAPI Interview Prep: 50 Questions With Short Answers

1. What is FastAPI? A modern Python web framework for APIs.
2. Why FastAPI? Fast, typed, auto docs, Pydantic integration.
3. What is a route? A URL endpoint mapped to a function.
4. What is APIRouter? A way to organize routes into modules.
5. What is Pydantic? Validation and serialization library.
6. What is `response_model`? Defines and filters API response shape.
7. What is dependency injection? FastAPI automatically provides reusable dependencies.
8. What is `Depends`? It declares a dependency like DB session/current user.
9. What is `get_db`? Request-scoped database session provider.
10. Why close DB sessions? To avoid connection leaks.
11. What is SQLAlchemy? Python ORM/database toolkit.
12. What is an ORM model? Python class mapped to a DB table.
13. What is `Base.metadata.create_all`? Creates tables from models.
14. Is `create_all` production migration? No, Alembic is better.
15. What is CORS? Browser rule controlling cross-origin requests.
16. Why configure CORS? Vercel frontend must call Render backend.
17. What is JWT? Signed token carrying claims.
18. What is Bearer auth? Token sent in Authorization header.
19. What is bcrypt? Password hashing algorithm.
20. Why not plain passwords? Data breach risk.
21. What is HTTP 201? Resource created.
22. What is HTTP 401? Not authenticated/invalid credentials.
23. What is HTTP 404? Resource not found.
24. What is HTTP 422? Validation failed.
25. Why use schemas? Separate API validation from DB models.
26. What is `EmailStr`? Pydantic email validation type.
27. What is an enum? Restricted set of allowed values.
28. How are task stages validated? `TaskStage` enum.
29. How prevent cross-user access? Filter by `owner_id`.
30. What is `exclude_unset`? Only update fields sent by client.
31. Why environment variables? Secure config outside code.
32. What is `DATABASE_URL`? DB connection string.
33. Why `pool_pre_ping`? Checks stale DB connections.
34. What is Uvicorn? ASGI server for FastAPI.
35. What is ASGI? Async Python web server interface.
36. Why Render? Free/simple backend hosting.
37. What is `runtime.txt`? Pins Python version on Render.
38. Why pin bcrypt? Compatibility with Passlib.
39. What is `load_dotenv`? Loads local `.env`.
40. What is a lifespan function? Startup/shutdown hook.
41. What happens on startup? Tables initialize.
42. Why no password in response? Security.
43. What is status code in decorators? Explicit API behavior.
44. What is `db.refresh`? Loads generated DB fields like id.
45. What is `db.commit`? Saves transaction.
46. What is `db.add`? Stages object for insert.
47. How test FastAPI? Swagger, curl, Postman, TestClient.
48. What is Swagger UI? Auto API documentation.
49. What deployment issue did you fix? Python 3.14 caused pydantic-core error; pinned 3.12.
50. What would you improve? Add Alembic, tests, refresh tokens, rate limiting.

## Phase 7: React Interview Prep: 50 Questions With Short Answers

1. What is React? UI library for component-based interfaces.
2. What is Vite? Fast frontend build tool/dev server.
3. What is a component? Reusable UI function.
4. What are props? Data passed from parent to child.
5. What is state? Component data that triggers re-render.
6. What is `useState`? Hook for local state.
7. What is `useEffect`? Runs side effects like API fetch.
8. What is `useMemo`? Memoizes calculated values.
9. What is React Router? Client-side routing.
10. What is `BrowserRouter`? Router using browser history.
11. What is `Navigate`? Redirect component.
12. What is protected route? Route blocked unless authenticated.
13. What is Context API? Shared state across components.
14. Why AuthContext? Stores token/user globally.
15. What is localStorage? Browser persistent key-value storage.
16. Why store token? Needed for protected requests.
17. Is localStorage perfect? No, cookies can be safer.
18. What is Axios? HTTP client.
19. What is Axios baseURL? Common backend URL.
20. What is interceptor? Runs before/after requests.
21. Why use API layer? Separates UI from networking.
22. How register works? Form submits to authApi.
23. How login works? Saves token then redirects.
24. How dashboard fetches tasks? `useEffect` calls fetchTasks.
25. How create task works? POST then update state.
26. How update works? PUT then replace task in state.
27. How delete works? DELETE then filter state.
28. How stage change works? PUT with `{stage}`.
29. What is controlled input? Input value controlled by React state.
30. What is form validation? Checking fields before API call.
31. What loading states exist? login/register/dashboard/save.
32. What error states exist? page errors and form errors.
33. Why responsive CSS? Works on desktop/mobile.
34. What is CSS grid? Layout system for columns.
35. Why component separation? Maintainability.
36. Why TaskCard? Reusable task UI.
37. Why TaskColumn? Groups tasks by stage.
38. What is conditional rendering? Render UI based on state.
39. What is `map` in React? Render lists.
40. Why use `key`? Helps React identify list items.
41. What is deployment env var? `VITE_API_URL`.
42. Why `VITE_` prefix? Vite exposes only prefixed env vars.
43. What is Vercel? Frontend deployment platform.
44. What is build output? Static files in `dist`.
45. What is SPA? Single Page Application.
46. Why redeploy after env change? Build-time env vars are baked into bundle.
47. What is UX? User experience.
48. What would improve UX? Better toasts, modals, optimistic updates.
49. What is a network error? API unreachable/CORS/backend failure.
50. What would you improve? Auto logout on 401, tests, better validation.

## Phase 8: Project Defense: 30 INDPRO-Style Questions

1. Why FastAPI? It is fast, beginner-friendly, typed, and gives Swagger docs.
2. Why React? It is widely used and good for component-based UI.
3. Why PostgreSQL? It is relational and production-friendly.
4. Why JWT? Stateless authentication for APIs.
5. Why SQLAlchemy? It maps Python classes to database tables cleanly.
6. Why separate routers? Better organization.
7. Why separate schemas/models? API validation differs from DB structure.
8. Why hash passwords? Security.
9. How are tasks protected? JWT identifies user; queries filter owner_id.
10. What happens if token is missing? Backend returns 403/401 via HTTPBearer/JWT validation.
11. What is the weakest part? No automated tests/migrations yet.
12. How would you scale? Add migrations, tests, pagination, better auth, monitoring.
13. Why not microservices? Too complex for small assignment.
14. Why no Docker? Assignment asked to avoid unnecessary complexity.
15. Why Vercel? Easy Vite deployment.
16. Why Render? Simple FastAPI hosting.
17. Why Neon? Free hosted PostgreSQL.
18. How did you handle deployment errors? Pinned Python runtime.
19. How did you handle bcrypt issue? Pinned bcrypt 4.0.1.
20. How does frontend know backend URL? `VITE_API_URL`.
21. How does backend allow frontend? `FRONTEND_ORIGIN` CORS.
22. What is one security risk? JWT in localStorage.
23. How improve security? HttpOnly cookies, refresh tokens, rate limits.
24. How test manually? Swagger, PowerShell, frontend flows.
25. How debug CORS? Check browser Network/Console and origins.
26. What data should never be returned? Password hash.
27. Why enum for stage? Prevent invalid stages.
28. How update only stage? PUT with partial payload `{stage}`.
29. What happens on duplicate register? 400 error.
30. Why should we select you? I built, deployed, debugged, and can explain the full stack.

## Phase 9: Mock Interview

### Round 1: HR
- Tell me about yourself. Answer: I am a fresher focused on full-stack development, and I built a deployed task manager using React, FastAPI, PostgreSQL, and JWT.
- Why INDPRO? Answer: The assignment values practical implementation, clean structure, and ownership, which matches how I like to learn.
- Biggest challenge? Answer: Deployment issues with Python versions and database URLs; I solved them by reading logs and configuring runtime/env vars.

### Round 2: Technical
- Explain JWT. Answer: A signed token returned after login and sent in request headers to access protected APIs.
- Explain SQLAlchemy. Answer: It lets Python classes represent database tables and simplifies queries.
- Explain React state. Answer: State stores dynamic UI data and triggers re-render when changed.

### Round 3: Project Discussion
- Walk me through your app. Answer: Register/login creates a JWT; dashboard fetches user tasks; users can create/update/delete tasks; backend protects each route and stores data in PostgreSQL.

### Round 4: Coding
- Validate a task stage. Answer: Use enum/allowed list and reject invalid values.
- Filter tasks by user. Answer: Query tasks where `owner_id == current_user.id`.

### Round 5: Behavioral
- What if production fails? Answer: Check logs, identify failing layer, reproduce locally if possible, then fix configuration/code and redeploy.

## Phase 10: Weakness Analysis

Priority 1:
- Explain JWT deeply.
- Explain database relationships and SQL queries.
- Explain CORS and deployment environment variables.

Priority 2:
- Learn Alembic migrations.
- Learn backend testing with Pytest/TestClient.
- Learn frontend testing basics.

Priority 3:
- Improve security answer: localStorage tradeoff, refresh tokens, HttpOnly cookies.
- Improve performance answer: pagination, indexes, caching where needed.

Interview risks:
- Confusing authentication vs authorization.
- Not knowing why `DATABASE_URL` differs locally and in Render.
- Not knowing why Vite env vars require redeploy.
- Not explaining ownership filtering clearly.

## Phase 11: INDPRO Preparation

Based on the assignment, INDPRO appears to value:
- Small but complete implementation.
- Clean code and structure.
- Working deployment.
- Ability to use AI responsibly while still implementing backend.
- Practical understanding over over-engineering.

Likely evaluation areas:
- Can you build a working CRUD app?
- Can you explain your own code?
- Can you debug deployment?
- Can you handle auth and database basics?
- Did you avoid unnecessary complexity?

Common candidate mistakes:
- Only frontend, no backend.
- Broken deployment link.
- No README.
- Hardcoded secrets.
- No error/loading states.
- Not knowing how JWT or database relationships work.

Public research note: I found limited public INDPRO-specific internship information. The strongest signals come from the assignment itself. Some public INDPRO job listings emphasize React/Node-style web development and practical project ability, which aligns with this assignment.

## Phase 12: 7-Day Preparation Plan

Day 1: Project Understanding
- Draw full architecture.
- Explain every file aloud.
- Practice 5-minute project walkthrough.

Day 2: FastAPI
- Study routers, dependencies, Pydantic, status codes.
- Re-test Swagger endpoints.

Day 3: React
- Study hooks, routing, Context, Axios, state updates.
- Explain each component.

Day 4: Database
- Practice SQL queries: SELECT, JOIN, WHERE.
- Explain PK/FK/indexes/relationships.

Day 5: JWT/Auth
- Explain login/register/token/protected route flow.
- Study bcrypt and why passwords are hashed.

Day 6: Mock Interviews
- Practice HR, technical, and project questions.
- Record yourself explaining the app.

Day 7: Final Revision
- Test live links.
- Check README.
- Review weak points.
- Prepare final demo script.

## Phase 13: Final Evaluation

Backend Readiness: 8/10
- Strong for internship. Improve with tests and migrations.

Frontend Readiness: 7.5/10
- Functional and clean. Improve with better UI feedback and auto logout.

Interview Readiness: 6.5/10 now, 8/10 if you study this guide.
- You have working experience, but must explain concepts clearly.

Communication Readiness: 6.5/10
- Improve concise explanations and avoid guessing. Use flows and examples.

Estimated selection probability:
- With deployed links working and confident explanation: 75-85%.
- If unable to explain code/auth/database: 45-55%.

Final recommendation:
- Submit only after verifying frontend, backend, README links, and database work from a fresh browser.
- In interview, be honest: "I used AI assistance, so I made sure to implement and understand the backend, test APIs, deploy, and debug production issues."
