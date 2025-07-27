import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ActivitySearch.css';

const ActivitySearch = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [popularActivities, setPopularActivities] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularActivities();
    fetchUpcomingActivities();
  }, []);

  const fetchPopularActivities = async () => {
    try {
      const response = await fetch('/api/activities/popular?limit=6');
      if (response.ok) {
        const data = await response.json();
        setPopularActivities(data.data);
      }
    } catch (err) {
      console.error('获取热门活动失败:', err);
    }
  };

  const fetchUpcomingActivities = async () => {
    try {
      const response = await fetch('/api/activities/upcoming?limit=6');
      if (response.ok) {
        const data = await response.json();
        setUpcomingActivities(data.data);
      }
    } catch (err) {
      console.error('获取即将开始的活动失败:', err);
    }
  };

  const searchActivities = async () => {
    if (!keyword.trim()) {
      setActivities([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        keyword: keyword.trim()
      });

      const response = await fetch(`/api/activities/search?${params}`);
      if (!response.ok) {
        throw new Error('搜索失败');
      }

      const data = await response.json();
      setActivities(data.data.activities || []);
      setTotalPages(data.data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchActivities();
  };

  const clearSearch = () => {
    setKeyword('');
    setActivities([]);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': '草稿',
      'published': '已发布',
      'cancelled': '已取消',
      'completed': '已完成'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="activity-search">
      {/* 页面头部 */}
      <div className="search-header">
        <div className="header-content">
          <div className="header-left">
            <button
              onClick={() => navigate('/')}
              className="back-btn"
            >
              ← 返回首页
            </button>
            <h1>活动搜索</h1>
          </div>
        </div>
        
        {/* 简化的搜索表单 */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              placeholder="输入活动名称进行搜索..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? '搜索中...' : '🔍 搜索'}
            </button>
            {keyword && (
              <button type="button" onClick={clearSearch} className="clear-btn">
                清除
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 搜索结果 */}
      {error && <div className="error">错误: {error}</div>}

      {activities.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h2>搜索结果 ({activities.length})</h2>
            <button onClick={clearSearch} className="clear-all-btn">
              清除搜索
            </button>
          </div>
          <div className="activities-grid">
            {activities.map(activity => (
              <div key={activity.id} className="activity-card" onClick={() => navigate(`/activity/${activity.id}`)}>
                <div className="activity-header">
                  <h3>{activity.title}</h3>
                  <span className={`status status-${activity.status}`}>
                    {getStatusText(activity.status)}
                  </span>
                </div>
                <p className="description">{activity.description}</p>
                <div className="activity-details">
                  <span>📍 {activity.location}</span>
                  <span>🕒 {formatDate(activity.startTime)}</span>
                  <span>💰 ¥{activity.price}</span>
                  <span>👥 {activity.currentParticipants}/{activity.maxParticipants}</span>
                </div>
                <div className="organizer">
                  组织者: {activity.organizer?.username || '未知'}
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                上一页
              </button>
              <span className="page-info">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      )}

      {/* 热门活动和即将开始的活动 */}
      {activities.length === 0 && (
        <div className="featured-sections">
          <div className="featured-section">
            <h2>🔥 热门活动</h2>
            <div className="featured-activities">
              {popularActivities.map(activity => (
                <div key={activity.id} className="featured-card" onClick={() => navigate(`/activity/${activity.id}`)}>
                  <h3>{activity.title}</h3>
                  <p className="location">📍 {activity.location}</p>
                  <p className="participants">👥 {activity.currentParticipants}/{activity.maxParticipants} 人</p>
                  <p className="price">💰 ¥{activity.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="featured-section">
            <h2>⏰ 即将开始</h2>
            <div className="featured-activities">
              {upcomingActivities.map(activity => (
                <div key={activity.id} className="featured-card" onClick={() => navigate(`/activity/${activity.id}`)}>
                  <h3>{activity.title}</h3>
                  <p className="location">📍 {activity.location}</p>
                  <p className="time">🕒 {formatDate(activity.startTime)}</p>
                  <p className="price">💰 ¥{activity.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && activities.length === 0 && keyword && (
        <div className="no-results">
          <div className="no-results-content">
            <h3>🔍 没有找到相关活动</h3>
            <p>尝试使用不同的关键词搜索</p>
            <button onClick={clearSearch} className="try-again-btn">
              重新搜索
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySearch; 