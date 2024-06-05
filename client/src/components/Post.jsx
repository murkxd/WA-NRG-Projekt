import React, { useState, useEffect } from 'react';
import './Post.css';
import './animations.css';

export function Post({ username, image, description, likes: initialLikes, dislikes: initialDislikes }) {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch('/api/comments');
        const data = await response.json();
        setComments(data);
      } catch (error) {
        // console.error('Error fetching comments:', error);
      }
    }
    fetchComments();
  }, []);
  
  const handleLike = () => {
    if (userReaction === 'like') {
      setLikes(likes - 1);
      setUserReaction(null);
    } else if (userReaction === 'dislike') {
      setDislikes(dislikes - 1);
      setLikes(likes + 1);
      setUserReaction('like');
    } else {
      setLikes(likes + 1);
      setUserReaction('like');
    }
  };

  const handleDislike = () => {
    if (userReaction === 'dislike') {
      setDislikes(dislikes - 1);
      setUserReaction(null);
    } else if (userReaction === 'like') {
      setLikes(likes - 1);
      setDislikes(dislikes + 1);
      setUserReaction('dislike');
    } else {
      setDislikes(dislikes + 1);
      setUserReaction('dislike');
    }
  };

  const handlePostComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ postId: id, text: newComment }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setComments([...comments, addedComment]);
        setNewComment('');
      } else {
        console.error('Error posting comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  return (
    <div className="post-full scaleUp">
      <div className="post-top">
        <h2>{username}</h2>
      </div>

      <div className="post-image">
      <img src={`${image}`} alt="Post" onError={(e) => { e.target.src = 'https://placehold.co/600'; }} />
      {/* <img src={image} alt="Post" onError={(e) => { e.target.src = 'https://placehold.co/600'; }} /> */}
        </div>

      <div className="post-actions">
        <div className="like-dislike">
          <div 
            className={`like ${userReaction === 'like' ? 'active' : ''}`} 
            onClick={handleLike}
          >
            <img src="https://img.icons8.com/?size=100&id=uG-gOKWvvi8T&format=png&color=000000" alt="Like" />
            <span>{likes}</span>
          </div>
          <div 
            className={`dislike ${userReaction === 'dislike' ? 'active' : ''}`} 
            onClick={handleDislike}
          >
            <img src="https://img.icons8.com/?size=100&id=KIph2vERzruS&format=png&color=000000" alt="Dislike" />
            <span>{dislikes}</span>
          </div>
        </div>
      </div>

      <div className="post-text">
        <p>{description}</p>
      </div>

      <div className="comment-box">
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Write a comment..."
        />
        <button onClick={handlePostComment}>Send</button>
      </div>

      <div className="post-comments">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <img src={comment.userProfilePicture} alt="Profile" className="comment-profile-picture" />
              <div>
                <span className="comment-author">{comment.author}</span>
                <p>{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  );
}

export default Post;
