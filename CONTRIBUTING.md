# Contributing to AIxArtisans

Thank you for your interest in contributing to AIxArtisans! This guide will help you set up your development environment and understand the Supabase configuration.

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings > Database to get your connection strings
3. Go to Project Settings > API to get your URL and anon key

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key

# Optional: For real AI image/video generation (uses demo files by default)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account-key.json
```

### 4. Enable Supabase Realtime (for real-time chat)

In your Supabase dashboard:

1. Go to Database > Replication
2. Enable realtime for these tables:
   - `Message`
   - `Conversation`
3. Or run this SQL in the SQL Editor:

```sql
-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";
ALTER PUBLICATION supabase_realtime ADD TABLE "Conversation";
```

### 5. Push Database Schema

```bash
npm run db:push
```

### 6. Generate Prisma Client

```bash
npm run db:generate
```

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Real-Time Chat

The chat system uses Supabase Realtime for instant messaging between users. Messages appear instantly without page refresh, and the system supports image sharing across all user roles (artisans, customers, volunteers).

### Troubleshooting Real-Time Issues

If real-time messaging isn't working:

1. **Verify Supabase Realtime is Enabled:**
   - Go to your Supabase Dashboard > Database > Replication
   - Ensure `Message` and `Conversation` tables are enabled for realtime
   - Or run: `ALTER PUBLICATION supabase_realtime ADD TABLE "Message", "Conversation";`

2. **Check Environment Variables:**

   ```bash
   # Ensure these are set in .env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Database Connection:**
   - Ensure your Supabase project is active and not paused
   - Check if you've exceeded your project limits
