# 🎧 Audiophile E-Commerce

A modern, full-stack e-commerce platform for premium audio equipment built with Next.js 16, featuring authentication, shopping cart, and integrated payment processing.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.18-2d3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🛍️ E-Commerce Core

- **Product Catalog**: Browse audio equipment by category (headphones, speakers, earphones)
- **Product Details**: Comprehensive product pages with image galleries, features, and related products
- **Shopping Cart**: Persistent cart with real-time updates and item management
- **Order Management**: Complete checkout flow with order history

### 🔐 Authentication & User Management

- **NextAuth v5**: Secure authentication with multiple providers
- **OAuth Integration**: Sign in with Google
- **Email/Password**: Traditional authentication with bcrypt password hashing
- **User Profiles**: Manage personal information, addresses, and payment methods

### 💳 Payment Processing

- **Stripe Integration**: Secure card payments with React Stripe.js
- **PayPal Support**: Alternative payment method with PayPal SDK
- **Order Confirmation**: Real-time payment verification and order confirmation

### 🎨 UI/UX

- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- **Modern Components**: Built with Radix UI primitives
- **Dark Mode Ready**: Theme support with next-themes
- **Accessible**: WCAG compliant components
- **Toast Notifications**: User feedback with Sonner

### 🗄️ Database & Architecture

- **PostgreSQL**: Robust relational database with Neon serverless
- **Prisma ORM**: Type-safe database queries with generated client
- **Server Actions**: Modern Next.js data mutations
- **Optimistic Updates**: Fast, responsive UI interactions

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **UI Components**: Radix UI (Dialog, Dropdown Menu, Label, Separator, Slot)

### Backend

- **Runtime**: Node.js
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma 6.18
- **Authentication**: NextAuth v5 with Prisma adapter
- **Payment APIs**: Stripe, PayPal

### Developer Tools

- **Language**: TypeScript 5
- **Testing**: Jest + ts-jest
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Stripe account (for payments)
- PayPal developer account (optional)
- Google OAuth credentials (for social login)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/audiophile.git
   cd audiophile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/audiophile"

   # NextAuth
   AUTH_SECRET="your-secret-key-here"
   AUTH_URL="http://localhost:3000"

   # Google OAuth
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

   # PayPal (optional)
   PAYPAL_CLIENT_ID="your-paypal-client-id"
   PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed the database with sample products
   npm run seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

npm install

Run the test suite:

```bash
npm test
```

## 🏗️ Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📊 Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **Product**: Audio equipment products
- **Category**: Product categories
- **Cart**: Shopping cart persistence
- **Order**: Purchase orders
- **OrderItem**: Individual items in orders
- **ProductImage**: Product image variants (mobile/tablet/desktop)
- **RelatedProduct**: Product recommendations

See `prisma/schema.prisma` for the complete schema definition.

## 🔑 Key Features Implementation

### Server Actions

Modern Next.js server actions for data mutations:

- `cart-actions.ts`: Cart management
- `order-actions.ts`: Order processing
- `auth-actions.ts`: User authentication
- `stripe-actions.ts`: Payment processing

### Route Protection

Middleware-based authentication checks for protected routes using NextAuth.

### Responsive Images

Optimized image delivery with responsive variants for different screen sizes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from Frontend Mentor's Audiophile challenge
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

Made with ❤️ and ☕
