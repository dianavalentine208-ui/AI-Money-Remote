# AI Agent Configuration

## Project Overview
- **Name**: AI-Money-Remote
- **Type**: React + TypeScript + Vite Application
- **Primary Dependencies**: Supabase, Stripe, React Router, Shadcn/ui

## Getting Started
- **Install Dependencies**: `npm install` or `bun install`
- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Run Tests**: `npm test` or `npm run test:watch` for watch mode
- **Lint Code**: `npm run lint`

## Key Information for AI Agents

### Environment Setup
- Requires Node.js 18+ or Bun
- Uses TypeScript with strict mode enabled
- Vite configuration in `vite.config.ts`
- Vitest for unit testing with jsdom

### Architecture
- **Frontend**: React 18 with React Router for navigation
- **UI Components**: Shadcn/ui built on Radix UI
- **Database**: Supabase (PostgreSQL backend)
- **Payments**: Stripe integration with @stripe/react-stripe-js
- **State Management**: TanStack React Query for data fetching
- **Forms**: React Hook Form with Zod validation

### Important Files
- `src/` - Application source code
- `components.json` - Shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `supabase/` - Database migrations and configs

### Output Access
- Development server runs on `http://localhost:5173` (default Vite port)
- Console output available in terminal when running `npm run dev`
- Test output from `npm test` or `npm run test:watch`

### Known Issues / Special Considerations
- `bun.lockb` is a binary lock file; use `package-lock.json` instead for npm
- Stripe and Supabase require API keys in environment variables
- Shadcn/ui components are managed via `components.json`

## Contact / Team
Add team member contacts here if AI agents need to escalate issues.