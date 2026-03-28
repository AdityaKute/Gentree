# GenTree Project Context

This document provides a comprehensive overview of the GenTree project, intended to be used as a context file for AI-driven development.

## 1. Project Overview

GenTree is a full-stack family tree management application. It features an interactive, zoomable, and pannable family tree canvas on the frontend and a robust RESTful API on the backend.

- **Frontend:** A modern, responsive single-page application (SPA) built with **React** and **TypeScript**.
- **Backend:** A **Spring Boot** application providing a REST API for data management.
- **Database:** Uses an **H2 in-memory database** by default, with optional **PostgreSQL** support.

## 2. Tech Stack

### Frontend
- **Framework/Library:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** Zustand
- **Routing:** React Router
- **Canvas Interaction:** React Zoom Pan Pinch

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Data Access:** Spring Data JPA (Hibernate)
- **Database:** H2 (default), PostgreSQL (optional)
- **Build Tool:** Maven

## 3. Project Structure

```
/
├── backend/                  # Java Spring Boot backend application
│   ├── pom.xml               # Maven build configuration
│   └── src/main/java/        # Java source code
│       └── com/gentree/
│           ├── GenTreeApplication.java   # Spring Boot main class
│           ├── FamilyMember.java         # JPA Entity
│           ├── MemberService.java        # REST Controller & Service Logic
│           └── FamilyMemberRepository.java # Spring Data Repository
├── src/                      # React frontend application
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (TreeCanvas, Settings, etc.)
│   │   ├── store/            # Zustand global state store
│   │   └── types/            # TypeScript type definitions (member.ts)
│   ├── main.tsx              # Frontend entry point
│   └── styles/               # Global CSS and Tailwind configuration
├── package.json              # Frontend dependencies and scripts
└── README.md                 # Original project README
```

## 4. How to Build, Run, and Test

### Frontend

- **Install Dependencies:**
  ```bash
  npm install
  ```
- **Run Development Server:**
  ```bash
  npm run dev
  ```
  This starts the Vite development server, typically on `http://localhost:5173`.

- **Build for Production:**
  ```bash
  npm run build
  ```
  This creates a `dist` directory with optimized, static assets.

### Backend

The backend uses an in-memory H2 database by default, so no external database setup is required for local development.

1.  **Run Application (Default H2):**
    -   Navigate to the `backend` directory.
    -   Use Maven to run the Spring Boot application:
        ```bash
        cd backend
        mvn spring-boot:run
        ```
    -   The backend API will be available on `http://localhost:8080`. The H2 console can be accessed at `http://localhost:8080/h2-console`.

2.  **Run Application (Optional PostgreSQL):**
    -   First, ensure PostgreSQL is running and set up the database and user:
        ```sql
        CREATE DATABASE gentree;
        CREATE USER gentree_user WITH PASSWORD 'gentree_password';
        GRANT ALL PRIVILEGES ON DATABASE gentree TO gentree_user;
        ```
    -   Run the Spring Boot application with the `postgres` profile enabled:
        ```bash
        cd backend
        SPRING_PROFILES_ACTIVE=postgres mvn spring-boot:run
        ```
    -   You can also configure the database connection using environment variables (`DB_URL`, `DB_USER`, `DB_PASS`).

## 5. Architectural Conventions & Key Logic

### Frontend
- **Component-Based:** The UI is built with reusable React components, many of which come from the `shadcn/ui` library.
- **State Management:** Global application state (like the family tree data) is managed in `src/app/store/useTreeStore.tsx` using Zustand. This provides a centralized and efficient way to manage and update the tree.
- **Data Fetching:** The frontend interacts with the backend API to fetch and update family member data. API calls are mapped to TypeScript interfaces defined in `src/app/types/member.ts`.
- **Tree Rendering:** The family tree is rendered on a canvas using `react-zoom-pan-pinch` for interactivity. The hierarchical structure is visualized with lines connecting parent and child nodes.

### Backend
- **RESTful API:** The backend exposes a set of REST endpoints for CRUD operations on family members (see `MemberService.java`).
- **JPA/Hibernate:** Object-Relational Mapping is handled by Spring Data JPA. The `FamilyMember.java` class is the primary entity, mapping to the `family_member` table in the database.
- **Service Layer:** Business logic (creating, updating, deleting members) is encapsulated in the `MemberService.java` class.
- **Hierarchical IDs:** The application uses a string-based hierarchical ID system (e.g., "1", "1.1", "1.1.2") to represent parent-child relationships within the tree structure. This is a key concept for tree manipulation and search aoperations.

## 6. API Endpoints

The core API endpoints are defined in `MemberService.java`:

- `GET /api/members`: Retrieves all family members.
- `GET /api/members/{id}`: Retrieves a single member by their ID.
- `POST /api/members`: Creates a new family member.
- `PUT /api/members/{id}`: Updates an existing family member.
- `DELETE /api/members/{id}`: Deletes a member and their descendants.
