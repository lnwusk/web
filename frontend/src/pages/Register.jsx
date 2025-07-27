import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const bannerUrl = '/banner.png';

export default function Register({ onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // 防止autofill变色
  useEffect(() => {
    if (formRef.current) {
      const style = document.createElement('style');
      style.innerHTML = `
        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.02) inset !important;
          box-shadow: 0 0 0 1000px rgba(255,255,255,0.02) inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff !important;
        }
      `;
      formRef.current.appendChild(style);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/register', { username, password });
      localStorage.setItem('token', res.data.token);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${bannerUrl})`, 
        backgroundPosition: 'center', 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0
      }}
    >
      {/* 背景遮罩 */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, rgba(30,30,60,0.7) 0%, rgba(20,20,40,0.7) 100%)',
          backdropFilter: 'blur(2px)',
          zIndex: 1
        }}
      />
      {/* 注册表单毛玻璃卡片 */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '26rem',
          padding: '2.5rem 2rem',
          borderRadius: '1.5rem',
          background: 'rgba(34, 39, 54, 0.55)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
          backdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.12)'
        }}
        className="animate-fade-in"
      >
        <h2 style={{color: '#ffffff', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-0.025em', textShadow: '0 2px 16px rgba(0,0,0,0.5)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'}}>注册新账号</h2>
        <p style={{color: '#ffffff', fontSize: '1rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: '500', letterSpacing: '0.025em'}}>请填写信息以创建您的账号</p>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%'}}>
          {/* 用户名输入框 */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%'}}>
            <label style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '500', letterSpacing: '0.05em'}}>用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="请输入用户名"
              style={{
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: '500',
                padding: '0.75rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
                outline: 'none',
                transition: 'all 0.3s',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              autoComplete="off"
            />
        </div>
          
          {/* 密码输入框 */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%'}}>
            <label style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '500', letterSpacing: '0.05em'}}>密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="请输入密码"
              style={{
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: '500',
                padding: '0.75rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
                outline: 'none',
                transition: 'all 0.3s',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              autoComplete="off"
            />
          </div>
          
          {/* 确认密码输入框 */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%'}}>
            <label style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '500', letterSpacing: '0.05em'}}>确认密码</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="请再次输入密码"
              style={{
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: '500',
                padding: '0.75rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
                outline: 'none',
                transition: 'all 0.3s',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              autoComplete="off"
            />
          </div>
        </div>
        
        {error && (
          <div style={{
            color: '#fecaca',
            fontSize: '1rem',
            textAlign: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            fontWeight: '600',
            letterSpacing: '0.025em',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)',
            color: '#ffffff',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            fontWeight: '700',
            fontSize: '1.125rem',
            letterSpacing: '0.025em',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 16px 0 rgba(99, 102, 241, 0.3)',
            transform: 'scale(1)',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.background = 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)';
            }
          }}
        >
            {loading ? '注册中...' : '注册'}
          </button>
        
        <button
          type="button"
          onClick={onBack}
          style={{
            color: '#ffffff',
            fontSize: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            transition: 'color 0.3s',
            marginTop: '0.25rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#c7d2fe';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#ffffff';
          }}
        >
            返回登录
          </button>
      </form>
    </div>
  );
} 