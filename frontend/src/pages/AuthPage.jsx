import React, { useState } from 'react';
import { login, register } from '../api/authApi';

const AuthPage = () =>{
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = isLogin
                ? await login({ email, password })
                : await register({ email, password });
            alert(`${isLogin ? 'Logged in' : 'Registered'} successfully`);
            console.log(response.data);
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                 <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                 <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
                {isLogin ? 'No account? Register here' : 'Already have an account? Login'}
            </p>
        </div>
    );
};

export default AuthPage;