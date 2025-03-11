import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase.ts';
import { Link, useNavigate } from 'react-router-dom';

type Role = 'faculty' | 'student' | 'staff' | 'moderator' | 'administrator';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<Role>('student'); // Default role
  const navigate = useNavigate();

  interface IUserData {
    email: string;
    role: Role;
    createdAt: any;
    disabled: boolean;
  }

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData: IUserData = {
        email: user.email ?? '',
        role,
        createdAt: serverTimestamp(),
        disabled: false, 
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      alert('User created successfully!');
      navigate('/blog');
    } catch (error: any) {
      console.error('Error signing up:', error);
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
        <h2 style={{ fontSize: '24px', marginBottom: '1.5rem', fontWeight: 'bold' }}>Create an Account</h2>
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column' }}>
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              outline: 'none',
              marginBottom: '1.5rem',
              fontSize: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              cursor: 'pointer',
              transition: '0.3s',
            }}
          >
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="moderator">Moderator</option>
            <option value="administrator">Administrator</option>
          </select>
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
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#00c6ff', textDecoration: 'none', fontWeight: 'bold' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
