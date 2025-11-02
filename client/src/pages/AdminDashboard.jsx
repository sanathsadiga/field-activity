// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { getAdminAnalytics } from '../api';

// export default function AdminDashboard() {
//   const { token, user } = useAuth();
//   const [data, setData] = useState(null);
//   const [err, setErr] = useState('');

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const { data } = await getAdminAnalytics(token);
//         setData(data);
//       } catch {
//         setErr('Failed to load analytics');
//       }
//     };
//     load();
//   }, [token]);

//   return (
//     <div className="container py-5">
//       <h1 className="mb-4">Admin Analytics</h1>
//       <p className="text-secondary">Welcome, {user?.name}</p>
//       {err && <div className="alert alert-danger">{err}</div>}
//       <div className="row g-4">
//         {data?.cards?.map((c, i) => (
//           <div className="col-12 col-sm-6 col-lg-3" key={i}>
//             <div className="card p-4 text-center">
//               <h6 className="text-secondary mb-2">{c.title}</h6>
//               <div className="display-6 fw-bold">{c.value}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// client/src/pages/AdminDashboard.jsx
// import React, { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useAuth } from "../context/AuthContext";
// import { getAdminAnalytics } from "../api";

// export default function AdminDashboard() {
//   const { token, user } = useAuth();

//   // analytics data
//   const [cards, setCards] = useState([]);
//   const [err, setErr] = useState("");

//   // filters
//   const [kind, setKind] = useState("");
//   const [location, setLocation] = useState("");
//   const [userQuery, setUserQuery] = useState("");
//   const [timeFrom, setTimeFrom] = useState(null);
//   const [timeTo, setTimeTo] = useState(null);

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [loading, setLoading] = useState(false);

//   // table + stats
//   const [data, setData] = useState({ results: [], total: 0, totalPages: 1 });
//   const [stats, setStats] = useState([]);

//   // ============= ✅ FETCH ANALYTICS (REAL API) ==================
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const { data } = await getAdminAnalytics(token);
//         setCards(data.cards);
//       } catch {
//         setErr("Failed to load analytics");
//       }
//     };
//     load();
//   }, [token]);

//   // ============= ✅ MOCK FETCH ENTRIES ==================
//   const fetchEntries = () => {
//     setLoading(true);
//     setTimeout(() => {
//       const mock = {
//         results: [
//           {
//             _id: "1",
//             user: { name: "John Doe" },
//             kind: "stall",
//             location: "Bangalore",
//             createdAt: new Date(),
//             papers: [{ type: "Bill", supply: "Yes" }],
//             data: { example: "Extra data here" },
//           },
//           {
//             _id: "2",
//             user: { name: "Admin" },
//             kind: "dealer",
//             location: "Mangalore",
//             createdAt: new Date(),
//             data: { note: "Mock record" },
//           },
//         ],
//         total: 2,
//         page: 1,
//         totalPages: 1,
//       };
//       setData(mock);
//       setLoading(false);
//     }, 400);
//   };

//   // ============= ✅ MOCK STATS ==================
//   const fetchStats = () => {
//     setStats([
//       { _id: "stall", count: 10 },
//       { _id: "dealer", count: 6 },
//       { _id: "vendor", count: 3 },
//     ]);
//   };

//   useEffect(() => {
//     fetchEntries();
//   }, [page, limit]);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const onApplyFilters = () => {
//     setPage(1);
//     fetchEntries();
//   };

//   const exportCsv = () => {
//     alert("Export disabled — backend not available");
//   };

//   // ===================================================================

//   return (
//     <div className="container py-5">
//       <h1 className="mb-4">Admin Dashboard</h1>
//       <p className="text-secondary">Welcome, {user?.name}</p>

//       {err && <div className="alert alert-danger">{err}</div>}

