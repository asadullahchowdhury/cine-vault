# CineVault - Movie Website

A modern, fully responsive movie website built with Next.js 16, TypeScript, and Tailwind CSS. Discover and explore movies and TV series with a cinematic dark theme.

## Features

- **Homepage**: Display latest and trending movies from TMDB API
- **Search**: Movie/series search with filters
- **Series Page**: Dedicated section for TV shows
- **Preview Page**: Detailed movie/series information with cast, trailers, and similar content
- **Wishlist System**: Save your favorite movies (requires authentication)
- **Categories**: Browse movies and TV shows by genre
- **Authentication**: User registration and login system
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Dark Theme**: Cinematic dark theme with smooth animations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Shadcn UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Database**: MySQL (via mysql2)
- **Authentication**: JWT (jose)
- **API**: TMDB (The Movie Database)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL database
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cine-vault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cinevault
DB_PORT=3306

# TMDB API Key
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Node Environment
NODE_ENV=development
```

4. Set up the database:
```bash
# Import the schema
mysql -u root -p < lib/db/schema.sql
```

Or manually run the SQL commands from `lib/db/schema.sql` in your MySQL client.

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /(auth)              # Authentication pages
    /login
    /register
  /(main)              # Main app pages
    /home              # Homepage
    /search            # Search page
    /series            # TV series page
    /categories        # Genre browsing
    /wishlist          # User favorites
    /preview/[id]      # Movie/series details
  /api                 # API routes
    /auth              # Authentication endpoints
    /movies            # Movie data endpoints
    /wishlist          # Wishlist CRUD
  /components
    /ui                # Reusable UI components
    /layout            # Layout components
    /movie             # Movie-specific components
    /animations        # Animation components
  /lib
    /db                # Database utilities
    /api               # External API clients
    /auth              # Auth utilities
  /utils               # Helper functions
  /types               # TypeScript types
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session

### Movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/search?q=query&page=1` - Search movies
- `GET /api/movies/[id]?type=movie` - Get movie details
- `GET /api/movies/genres?type=movie` - Get genres
- `GET /api/movies/genres/[id]?type=movie` - Get movies by genre

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[id]?type=movie` - Remove from wishlist

## Database Schema

The database includes three main tables:
- `users` - User accounts
- `wishlist` - User's saved movies/TV shows
- `watch_progress` - Watch progress tracking (for future "Continue Watching" feature)

See `lib/db/schema.sql` for the complete schema.

## Development

### Code Style

This project follows the coding standards defined in `.cursorrules`:
- Use tabs for indentation
- Single quotes for strings
- Functional components with TypeScript
- Follow naming conventions (PascalCase for components, camelCase for functions)

### Building for Production

```bash
npm run build
npm start
```

## Future Enhancements

- Continue Watching feature
- Advanced search filters
- User reviews and ratings
- Social features (sharing, comments)
- Mobile app (React Native)
- Desktop app (Electron)

## License

MIT

## Credits

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
