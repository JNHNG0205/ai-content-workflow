# AI Content Workflow

A full-stack content management system with AI-powered content generation, review workflow, and role-based access control. Writers can create, edit, and submit content for review, while reviewers can approve or reject submissions with feedback.

## 🚀 Features

- **AI-Powered Content Generation**: Generate content using Google Gemini AI
- **Content Workflow**: Draft → Submit → Review → Approve/Reject workflow
- **Role-Based Access Control**: Three roles (WRITER, REVIEWER, ADMIN)
- **Session Management**: Secure authentication with Redis-backed sessions
- **Review System**: Reviewers can assign themselves, approve, or reject content with comments
- **Content Management**: Writers can view drafts, submitted, rejected, and approved content
- **RESTful API**: Well-structured REST API for frontend integration

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Sessions**: Redis (ioredis)
- **AI**: Google Gemini AI (@google/genai)
- **Authentication**: Session-based with bcrypt password hashing

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Linting**: ESLint

## 📁 Project Structure

```
ai-content-workflow/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth middleware
│   │   ├── config/          # Configuration files
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/     # Database migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── ...
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Redis server
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-content-workflow
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
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

3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

### Running the Application

1. **Start Redis** (if not running as a service)

   ```bash
   redis-server
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

## 📚 API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "WRITER" // Optional: WRITER, REVIEWER, ADMIN
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
  "user": { "id": "...", "email": "...", "role": "..." }
}
```

**Note**: Use the `sessionId` in the `x-session-id` header for authenticated requests.

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

```http
POST /api/ai/generate
x-session-id: <session-id>
Content-Type: application/json

{
  "prompt": "Write a blog post about TypeScript"
}

Response: {
  "content": "Generated content here..."
}
```

## 🔄 Content Workflow

1. **DRAFT**: Writer creates content

   - Writer can create, update, and view drafts
   - Writer can submit draft for review

2. **SUBMITTED**: Content is submitted for review

   - Reviewer can view pending submissions
   - Reviewer can assign themselves to review
   - Reviewer can approve or reject

3. **APPROVED**: Content is approved

   - Content is finalized
   - Writer can view approved content

4. **REJECTED**: Content is rejected
   - Reviewer provides feedback comment
   - Writer can view rejection comment
   - Writer can revert to DRAFT for editing

## 👥 User Roles

- **WRITER**: Can create, edit, submit, and view their own content
- **REVIEWER**: Can view pending reviews, assign themselves, approve/reject content
- **ADMIN**: Full access (can be extended)

## 🧪 Testing

### Test AI Service

```bash
cd backend
npm run test
```

Or manually:

```bash
cd backend
npx ts-node src/test-ai.ts
```

### Test API Endpoints

Example with curl:

```bash
# Login
SESSION_ID=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"writer@example.com","password":"password123"}' | jq -r '.sessionId')

# Create draft
curl -X POST http://localhost:4000/api/content \
  -H "x-session-id: $SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Content"}'
```

## 🛠️ Development

### Backend Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run test     # Test AI service
```

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Database Management

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

## 📝 Notes

- Sessions are stored in Redis and expire after 24 hours
- Passwords are hashed using bcrypt
- Content status transitions are validated to prevent invalid state changes
- Reviewers cannot review their own content
- All API endpoints require authentication except `/api/auth/*`

## 🔒 Security

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- Input validation on all endpoints
- SQL injection protection via Prisma ORM

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using TypeScript, Express, React, and Prisma
