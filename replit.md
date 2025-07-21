# Therapy Journal Application

## Overview

This is a comprehensive therapy journal and mutual help platform built as a mobile-first web application. The app helps cancer patients track their treatment progress, manage side effects, and connect with others for mutual support. It features a modern, compassionate design with warm colors and a supportive interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom therapy-focused color palette
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Hot module replacement with Vite middleware integration

### Mobile-First Design
- **Responsive**: Optimized for mobile devices with max-width container
- **Touch-Friendly**: Large touch targets and gesture-friendly interactions
- **Progressive**: Works as a web app with potential for PWA features

## Key Components

### User Interface Components
- **Layout System**: Mobile-first layout with bottom navigation
- **Form Components**: React Hook Form with Zod validation
- **UI Library**: Complete set of accessible components (buttons, forms, dialogs, etc.)
- **Mood Tracking**: Interactive emoji-based mood selection
- **Supportive Messaging**: Dynamic encouragement based on treatment type and side effects

### Data Models
- **Users**: Basic user profiles with demographics
- **Therapy Entries**: Detailed treatment tracking with cycles, medications, and side effects
- **Help Requests**: Community support system for practical assistance
- **Help Responses**: Response system for offering help

### Core Features
- **Therapy Diary**: Track daily treatment progress, side effects, and mood
- **Mutual Help**: Community platform for requesting and offering assistance
- **Progress Visualization**: Treatment cycle tracking and wellbeing monitoring

## Data Flow

### Client-Server Communication
- **Query Management**: TanStack Query handles caching, background updates, and error states
- **API Integration**: Custom `apiRequest` function for consistent HTTP handling
- **Form Submission**: React Hook Form with Zod schema validation
- **Real-time Updates**: Optimistic updates with query invalidation

### Data Validation
- **Schema Definition**: Shared Zod schemas between client and server
- **Type Safety**: Full TypeScript coverage from database to UI
- **Input Validation**: Client-side validation with server-side verification

### State Management
- **Server State**: TanStack Query for API data
- **Form State**: React Hook Form for complex form management
- **UI State**: React hooks for local component state
- **Toast Notifications**: Custom toast system for user feedback

## External Dependencies

### Database and Storage
- **Primary Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migration System**: Drizzle Kit for schema management

### UI and Styling
- **Component Library**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Montserrat font family from Google Fonts

### Development Tools
- **Build System**: Vite with React plugin
- **Runtime Error Handling**: Replit error overlay for development
- **Code Organization**: Path aliases for clean imports

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with Express middleware
- **Database**: Neon Database with development connection
- **Error Handling**: Development-specific error overlays

### Production Build
- **Client**: Vite builds optimized React bundle
- **Server**: ESBuild compiles Express server for Node.js
- **Assets**: Static assets served from dist/public directory
- **Environment**: Production configuration with proper error handling

### Database Management
- **Schema Deployment**: `drizzle-kit push` for schema updates
- **Environment Variables**: DATABASE_URL for connection string
- **Migration Strategy**: Schema-first approach with Drizzle migrations

### Performance Considerations
- **Bundle Optimization**: Tree shaking and code splitting with Vite
- **Query Caching**: Infinite cache time with manual invalidation
- **Responsive Images**: Optimized for mobile-first approach
- **Component Lazy Loading**: Dynamic imports for code splitting