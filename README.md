
# GenTree - Family Tree Management System

A production-ready family tree management application built with React, TypeScript, and Spring Boot.

## Features

- **Interactive Tree Canvas**: Zoomable and pannable canvas with SVG connections
- **CRUD Operations**: Add, edit, and delete family members with validation
- **Smart Search**: DFS-based search by middle name and last name
- **Authentication**: Login and registration with validation
- **Responsive Design**: Modern UI following the Heritage & Modernity design system
- **Backend API**: RESTful Spring Boot API with PostgreSQL integration

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui components
- React Zoom Pan Pinch (canvas interactions)
- Zustand (state management)
- React Router (navigation)

### Backend
- Spring Boot 3.2
- H2 in-memory database by default
- PostgreSQL support via explicit profile
- JPA/Hibernate
- Maven

## Project Structure

```
GenTree/
├── src/                          # Frontend source
│   ├── app/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── store/                # Zustand state management
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # Utility functions
│   ├── styles/                   # CSS styles
│   └── main.tsx                  # App entry point
├── backend/                      # Spring Boot backend
│   ├── src/main/java/com/gentree/
│   │   ├── GenTreeApplication.java
│   │   ├── FamilyMember.java     # JPA entity
│   │   ├── FamilyMemberRepository.java
│   │   └── MemberService.java    # REST controller
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── package.json                  # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 13+

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Backend Setup

The backend uses an in-memory H2 database by default for local development, so no PostgreSQL setup is required to run the app locally.

1. Run the Spring Boot application using the default H2 database:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. If you want to use PostgreSQL instead, first create the database and user:
   ```sql
   CREATE DATABASE gentree;
   CREATE USER gentree_user WITH PASSWORD 'gentree_password';
   GRANT ALL PRIVILEGES ON DATABASE gentree TO gentree_user;
   ```

3. Then run Spring Boot with the `postgres` profile enabled:
   ```bash
   cd backend
   SPRING_PROFILES_ACTIVE=postgres mvn spring-boot:run
   ```

4. Optional environment variables for PostgreSQL:
   - `DB_URL` (default: `jdbc:postgresql://localhost:5432/gentree`)
   - `DB_USER` (default: `gentree_user`)
   - `DB_PASS` (default: `gentree_password`)
   - `SERVER_PORT` (default: `8080`)

## API Endpoints

- `GET /api/members` - Get all family members
- `GET /api/members/{id}` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Delete member (cascades to children)

## Key Features Implementation

### Tree Data Structure
- Recursive N-ary tree with hierarchical member IDs (e.g., "1.2.3")
- DFS-based search and filtering
- Automatic ID generation based on parent-child relationships

### State Management
- Global tree state with Zustand
- Efficient updates without full re-renders
- Memoized computations for performance

### UI/UX
- Heritage & Modernity color palette
- Responsive design with atomic components
- Interactive canvas with zoom/pan controls
- Smart parent selection with autocomplete
- Real-time search highlighting

## Validation Rules

- First name, last name, and DOB are required
- Date of death cannot be before date of birth
- Deceased members show 90% opacity
- Hierarchical member IDs are immutable
- Cascade deletion for subtrees

## Development

### TypeScript
- Strict type checking enabled
- All components properly typed
- API responses mapped to TypeScript interfaces

### Testing
- Build passes without errors
- TypeScript compilation clean
- Component props validated

## Contributing

1. Follow the established code structure
2. Maintain TypeScript strictness
3. Update documentation for API changes
4. Test builds before committing

## License

This project is part of the GenTree family tree management system.
  