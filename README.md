# Mood Tracker Backend

A RESTful API backend for tracking daily moods, sleep patterns, and personal reflections. Built with Node.js, Express, TypeScript, and Prisma ORM.

## Features

- **User Management**: Registration, authentication, and profile management with JWT
- **Mood Tracking**: Log daily mood entries with mood levels, sleep hours, and reflections
- **Statistics & Analytics**: 
  - Calculate average mood and sleep over custom time periods
  - View percentage distribution of mood and sleep patterns
  - Analyze trends with flexible date ranges
- **Advice System**: Get personalized advice based on mood patterns
- **File Upload**: Profile photo management with Cloudinary integration
- **Email Service**: Password reset functionality with Nodemailer

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Custom DTOs with env-var for environment variables

## Project Structure

```
src/
├── app.ts                      # Application entry point
├── config/                     # Configuration files (JWT, bcrypt, env)
├── data/postgres/              # Database connection
├── domain/
│   ├── dtos/                   # Data Transfer Objects
│   ├── entities/               # Domain entities
│   ├── errors/                 # Custom error handling
│   └── responses/              # Response formatters
└── presentation/
    ├── advices/                # Advice endpoints
    ├── mood-entries/           # Mood tracking endpoints
    ├── stats/                  # Statistics endpoints
    ├── users/                  # User management endpoints
    ├── middlewares/            # Auth & file upload middleware
    └── services/               # Business logic layer
```

## Database Schema

### User Model
- Email-based authentication
- Profile with name and photo
- One-to-many relationship with mood entries

### MoodEntry Model
- Mood levels: VERY_SAD, SAD, NEUTRAL, HAPPY, VERY_HAPPY (mapped to 1-5 scale for analytics)
- Sleep tracking: ZER0_TWO, THREE_FOUR, FIVE_SIX, SEVEN_EIGHT, NINE (0-2, 3-4, 5-6, 7-8, 9+ hours)
- Optional reflection text
- Timestamps for creation and updates
- Linked to user via authorId

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.template` to `.env`
   - Configure your PostgreSQL database URL
   - Add JWT secret, Cloudinary credentials, and email settings

3. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Build and run production server

## API Endpoints

### Authentication
- `POST /api/users/register` - Create new user account
- `POST /api/users/login` - Authenticate user
- `POST /api/users/request-reset` - Request password reset

### Mood Entries
- `POST /api/mood-entries` - Create mood entry
- `GET /api/mood-entries` - Get user's mood entries (paginated)
- `GET /api/mood-entries/:id` - Get specific mood entry
- `PUT /api/mood-entries/:id` - Update mood entry
- `DELETE /api/mood-entries/:id` - Delete mood entry

### Statistics
- `GET /api/stats/average?daysRange=7` - Get average mood and sleep over specified days
- `GET /api/stats/distribution?daysRange=30` - Get percentage distribution of moods and sleep patterns

### Advices
- `GET /api/advices` - Get personalized advice

### User Profile
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-photo` - Upload profile photo

## Environment Variables

See `.env.template` for required environment variables including:
- Database connection (POSTGRES_URL)
- JWT configuration
- Cloudinary credentials
- Email service settings

## License

ISC