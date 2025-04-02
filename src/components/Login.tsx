import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.ts';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user's disabled status from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.disabled) {
          await signOut(auth);
          alert('Your account has been disabled. Please contact the administrator.');
          return;
        }
      }

      
      navigate('/blog');
    } catch (error: any) {
      console.error('Error logging in:', error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: "linear-gradient(to right, #141e30, #243b55)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '380px',
          padding: '2.5rem',
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '24px', marginBottom: '1.5rem', fontWeight: 'bold' }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                outline: 'none',
                marginBottom: '1rem',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                transition: '0.3s',
              }}
              onFocus={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
              onBlur={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                outline: 'none',
                marginBottom: '1rem',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                transition: '0.3s',
              }}
              onFocus={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
              onBlur={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#00c6ff',
              backgroundImage: 'linear-gradient(to right, #00c6ff, #0072ff)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.3s ease-in-out',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
          Don’t have an account?{' '}
          <Link to="/signup" style={{ color: '#00c6ff', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
