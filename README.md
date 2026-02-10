# AIxArtisans

AI-Powered Marketplace Assistant for Local Artisans

## Project Links

- **Live Demo:** [https://youtu.be/XkxdKyEOsBI](https://youtu.be/XkxdKyEOsBI)

## Features by User Role

### For Artisans

- **AI Photo Studio** - Professional product photography with style transfer & image enhancement
- **AI Video Studio** - Generate product videos with slideshow, rotation, and story styles using Vertex AI Veo
- **Voice-to-Product** - Create complete product listings using speech recognition and AI
- **AI Product Descriptions** - Generate compelling descriptions using Groq Llama 3.3 70B
- **Product Management** - Create, edit, and manage product listings with certificates
- **Digital Certificates** - Generate authenticity certificates with QR codes and heritage stories
- **Price Negotiation** - Receive and respond to customer offers with accept/reject/counter options
- **Crowdfunding** - Launch and manage funding campaigns for projects
- **Project Posting** - Post collaboration projects and manage volunteer applications
- **Real-time Chat** - Message customers and volunteers with image sharing

### For Customers

- **Product Marketplace** - Browse and purchase handcrafted items with advanced filtering
- **AI Stylist** - Transform product designs with different styles (minimalist, bohemian, extravagant, classic)
- **Price Negotiation** - Make offers on products and negotiate with artisans
- **Direct Artisan Contact** - Message artisans about custom product modifications and requests
- **Certificate Verification** - View and verify product authenticity certificates
- **Shopping Cart & Favorites** - Full e-commerce functionality with persistent wishlist
- **Real-time Chat** - Communicate with artisans about customizations and orders

### For Volunteers

- **Project Discovery** - Browse and apply to artisan collaboration projects
- **Skill Offering** - Provide marketing, photography, business development, and other professional skills
- **Artisan Support** - Help artisans with digital marketing, pricing strategies, and business growth
- **Real-time Collaboration** - Chat with artisans to coordinate project work

### For Everyone

- **Demo Mode** - Experience all features without registration using localStorage persistence
- **Multi-language Support** - Interface available in English and Hindi
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode** - Theme switching for better user experience

## Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js 16 Frontend]
        B[React Components]
        C[Tailwind CSS]
    end

    subgraph "Application Layer"
        D[Next.js API Routes]
        E[Server Components]
        F[Middleware]
    end

    subgraph "AI Services"
        VA[Google Vertex AI]
        H[Groq - Llama 3]
        I[Imagen - Image Gen]
        J[Veo - Video Gen]
        K[Text Generation]
        SR[Speech Recognition]
    end

    subgraph "Browser APIs"
        L[Web Speech API]
    end

    subgraph "Data Layer"
        M[(Supabase PostgreSQL)]
        N[Prisma ORM]
        O[Supabase Storage]
        Q[Supabase Realtime<br/>WebSocket]
    end

    subgraph "Authentication"
        P[Supabase Auth]
    end

    A --> B
    B --> C
    A --> D
    A --> E
    A --> L
    D --> N
    E --> N
    N --> M
    D --> VA
    D --> H
    D --> O
    D --> Q
    F --> P
    P --> M
    VA --> I
    VA --> J
    H --> K
    L --> SR
    SR --> K
    Q --> M

    style A fill:#10b981
    style VA fill:#4285f4
    style H fill:#ff6b6b
    style L fill:#ffa500
    style M fill:#3ecf8e
    style P fill:#3ecf8e
    style L fill:#ffa500
    style M fill:#3ecf8e
    style P fill:#3ecf8e
```

## Tech Stack

| Category           | Technology          | Purpose                                               |
| ------------------ | ------------------- | ----------------------------------------------------- |
| **Frontend**       | Next.js 16          | React framework with server-side rendering            |
| **Styling**        | Tailwind CSS        | Utility-first CSS framework                           |
| **Database**       | Supabase PostgreSQL | Cloud-hosted PostgreSQL database                      |
| **ORM**            | Prisma              | Type-safe database client and schema management       |
| **Authentication** | Supabase Auth       | User authentication and authorization                 |
| **File Storage**   | Supabase Storage    | Cloud storage for images and files                    |
| **Real-time Chat** | Supabase Realtime   | WebSocket-based instant messaging                     |
| **AI Services**    | Vertex AI + Groq    | Image/video generation (Imagen, Veo) + Text (Llama 3) |
| **Language**       | TypeScript          | Type-safe JavaScript development                      |
| **Deployment**     | Vercel              | Serverless deployment platform                        |

## Getting Started

Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed setup instructions and Supabase configuration.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── api/             # API routes
│   ├── auth/            # Auth callbacks
│   └── page.tsx         # Landing page
├── lib/
│   ├── prisma.ts        # Prisma client
│   ├── supabase/        # Supabase clients
│   ├── ai/              # AI service functions
│   └── utils.ts         # Utility functions
└── types/               # TypeScript types
```

## Database Schema

Key models:

- **User** - Base user with role (ARTISAN, VOLUNTEER, CUSTOMER)
- **ArtisanProfile** / **VolunteerProfile** - Role-specific data
- **Product** - Artisan products with certificates
- **Project** - Volunteer collaboration projects
- **Conversation** / **Message** - Chat system
- **BargainRequest** - Price negotiation
- **Certificate** - Authenticity certificates

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio
