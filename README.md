<div align="center">
  <h1>SCATCH</h1>
  <p><strong>Premium Leather Bags — Full Stack E-Commerce Platform</strong></p>

  ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
  ![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=flat&logo=redis&logoColor=white)
  ![Deployed](https://img.shields.io/badge/Deployed-Live-success?style=flat)

  <br/>

  **[🌐 Live Demo](https://scatchbyrs.vercel.app)** &nbsp;·&nbsp;
  **[📦 Backend API](https://scatch-api.onrender.com/api/health)** &nbsp;·&nbsp;
  **[👤 LinkedIn](https://github.com/rishhabhsingh)**

  <br/>

  ![SCATCH Preview](https://res.cloudinary.com/dqygddc7b/image/upload/v1775044620/brandstory_rvnmm6.jpg)
</div>

---

## What is SCATCH?

SCATCH is a production-grade full-stack e-commerce platform for premium leather bags. Built entirely from scratch over 6 weeks — every line of code written and understood by hand. No boilerplate, no shortcuts.

This is not a tutorial clone. It's a real product with real architecture decisions, real debugging, and real deployment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, GSAP |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB Atlas, Mongoose |
| Caching | Redis (Upstash) |
| Auth | JWT (access + refresh tokens), bcrypt |
| AI Chat | GROQ API — LLaMA 3.3 70B |
| Payments | Mock payment flow (Razorpay architecture) |
| Storage | Cloudinary |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Animations | GSAP + ScrollTrigger |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Features

### Customer
- Browse products by category with filters, search, and sort
- Product detail with image gallery, reviews, and related products
- Cart drawer with real-time quantity management
- 3-step checkout with saved address auto-fill
- Order tracking with status timeline
- AI customer support chat (GROQ LLaMA 3.3 70B)
- Google Sign In

### Admin
- Product CRUD with image management
- Order status management
- Customer directory
- Revenue and stock overview dashboard

### Technical
- Dual JWT token system (15min access + 7day refresh with rotation)
- Redis caching with query-aware keys and TTL invalidation
- Role-based access control (customer / admin)
- GSAP scroll animations and page transitions
- Fully responsive dark luxury design system
- Axios interceptors for silent token refresh

---

## Architecture
```
Client (Vercel)
    ↓ HTTPS
Express API (Render)
    ↓           ↓           ↓
MongoDB      Redis       Cloudinary
(Atlas)    (Upstash)    (Images)
    ↓
GROQ AI (Chat)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (for local Redis)
- MongoDB Atlas account
- Cloudinary account
- GROQ API key

### Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/scatch.git
cd scatch

# Backend
cd server
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev

# Frontend
cd ../client
npm install
npm run dev
```

### Environment Variables
```env
# Server
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
GROQ_API_KEY=your_key
CLIENT_URL=http://localhost:5173

# Client
VITE_API_URL=http://localhost:5000/api
```

---

## Project Structure
```
scatch/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level pages
│       ├── store/          # Zustand state
│       ├── services/       # API service layer
│       └── hooks/          # Custom React hooks
└── server/                 # Express backend
    ├── controllers/        # Business logic
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    ├── middleware/         # Auth, admin, rate limit
    ├── config/             # DB, Redis, Cloudinary
    └── utils/              # Helpers
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| GET | /api/products | — | Get all products (cached) |
| GET | /api/products/:id | — | Get product (cached) |
| POST | /api/products | Admin | Create product |
| GET | /api/cart | Customer | Get cart |
| POST | /api/cart/add | Customer | Add to cart |
| POST | /api/orders/mock-payment | Customer | Place order |
| POST | /api/chat/message | Customer | AI chat message |

---

## What I Learned

- JWT dual token security architecture
- Redis caching patterns and cache invalidation strategies
- Mongoose 9 breaking changes (async hooks)
- Production deployment and environment management
- CORS configuration for cross-origin deployments
- Real debugging workflow — reading stack traces, isolating issues

---

## Author

**Rishabh Singh**
[LinkedIn](https://www.linkedin.com/in/rishabh-singh-b13773225) · [GitHub](https://github.com/rishhabhsingh) · [Live Demo](https://scatchbyrs.vercel.app)

---

<div align="center">
  <p>Built with purpose. Every line written by hand.</p>
</div>