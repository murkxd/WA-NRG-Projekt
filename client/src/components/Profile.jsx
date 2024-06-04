import React, { useState, useEffect } from 'react';
import './Profile.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export function Profile() {
    const [profile, setProfile] = useState({ username: '', bio: '' });
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5176/user-profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setProfile({
                    username: data.username,
                    pfp: data.profilePicture || 'https://placehold.co/600',
                    bio: data.bio || 'No bio available'
                });
            })
            .catch(error => console.error('Error fetching user profile:', error));        

        fetch('http://localhost:5176/user-posts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching user posts:', error));
    }, []);

    const handleImageClick = (postId) => {
        console.log('Clicked post ID:', postId);
    };

    return (
        <div className="profile-page">
            <div className="profile-top">Profile</div>
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-picture">
                        <img src="https://placehold.co/600" alt="Profile" />
                    </div>
                    <div className="profile-details">
                        <p className="profile-username">{profile.username}</p>
                        <p className="profile-bio">{profile.bio}</p>
                    </div>
                    <div className="profile-menu">
                        <DropdownButton id="dropdown-basic-button" title="Options" className="custom-dropdown">
                            <Dropdown.Item href="#/action-1" className="custom-dropdown-item">Edit Bio</Dropdown.Item>
                            <Dropdown.Item href="#/action-2" className="custom-dropdown-item">Change Profile Picture</Dropdown.Item>
                            <Dropdown.Item href="#/action-3" className="custom-dropdown-item">Change Password</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>
                <div className="profile-posts">
                    {posts.length > 0 ? (
                        <div className="posts-grid">
                            {posts.map(post => (
                                <div key={post.id} className="post-thumbnail" onClick={() => handleImageClick(post.id)}>
                                    <img src={post.imageUrl} alt="Post" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="posts-grid">
                            <p className="no-posts-message">No posts yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
