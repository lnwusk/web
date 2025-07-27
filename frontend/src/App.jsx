import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ActivityManagement from './pages/ActivityManagement';
import ActivityRegistration from './pages/ActivityRegistration';
import ActivitySearch from './pages/ActivitySearch';
import ActivityDetail from './pages/ActivityDetail';
import axios from 'axios';
import './App.css';

// 主应用组件
function MainApp() {
  const [token] = useState(() => localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取所有已发布的活动
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/activities?status=published');
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('获取活动失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && location.pathname === '/') {
      fetchActivities();
    }
  }, [token, location.pathname]);

  if (!token) {
    return showRegister ? (
      <Register onBack={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  // 渲染主应用内容
  const renderMainContent = () => {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        {/* 顶部导航栏 */}
        <nav
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 1000,
            padding: '0 2rem'
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '80px'
            }}
          >
            {/* Logo */}
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onClick={() => navigate('/')}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              体育活动室
            </div>

            {/* 导航按钮 */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: location.pathname === '/' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.8)',
                  color: location.pathname === '/' ? 'white' : '#6b7280',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  boxShadow: location.pathname === '/' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/') {
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.color = '#6b7280';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                活动列表
              </button>
              <button
                onClick={() => navigate('/activities')}
                style={{
                  background: location.pathname === '/activities' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.8)',
                  color: location.pathname === '/activities' ? 'white' : '#6b7280',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  boxShadow: location.pathname === '/activities' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/activities') {
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/activities') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.color = '#6b7280';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                活动管理
              </button>
              <button
                onClick={() => navigate('/orders')}
                style={{
                  background: location.pathname === '/orders' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.8)',
                  color: location.pathname === '/orders' ? 'white' : '#6b7280',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  boxShadow: location.pathname === '/orders' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/orders') {
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/orders') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.color = '#6b7280';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                我的报名
              </button>
              <button
                onClick={() => navigate('/search')}
                style={{
                  background: location.pathname === '/search' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.8)',
                  color: location.pathname === '/search' ? 'white' : '#6b7280',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  boxShadow: location.pathname === '/search' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/search') {
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/search') {
                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.color = '#6b7280';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                搜索活动
              </button>
            </div>

            {/* 退出登录按钮 */}
            <button
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)'
              }}
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.2)';
              }}
            >
              退出登录
            </button>
          </div>
        </nav>

        {/* 主内容区域 */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            paddingTop: '120px',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* 页面标题 */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '4rem',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
            }}>
              🏃‍♂️
            </div>
            <h1
              style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              欢迎来到体育活动室
            </h1>
            <p
              style={{
                fontSize: '1.5rem',
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: '400',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              发现精彩活动，立即报名参与，让运动成为生活的一部分
            </p>
          </div>

          {/* 活动列表 */}
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem',
              color: 'white',
              fontSize: '1.25rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              加载中...
            </div>
          ) : activities.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem',
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎯</div>
              <h3 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>
                暂无活动
              </h3>
              <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
                目前没有可报名的活动，请稍后再来查看
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'stretch'
            }}>
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '280px',
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                  onClick={() => navigate(`/activity/${activity.id}`)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.02)';
                    e.target.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div>
                    <h3 style={{ 
                      color: '#1f2937', 
                      marginBottom: '1.5rem',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      lineHeight: '1.3'
                    }}>
                      {activity.title}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '25px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                      }}>
                        ¥{activity.price}
                      </span>
                      <span style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '25px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}>
                        {activity.currentParticipants}/{activity.maxParticipants} 人
                      </span>
                    </div>
                    {activity.description && (
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <button
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '1rem 0',
                      borderRadius: '15px',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/activity/${activity.id}`);
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    查看详情 →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 添加CSS动画 */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {renderMainContent()}
    </div>
  );
}

// 主应用入口
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/activities" element={<ActivityManagement />} />
        <Route path="/orders" element={<ActivityRegistration />} />
        <Route path="/search" element={<ActivitySearch />} />
        <Route path="/activity/:id" element={<ActivityDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
