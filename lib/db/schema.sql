-- CineVault Database Schema
-- MySQL Database Structure

CREATE DATABASE IF NOT EXISTS cinevault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cinevault;

-- Users table
CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	movie_id INT NOT NULL,
	movie_type ENUM('movie', 'tv') NOT NULL DEFAULT 'movie',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE KEY unique_user_movie (user_id, movie_id, movie_type),
	INDEX idx_user_id (user_id),
	INDEX idx_movie_id (movie_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Watch progress table (for Continue Watching feature)
CREATE TABLE IF NOT EXISTS watch_progress (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	movie_id INT NOT NULL,
	movie_type ENUM('movie', 'tv') NOT NULL DEFAULT 'movie',
	progress DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT 'Progress percentage (0-100)',
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE KEY unique_user_movie_progress (user_id, movie_id, movie_type),
	INDEX idx_user_id (user_id),
	INDEX idx_movie_id (movie_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;


