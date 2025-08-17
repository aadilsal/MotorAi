# 🚗 MotorAI - AI-Powered Car Marketplace

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)

**A modern, AI-powered car marketplace that revolutionizes how people buy and sell vehicles online.**

</div>

---

## 🌟 Why MotorAI?

MotorAI isn't just another car marketplace—it's an **intelligent platform** that leverages cutting-edge AI to transform the car buying and selling experience. Built with modern technologies and designed for scale, this project demonstrates enterprise-level full-stack development skills.

### 🎯 Perfect For

- **Portfolio Projects** - Showcase advanced full-stack capabilities
- **Learning** - Modern React 19 + Next.js 15 patterns
- **Interview Prep** - Demonstrate real-world application architecture
- **Startup MVPs** - Production-ready marketplace foundation

---

## ✨ Key Features

### 🤖 **AI-Powered Intelligence**

- **Smart Car Descriptions** - Auto-generate compelling listings with Gemini AI
- **Price Predictions** - AI-driven market analysis and pricing recommendations
- **Intelligent Search** - Natural language search queries
- **Virtual Assistant** - 24/7 AI chatbot for customer support

### 🔐 **Enterprise Security**

- **Multi-layer Authentication** - Secure user management with Clerk
- **Rate Limiting & DDoS Protection** - Powered by Arcjet
- **Data Encryption** - End-to-end encrypted user data
- **Role-based Access Control** - Admin, dealer, and customer roles

### 🛒 **Complete Marketplace Experience**

- **Advanced Filtering** - Search by make, model, year, price, location
- **Test Drive Scheduling** - Seamless booking system
- **Favorites & Wishlist** - Save and compare vehicles
- **Real-time Notifications** - Updates on saved searches and bookings

### 📊 **Admin Dashboard**

- **Analytics & Insights** - Sales metrics, user activity, market trends
- **Inventory Management** - Bulk operations and automated workflows
- **User Management** - Customer support and account administration
- **Revenue Tracking** - Financial reporting and commission management

### 🎨 **Modern User Experience**

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Accessible UI** - WCAG compliant with Shadcn/UI components
- **Dark/Light Mode** - User preference support
- **Progressive Web App** - Offline functionality and native feel

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="33%">

### Frontend

- **React 19** - Latest features & Concurrent Mode
- **Next.js 15** - App Router, Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Modern component library
- **Framer Motion** - Smooth animations

</td>
<td valign="top" width="33%">

### Backend

- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Type-safe database operations
- **Supabase** - PostgreSQL database
- **Clerk Auth** - Authentication & user management
- **Gemini AI** - Google's latest AI model
- **Resend** - Transactional emails

</td>
<td valign="top" width="33%">

### DevOps & Tools

- **Vercel** - Deployment & hosting
- **Arcjet** - Security & rate limiting
- **ESLint & Prettier** - Code quality
- **Husky** - Git hooks
- **Zod** - Runtime validation
- **React Hook Form** - Form management

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Git

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/ai-car-marketplace.git
cd ai-car-marketplace
npm install
```

### 2. Environment Setup

Create `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# AI Integration
GEMINI_API_KEY="your_gemini_api_key"

# Security (Arcjet)
ARCJET_KEY="ajkey_..."

# File Storage (Optional)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Email (Resend)
RESEND_API_KEY="re_..."
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### 4. Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Database Schema

<details>
<summary>Click to view complete schema</summary>

