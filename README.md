# AI Content Workflow

A full-stack content management system with AI-powered content generation and refinement, review workflow, and role-based access control. Writers can create, edit, and submit content for review, while reviewers can approve or reject submissions with feedback.

## 🚀 Features

### Content Management

- **AI-Powered Content Generation**: Generate social media posts using Google Gemini AI
- **AI Content Refinement**: Refine existing content with AI, with optional custom instructions
- **Content Workflow**: Complete Draft → Submit → Review → Approve/Reject workflow
- **Content Status Tracking**: View drafts, submitted, rejected, and approved content
- **Content Editing**: Update drafts and revert rejected content back to draft status

### AI Capabilities

- **Smart Content Generation**: Generate engaging social media posts with emojis
- **Content Refinement**: Improve existing content with AI-powered suggestions
- **Custom AI Persona**: Professional social media marketing expert persona
- **Instruction-Based Refinement**: Provide specific instructions for content refinement

### User Management

- **Role-Based Access Control**: Three roles (WRITER, REVIEWER, ADMIN)
- **Secure Authentication**: Session-based authentication with Redis-backed sessions
- **Session Persistence**: Automatic session restoration on page refresh

### Review System

- **Self-Assignment**: Reviewers can assign themselves to review content
- **Approval/Rejection**: Reviewers can approve or reject content with feedback
- **Review Comments**: Detailed feedback for rejected content
- **Review History**: Track reviewed content

### Frontend Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **React Query**: Efficient data fetching and caching with TanStack Query
- **Client-Side Routing**: React Router for seamless navigation
- **Responsive Design**: Mobile-friendly interface
- **Real-Time Updates**: Automatic cache invalidation and data synchronization

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Sessions**: Redis (ioredis)
- **AI Service**: Google Gemini AI (@google/genai)
- **Authentication**: Session-based with bcrypt password hashing
- **API**: RESTful API design

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS with PostCSS
- **Utilities**: clsx, tailwind-merge
- **Linting**: ESLint

## 📁 Project Structure

```
ai-content-workflow/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic (auth, content, review, AI)
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth middleware
│   │   ├── config/          # Configuration files (env, prisma, redis)
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── generated/       # Generated Prisma client
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # shadcn/ui components
│   │   ├── contexts/        # React contexts (AuthContext)
│   │   ├── hooks/           # Custom hooks (useContent, useReview, useAI)
│   │   ├── lib/             # Utilities (api, queryClient, utils)
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app with routing
│   │   └── main.tsx         # Entry point
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Redis** server
- **Google Gemini API key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-content-workflow
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=4000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_content_workflow"

# Redis
REDIS_URL="redis://localhost:6379"

# AI Service
GEMINI_API_KEY="your_gemini_api_key_here"

# Optional: Custom AI Character/Persona
# AI_CHARACTER="You are a professional social media marketing expert..."
```

### Database Setup

1. **Create PostgreSQL database**

   ```bash
   createdb ai_content_workflow
   ```

2. **Run Prisma migrations**

   ```bash
   cd backend
   npx prisma migrate dev
   ```

   This will:

   - Create the database schema
   - Generate the Prisma client
   - Run all migrations

3. **Optional: View database with Prisma Studio**

   ```bash
   npx prisma studio
   ```

### Running the Application

1. **Start Redis** (if not running as a service)

   ```bash
   redis-server
   ```

   Or use Docker:

   ```bash
   docker run -d -p 6379:6379 redis
   ```

2. **Start the backend**

   ```bash
   cd backend
   npm run dev
   ```

   Backend will run on `http://localhost:4000`

3. **Start the frontend** (in a new terminal)

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend will run on `http://localhost:5173` (default Vite port)

4. **Access the application**

   Open `http://localhost:5173` in your browser

## 📚 API Documentation

### Base URL

All API endpoints are prefixed with `/api`

### Authentication

All authenticated endpoints require the `x-session-id` header with a valid session ID.

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "WRITER"  // Optional: WRITER, REVIEWER, ADMIN (default: WRITER)
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "sessionId": "uuid",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "WRITER"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
x-session-id: <session-id>
```

### Content Routes (WRITER role required)

#### Create Draft

```http
POST /api/content
x-session-id: <session-id>
Content-Type: application/json

{
  "title": "My Article",
  "body": "Article content here..."
}
```

#### Get Drafts

```http
GET /api/content/drafts
x-session-id: <session-id>
```

#### Get Single Content

```http
GET /api/content/:contentId
x-session-id: <session-id>
```

#### Update Content

```http
PUT /api/content/:contentId
x-session-id: <session-id>
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated content..."
}
```

#### Submit Draft

```http
POST /api/content/:contentId/submit
x-session-id: <session-id>
```

#### Revert Rejected Content to Draft

```http
PUT /api/content/:contentId/revert
x-session-id: <session-id>
```

#### Get Content by Status

```http
GET /api/content/submitted
GET /api/content/rejected
GET /api/content/approved
x-session-id: <session-id>
```

### Review Routes (REVIEWER role required)

#### Get Pending Reviews

```http
GET /api/review/pending
x-session-id: <session-id>
```

#### Assign Reviewer to Content

```http
POST /api/review/:contentId/assign
x-session-id: <session-id>
```

#### Approve Content

```http
POST /api/review/:contentId/approve
x-session-id: <session-id>
```

#### Reject Content

```http
POST /api/review/:contentId/reject
x-session-id: <session-id>
Content-Type: application/json

