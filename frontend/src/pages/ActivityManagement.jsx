import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ActivityManagement() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    maxParticipants: '',
    price: '',
    status: 'draft'
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // 获取用户创建的活动
  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      console.log('正在获取用户活动，token:', token ? '存在' : '不存在');
      const response = await axios.get('/api/activities/user/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('获取活动成功:', response.data);
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('获取活动失败:', error);
      console.error('错误详情:', error.response?.data);
      console.error('状态码:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserActivities();
    }
  }, [token]);

  // 创建活动
  const handleCreateActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // 准备提交的数据，确保数据类型正确
      const submitData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        maxParticipants: parseInt(formData.maxParticipants) || 0,
        price: parseFloat(formData.price) || 0.00
      };
      
      console.log('正在创建活动，数据:', submitData);
      const response = await axios.post('/api/activities', submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('创建活动成功:', response.data);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        startTime: '',
        endTime: '',
        maxParticipants: '',
        price: '',
        status: 'draft'
      });
      fetchUserActivities();
    } catch (error) {
      console.error('创建活动失败:', error);
      console.error('错误详情:', error.response?.data);
      console.error('状态码:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  // 删除活动
  const handleDeleteActivity = async (id) => {
    if (!window.confirm('确定要删除这个活动吗？')) return;
    
    try {
      await axios.delete(`/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserActivities();
    } catch (error) {
      console.error('删除活动失败:', error);
    }
  };

  // 更新活动状态
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/activities/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserActivities();
    } catch (error) {
      console.error('更新活动状态失败:', error);
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startTime: '',
      endTime: '',
      maxParticipants: '',
      price: '',
      status: 'draft'
    });
    setShowCreateForm(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem'
      }}
    >
      {/* 主内容区域 */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* 页面头部 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ← 返回首页
            </button>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              活动管理
            </h1>
          </div>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              + 创建活动
            </button>
          )}
        </div>

        {/* 创建活动表单 */}
        {showCreateForm && (
          <div style={{
            background: 'rgba(102, 126, 234, 0.05)',
            padding: '2rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ 
                color: '#374151', 
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                创建新活动
              </h2>
              <button
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateActivity}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="活动标题"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="text"
                  placeholder="活动地点"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="number"
                  placeholder="最大参与人数"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="活动价格"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    color: '#374151',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <textarea
                placeholder="活动描述"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  background: 'white',
                  color: '#374151',
                  outline: 'none',
                  marginBottom: '1rem',
                  resize: 'vertical',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {loading ? '创建中...' : '创建活动'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: 'rgba(0, 0, 0, 0.05)',
                    color: '#6b7280',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0, 0, 0, 0.05)';
                  }}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 活动列表 */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#6b7280',
            fontSize: '1.125rem'
          }}>
            加载中...
          </div>
        ) : activities.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              暂无活动
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              点击上方按钮创建您的第一个活动
            </p>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                创建活动
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: '#374151', 
                      marginBottom: '0.5rem',
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}>
                      {activity.title}
                    </h3>
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}>
                      {activity.description || '暂无描述'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    <select
                      value={activity.status}
                      onChange={(e) => handleUpdateStatus(activity.id, e.target.value)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        background: 'white',
                        color: '#374151',
                        outline: 'none',
                        fontSize: '0.875rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <option value="draft">草稿</option>
                      <option value="published">已发布</option>
                      <option value="cancelled">已取消</option>
                      <option value="completed">已完成</option>
                    </select>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem', 
                  fontSize: '0.875rem',
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>地点:</strong> {activity.location || '未设置'}
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>开始时间:</strong> {new Date(activity.startTime).toLocaleString()}
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>结束时间:</strong> {new Date(activity.endTime).toLocaleString()}
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>参与人数:</strong> {activity.currentParticipants}/{activity.maxParticipants}
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>价格:</strong> ¥{activity.price}
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>状态:</strong> 
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      background: activity.status === 'published' ? 'rgba(34, 197, 94, 0.1)' :
                                activity.status === 'draft' ? 'rgba(156, 163, 175, 0.1)' :
                                activity.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' :
                                'rgba(59, 130, 246, 0.1)',
                      color: activity.status === 'published' ? '#16a34a' :
                             activity.status === 'draft' ? '#6b7280' :
                             activity.status === 'cancelled' ? '#dc2626' :
                             '#2563eb'
                    }}>
                      {activity.status === 'published' ? '已发布' :
                       activity.status === 'draft' ? '草稿' :
                       activity.status === 'cancelled' ? '已取消' :
                       '已完成'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 