//       {/* ===================== ANALYTICS CARDS ===================== */}
//       <div className="row g-4 mb-5">
//         {cards?.map((c, i) => (
//           <div className="col-12 col-sm-6 col-lg-3" key={i}>
//             <div className="card p-4 text-center">
//               <h6 className="text-secondary mb-2">{c.title}</h6>
//               <div className="display-6 fw-bold">{c.value}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ===================== FILTERS ===================== */}
//       <div className="mb-4 grid grid-cols-6 gap-2">
//         <select value={kind} onChange={(e) => setKind(e.target.value)}>
//           <option value="">All kinds</option>
//           <option value="stall">Stall</option>
//           <option value="dealer">Dealer</option>
//           <option value="depo">Depo</option>
//           <option value="vendor">Vendor</option>
//           <option value="oh">OH Visit</option>
//           <option value="reader">Reader</option>
//         </select>

//         <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

//         <input placeholder="Search userId" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />

//         <DatePicker selected={timeFrom} onChange={(d) => setTimeFrom(d)} placeholderText="Time From" showTimeSelect dateFormat="Pp" />
//         <DatePicker selected={timeTo} onChange={(d) => setTimeTo(d)} placeholderText="Time To" showTimeSelect dateFormat="Pp" />

//         <div className="flex gap-2">
//           <button onClick={onApplyFilters}>Apply</button>
//           <button
//             onClick={() => {
//               setKind("");
//               setLocation("");
//               setUserQuery("");
//               setTimeFrom(null);
//               setTimeTo(null);
//               onApplyFilters();
//             }}>
//             Reset
//           </button>
//           <button onClick={exportCsv}>Export CSV</button>
//         </div>
//       </div>

//       {/* ===================== STATS ===================== */}
//       <div className="mb-4">
//         <strong>Stats (mock): </strong>
//         <div>
//           {stats.map((s) => (
//             <span key={s._id} style={{ marginRight: 10 }}>
//               {s._id}: {s.count}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* ===================== TABLE ===================== */}
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <table className="w-full border">
//           <thead>
//             <tr>
//               <th>SubmittedBy</th>
//               <th>Kind</th>
//               <th>Location</th>
//               <th>SubmittedAt</th>
//               <th>Extra</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.results.map((entry) => (
//               <tr key={entry._id}>
//                 <td>{entry.user?.name || "—"}</td>
//                 <td>{entry.kind}</td>
//                 <td>{entry.location || "—"}</td>
//                 <td>{new Date(entry.createdAt).toLocaleString()}</td>
//                 <td>{JSON.stringify(entry.data || entry.papers || {})}</td>
//                 <td>
//                   <button onClick={() => alert(JSON.stringify(entry, null, 2))}>View</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* ===================== PAGINATION ===================== */}
//       <div className="mt-4 flex items-center gap-3">
//         <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
//           Prev
//         </button>
//         <span>
//           Page {data.page} / {data.totalPages}
//         </span>
//         <button disabled={data.page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
//           Next
//         </button>

//         <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//           <option value={50}>50</option>
//         </select>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import { getAdminAnalytics } from "../api";