{
  "comment": "Needs more detail in section 3"
}
```

#### Get Reviewed Content

```http
GET /api/review/reviewed
x-session-id: <session-id>
```

### AI Routes (WRITER role required)

#### Generate Content

Generate a new social media post from a prompt.

```http
POST /api/ai/generate
x-session-id: <session-id>
Content-Type: application/json

{
  "prompt": "Write a social media post about TypeScript"
}

Response: {
  "content": "🚀 Just discovered TypeScript and I'm in love! 💙\n\nTypeScript brings type safety to JavaScript..."
}
```

**Note**: The AI returns only the post text with emojis, formatted like a typical social media post.

#### Refine Content

Refine and improve existing content with optional custom instructions.

```http
POST /api/ai/refine
x-session-id: <session-id>
Content-Type: application/json

{
  "content": "Current post content here...",
  "instruction": "Make it more engaging and add emojis"  // Optional
}

Response: {
  "content": "✨ Refined post content with improvements... 🎉"
}
```

**Note**:

- The `content` field is required and must not be empty
- The `instruction` field is optional - provides specific refinement guidance
- Returns only the refined post text, no explanations

## 🔄 Content Workflow

### Status Flow

```
DRAFT → SUBMITTED → APPROVED
              ↓
          REJECTED → DRAFT (after revert)
```

### Detailed Workflow

1. **DRAFT** - Writer creates content

   - Writer can create, update, and view drafts
   - Writer can use AI to generate or refine content
   - Writer can submit draft for review

2. **SUBMITTED** - Content is submitted for review

   - Content appears in reviewer's pending list
   - Reviewer can assign themselves to review
   - Reviewer can approve or reject with comments

3. **APPROVED** - Content is approved

   - Content is finalized
   - Writer can view approved content
   - Content cannot be edited

4. **REJECTED** - Content is rejected
   - Reviewer provides feedback comment
   - Writer can view rejection comment
   - Writer can revert to DRAFT for editing
   - After revert, writer can update and resubmit

## 👥 User Roles

### WRITER

- Create, edit, and manage drafts
- Generate content with AI
- Refine content with AI
- Submit content for review
- View submitted, rejected, and approved content
- Revert rejected content to draft

### REVIEWER

- View pending content submissions
- Assign themselves to review content
- Approve or reject content
- Provide feedback comments when rejecting
- View review history

### ADMIN

- Full access (can be extended with additional permissions)

## 🎨 Frontend Features

### Writer Dashboard

- **Create Tab**: Create new content with AI generation
- **Drafts Tab**: View and manage all drafts
- **Submitted Tab**: Track submitted content
- **Rejected Tab**: View rejected content with feedback
- **Approved Tab**: View approved content
- **AI Features**:
  - Generate content from prompts
  - Preview generated content before keeping
  - Refine existing content with optional instructions
  - Preview refined content before applying

### Reviewer Dashboard

- **Pending Reviews Tab**: View content awaiting review
- **Reviewed Tab**: View review history
- **Review Actions**:
  - Assign yourself to review
  - Approve content
  - Reject with detailed comments

## 🧪 Testing

### Test API Endpoints

Example with curl:

```bash
# Register a user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"writer@example.com","password":"password123","role":"WRITER"}'

# Login and get session ID
SESSION_ID=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"writer@example.com","password":"password123"}' | jq -r '.sessionId')

# Create draft
curl -X POST http://localhost:4000/api/content \
  -H "x-session-id: $SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","body":"This is a test post"}'

# Generate AI content
curl -X POST http://localhost:4000/api/ai/generate \
  -H "x-session-id: $SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write a post about AI"}'

# Refine content
curl -X POST http://localhost:4000/api/ai/refine \
  -H "x-session-id: $SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"content":"Original post text","instruction":"Make it more engaging"}'
```

## 🛠️ Development

### Backend Scripts

```bash
cd backend

npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run test     # Test AI service
```

### Frontend Scripts

```bash
cd frontend

npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Database Management

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio

# Generate Prisma client
npx prisma generate
```

## ⚙️ Configuration

### AI Character/Persona

The AI uses a default persona as a professional social media marketing expert. You can customize this by setting the `AI_CHARACTER` environment variable:

```env
AI_CHARACTER="You are a professional social media marketing expert specializing in B2B content, with expertise in LinkedIn and Twitter. Your writing style is data-driven and authoritative."
```

### Session Configuration

- Sessions are stored in Redis
- Default expiration: 24 hours
- Session ID is stored in browser localStorage on the frontend

## 📝 Notes

- **Sessions**: Stored in Redis, expire after 24 hours
- **Passwords**: Hashed using bcrypt with salt rounds
- **Content Status**: Transitions are validated to prevent invalid state changes
- **Self-Review Prevention**: Reviewers cannot review their own content
- **Authentication**: All API endpoints require authentication except `/api/auth/*`
- **AI Output**: Returns only post text with emojis, no explanations or meta-commentary
- **Data Fetching**: Frontend uses TanStack Query for efficient caching and automatic refetching

## 🔒 Security

- **Password Hashing**: bcrypt with salt rounds
- **Session-Based Auth**: Secure session management with Redis
- **Role-Based Access Control**: Endpoints protected by role middleware
- **Input Validation**: All endpoints validate input data
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS**: Configured for secure cross-origin requests

## 🚀 Deployment

### Backend Deployment

1. Build the backend:

   ```bash
   cd backend
   npm run build
   ```

2. Set environment variables on your hosting platform

3. Start the server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

3. Set `VITE_API_URL` environment variable to your backend URL

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [Prisma](https://www.prisma.io/) for database ORM
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [TanStack Query](https://tanstack.com/query) for data fetching

---

Built with ❤️ using TypeScript, Express, React, Prisma, and Google Gemini AI
