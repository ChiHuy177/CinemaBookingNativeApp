import { useState, useEffect } from 'react';
import type { MyTicketDTO, TicketDTO } from '../types/ticket.types';
import { ticketService } from '../services/ticketService';
import { Ticket, Loader2, AlertCircle, Calendar, Clock, MapPin, Film, X, CheckCircle, XCircle } from 'lucide-react';
import { API_CONFIG } from '../config/api.config';
import './TicketList.css';

const TicketList: React.FC = () => {
    const [tickets, setTickets] = useState<MyTicketDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ticketService.getAllMyTickets();
            setTickets(data);
        } catch (err) {
            setError('Không thể tải danh sách vé. Vui lòng kiểm tra kết nối API.');
            console.error('Error loading tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (ticketId: number) => {
        try {
            setLoadingDetail(true);
            const detail = await ticketService.getTicketById(ticketId);
            setSelectedTicket(detail);
        } catch (err) {
            alert('Không thể tải chi tiết vé.');
            console.error('Error loading ticket detail:', err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 size={48} className="loading-spinner" />
                <p>Đang tải danh sách vé...</p>
            </div>
        );
    }

    return (
        <div className="ticket-list-container">
            <div className="ticket-list-header">
                <div className="header-content">
                    <h1>
                        <Ticket size={32} style={{ display: 'inline', marginRight: '12px' }} />
                        Vé của tôi
                    </h1>
                    <p className="subtitle">Tổng cộng {tickets.length} vé</p>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                    <button onClick={loadTickets}>Thử lại</button>
                </div>
            )}

            <div className="tickets-grid">
                {tickets.map((ticket) => (
                    <div key={ticket.ticketId} className={`ticket-card ${!ticket.isActive ? 'used' : ''}`}>
                        <div className="ticket-header">
                            <div className="ticket-info">
                                <h3>{ticket.movie.title}</h3>
                                <div className="ticket-status">
                                    {ticket.isActive ? (
                                        <span className="status-badge active">
                                            <CheckCircle size={16} />
                                            Chưa sử dụng
                                        </span>
                                    ) : (
                                        <span className="status-badge used">
                                            <XCircle size={16} />
                                            Đã sử dụng
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="ticket-details">
                            <div className="detail-row">
                                <MapPin size={16} />
                                <span>{ticket.cinemaName}</span>
                            </div>
                            <div className="detail-row">
                                <Calendar size={16} />
                                <span>{formatDate(ticket.showingTime.startTime)}</span>
                            </div>
                            <div className="detail-row">
                                <Clock size={16} />
                                <span>{formatTime(ticket.showingTime.startTime)} - {formatTime(ticket.showingTime.endTime)}</span>
                            </div>
                            <div className="detail-row">
                                <Film size={16} />
                                <span>Phòng: {ticket.showingTime.roomName}</span>
                            </div>
                        </div>

                        <div className="ticket-footer">
                            <div className="ticket-price">
                                <span className="price-label">Tổng tiền:</span>
                                <span className="price-value">{ticket.totalPrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <button
                                className="btn-view-detail"
                                onClick={() => handleViewDetail(ticket.ticketId)}
                                disabled={loadingDetail}
                            >
                                {loadingDetail ? <Loader2 size={16} className="spinner" /> : 'Chi tiết'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {tickets.length === 0 && !error && (
                <div className="empty-state">
                    <Ticket size={80} className="empty-icon" />
                    <h3>Chưa có vé nào</h3>
                    <p>Bạn chưa đặt vé nào</p>
                </div>
            )}

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <div className="ticket-detail-overlay" onClick={() => setSelectedTicket(null)}>
                    <div className="ticket-detail-container" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-close-detail" onClick={() => setSelectedTicket(null)}>
                            <X size={24} />
                        </button>

                        <div className="ticket-detail-content">
                            <h2>Chi tiết vé</h2>

                            <div className="detail-section">
                                <h3>Mã vé</h3>
                                <div className="ticket-code">{selectedTicket.ticketCode}</div>
                            </div>

                            <div className="detail-section">
                                <h3>Thông tin phim</h3>
                                <p><strong>Tên phim:</strong> {selectedTicket.movie.title}</p>
                                <p><strong>Rạp:</strong> {selectedTicket.cinemaName}</p>
                                <p><strong>Phòng:</strong> {selectedTicket.showingTime.roomName}</p>
                                <p><strong>Thời gian:</strong> {formatDate(selectedTicket.showingTime.startTime)} - {formatTime(selectedTicket.showingTime.startTime)}</p>
                            </div>

                            <div className="detail-section">
                                <h3>Ghế ngồi</h3>
                                <div className="seats-list">
                                    {selectedTicket.seats.map((seat) => (
                                        <span key={seat.seatId} className="seat-badge">
                                            {seat.seatName}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {selectedTicket.combos && selectedTicket.combos.length > 0 && (
                                <div className="detail-section">
                                    <h3>Combo</h3>
                                    {selectedTicket.combos.map((combo) => (
                                        <p key={combo.comboId}>
                                            {combo.name} x {combo.quantity}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className="detail-section">
                                <h3>Chi tiết giá</h3>
                                <div className="price-breakdown">
                                    <div className="price-row">
                                        <span>Tiền ghế:</span>
                                        <span>{selectedTicket.totalPriceSeats.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Tiền combo:</span>
                                        <span>{selectedTicket.totalPriceCombos.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    {selectedTicket.totalPriceDiscount > 0 && (
                                        <div className="price-row discount">
                                            <span>Giảm giá coupon:</span>
                                            <span>-{selectedTicket.totalPriceDiscount.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                    )}
                                    {selectedTicket.totalRankDiscount > 0 && (
                                        <div className="price-row discount">
                                            <span>Giảm giá hạng:</span>
                                            <span>-{selectedTicket.totalRankDiscount.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                    )}
                                    {selectedTicket.loyalPointsUsed > 0 && (
                                        <div className="price-row discount">
                                            <span>Điểm tích lũy:</span>
                                            <span>-{selectedTicket.loyalPointsUsed.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                    )}
                                    <div className="price-row total">
                                        <span>Tổng cộng:</span>
                                        <span>{selectedTicket.totalPrice.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <p><strong>Ngày tạo:</strong> {formatDate(selectedTicket.createdAt)}</p>
                                {selectedTicket.usedAt && (
                                    <p><strong>Ngày sử dụng:</strong> {formatDate(selectedTicket.usedAt)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketList;
