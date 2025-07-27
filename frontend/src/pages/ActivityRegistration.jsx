import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ActivityRegistration.css';

const ActivityRegistration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/registrations/user?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('获取报名记录失败');
      }

      const data = await response.json();
      console.log('获取到的报名记录:', data);
      setRegistrations(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (activityId) => {
    if (!window.confirm('确定要取消报名吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/registrations/cancel/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('取消报名失败');
      }

      // 重新获取报名记录
      fetchRegistrations();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'confirmed': '已确认',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      'confirmed': 'status-confirmed',
      'cancelled': 'status-cancelled'
    };
    return classMap[status] || '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>出错了</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>重新加载</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* 背景装饰 */}
      <div className="background-decoration"></div>
      
      <div className="content-wrapper">
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-left">
            <button
              onClick={() => navigate('/')}
              className="back-button"
            >
              <span>←</span>
              返回首页
            </button>
            <div className="title-section">
              <h1>我的活动报名</h1>
              <p>管理您的活动报名记录</p>
            </div>
          </div>
          
          <div className="filter-section">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                全部
              </button>
              <button 
                className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
                onClick={() => setFilter('confirmed')}
              >
                已确认
              </button>
              <button 
                className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                onClick={() => setFilter('cancelled')}
              >
                已取消
              </button>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{registrations.length}</div>
            <div className="stat-label">总报名数</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {registrations.filter(r => r.status === 'confirmed').length}
            </div>
            <div className="stat-label">已确认</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {registrations.filter(r => r.status === 'cancelled').length}
            </div>
            <div className="stat-label">已取消</div>
          </div>
        </div>

        {/* 报名列表 */}
        {registrations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>暂无报名记录</h3>
            <p>您还没有报名任何活动，快去发现精彩活动吧！</p>
            <button 
              onClick={() => navigate('/')}
              className="browse-button"
            >
              浏览活动
            </button>
          </div>
        ) : (
          <div className="registrations-grid">
            {registrations.map((registration, index) => (
              <div 
                key={registration.id} 
                className="registration-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <h3 className="activity-title">{registration.activity.title}</h3>
                  <div className={`status-badge ${getStatusClass(registration.status)}`}>
                    {getStatusText(registration.status)}
                  </div>
                </div>
                
                <div className="card-content">
                  {registration.activity.description && (
                    <p className="activity-description">
                      {registration.activity.description}
                    </p>
                  )}
                  
                  <div className="activity-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-label">地点:</span>
                      <span className="detail-value">{registration.activity.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🕒</span>
                      <span className="detail-label">时间:</span>
                      <span className="detail-value">{formatDate(registration.activity.startTime)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="detail-label">价格:</span>
                      <span className="detail-value price">¥{registration.activity.price}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <span className="detail-label">组织者:</span>
                      <span className="detail-value">{registration.activity.organizer.username}</span>
                    </div>
                  </div>
                  
                  <div className="registration-meta">
                    <div className="registration-time">
                      <span className="meta-icon">📅</span>
                      报名时间: {formatDate(registration.registrationTime)}
                    </div>
                    {registration.notes && (
                      <div className="registration-notes">
                        <span className="meta-icon">📝</span>
                        备注: {registration.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="card-actions">
                  <button 
                    onClick={() => navigate(`/activity/${registration.activity.id}`)}
                    className="action-btn view-btn"
                  >
                    查看活动
                  </button>
                  {registration.status === 'confirmed' && (
                    <button
                      onClick={() => cancelRegistration(registration.activity.id)}
                      className="action-btn cancel-btn"
                    >
                      取消报名
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityRegistration; 