import { useState, useEffect } from 'react';
import type { ComboDTO } from '../types/common.types';
import { comboService } from '../services/comboService';
import { Package, Loader2, AlertCircle } from 'lucide-react';
import './ComboList.css';
import { API_CONFIG } from '../config/api.config';

const ComboList: React.FC = () => {
  const [combos, setCombos] = useState<ComboDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCombos();
  }, []);

  const loadCombos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await comboService.getAllCombos();
      setCombos(data);
    } catch (err) {
      setError('Không thể tải danh sách combo. Vui lòng kiểm tra kết nối API.');
      console.error('Error loading combos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 size={48} className="loading-spinner" />
        <p>Đang tải danh sách combo...</p>
      </div>
    );
  }

  return (
    <div className="combo-list-container">
      <div className="combo-list-header">
        <div className="header-content">
          <h1>
            <Package size={32} style={{ display: 'inline', marginRight: '12px' }} />
            Danh sách Combo
          </h1>
          <p className="subtitle">Tổng cộng {combos.length} combo</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={24} />
          <p>{error}</p>
          <button onClick={loadCombos}>Thử lại</button>
        </div>
      )}

      <div className="combos-grid">
        {combos.map((combo) => (
          <div key={combo.comboId} className="combo-card">
            <div className="combo-image">
              <img
                src={API_CONFIG.getComboUrl(combo.imageURL)}
                alt={combo.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="combo-content">
              <h3>{combo.name}</h3>
              <div className="combo-details">
                <div className="detail-item">
                  <span className="label">Số lượng:</span>
                  <span className="value">{combo.quantity}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Giá:</span>
                  <span className="value price">{combo.price.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {combos.length === 0 && !error && (
        <div className="empty-state">
          <Package size={80} className="empty-icon" />
          <h3>Chưa có combo nào</h3>
          <p>Danh sách combo trống</p>
        </div>
      )}
    </div>
  );
};

export default ComboList;
