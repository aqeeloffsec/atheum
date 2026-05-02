# Atheum 📚

Atheum is a comprehensive web application designed for reading, managing, and interacting with books. Built with a modern SvelteKit stack, Atheum features a premium book reader with page-flip effects, server-side PDF generation, subscription management, and an AI-powered agent.

## ✨ Key Features

- **Library Management**: Browse, filter, search, and favorite books seamlessly.
- **Premium Book Reader**: An immersive reading experience featuring realistic page-flip effects.
- **AI Agent**: Enhanced functionality and interactions powered by a Mastra AI agent.
- **PDF Generation**: Robust server-side PDF creation from book content.
- **Subscription Handling**: Integrated Stripe processing for upgrades, cancellations, and customer portal access.
- **Authentication**: Secure user authentication and state management powered by Supabase.

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with Svelte 5 & TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (with forms and typography plugins)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **AI Integration**: [Mastra](https://mastra.ai/) & AI SDK
- **PDF Processing**: `pdfmake`, `html2pdf.js`, `page-flip`
- **Testing**: [Playwright](https://playwright.dev/) for End-to-End tests
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📁 Project Structure

- `src/lib/components/` - Reusable Svelte components following atomic design principles.
- `src/lib/state/` - State management stores (`user-state.svelte.ts`, `navigation-state.svelte.ts`).
- `src/lib/server/` - Server-side logic including Stripe integration, PDF engine, and Supabase client.
- `src/lib/mastra/` - AI agent implementation.
- `src/routes/` - SvelteKit routes organized by feature:
  - `(auth)/` - Authentication routes (login, signup, password reset).
  - `(private)/` - Protected routes requiring authentication (e.g., library).
  - `(landing-page)/` - Public landing page.
  - `api/` - Server endpoints (Stripe webhooks, PDF generation, etc.).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm/yarn
- Supabase project
- Stripe account

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/atheum.git
   cd atheum
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   ```

3. **Environment Setup:**
   Duplicate the `.env.example` file to create your `.env` file and populate the necessary environment variables for Supabase, Stripe, and OpenRouter API (if configured).
   ```sh
   cp .env.example .env
   ```

4. **Start the Development Server:**
   ```sh
   npm run dev
   # or automatically open in the browser
   npm run dev -- --open
   ```

## 🏗️ Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run check`: Type checking via `svelte-check`
- `npm run lint`: Run Prettier and ESLint
- `npm run format`: Format code using Prettier
- `npm run test:e2e`: Run Playwright E2E tests

## 🧪 Testing

End-to-End testing is configured using Playwright. Tests are located in the `e2e/`.

Run the test suite with:
```sh
npm run test:e2e
```

## 📄 License

This project is licensed under the terms defined in the [LICENSE](LICENSE) file.
