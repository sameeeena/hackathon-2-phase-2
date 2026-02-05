# Todo App Frontend

A Next.js frontend for the Todo application.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

The following environment variables are required for the application to work:

- `NEXT_PUBLIC_API_URL`: The URL of the backend API (e.g., your Hugging Face Space URL when deployed)
- `BETTER_AUTH_URL`: The URL for authentication
- `BETTER_AUTH_SECRET`: Secret key for authentication (only for development)

> Note: Do not commit actual API keys or secrets to version control. Use environment variables in production.

## Building for Production

To build the application for production, run:

```bash
npm run build
```

## Deploy on Vercel

The easiest way to deploy your Todo frontend is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Deployment Steps:

1. Go to [Vercel](https://vercel.com) and create an account
2. Click "New Project" and import your GitHub repository
3. Select the `frontend` directory in your repository
4. In the project settings, add the following environment variable:
   - `NEXT_PUBLIC_API_URL`: Set this to your backend API URL (e.g., your Hugging Face Space URL)
5. Click "Deploy" to start the build process

### Required Environment Variables for Production:

- `NEXT_PUBLIC_API_URL`: Your deployed backend API URL (e.g., `https://your-username-hf-space-name.hf.space`)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
