import React, { useState, useEffect } from 'react';
import '../styles/ActivityComments.css';

const ActivityComments = ({ activityId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalRatings: 0 });

  useEffect(() => {
    fetchComments();
    fetchRatingStats();
  }, [activityId, currentPage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments/activity/${activityId}?page=${currentPage}&limit=10`);
      if (!response.ok) {
        throw new Error('获取评论失败');
      }
      const data = await response.json();
      setComments(data.data.comments);
      setTotalPages(data.data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingStats = async () => {
    try {
      const response = await fetch(`/api/comments/stats/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setRatingStats(data.data);
      }
    } catch (err) {
      console.error('获取评分统计失败:', err);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      const response = await fetch('/api/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          activityId,
          content: newComment,
          rating: rating > 0 ? rating : null
        })
      });

      if (!response.ok) {
        throw new Error('发表评论失败');
      }

      setNewComment('');
      setRating(0);
      fetchComments();
      fetchRatingStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const submitReply = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        return;
      }

      const response = await fetch('/api/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          activityId,
          content: replyContent,
          parentId
        })
      });

      if (!response.ok) {
        throw new Error('回复失败');
      }

      setReplyContent('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('删除评论失败');
      }

      fetchComments();
      fetchRatingStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const renderComment = (comment) => (
    <div key={comment.id} className="comment">
      <div className="comment-header">
        <span className="username">{comment.user.username}</span>
        <span className="date">{formatDate(comment.createdAt)}</span>
        {comment.rating && (
          <div className="rating">
            {renderStars(comment.rating)}
          </div>
        )}
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-actions">
        <button 
          onClick={() => setReplyTo(comment.id)}
          className="reply-btn"
        >
          回复
        </button>
        {comment.user.id === parseInt(localStorage.getItem('userId')) && (
          <button 
            onClick={() => deleteComment(comment.id)}
            className="delete-btn"
          >
            删除
          </button>
        )}
      </div>

      {/* 回复表单 */}
      {replyTo === comment.id && (
        <div className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="写下你的回复..."
            rows="2"
          />
          <div className="reply-actions">
            <button onClick={() => submitReply(comment.id)}>回复</button>
            <button onClick={() => setReplyTo(null)}>取消</button>
          </div>
        </div>
      )}

      {/* 回复列表 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <div key={reply.id} className="reply">
              <div className="reply-header">
                <span className="username">{reply.user.username}</span>
                <span className="date">{formatDate(reply.createdAt)}</span>
              </div>
              <div className="reply-content">{reply.content}</div>
              {reply.user.id === parseInt(localStorage.getItem('userId')) && (
                <button 
                  onClick={() => deleteComment(reply.id)}
                  className="delete-btn small"
                >
                  删除
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loading">加载评论中...</div>;
  }

  return (
    <div className="activity-comments">
      <div className="comments-header">
        <h3>评论 ({comments.length})</h3>
        {ratingStats.totalRatings > 0 && (
          <div className="rating-summary">
            <span>平均评分: {ratingStats.averageRating}</span>
            <span>总评论数: {ratingStats.totalRatings}</span>
          </div>
        )}
      </div>

      {/* 发表评论 */}
      <form onSubmit={submitComment} className="comment-form">
        <div className="rating-input">
          <label>评分 (可选):</label>
          <div className="stars-input">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          rows="3"
          required
        />
        <button type="submit" disabled={!newComment.trim()}>
          发表评论
        </button>
      </form>

      {error && <div className="error">错误: {error}</div>}

      {/* 评论列表 */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">暂无评论，快来发表第一条评论吧！</p>
        ) : (
          comments.map(renderComment)
        )}
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
  );
};

export default ActivityComments; 