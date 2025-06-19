# Marketin Agent

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [pnpm](https://pnpm.io/) (package manager, version 7 or higher)

You can install pnpm globally with:

```bash
npm install -g pnpm
```

### Steps to install and run the project

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd marketing-project-ai-summer
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open your browser at [http://localhost:5173](http://localhost:5173) to view the application.

## Project Structure

This project follows a modular architecture, organized primarily by feature (modules) with a shared layer for reusable elements. The structure is designed for scalability, maintainability, and effective team collaboration.

```
📂 src/
 ┣ 📂 assets/             # Static resources (images, icons, etc.)
 ┣ 📂 core/               # Core infrastructure and shared services
 ┣ 📂 modules/            # Feature-based organization
 ┣ 📂 shared/             # Reusable components, hooks, and utilities
 ┣ 📜 App.tsx             # Main application component
 ┣ 📜 main.tsx            # Application entry point
 ┗ 📜 index.css           # Global styles
```

## Modules Overview

### 📂 modules/

Contains code organized by business feature. Each feature is self-contained and includes all aspects needed to implement its specific functionality.

```
📂 modules/
 ┣ 📂 auth/                  # Authentication functionality
 ┃ ┣ 📂 components/          # Auth-specific components
 ┃ ┣ 📂 page/                # Auth-related pages
 ┃ ┣ 📂 hooks/               # Auth-specific hooks
 ┃ ┣ 📂 store/               # Redux state for auth
 ┃ ┣ 📂 types/               # TypeScript types for auth
 ┃ ┣ 📂 services/            # API services for auth
 ┗ ...
 ┣ 📂 campaigns/             # Campaign management
 ┣ 📂 chat-coach/            # AI marketing coach chat
 ┣ 📂 chat-coach-modal/      # Modal chat with AI coach
 ┣ 📂 content-post/          # Content feedback and posts
 ┣ 📂 create-post/           # Post creation and AI suggestions
 ┣ 📂 dashboard/             # Dashboard and analytics
```

**Purpose**: Each feature encapsulates all logic, components, pages, and state related to a specific business functionality. This enables parallel development and improves code cohesion.

### 📂 core/

Contains core infrastructure and services shared across the application.

```
📂 core/
 ┣ 📂 api/                   # API configuration and utilities
 ┃ ┣ 📜 apiClient.ts         # Configured HTTP client
 ┃ ┣ 📜 apiErrors.ts         # API error handling
 ┣ 📂 context/               # Shared React contexts (e.g., theme)
 ┣ 📂 hooks/                 # Core hooks (e.g., mobile detection, modals)
 ┣ 📂 lib/                   # Core utilities
 ┣ 📂 store/                 # Central Redux configuration
 ┃ ┣ 📜 store.ts             # Store setup
 ┃ ┣ 📜 rootReducer.ts       # Root reducer
 ┃ ┗ 📜 middleware.ts        # Custom middleware
```

**Purpose**: Provides the technical foundation and shared services for the entire app. Centralizes critical configurations and ensures consistency.

### 📂 shared/

Contains reusable UI components, hooks, utilities, and types shared across modules.

```
📂 shared/
 ┣ 📂 components/            # Reusable UI components
 ┃ ┣ 📂 button/              # Button variants
 ┃ ┣ 📂 cards/               # Card components
 ┃ ┣ 📂 dropdown/            # Dropdowns and menus
 ┃ ┣ 📂 error-state/         # Error display components
 ┃ ┣ 📂 header/              # App and site headers
 ┃ ┣ 📂 loading-state/       # Loading indicators
 ┃ ┣ 📂 table/               # Table and data display
 ┃ ┣ 📂 tooltip/             # Tooltip components
 ┃ ┣ 📂 ui/                  # Atomic UI elements (inputs, badges, etc.)
 ┣ 📂 layout/                # Layout and routing helpers
 ┣ 📂 pages/                 # Shared pages (e.g., Not Found)
 ┣ 📂 types/                 # Shared TypeScript types
 ┃ ┣ 📜 types.ts             # Common types
 ┗ 📜 router.ts              # Shared router utilities
```

**Purpose**: Provides a library of reusable UI components, hooks, and utilities to maintain visual and behavioral consistency throughout the app. Promotes code reuse and a coherent design system.

### 📂 assets/

Contains static resources used throughout the application.

```
📂 assets/
 ┣ 📜 logo-mark.webp         # Logos and icons
 ┣ 📜 react.svg              # Framework icons
 ┗ ...
```

**Purpose**: Centralizes all static resources for easier management and optimization.

## Development Guidelines

### Code Organization

1. **Single Responsibility Principle**: Each file should have a single responsibility and reason to change.
2. **Modularity**: Organize code into cohesive modules with clear interfaces.
3. **Encapsulation**: Hide internal implementations, exporting only what's necessary.
4. **Reuse**: Extract common components, hooks, and utilities into the `shared` folder.

### State Management

1. **Redux for global state**: Use Redux for state shared across multiple modules.
2. **React Context for UI state**: Use Context API for UI state shared within a component tree.
3. **useState/useReducer for local state**: For component-specific state.

### Naming Conventions

1. **Components**: PascalCase (e.g., `UserProfile.tsx`)
2. **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`)
3. **Utilities and services**: camelCase (e.g., `formatDate.ts`, `authService.ts`)
4. **Types/Interfaces**: PascalCase (e.g., `UserData.ts`)
5. **Redux files**: camelCase with descriptive suffix (e.g., `userSlice.ts`)

## Redux Workflow

1. **Slices**: Define slices with reducers, actions, and selectors.
2. **Thunks**: Use thunks for async logic.
3. **Selectors**: Use selectors to access state.
4. **Custom hooks**: Encapsulate Redux logic in reusable hooks.

## Best Practices

1. **Type Safety**: Use TypeScript for all code.
2. **Testing**: Write unit and integration tests for components and logic.
3. **Lazy Loading**: Implement lazy loading for large routes/modules.
4. **Documentation**: Document components, hooks, and functions with JSDoc.
5. **Performance**: Optimize rendering with React.memo, useMemo, and useCallback as needed.
6. **Consistent UI**: Use Tailwind CSS consistently, creating abstractions when necessary.
7. **Atomic Components**: Design components following atomic design principles (atoms, molecules, organisms).

---

# mark-frontend
