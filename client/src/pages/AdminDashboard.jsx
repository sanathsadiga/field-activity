import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminAnalytics } from '../api';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getAdminAnalytics(token);
        setData(data);
      } catch {
        setErr('Failed to load analytics');
      }
    };
    load();
  }, [token]);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Analytics</h1>
      <p className="text-secondary">Welcome, {user?.name}</p>
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="row g-4">
        {data?.cards?.map((c, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="card p-4 text-center">
              <h6 className="text-secondary mb-2">{c.title}</h6>
              <div className="display-6 fw-bold">{c.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
