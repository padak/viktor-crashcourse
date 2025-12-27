This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Application Workflow

```mermaid
flowchart TD
    subgraph Frontend["Frontend (Next.js)"]
        A[QuestionForm] -->|user submits| B[Loading...]
        B --> C[ProblemsList]
        C -->|user confirms| D[Loading...]
        D --> E[Recommendations]
        E -->|reset| A
    end

    subgraph Backend["Backend (FastAPI)"]
        F[POST /api/analyze]
        G[POST /api/recommend]
    end

    subgraph Claude["Claude AI"]
        H[Sonnet 4.5]
    end

    B -->|POST feeling, troubles, changes| F
    F -->|analyze| H
    H -->|3 problems| F
    F -->|problems[]| C

    D -->|POST problems| G
    G -->|recommend| H
    H -->|recommendations| G
    G -->|recommendations[]| E
```

### User Flow

1. **QuestionForm** - User answers 3 questions about feelings
2. **ProblemsList** - AI identifies 3 main problems, user confirms
3. **Recommendations** - Personalized advice for each problem

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
