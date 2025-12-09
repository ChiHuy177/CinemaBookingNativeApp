import { useState, useEffect } from "react";
import type {
    MovieDTO,
    MovieDetailHomeDTO,
    CreateMovieDTO,
    UpdateMovieDTO,
} from "../types/movie.types";
import { API_CONFIG } from "../config/api.config";
import {
    Search,
    Plus,
    AlertCircle,
    Film,
    X,
    Heart,
    Star,
    Clock,
    User,
    Building2,
    Globe,
    Play,
} from "lucide-react";
import "./MovieList.css";
import MovieCard from "./MovieCard";
import MovieForm from "./MovieForm";
import { movieService } from "../services/movieService";

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<MovieDTO[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<MovieDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingMovie, setEditingMovie] = useState<MovieDTO | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMovie, setSelectedMovie] =
        useState<MovieDetailHomeDTO | null>(null);

    useEffect(() => {
        loadMovies();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = movies.filter(
                (movie) =>
                    movie.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    movie.director
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            setFilteredMovies(filtered);
        } else {
            setFilteredMovies(movies);
        }
    }, [searchTerm, movies]);

    const loadMovies = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await movieService.getAllMovies();
            setMovies(data);
            setFilteredMovies(data);
        } catch (err) {
            setError(
                "Không thể tải danh sách phim. Vui lòng kiểm tra kết nối API."
            );
            console.error("Error loading movies:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingMovie(null);
        setShowForm(true);
    };

    const handleEdit = (movie: MovieDTO) => {
        setEditingMovie(movie);
        setShowForm(true);
    };

    const handleDelete = async (movieId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phim này?")) {
            try {
                await movieService.deleteMovie(movieId);
                await loadMovies();
                alert("Xóa phim thành công!");
            } catch (err) {
                alert("Không thể xóa phim. Vui lòng thử lại.");
                console.error("Error deleting movie:", err);
            }
        }
    };

    const handleView = async (movie: MovieDTO) => {
        try {
            const detail = await movieService.getMovieDetail(movie.movieId);
            setSelectedMovie(detail);
        } catch (err) {
            alert("Không thể tải chi tiết phim.");
            console.error("Error loading movie detail:", err);
        }
    };

    const handleFormSubmit = async (
        formData: CreateMovieDTO | UpdateMovieDTO,
        posterFile?: File
    ) => {
        try {
            if (editingMovie) {
                await movieService.updateMovie(
                    editingMovie.movieId,
                    formData as UpdateMovieDTO,
                    posterFile
                );
                alert("Cập nhật phim thành công!");
            } else {
                await movieService.createMovie(
                    formData as CreateMovieDTO,
                    posterFile
                );
                alert("Tạo phim mới thành công!");
            }
            setShowForm(false);
            setEditingMovie(null);
            await loadMovies();
        } catch (err) {
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
            console.error("Error submitting form:", err);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingMovie(null);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải danh sách phim...</p>
            </div>
        );
    }

    return (
        <div className="movie-list-container">
            <div className="movie-list-header">
                <div className="header-content">
                    <h1>Quản lý Phim</h1>
                    <p className="subtitle">
                        Tổng cộng {filteredMovies.length} phim
                    </p>
                </div>

                <div className="header-actions">
                    <div className="search-box">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm phim..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-add" onClick={handleCreate}>
                        <Plus size={20} />
                        Thêm phim mới
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                    <button onClick={loadMovies}>Thử lại</button>
                </div>
            )}

            {filteredMovies.length === 0 && !error ? (
                <div className="empty-state">
                    <Film size={80} className="empty-icon" />
                    <h3>Không tìm thấy phim nào</h3>
                    <p>
                        {searchTerm
                            ? "Thử tìm kiếm với từ khóa khác"
                            : "Hãy thêm phim đầu tiên của bạn!"}
                    </p>
                    {!searchTerm && (
                        <button className="btn-add" onClick={handleCreate}>
                            <Plus size={20} />
                            Thêm phim mới
                        </button>
                    )}
                </div>
            ) : (
                <div className="movies-grid">
                    {filteredMovies.map((movie) => (
                        <MovieCard
                            key={movie.movieId}
                            movie={movie}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <MovieForm
                    movie={editingMovie}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}

            {selectedMovie && (
                <div
                    className="movie-detail-overlay"
                    onClick={() => setSelectedMovie(null)}
                >
                    <div
                        className="movie-detail-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="btn-close-detail"
                            onClick={() => setSelectedMovie(null)}
                        >
                            <X size={24} />
                        </button>

                        <div className="movie-detail-content">
                            <div className="movie-detail-poster">
                                <img
                                    src={API_CONFIG.getImageUrl(
                                        selectedMovie.posterURL
                                    )}
                                    alt={selectedMovie.title}
                                />
                            </div>

                            <div className="movie-detail-info">
                                <h2>{selectedMovie.title}</h2>

                                <div className="detail-stats">
                                    <div className="stat">
                                        <span className="stat-label">
                                            <Heart size={18} /> Lượt thích:
                                        </span>
                                        <span className="stat-value">
                                            {selectedMovie.totalLike}
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">
                                            <Star size={18} /> Đánh giá:
                                        </span>
                                        <span className="stat-value">
                                            {selectedMovie.rating.toFixed(1)}/10
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">
                                            <Clock size={18} /> Thời lượng:
                                        </span>
                                        <span className="stat-value">
                                            {selectedMovie.duration} phút
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">
                                            <User size={18} /> Đạo diễn:
                                        </span>
                                        <span className="stat-value">
                                            {selectedMovie.director}
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">
                                            <Building2 size={18} /> Công ty:
                                        </span>
                                        <span className="stat-value">
                                            {selectedMovie.company}
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">
                                            <Globe size={18} /> Ngôn ngữ:
                                        </span>
                                        <span className="stat-value">
                                            {selectedMovie.language}
                                        </span>
                                    </div>
                                </div>

                                <div className="detail-description">
                                    <h3>
                                        <Film
                                            size={20}
                                            style={{
                                                display: "inline",
                                                marginRight: "8px",
                                            }}
                                        />
                                        Mô tả
                                    </h3>
                                    <p>{selectedMovie.description}</p>
                                </div>

                                {selectedMovie.genres &&
                                    selectedMovie.genres.length > 0 && (
                                        <div className="detail-genres">
                                            <h3>
                                                <Film
                                                    size={20}
                                                    style={{
                                                        display: "inline",
                                                        marginRight: "8px",
                                                    }}
                                                />
                                                Thể loại
                                            </h3>
                                            <div className="genres-list">
                                                {selectedMovie.genres.map(
                                                    (genre) => (
                                                        <span
                                                            key={genre.genreId}
                                                            className="genre-tag"
                                                        >
                                                            {genre.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {selectedMovie.trailerURL && (
                                    <a
                                        href={selectedMovie.trailerURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-trailer"
                                    >
                                        <Play size={20} />
                                        Xem Trailer
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieList;
