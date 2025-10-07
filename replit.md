# Overview

This is a full-stack web application built with React (frontend) and Express (backend), featuring a marginal profit calculator. The application demonstrates a typical modern web stack with TypeScript, using Vite for building and development, and includes a comprehensive UI component library based on shadcn/ui (Radix UI primitives). The current implementation includes a Japanese business calculator for marginal profit, marginal profit rate, and break-even point analysis.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build System**
- **React 18+** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured with custom plugins for Replit integration
- **Wouter** for client-side routing (lightweight alternative to React Router)

**State Management & Data Fetching**
- **TanStack Query (React Query)** for server state management with custom query client configuration
- Custom API request utilities with credential-based authentication support
- Toast notifications for user feedback using Radix UI Toast primitives

**UI Component System**
- **shadcn/ui** component library (New York style variant) built on Radix UI primitives
- **Tailwind CSS** for styling with CSS variables for theming
- Custom design system with Japanese typography support (Noto Sans JP, JetBrains Mono)
- Comprehensive component library including forms, dialogs, data display, and navigation components

**Styling Approach**
- Utility-first CSS with Tailwind
- CSS custom properties for dynamic theming (light/dark mode support)
- Responsive design with mobile-first breakpoints
- Custom color palette with semantic color tokens

## Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for type-safe API development
- Custom middleware for request/response logging
- Raw body capture for webhook/payment processing support

**Database Layer**
- **Drizzle ORM** configured for PostgreSQL dialect
- **Neon Database** serverless PostgreSQL driver
- Schema-first approach with migrations stored in `./migrations`
- Zod integration for runtime validation via `drizzle-zod`

**Data Access Pattern**
- Storage interface abstraction (`IStorage`) for flexible data layer implementation
- In-memory storage implementation (`MemStorage`) for development/testing
- User management with username-based authentication structure

**API Architecture**
- RESTful API endpoints with `/api` prefix convention
- Request/response logging with truncation for readability
- Error handling with status code propagation
- Session management prepared via `connect-pg-simple`

## Development & Build Configuration

**TypeScript Configuration**
- Strict mode enabled for enhanced type safety
- Path aliases configured (`@/` for client, `@shared/` for shared code)
- ESNext module system with bundler resolution
- Incremental compilation for faster builds

**Build Process**
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server code with external packages
- Separate development and production modes
- Database schema push via Drizzle Kit

**Development Tools**
- Hot Module Replacement (HMR) for frontend development
- Runtime error overlay for better debugging
- Cartographer and dev banner plugins for Replit environment
- Custom Vite middleware integration for SSR-like setup

## External Dependencies

**Core Framework Dependencies**
- `express` - Backend web framework
- `react` & `react-dom` - Frontend UI library
- `vite` - Build tool and dev server
- `typescript` - Type system

**Database & ORM**
- `@neondatabase/serverless` - Serverless PostgreSQL client for Neon
- `drizzle-orm` - TypeScript ORM with type-safe queries
- `drizzle-kit` - Schema migration toolkit
- `drizzle-zod` - Zod schema generation from Drizzle schemas
- `connect-pg-simple` - PostgreSQL session store for Express

**UI Component Libraries**
- `@radix-ui/react-*` - Headless UI primitives (accordion, dialog, dropdown, etc.)
- `@tanstack/react-query` - Server state management
- `lucide-react` - Icon library
- `embla-carousel-react` - Carousel component
- `cmdk` - Command menu component
- `recharts` - Charting library

**Form Handling & Validation**
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolver for react-hook-form
- `zod` - Schema validation library

**Styling**
- `tailwindcss` - Utility-first CSS framework
- `autoprefixer` - CSS vendor prefixing
- `class-variance-authority` - Component variant management
- `tailwind-merge` & `clsx` - Conditional class name utilities

**Utilities**
- `date-fns` - Date manipulation library
- `nanoid` - Unique ID generation
- `wouter` - Lightweight routing library

**Development Tools**
- `@replit/vite-plugin-*` - Replit-specific development plugins
- `tsx` - TypeScript execution for development
- `esbuild` - JavaScript bundler for production builds