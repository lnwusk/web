import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActivityComments from '../components/ActivityComments';
import '../styles/ActivityDetail.css';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationNotes, setRegistrationNotes] = useState('');

  useEffect(() => {
    fetchActivity();
    checkRegistration();
  }, [id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activities/${id}`);
      if (!response.ok) {
        throw new Error('获取活动详情失败');
      }
      const data = await response.json();
      setActivity(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/registrations/check/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRegistration(data.data.registration);
      }
    } catch (err) {
      console.error('检查报名状态失败:', err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      alert('请先登录');
      navigate('/login');
      return;
    }

    try {
      setRegistrationLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/registrations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          activityId: parseInt(id),
          notes: registrationNotes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '报名失败');
      }

      const data = await response.json();
      alert('报名成功！');
      setRegistration(data.data);
      setShowRegistrationForm(false);
      setRegistrationNotes('');
      fetchActivity(); // 刷新活动信息以更新参与人数
    } catch (err) {
      alert(err.message);
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!window.confirm('确定要取消报名吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/registrations/cancel/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('取消报名失败');
      }

      alert('取消报名成功');
      setRegistration(null);
      fetchActivity(); // 刷新活动信息
    } catch (err) {
      alert(err.message);
    }
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

  const getStatusClass = (status) => {
    const classMap = {
      'draft': 'status-draft',
      'published': 'status-published',
      'cancelled': 'status-cancelled',
      'completed': 'status-completed'
    };
    return classMap[status] || '';
  };

  const getRegistrationStatusText = (status) => {
    const statusMap = {
      'confirmed': '已确认',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  };

  const getRegistrationStatusClass = (status) => {
    const classMap = {
      'confirmed': 'registration-confirmed',
      'cancelled': 'registration-cancelled'
    };
    return classMap[status] || '';
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">错误: {error}</div>;
  }

  if (!activity) {
    return <div className="error">活动不存在</div>;
  }

  return (
    <div className="activity-detail">
      <div className="header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← 返回首页
        </button>
        <h1>{activity.title}</h1>
      </div>

      <div className="activity-content">
        <div className="main-info">
          <div className="activity-header">
            <div className="title-section">
              <h2>{activity.title}</h2>
              <span className={`status ${getStatusClass(activity.status)}`}>
                {getStatusText(activity.status)}
              </span>
            </div>
            <div className="price-section">
              <span className="price">¥{activity.price}</span>
            </div>
          </div>

          <div className="description">
            <h3>活动描述</h3>
            <p>{activity.description || '暂无描述'}</p>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="label">📍 地点</span>
              <span className="value">{activity.location || '未设置'}</span>
            </div>
            <div className="detail-item">
              <span className="label">🕒 开始时间</span>
              <span className="value">{formatDate(activity.startTime)}</span>
            </div>
            <div className="detail-item">
              <span className="label">🕐 结束时间</span>
              <span className="value">{formatDate(activity.endTime)}</span>
            </div>
            <div className="detail-item">
              <span className="label">👥 参与人数</span>
              <span className="value">{activity.currentParticipants}/{activity.maxParticipants}</span>
            </div>
            <div className="detail-item">
              <span className="label">👤 组织者</span>
              <span className="value">{activity.organizer?.username || '未知'}</span>
            </div>
          </div>

          {/* 报名状态显示 */}
          {registration && (
            <div className="registration-status">
              <h3>我的报名状态</h3>
              <div className={`status-badge ${getRegistrationStatusClass(registration.status)}`}>
                {getRegistrationStatusText(registration.status)}
              </div>
              <p>报名时间: {formatDate(registration.registrationTime)}</p>
              {registration.notes && <p>备注: {registration.notes}</p>}
              {registration.status === 'confirmed' && (
                <button onClick={handleCancelRegistration} className="cancel-btn">
                  取消报名
                </button>
              )}
            </div>
          )}

          {/* 报名按钮 */}
          {!registration && activity.status === 'published' && (
            <div className="registration-section">
              {showRegistrationForm ? (
                <form onSubmit={handleRegister} className="registration-form">
                  <h3>活动报名</h3>
                  <div className="form-group">
                    <label>备注 (可选):</label>
                    <textarea
                      value={registrationNotes}
                      onChange={(e) => setRegistrationNotes(e.target.value)}
                      placeholder="请输入备注信息..."
                      rows="3"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={registrationLoading} className="submit-btn">
                      {registrationLoading ? '报名中...' : '确认报名'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowRegistrationForm(false)}
                      className="cancel-btn"
                    >
                      取消
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setShowRegistrationForm(true)}
                  className="register-btn"
                  disabled={activity.currentParticipants >= activity.maxParticipants}
                >
                  {activity.currentParticipants >= activity.maxParticipants ? '活动已满员' : '立即报名'}
                </button>
              )}
            </div>
          )}

          {activity.status !== 'published' && (
            <div className="unavailable-message">
              <p>此活动暂不可报名</p>
            </div>
          )}
        </div>
      </div>

      {/* 评论区域 */}
      <ActivityComments activityId={id} />
    </div>
  );
};

export default ActivityDetail; 