export default function AdminDashboard() {
  const { token, user } = useAuth();

  // analytics data
  const [cards, setCards] = useState([]);
  const [err, setErr] = useState("");

  // filters
  const [kind, setKind] = useState("");
  const [location, setLocation] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [timeFrom, setTimeFrom] = useState(null);
  const [timeTo, setTimeTo] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);

  // table + stats
  const [data, setData] = useState({ results: [], total: 0, totalPages: 1 });
  const [stats, setStats] = useState([]);

  // ✅ FETCH ANALYTICS (REAL API)
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getAdminAnalytics(token);
        setCards(data.cards);
      } catch {
        setErr("Failed to load analytics");
      }
    };
    load();
  }, [token]);

  // MOCK FETCH ENTRIES
  const fetchEntries = () => {
    setLoading(true);
    setTimeout(() => {
      const mock = {
        results: [
          {
            _id: "1",
            user: { name: "John Doe" },
            kind: "stall",
            location: "Bangalore",
            createdAt: new Date(),
            papers: [{ type: "Bill", supply: "Yes" }],
            data: { example: "Extra data here" },
          },
          {
            _id: "2",
            user: { name: "Admin" },
            kind: "dealer",
            location: "Mangalore",
            createdAt: new Date(),
            data: { note: "Mock record" },
          },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      };
      setData(mock);
      setLoading(false);
    }, 400);
  };

  //  MOCK STATS
  const fetchStats = () => {
    setStats([
      { _id: "stall", count: 10 },
      { _id: "dealer", count: 6 },
      { _id: "vendor", count: 3 },
    ]);
  };

  useEffect(() => {
    fetchEntries();
  }, [page, limit]);

  useEffect(() => {
    fetchStats();
  }, []);

  const onApplyFilters = () => {
    setPage(1);
    fetchEntries();
  };

  const exportCsv = () => {
    alert("Export disabled — backend not available");
  };

  // ==========================================================

  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <p className="text-secondary">Welcome, {user?.name}</p>

      {err && <div className="alert alert-danger">{err}</div>}

      {/* ANALYTICS CARDS */}
      <div className="row g-4 mb-5">
        {cards?.map((c, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="card p-4 text-center shadow-sm">
              <h6 className="text-secondary mb-2">{c.title}</h6>
              <div className="display-6 fw-bold">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="mb-4 row g-2">
        <div className="col">
          <select
            className="form-select"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="">All kinds</option>
            <option value="stall">Stall</option>
            <option value="dealer">Dealer</option>
            <option value="depo">Depo</option>
            <option value="vendor">Vendor</option>
            <option value="oh">OH Visit</option>
            <option value="reader">Reader</option>
          </select>
        </div>

        {/* ✅ UPDATED → LOCATION DROPDOWN */}
        <div className="col">
          <select
            className="form-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select Location</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mangalore">Mangalore</option>
            <option value="Udupi">Udupi</option>
            <option value="Kundapura">Kundapura</option>
            <option value="Puttur">Puttur</option>
            <option value="Belthangady">Belthangady</option>
            <option value="Karkala">Karkala</option>
            <option value="Kasargod">Kasargod</option>
          </select>
        </div>

        <div className="col">
          <input
            className="form-control"
            placeholder="Search userId"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
        </div>

        <div className="col">
          <DatePicker
            selected={timeFrom}
            onChange={(d) => setTimeFrom(d)}
            placeholderText="Time From"
            className="form-control"
            showTimeSelect
            dateFormat="Pp"
          />
        </div>

        <div className="col">
          <DatePicker
            selected={timeTo}
            onChange={(d) => setTimeTo(d)}
            placeholderText="Time To"
            className="form-control"
            showTimeSelect
            dateFormat="Pp"
          />
        </div>

        <div className="col d-flex gap-2">
          <button className="btn btn-primary" onClick={onApplyFilters}>
            Apply
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setKind("");
              setLocation("");
              setUserQuery("");
              setTimeFrom(null);
              setTimeTo(null);
              onApplyFilters();
            }}
          >
            Reset
          </button>

          <button className="btn btn-outline-success" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="mb-4">
        <strong>Stats (mock): </strong>
        <div className="mt-2">
          {stats.map((s) => (
            <span key={s._id} className="badge bg-info text-dark me-2">
              {s._id}: {s.count}
            </span>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Submitted By</th>
              <th>Kind</th>
              <th>Location</th>
              <th>Submitted At</th>
              <th>Extra</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.results.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.user?.name || "—"}</td>
                <td>{entry.kind}</td>
                <td>{entry.location || "—"}</td>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
                <td>{JSON.stringify(entry.data || entry.papers || {})}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => alert(JSON.stringify(entry, null, 2))}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* PAGINATION */}
      <div className="mt-4 d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {data.page} / {data.totalPages}
        </span>

        <button
          className="btn btn-outline-secondary"
          disabled={data.page >= data.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>

        <select
          className="form-select w-auto"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}