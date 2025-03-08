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
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data in Firestore including the disabled field
      const userData: IUserData = {
        email: user.email ?? '',
        role,
        createdAt: serverTimestamp(),
        disabled: false, // newly added default disabled field
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
        background: "url('https://via.placeholder.com/1920x1080') center/cover no-repeat",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: '350px',
          padding: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label>Select Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="moderator">Moderator</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#4c9aff',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
