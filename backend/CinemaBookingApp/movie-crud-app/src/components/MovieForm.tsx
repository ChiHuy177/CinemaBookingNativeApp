import { useState, useEffect } from 'react';
import type { MovieDTO, CreateMovieDTO, UpdateMovieDTO } from '../types/movie.types';
import type { GenreDTO } from '../types/genre.types';
import { genreService } from '../services/genreService';
import { actorService } from '../services/actorService';
import './MovieForm.css';

interface MovieFormProps {
  movie: MovieDTO | null;
  onSubmit: (data: CreateMovieDTO | UpdateMovieDTO, posterFile?: File) => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  description: string;
  duration: string;
  director: string;
  releaseDate: string;
  posterURL: string;
  trailerURL: string;
  requireAge: string;
  company: string;
  language: string;
}

interface FormErrors {
  [key: string]: string;
}

interface Actor {
  actorId: number;
  name: string;
}

interface ActorSelection {
  actorId: number;
  characterName: string;
}

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    duration: '',
    director: '',
    releaseDate: '',
    posterURL: '',
    trailerURL: '',
    requireAge: '',
    company: '',
    language: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Genres and Actors
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedActors, setSelectedActors] = useState<ActorSelection[]>([]);

  useEffect(() => {
    loadGenresAndActors();
  }, []);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        duration: movie.duration.toString() || '',
        director: movie.director || '',
        releaseDate: movie.releaseDate ? (movie.releaseDate.split('T')[0] ?? '') : '',
        posterURL: movie.posterURL || '',
        trailerURL: movie.trailerURL || '',
        requireAge: movie.requireAge?.toString() || '',
        company: movie.company || '',
        language: movie.language || ''
      });
      // Set preview URL cho ảnh hiện tại
      if (movie.posterURL) {
        setPreviewUrl(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5199'}/images/posters/${movie.posterURL}`);
      }
    }
  }, [movie]);

  const loadGenresAndActors = async () => {
    try {
      const [genresData, actorsData] = await Promise.all([
        genreService.getAllGenres(),
        actorService.getAllActors()
      ]);
      setGenres(genresData);
      setActors(actorsData);
    } catch (error) {
      console.error('Error loading genres and actors:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, posterFile: 'Vui lòng chọn file ảnh' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, posterFile: 'Kích thước file không được vượt quá 5MB' }));
        return;
      }

      setPosterFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (errors.posterFile) {
        setErrors(prev => ({ ...prev, posterFile: '' }));
      }
    }
  };

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleAddActor = () => {
    setSelectedActors(prev => [...prev, { actorId: 0, characterName: '' }]);
  };

  const handleRemoveActor = (index: number) => {
    setSelectedActors(prev => prev.filter((_, i) => i !== index));
  };

  const handleActorChange = (index: number, field: 'actorId' | 'characterName', value: string | number) => {
    setSelectedActors(prev => {
      const updated = [...prev];
      const current = updated[index];
      if (!current) return prev;

      if (field === 'actorId') {
        updated[index] = { actorId: Number(value), characterName: current.characterName };
      } else {
        updated[index] = { actorId: current.actorId, characterName: String(value) };
      }
      return updated;
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Tên phim là bắt buộc';
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.duration || parseInt(formData.duration) <= 0) newErrors.duration = 'Thời lượng phải lớn hơn 0';
    if (!formData.director.trim()) newErrors.director = 'Đạo diễn là bắt buộc';
    if (!formData.releaseDate) newErrors.releaseDate = 'Ngày phát hành là bắt buộc';

    if (!posterFile && !formData.posterURL.trim()) {
      newErrors.posterFile = 'Vui lòng chọn ảnh poster';
    }

    if (!formData.company.trim()) newErrors.company = 'Công ty là bắt buộc';
    if (!formData.language.trim()) newErrors.language = 'Ngôn ngữ là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      if (movie) {
        const submitData: UpdateMovieDTO = {
          title: formData.title,
          description: formData.description,
          duration: parseInt(formData.duration),
          director: formData.director,
          releaseDate: new Date(formData.releaseDate).toISOString(),
          posterURL: formData.posterURL,
          trailerURL: formData.trailerURL,
          requireAge: formData.requireAge ? parseInt(formData.requireAge) : 0,
          company: formData.company,
          language: formData.language
        };
        onSubmit(submitData, posterFile || undefined);
      } else {
        const submitData: CreateMovieDTO = {
          title: formData.title,
          description: formData.description,
          duration: parseInt(formData.duration),
          director: formData.director,
          releaseDate: new Date(formData.releaseDate).toISOString(),
          posterURL: formData.posterURL,
          trailerURL: formData.trailerURL,
          requireAge: formData.requireAge ? parseInt(formData.requireAge) : null,
          company: formData.company,
          language: formData.language,
          genreIDs: selectedGenres,
          createMovieActorDTOs: selectedActors.filter(a => a.actorId > 0 && a.characterName.trim())
        };
        onSubmit(submitData, posterFile || undefined);
      }
    }
  };

  return (
    <div className="movie-form-overlay">
      <div className="movie-form-container">
        <div className="movie-form-header">
          <h2>{movie ? '✏️ Chỉnh sửa phim' : '➕ Thêm phim mới'}</h2>
          <button className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="movie-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Tên phim *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Nhập tên phim..."
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="director">Đạo diễn *</label>
              <input
                type="text"
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                className={errors.director ? 'error' : ''}
                placeholder="Nhập tên đạo diễn..."
              />
              {errors.director && <span className="error-message">{errors.director}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="duration">Thời lượng (phút) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={errors.duration ? 'error' : ''}
                placeholder="120"
                min="1"
              />
              {errors.duration && <span className="error-message">{errors.duration}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="releaseDate">Ngày phát hành *</label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className={errors.releaseDate ? 'error' : ''}
              />
              {errors.releaseDate && <span className="error-message">{errors.releaseDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="company">Công ty *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={errors.company ? 'error' : ''}
                placeholder="Warner Bros, Marvel Studios..."
              />
              {errors.company && <span className="error-message">{errors.company}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="language">Ngôn ngữ *</label>
              <input
                type="text"
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className={errors.language ? 'error' : ''}
                placeholder="Tiếng Anh, Tiếng Việt..."
              />
              {errors.language && <span className="error-message">{errors.language}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="requireAge">Độ tuổi yêu cầu</label>
              <input
                type="number"
                id="requireAge"
                name="requireAge"
                value={formData.requireAge}
                onChange={handleChange}
                placeholder="13, 16, 18..."
                min="0"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Mô tả *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                placeholder="Nhập mô tả phim..."
                rows={4}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="posterFile">Ảnh Poster *</label>
              <input
                type="file"
                id="posterFile"
                name="posterFile"
                accept="image/*"
                onChange={handleFileChange}
                className={errors.posterFile ? 'error' : ''}
              />
              {errors.posterFile && <span className="error-message">{errors.posterFile}</span>}

              {previewUrl && (
                <div className="poster-preview">
                  <img src={previewUrl} alt="Poster preview" />
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="trailerURL">URL Trailer</label>
              <input
                type="text"
                id="trailerURL"
                name="trailerURL"
                value={formData.trailerURL}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {!movie && (
              <div className="form-group full-width">
                <label>Thể loại (optional)</label>
                <div className="genres-selection">
                  {genres.map(genre => (
                    <label key={genre.genreId} className="genre-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre.genreId)}
                        onChange={() => handleGenreToggle(genre.genreId)}
                      />
                      <span>{genre.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!movie && (
              <div className="form-group full-width">
                <label>Diễn viên (optional)</label>
                <div className="actors-selection">
                  {selectedActors.map((actorSelection, index) => (
                    <div key={index} className="actor-row">
                      <select
                        value={actorSelection.actorId}
                        onChange={(e) => handleActorChange(index, 'actorId', parseInt(e.target.value))}
                        className="actor-select"
                      >
                        <option value={0}>Chọn diễn viên...</option>
                        {actors.map(actor => (
                          <option key={actor.actorId} value={actor.actorId}>
                            {actor.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Tên nhân vật..."
                        value={actorSelection.characterName}
                        onChange={(e) => handleActorChange(index, 'characterName', e.target.value)}
                        className="character-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveActor(index)}
                        className="btn-remove-actor"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddActor}
                    className="btn-add-actor"
                  >
                    + Thêm diễn viên
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {movie ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
