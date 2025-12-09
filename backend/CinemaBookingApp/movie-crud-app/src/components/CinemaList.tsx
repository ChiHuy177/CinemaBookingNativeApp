import { useState, useEffect } from 'react';
import type { CinemaDTO } from '../types/common.types';
import { cinemaService } from '../services/cinemaService';
import { Building2, Loader2, AlertCircle, MapPin } from 'lucide-react';
import './CinemaList.css';

const CinemaList: React.FC = () => {
  const [cinemas, setCinemas] = useState<CinemaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCinemas();
  }, []);

  const loadCinemas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cinemaService.getAllCinemas();
      setCinemas(data);
    } catch (err) {
      setError('Không thể tải danh sách rạp chiếu. Vui lòng kiểm tra kết nối API.');
      console.error('Error loading cinemas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="loading-spinner" />
        <p>Đang tải danh sách rạp chiếu...</p>
      </div>
    );
  }

  return (
    <div className="cinema-list-container">
      <div className="cinema-list-header">
        <div className="header-content">
          <h1>
            <Building2 size={32} style={{ display: 'inline', marginRight: '12px' }} />
            Danh sách Rạp chiếu
          </h1>
          <p className="subtitle">Tổng cộng {cinemas.length} rạp</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={24} />
          <p>{error}</p>
          <button onClick={loadCinemas}>Thử lại</button>
        </div>
      )}

      <div className="cinemas-grid">
        {cinemas.map((cinema) => (
          <div key={cinema.cinemaId} className="cinema-card">
            <div className="cinema-icon">
              <Building2 size={48} />
            </div>
            <div className="cinema-content">
              <h3>{cinema.name}</h3>
              <div className="cinema-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{cinema.address}</span>
                </div>
                <div className="detail-item">
                  <span className="city-badge">{cinema.city}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cinemas.length === 0 && !error && (
        <div className="empty-state">
          <Building2 size={80} className="empty-icon" />
          <h3>Chưa có rạp chiếu nào</h3>
          <p>Danh sách rạp chiếu trống</p>
        </div>
      )}
    </div>
  );
};

export default CinemaList;
