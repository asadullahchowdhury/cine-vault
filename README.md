# CineVault - Movie Website

A modern, fully responsive movie website built with Next.js 16, TypeScript, and Tailwind CSS. Discover and explore movies with a cinematic dark theme.

## Features

- **Homepage**: Display latest and trending movies from YTS API
- **Search**: Movie search with filters
- **Preview Page**: Detailed movie information with cast, trailers, and similar content
- **Wishlist System**: Save your favorite movies (requires authentication)
- **Categories**: Browse movies by genre
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
- **API**: YTS (YIFY Torrents)

## 📌 About this repository

This repository is a **portfolio showcase** of how I built CineVault — architecture, API routes and UI. It isn't packaged for installation or reuse; feel free to browse the code.

## Project Structure

```
/app
  /(auth)              # Authentication pages
    /login
    /register
  /(main)              # Main app pages
    /home              # Homepage
    /search            # Search page
    /categories        # Genre browsing
    /wishlist          # User favorites
    /preview/[id]      # Movie details
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
- `GET /api/movies/[id]` - Get movie details
- `GET /api/movies/genres` - Get genres
- `GET /api/movies/genres/[id]` - Get movies by genre

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[id]?type=movie` - Remove from wishlist

## Database Schema

The database includes three main tables:
- `users` - User accounts
- `wishlist` - User's saved movies
- `watch_progress` - Watch progress tracking (for future "Continue Watching" feature)

See `lib/db/schema.sql` for the complete schema.

## Future Enhancements

- Continue Watching feature
- Advanced search filters
- User reviews and ratings
- Social features (sharing, comments)
- Mobile app (React Native)
- Desktop app (Electron)

## License

© 2026 Rahat Chowdhury. All rights reserved. Shared for portfolio purposes only.

## 👤 Author

**Rahat Chowdhury** — Full-Stack Developer
[Portfolio](https://rahat-chowdhury.vercel.app) · [LinkedIn](https://www.linkedin.com/in/chowdhuryrahat) · [GitHub](https://github.com/asadullahchowdhury)

## Credits

- Movie data provided by [YTS (YIFY Torrents)](https://yts.mx/)
