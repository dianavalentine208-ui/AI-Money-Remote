AGENTS.md: AI Money Remote Project Guide
## 1. Project Context
Mission: A 30-day "faceless theme page" launchpad and "Money Matchmaker" affiliate tool for users aged 35+.
Tech Stack: React/Vite frontend (built with Lovable), Supabase backend, and Stripe for payments.
## 2. Dev & Launch Commands
Build: npm run build
Test: npm test
Pricing: All Stripe subscription logic is handled in the src/components/Pricing directory.
## 3. Critical Rules for the AI
Target Demographic: Always prioritize high-trust, professional, and simple UI/UX for a 35+ audience. No complex technical jargon.
Safety First: Never commit .env files. Ensure RLS is active on all Supabase tables.
Style: Use the existing "Analog AI Studio" aesthetic but update all branding to AI Money Remote.
