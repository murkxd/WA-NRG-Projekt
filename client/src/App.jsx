import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { Post } from './components/Post.jsx';
import { Headerbar } from './components/Headerbar.jsx';
import { Login } from './components/Login.jsx';
import { Register } from './components/Register.jsx';
import { Profile } from './components/Profile.jsx';
import { AddPost } from './components/AddPost.jsx';
import { Footer } from './components/Footer.jsx';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5176/posts')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched posts data:', data);
                setPosts(data);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

   return (
        <div className='post-cont'>
            {posts.length > 0 ? (
                posts.map(post => (
                    <Post 
                        key={post.id}
                        username={post.User.username}
                        image={post.imageUrl}  
                        description={post.description}
                        likes={post.like_count}
                        dislikes={post.dislike_count} 
                    />
                ))
            ) : (
                <Post
                    key="placeholder"
                    username="Placeholder User"
                    image="https://placehold.co/600"
                    description="This is a placeholder post because there are no posts in the database."
                    likes={0}
                    dislikes={0}
                />
            )}
        </div>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkLoginStatus = async () => {
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
                setIsLoggedIn(data.loggedIn);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div>
                <header>
                    <Headerbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                </header>
                <main>
                    {!isLoading && (
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/register" element={<Register />} />
                            {isLoggedIn ? (
                                <>
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/addpost" element={<AddPost />} />
                                </>
                            ) : (
                                <Route path="*" element={<Navigate to="/login" />} />
                            )}
                        </Routes>
                    )}
                </main>
                <Footer />
            </div>
        </Router>
    );
}


export default App;
