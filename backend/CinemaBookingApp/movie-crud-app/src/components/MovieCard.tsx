import { useState } from 'react';
import type { MovieDTO } from '../types/movie.types';
import { API_CONFIG } from '../config/api.config';
import { Eye, Edit, Trash2, Film, Clock, Calendar, Heart, Ticket } from 'lucide-react';
import './MovieCard.css';

interface MovieCardProps {
  movie: MovieDTO;
  onEdit: (movie: MovieDTO) => void;
  onDelete: (id: number) => void;
  onView: (movie: MovieDTO) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onEdit, onDelete, onView }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="movie-card">
      <div className="movie-card-poster">
        {!imageError && movie.posterURL ? (
          <img 
            src={API_CONFIG.getImageUrl(movie.posterURL)} 
            alt={movie.title}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="movie-card-placeholder">
            <Film size={64} />
          </div>
        )}
        <div className="movie-card-overlay">
          <button className="btn-icon" onClick={() => onView(movie)} title="Xem chi tiết">
            <Eye size={20} />
          </button>
          <button className="btn-icon" onClick={() => onEdit(movie)} title="Chỉnh sửa">
            <Edit size={20} />
          </button>
          <button className="btn-icon btn-danger" onClick={() => onDelete(movie.movieId)} title="Xóa">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        
        <div className="movie-card-info">
          <div className="info-item">
            <Clock size={16} className="info-icon" />
            <span>{formatDuration(movie.duration)}</span>
          </div>
          <div className="info-item">
            <Calendar size={16} className="info-icon" />
            <span>{formatDate(movie.releaseDate)}</span>
          </div>
        </div>

        <div className="movie-card-stats">
          <div className="stat-item">
            <Heart size={16} className="stat-icon" />
            <span>{movie.totalLike || 0}</span>
          </div>
          <div className="stat-item">
            <Ticket size={16} className="stat-icon" />
            <span>{movie.totalBooking || 0}</span>
          </div>
          {movie.requireAge && (
            <div className="stat-item age-rating">
              <span>{movie.requireAge}+</span>
            </div>
          )}
        </div>

        {!movie.isAvailable && (
          <div className="movie-unavailable">Không khả dụng</div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
