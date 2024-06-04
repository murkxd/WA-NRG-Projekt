import React, { useState, useEffect } from 'react';
import './AddPost.css';

export function AddPost() {
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    const getCurrentUserId = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch('http://localhost:5176/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setUserId(data.user.userId);
                } else {
                    console.error('Error retrieving user data:', data.error);
                }
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
        }
    };

    useEffect(() => {
        getCurrentUserId();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            setError('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('description', description);
        formData.append('userId', userId);

        try {
            const response = await fetch('http://localhost:5176/addPost', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setImageFile(null);
                setDescription('');
                alert('Post added successfully!');
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error('Error adding post:', error);
            setError('An error occurred while adding the post.');
        }
    };

    return (
        <div className="add-post">
            <h2>Add a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="image">Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button id='addpost-button' type="submit">Add Post</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default AddPost;