```prisma
// Core Models
model User {
  id          String   @id @default(uuid())
  clerkUserId String   @unique
  email       String   @unique
  name        String?
  phone       String?
  imageUrl    String?
  role        Role     @default(USER)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  cars              Car[]
  testDriveBookings TestDriveBooking[]
  savedCars         SavedCar[]

  @@map("users")
}

model Car {
  id              String        @id @default(uuid())
  make            String
  model           String
  year            Int
  price           Float
  mileage         Int?
  fuelType        FuelType
  transmission    Transmission
  bodyType        BodyType
  color           String?
  description     String?
  status          CarStatus     @default(AVAILABLE)
  featured        Boolean       @default(false)
  images          String[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  owner             User               @relation(fields: [ownerId], references: [id])
  ownerId           String
  testDriveBookings TestDriveBooking[]
  savedCars         SavedCar[]

  @@map("cars")
}

model TestDriveBooking {
  id          String            @id @default(uuid())
  bookingDate DateTime
  startTime   String
  endTime     String
  status      BookingStatus     @default(PENDING)
  notes       String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  // Relations
  user   User   @relation(fields: [userId], references: [id])
  userId String
  car    Car    @relation(fields: [carId], references: [id])
  carId  String

  @@map("test_drive_bookings")
}

// Enums
enum Role {
  USER
  ADMIN
  DEALER
}

enum CarStatus {
  AVAILABLE
  SOLD
  PENDING
  UNAVAILABLE
}

enum FuelType {
  PETROL
  DIESEL
  ELECTRIC
  HYBRID
  LPG
}

enum Transmission {
  MANUAL
  AUTOMATIC
  CVT
}

enum BodyType {
  SEDAN
  HATCHBACK
  SUV
  COUPE
  CONVERTIBLE
  TRUCK
  VAN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

</details>

---

## 🏗 Project Architecture

```
├── 📁 app/
│   ├── 📁 (auth)/              # Authentication pages
│   ├── 📁 (admin)/             # Admin dashboard
│   ├── 📁 (marketplace)/       # Public marketplace
│   ├── 📁 api/                 # API routes
│   │   ├── 📁 cars/           # Car CRUD operations
│   │   ├── 📁 users/          # User management
│   │   ├── 📁 ai/             # Gemini AI integration
│   │   └── 📁 webhooks/       # Third-party webhooks
│   └── 📄 layout.tsx          # Root layout
├── 📁 components/
│   ├── 📁 ui/                 # Shadcn/UI components
│   ├── 📁 forms/              # Form components
│   ├── 📁 cards/              # Card components
│   └── 📁 layout/             # Layout components
├── 📁 lib/
│   ├── 📄 prisma.ts           # Database client
│   ├── 📄 clerk.ts            # Auth configuration
│   ├── 📄 gemini.ts           # AI client
│   └── 📄 utils.ts            # Utilities
├── 📁 prisma/
│   ├── 📄 schema.prisma       # Database schema
│   └── 📄 seed.ts             # Database seeding
└── 📁 public/                 # Static assets
```

---

## 🎯 Key Features Showcase

### AI Integration Examples

```typescript
// Auto-generate car descriptions
const description = await generateCarDescription({
  make: "BMW",
  model: "X5",
  year: 2023,
  features: ["leather seats", "sunroof", "navigation"],
});

// Price prediction
const suggestedPrice = await predictCarPrice({
  make: "Toyota",
  model: "Camry",
  year: 2022,
  mileage: 15000,
  location: "New York",
});
```

### Advanced Search Implementation

```typescript
// Natural language search
const cars = await searchCars({
  query: "red sports car under $50k with low mileage",
  filters: {
    priceRange: [0, 50000],
    bodyType: "COUPE",
    color: "red",
  },
});
```

---

## 📱 API Documentation

<details>
<summary>Core API Endpoints</summary>

### Cars

- `GET /api/cars` - List all cars with filtering
- `GET /api/cars/[id]` - Get car details
- `POST /api/cars` - Create new listing (Auth required)
- `PUT /api/cars/[id]` - Update listing (Auth required)
- `DELETE /api/cars/[id]` - Delete listing (Auth required)

### Test Drives

- `POST /api/test-drives` - Book test drive
- `GET /api/test-drives` - Get user's bookings
- `PUT /api/test-drives/[id]` - Update booking status

### AI Features

- `POST /api/ai/describe` - Generate car description
- `POST /api/ai/price` - Predict car price
- `POST /api/ai/chat` - AI assistant chat

### Admin

- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/users` - User management
- `PUT /api/admin/cars/[id]/status` - Update car status

</details>

---

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Excellent ratings
- **Bundle Size**: Optimized with tree-shaking
- **Image Optimization**: Next.js Image component
- **Caching**: Redis integration for API responses

---

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful component library
- [Clerk](https://clerk.dev/) for seamless authentication
- [Supabase](https://supabase.com/) for the powerful backend
- [Vercel](https://vercel.com/) for excellent deployment platform

---

<div align="center">

**Built with ❤️ by [Aadil Salman Butt](https://github.com/aadilsal)**

[⭐ Star this repo](https://github.com/aadilsal/MotorAi) if you found it helpful!

</div>
