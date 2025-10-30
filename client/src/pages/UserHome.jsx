import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserHome() {
  const { user } = useAuth();
  return (
    <div className="container py-5">
      <div className="text-center">
        <h1 className="mb-3">Hello {user?.name || 'Guest'} 👋</h1>
        <p className="lead">This is the user home page. More features coming soon.</p>
      </div>
    </div>
  );
}
    