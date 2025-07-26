# Therapy Journal Application

## Overview

This is a comprehensive therapy journal and mutual help platform built as a mobile-first web application for cancer patients. The app helps users track their treatment progress, manage side effects, record mood and wellbeing, and connect with other patients for mutual support. It features a clean, empathetic design with personalized recommendations and supportive messaging.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing (alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom therapy-focused color palette and mobile-first design
- **Build Tool**: Vite for fast development and optimized production builds
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript for consistency with frontend
- **Database ORM**: Drizzle ORM configured for PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL) via @neondatabase/serverless
- **API Design**: RESTful endpoints with JSON responses
- **Data Storage**: In-memory storage implementation for development (MemStorage class)
- **Development**: Hot module replacement with Vite middleware integration

### Mobile-First Design Philosophy
- **Responsive**: Optimized for mobile devices with max-width container
- **Touch-Friendly**: Large touch targets and gesture-friendly interactions
- **Bottom Navigation**: Mobile-native navigation pattern
- **Therapy-Focused Colors**: Warm, calming color palette with soft pastels

## Key Components

### Core Application Structure
- **Layout System**: Shared layout component with bottom navigation
- **Routing**: Three main pages (Home, Therapy Diary, Mutual Help)
- **Error Handling**: Custom 404 page and error boundaries
- **Toast Notifications**: User feedback system for actions

### User Interface Components
- **Form Components**: Therapy entry form, help request form with validation
- **Interactive Elements**: Mood selector with emoji-based selection
- **Data Display**: Therapy entry cards, help request cards with status badges
- **Navigation**: Bottom tab navigation optimized for mobile use
- **Supportive Messaging**: Dynamic encouragement based on treatment type and side effects

### Data Models and Schema
- **Users**: Basic user profiles with demographics (id, username, name, age, location)
- **Therapy Entries**: Comprehensive treatment tracking including:
  - Treatment cycles and medications
  - Wellbeing severity (1-5 scale)
  - Side effects array
  - Physical activity levels
  - Mood tracking with emoji
- **Help Requests**: Community support system with categorized help types
- **Help Responses**: Response mechanism for offering assistance

## Data Flow

### Client-Server Communication
- **API Layer**: RESTful endpoints for all data operations
- **Query Management**: TanStack Query handles caching, synchronization, and background updates
- **Form Submission**: React Hook Form with Zod validation before API calls
- **Real-time Updates**: Query invalidation for immediate UI updates after mutations

### State Management Strategy
- **Server State**: Managed by TanStack Query with automatic caching
- **Form State**: React Hook Form for complex form handling
- **UI State**: React state hooks for component-level state
- **Global State**: Minimal global state, preferring server state synchronization

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe variant handling for components

### Development and Build
- **TypeScript**: Static typing across frontend and backend
- **Vite**: Build tool with hot module replacement
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Development environment plugins

### Backend Dependencies
- **Express**: Web framework for Node.js
- **Drizzle ORM**: Type-safe database toolkit
- **Zod**: Schema validation library
- **Date-fns**: Date utility library

## Deployment Strategy

### Development Environment
- **Replit-Optimized**: Custom Vite configuration for Replit environment
- **Hot Reloading**: Vite middleware integration with Express server
- **TypeScript**: Shared configuration across client and server

### Production Build
- **Static Frontend**: Vite builds to `dist/public` directory
- **Server Bundle**: ESBuild bundles server to `dist/index.js`
- **Environment Variables**: Database URL configuration via environment
- **Deployment Targets**: Vercel (recommended) or Netlify with automatic detection

### Database Configuration
- **Development**: In-memory storage for rapid prototyping
- **Production**: PostgreSQL via Neon Database with connection pooling
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared between client and server via TypeScript imports

## Technical Decisions

### Framework Choices
- **React over Vue/Angular**: Mature ecosystem and team familiarity
- **Wouter over React Router**: Smaller bundle size for mobile-first approach
- **TanStack Query**: Superior caching and synchronization for data-heavy app
- **Drizzle over Prisma**: Better TypeScript integration and performance

### Architecture Patterns
- **Monorepo Structure**: Shared schemas and types between client/server
- **Mobile-First**: Progressive enhancement from mobile to desktop
- **Component Composition**: Radix UI primitives with custom styling
- **Type Safety**: End-to-end TypeScript for better developer experience

### Performance Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Lazy loading and responsive images
- **Caching Strategy**: Aggressive caching with TanStack Query
- **Bundle Size**: Careful dependency selection for mobile performance