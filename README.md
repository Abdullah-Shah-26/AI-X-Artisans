# AIxArtisans

AI-Powered Marketplace Assistant for Local Artisans

## Project Links

- **Live Demo:** [Youtube](https://youtu.be/XkxdKyEOsBI)

## Features by User Role

### For Artisans

- **AI Photo Studio** - Professional product photography with style transfer & image enhancement
- **AI Video Studio** - Generate product videos with slideshow, rotation, and story styles using Vertex AI Veo
- **Voice-to-Product** - Create complete product listings using speech recognition and AI
- **AI Product Descriptions** - Generate compelling descriptions using Groq Llama 3.3 70B
- **Product Management** - Create, edit, and manage product listings with certificates
- **Digital Certificates** - Generate authenticity certificates with QR codes and heritage stories
- **Price Negotiation** - Receive and respond to customer offers with accept/reject/counter options
- **Crowd Funding** - Launch and manage funding campaigns for projects
- **Project Posting** - Post collaboration projects and manage volunteer applications
- **Real-time Chat** - Message customers and volunteers with image sharing

### For Customers

- **Product Marketplace** - Browse and purchase handcrafted items with advanced filtering
- **AI Stylist** - Transform product designs with different styles (minimalist, bohemian, extravagant, classic)
- **Price Negotiation** - Make offers on products and negotiate with artisans
- **Direct Artisan Contact** - Message artisans about custom product modifications and requests
- **Certificate Verification** - View product authenticity certificates
- **Shopping Cart & Favorites** - Full e-commerce functionality with persistent wishlist
- **Real-time Chat** - Communicate with artisans about customizations and orders

### For Volunteers

- **Project Discovery** - Browse and apply to artisan collaboration projects
- **Skill Offering** - Provide marketing, photography, business development, and other professional skills
- **Real-time Collaboration** - Chat with artisans to coordinate project work

### For Everyone

- **Demo Mode** - Experience all features without registration using localStorage persistence
- **Multi-language Support** - Interface available in English & Hindi
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode** - Theme switching for better user experience

## Architecture

```mermaid
flowchart LR

    %% =========================================================
    %% CLIENT
    %% =========================================================
    subgraph CLIENT["CLIENT"]
        direction TB

        UI["Next.js 16<br/>React + TypeScript"]
        COMPONENTS["UI Components<br/>Tailwind CSS"]
        SPEECH["Web Speech API"]

        UI --> COMPONENTS
        UI --> SPEECH
    end


    %% =========================================================
    %% APPLICATION
    %% =========================================================
    subgraph APP["APPLICATION"]
        direction TB

        API["Next.js API Routes"]
        SERVER["Server Components"]
        MIDDLEWARE["Middleware"]

        API --- SERVER
        API --- MIDDLEWARE
    end


    %% =========================================================
    %% AI SERVICES
    %% =========================================================
    subgraph AI["AI SERVICES"]
        direction TB

        VERTEX["Google Vertex AI"]

        subgraph GEN["GENERATION"]
            direction LR
            IMAGEN["Imagen<br/>Image Generation"]
            VEO["Veo<br/>Video Generation"]
        end

        GROQ["Groq · Llama 3"]
        TEXT["Text Generation"]
        SR["Speech Recognition"]

        VERTEX --> IMAGEN
        VERTEX --> VEO

        GROQ --> TEXT
        SR --> TEXT
    end


    %% =========================================================
    %% DATA + AUTH
    %% =========================================================
    subgraph DATA["DATA & AUTHENTICATION"]
        direction TB

        PRISMA["Prisma ORM"]
        DB[("Supabase PostgreSQL")]
        STORAGE["Supabase Storage"]
        REALTIME["Supabase Realtime"]
        AUTH["Supabase Auth"]

        PRISMA --> DB
        REALTIME --> DB
        AUTH --> DB
    end


    %% =========================================================
    %% PRIMARY FLOW
    %% =========================================================

    CLIENT --> APP
    APP --> AI
    APP --> DATA

    COMPONENTS --> API
    SPEECH --> SR

    API --> VERTEX
    API --> GROQ

    API --> PRISMA
    API --> STORAGE
    API --> REALTIME

    MIDDLEWARE --> AUTH


    %% =========================================================
    %% COLORS — REFERENCE STYLE
    %% =========================================================

    %% Blue — Frontend
    classDef frontend fill:#4285F4,stroke:#4285F4,color:#FFFFFF,stroke-width:2px

    %% Purple — Google / Generation / Speech
    classDef purple fill:#8B5CF6,stroke:#8B5CF6,color:#FFFFFF,stroke-width:2px

    %% Pink — Groq / Text AI
    classDef pink fill:#EC4899,stroke:#EC4899,color:#FFFFFF,stroke-width:2px

    %% Orange — Browser / Storage / Realtime
    classDef orange fill:#F59E0B,stroke:#F59E0B,color:#FFFFFF,stroke-width:2px

    %% Green — Database / Authentication
    classDef green fill:#3ECF8E,stroke:#3ECF8E,color:#FFFFFF,stroke-width:2px

    %% Neutral — Internal components
    classDef neutral fill:#292929,stroke:#8A8A8A,color:#FFFFFF,stroke-width:1.5px


    %% Apply colors
    class UI frontend

    class VERTEX,IMAGEN,VEO,SR purple

    class GROQ,TEXT pink

    class SPEECH,STORAGE,REALTIME orange

    class DB,AUTH green

    class COMPONENTS,API,SERVER,MIDDLEWARE,PRISMA neutral


    %% =========================================================
    %% CONTAINER STYLING
    %% =========================================================

    style CLIENT fill:#464646,stroke:#666666,stroke-width:1px,color:#FFFFFF
    style APP fill:#464646,stroke:#666666,stroke-width:1px,color:#FFFFFF
    style AI fill:#464646,stroke:#666666,stroke-width:1px,color:#FFFFFF
    style DATA fill:#464646,stroke:#666666,stroke-width:1px,color:#FFFFFF

    style GEN fill:#3D3D3D,stroke:#666666,stroke-width:1px,color:#FFFFFF


    %% =========================================================
    %% CONNECTIONS
    %% =========================================================

    linkStyle default stroke:#B8B8B8,stroke-width:1.3px
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

## App Gallery

<table align="center">
    <tr>
        <td align="center">
            <img src="./public/screenshots/Landing-Page-1.png" alt="Landing Page (1)" width="330" />
            <br /><sub>Landing Page (1)</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Landing-Page-2.png" alt="Landing Page (2)" width="330" />
            <br /><sub>Landing Page (2)</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/Landing-Page-3.png" alt="Landing Page (3)" width="330" />
            <br /><sub>Landing Page (3)</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Login.png" alt="Login" width="330" />
            <br /><sub>Login</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/SignUp.png" alt="Sign Up" width="330" />
            <br /><sub>Sign Up</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Demo-Artisan-Dashboard.png" alt="Artisan Dashboard" width="330" />
            <br /><sub>Artisan Dashboard</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/Add-Product.png" alt="Add Product" width="330" />
            <br /><sub>Add Product</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Photo-Studio.png" alt="AI Photo Studio" width="330" />
            <br /><sub>AI Photo Studio</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/Video-Studiop.png" alt="AI Video Studio" width="330" />
            <br /><sub>AI Video Studio</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Collabration-Hub-As-Artisan.png" alt="Collaboration Hub (Artisan)" width="330" />
            <br /><sub>Collaboration Hub (Artisan)</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/Project-Posting.png" alt="Project Posting" width="330" />
            <br /><sub>Project Posting</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Connections.png" alt="Connections" width="330" />
            <br /><sub>Connections</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/Conversation-Menu.png" alt="Conversations" width="330" />
            <br /><sub>Conversations</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Negotiation.png" alt="Negotiations" width="330" />
            <br /><sub>Negotiations</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/Finance-Funding.png" alt="Finance Funding" width="330" />
            <br /><sub>Finance Funding</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Volunteer-Dashboard.png" alt="Volunteer Dashboard" width="330" />
            <br /><sub>Volunteer Dashboard</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/Volunteer-Project-Management.png" alt="Volunteer Project Management" width="330" />
            <br /><sub>Volunteer Project Management</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/MarketPlace-For-Customers.png" alt="Customer Marketplace" width="330" />
            <br /><sub>Customer Marketplace</sub>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="./public/screenshots/Demo-Project-Description-Page.png" alt="Demo Product Description Page" width="330" />
            <br /><sub>Demo Product Description Page</sub>
        </td>
        <td align="center">
            <img src="./public/screenshots/Current-AI-Stylist-Features.png" alt="AI Stylist Features" width="330" />
            <br /><sub>AI Stylist Features</sub>
        </td>
    </tr>
    <tr>
        <td align="center" colspan="2">
            <img src="./public/screenshots/Customer-Profile.png" alt="Customer Profile" width="330" />
            <br /><sub> Customer Profile</sub>
        </td>
    </tr>
</table>

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
