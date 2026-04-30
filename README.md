# AI Money Remote

A modern financial application built with React, TypeScript, and Vite. Manage your remote earnings, track payments, and integrate with Stripe for seamless payment processing.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui (Radix UI + Tailwind CSS)
- **Database**: Supabase (PostgreSQL)
- **Payment Processing**: Stripe
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack React Query (v5)
- **Styling**: Tailwind CSS with custom configuration
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint with TypeScript support
- **Package Manager**: npm / Bun

## Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm or Bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/dianavalentine208-ui/AI-Money-Remote.git
cd AI-Money-Remote

# Install dependencies
npm install
# or with Bun
bun install
```

### Development

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Run with hot module replacement
# Open http://localhost:5173 in your browser
```

### Building

```bash
# Production build
npm run build

# Development build
npm run build:dev

# Preview production build
npm run preview
```

### Testing & Quality

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build optimized production bundle |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |
| `npm test` | Run test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Project Structure

```
├── src/                          # Source code
│   ├── components/              # Reusable React components
│   ├── lib/                     # Utility functions
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── public/                      # Static assets
├── supabase/                    # Database config and migrations
├── components.json              # Shadcn/ui configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── eslint.config.js             # ESLint configuration
├── vitest.config.ts             # Vitest configuration
└── package.json                 # Project dependencies
```

## Key Features

- 💳 Stripe payment integration
- 🗄️ Supabase database and authentication
- 📊 Interactive dashboards with Recharts
- 🎨 Beautiful UI components with Shadcn/ui
- ✅ Form validation with Zod
- 🧪 Unit tests with Vitest
- 📱 Responsive design with Tailwind CSS
- 🌓 Dark mode support with next-themes

## Dependencies

### Core
- React 18.3.1
- React Router 6.30.1
- TypeScript 5.8.3

### UI & Styling
- Shadcn/ui components (Radix UI)
- Tailwind CSS 3.4.17
- Lucide React icons
- Tailwind Merge & Animate

### Data & Forms
- TanStack React Query 5.83.0
- React Hook Form 7.61.1
- Zod 3.25.76

### Integrations
- Supabase 2.103.0
- Stripe (React & JS) 6.1.0 & 9.1.0

### Utilities
- date-fns 3.6.0
- Canvas Confetti 1.9.4
- Sonner (toast notifications)

## Development

### Code Quality
- TypeScript strict mode enabled
- ESLint configured with React and TypeScript plugins
- Prettier for consistent formatting

### Testing
- Unit tests with Vitest
- React Testing Library for component testing
- jsdom for DOM simulation

### Pre-commit Checks
Run linting before committing:
```bash
npm run lint
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test them: `npm run test`
3. Run linter: `npm run lint`
4. Commit with clear messages
5. Push to your branch and create a Pull Request

## Troubleshooting

### Port 5173 already in use
```bash
# Vite will automatically try the next available port
npm run dev
```

### Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type errors
```bash
# Regenerate TypeScript types
npm run build
```

## License

This project is open source. See LICENSE file for details.

## Support

For issues and questions, please:
1. Check existing GitHub Issues
2. Review project documentation in `agents.md`
3. Create a new GitHub Issue with detailed information

---

**Last Updated**: 2026-04-30 06:20:26