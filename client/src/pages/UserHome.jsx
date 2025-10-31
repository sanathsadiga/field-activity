import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitEntry } from '../api';

function StallForm({ onSubmit }) {
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState('');
  const [detectError, setDetectError] = useState(null);
  const stallsByLocation = useMemo(() => ({
    mangluru: ['Mangla Stall 1', 'Mangla Stall 2', 'Mangla Stall 3', 'Mangla Stall 4', 'Mangla Stall 5'],
    kundapura: ['Kunda Stall A', 'Kunda Stall B', 'Kunda Stall C', 'Kunda Stall D', 'Kunda Stall E'],
  }), []);

  const [selectedStall, setSelectedStall] = useState('');

  // paper entries stored as { type, supply, retail }
  const paperTypes = ['VK', 'VV', 'PV', 'UV'];
  const [selectedPapers, setSelectedPapers] = useState([]);

  const detectLocation = () => {
    setDetectError(null);
    if (!navigator.geolocation) {
      setDetectError('Geolocation not supported by this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude } = pos.coords;
        setCoords(pos.coords);
        // simplistic mapping: choose location by latitude threshold for demo
        setLocation(latitude >= 13 ? 'mangluru' : 'kundapura');
      },
      (err) => {
        // do not force a default — surface the error so user can retry or manually select
        setDetectError(err.message || 'Unable to detect location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    // run detection once on mount
    detectLocation();
  }, []);

  useEffect(() => {
    // reset stall selection when location changes
    if (location && stallsByLocation[location]) {
      setSelectedStall(stallsByLocation[location][0]);
    } else {
      setSelectedStall('');
    }
  }, [location, stallsByLocation]);

  const togglePaper = (type) => {
    setSelectedPapers((prev) => {
      const exist = prev.find((p) => p.type === type);
      if (exist) return prev.filter((p) => p.type !== type);
      return [...prev, { type, supply: 0, retail: 0 }];
    });
  };

  const updatePaper = (type, field, value) => {
    setSelectedPapers((prev) => prev.map((p) => (p.type === type ? { ...p, [field]: Number(value || 0) } : p)));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    // compute net for each paper
    const papers = selectedPapers.map((p) => ({ ...p, net: (Number(p.supply) || 0) - (Number(p.retail) || 0) }));
    const data = {
      kind: 'stall',
      location,
      coords,
      stall: selectedStall,
      papers,
      submittedAt: new Date().toISOString(),
    };
    console.log('Stall form submitted:', data);
    if (onSubmit) onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <h4>Stall Visit</h4>
      <div className="mb-3">
        <label className="form-label">Location (auto-filled)</label>
        <select className="form-select" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">-- choose location --</option>
          {Object.keys(stallsByLocation).map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <small className="text-muted">Detected coords: {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'n/a'}</small>
        {detectError && (
          <div className="alert alert-warning py-1 mt-2 d-flex justify-content-between align-items-center">
            <div className="small mb-0">{detectError}</div>
            <button type="button" className="btn btn-sm btn-outline-secondary ms-2" onClick={detectLocation}>Retry</button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Select Stall</label>
        <select className="form-select" value={selectedStall} onChange={(e) => setSelectedStall(e.target.value)} disabled={!location || !stallsByLocation[location]}>
          {!location && <option value="">-- pick a location first --</option>}
          {(stallsByLocation[location] || []).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Select Paper Types</label>
        <div>
          {paperTypes.map((t) => (
            <label className="me-3" key={t}>
              <input type="checkbox" className="form-check-input me-1" checked={!!selectedPapers.find((p) => p.type === t)} onChange={() => togglePaper(t)} />
              {t}
            </label>
          ))}
        </div>
      </div>

      {selectedPapers.length > 0 && (
        <div className="mb-3">
          <label className="form-label">Paper entries</label>
          {selectedPapers.map((p) => (
            <div key={p.type} className="border rounded p-2 mb-2">
              <strong>{p.type}</strong>
              <div className="row g-2 mt-2">
                <div className="col-md-4">
                  <input type="number" className="form-control" value={p.supply} onChange={(e) => updatePaper(p.type, 'supply', e.target.value)} placeholder="Supply" />
                </div>
                <div className="col-md-4">
                  <input type="number" className="form-control" value={p.retail} onChange={(e) => updatePaper(p.type, 'retail', e.target.value)} placeholder="Retail" />
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <div>Net: <strong>{(Number(p.supply) || 0) - (Number(p.retail) || 0)}</strong></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" type="submit">Submit Stall</button>
      </div>
    </form>
  );
}

function SimpleForm({ title, fields, kind }) {
  const initial = fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});
  const [data, setData] = useState(initial);

  const onChange = (name, val) => setData((d) => ({ ...d, [name]: val }));
  const submit = (ev) => {
    ev.preventDefault();
    console.log(`${kind} form submitted:`, { kind, ...data, submittedAt: new Date().toISOString() });
  };

  return (
    <form onSubmit={submit} className="card p-4">
      <h4>{title}</h4>
      {fields.map((f) => (
        <div className="mb-3" key={f.name}>
          <label className="form-label">{f.label}</label>
          <input className="form-control" value={data[f.name]} onChange={(e) => onChange(f.name, e.target.value)} placeholder={f.placeholder || ''} />
        </div>
      ))}
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" type="submit">Submit {title}</button>
      </div>
    </form>
  );
}

function DealerForm({ onSubmit }) {
  const [dealerName, setDealerName] = useState('');
  const [discussion, setDiscussion] = useState('');

  const submit = (ev) => {
    ev.preventDefault();
    const data = {
      kind: 'dealer',
      dealerName,
      discussion,
      submittedAt: new Date().toISOString(),
    };
    console.log('Dealer form submitted:', data);
    if (onSubmit) onSubmit(data);
    setDealerName('');
    setDiscussion('');
  };

  return (
    <form onSubmit={submit} className="card p-4">
      <h4>Dealer</h4>
      <div className="mb-3">
        <label className="form-label">Dealer Name</label>
        <input className="form-control" value={dealerName} onChange={(e) => setDealerName(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Discussion</label>
        <textarea className="form-control" value={discussion} onChange={(e) => setDiscussion(e.target.value)} rows={6} />
      </div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" type="submit">Submit Dealer</button>
      </div>
    </form>
  );
}

function DepoForm({ onSubmit }) {
  const [timeVisited, setTimeVisited] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const toISODateTime = (timeStr) => {
    if (!timeStr) return null;
    // timeStr is expected in HH:MM (24h) from <input type="time" />
    // Return a human-friendly local string like MM/DD/YYYY 11:00 AM (no timezone suffix)
    const [hours, minutes] = timeStr.split(':').map((n) => Number(n));
    const now = new Date();
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours || 0, minutes || 0, 0);
    const pad = (n) => String(n).padStart(2, '0');
    const mm = pad(dt.getMonth() + 1);
    const dd = pad(dt.getDate());
    const yyyy = dt.getFullYear();
    const hour24 = dt.getHours();
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const min = pad(dt.getMinutes());
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${mm}/${dd}/${yyyy} ${hour12}:${min} ${ampm}`;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const data = {
      kind: 'depo',
      // store ISO datetimes (current date + entered times) so admin can filter by full timestamps
      timeVisited: toISODateTime(timeVisited),
      timeLeft: toISODateTime(timeLeft),
      submittedAt: new Date().toISOString(),
    };
    console.log('Depo form submitted:', data);
    if (onSubmit) onSubmit(data);
    setTimeVisited('');
    setTimeLeft('');
  };

  return (
    <form onSubmit={submit} className="card p-4">
      <h4>Depo Visit</h4>

      <div className="mb-3">
        <label className="form-label">Time visited</label>
        <input type="time" className="form-control" value={timeVisited} onChange={(e) => setTimeVisited(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Time left</label>
        <input type="time" className="form-control" value={timeLeft} onChange={(e) => setTimeLeft(e.target.value)} />
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" type="submit">Submit Depo</button>
      </div>
    </form>
  );
}

function VendorForm({ onSubmit }) {
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState('');
  const [detectError, setDetectError] = useState(null);
  const paperTypes = ['VK', 'VV', 'PV', 'UV'];
  const [selectedPapers, setSelectedPapers] = useState([]);

  const detectLocation = () => {
    setDetectError(null);
    if (!navigator.geolocation) {
      setDetectError('Geolocation not supported by this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude } = pos.coords;
        setCoords(pos.coords);
        setLocation(latitude >= 13 ? 'mangluru' : 'kundapura');
      },
      (err) => setDetectError(err.message || 'Unable to detect location'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const togglePaper = (type) => {
    setSelectedPapers((prev) => {
      const exist = prev.find((p) => p.type === type);
      if (exist) return prev.filter((p) => p.type !== type);
      return [...prev, { type, supply: 0 }];
    });
  };

  const updatePaper = (type, value) => {
    setSelectedPapers((prev) => prev.map((p) => (p.type === type ? { ...p, supply: Number(value || 0) } : p)));
  };

  const submit = (ev) => {
    ev.preventDefault();
    const papers = selectedPapers.map((p) => ({ type: p.type, supply: Number(p.supply || 0) }));
    const data = {
      kind: 'vendor',
      location,
      coords,
      papers,
      submittedAt: new Date().toISOString(),
    };
    console.log('Vendor form submitted:', data);
    if (onSubmit) onSubmit(data);
    setSelectedPapers([]);
  };

  return (
    <form onSubmit={submit} className="card p-4">
      <h4>Vendor</h4>

      <div className="mb-3">
        <label className="form-label">Location (auto-detected)</label>
        <select className="form-select" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">-- choose location --</option>
          <option value="mangluru">mangluru</option>
          <option value="kundapura">kundapura</option>
        </select>
        <small className="text-muted">Detected coords: {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'n/a'}</small>
        {detectError && (
          <div className="alert alert-warning py-1 mt-2 d-flex justify-content-between align-items-center">
            <div className="small mb-0">{detectError}</div>
            <button type="button" className="btn btn-sm btn-outline-secondary ms-2" onClick={detectLocation}>Retry</button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Select Paper Types (supply only)</label>
        <div>
          {paperTypes.map((t) => (
            <label className="me-3" key={t}>
              <input type="checkbox" className="form-check-input me-1" checked={!!selectedPapers.find((p) => p.type === t)} onChange={() => togglePaper(t)} />
              {t}
            </label>
          ))}
        </div>
      </div>

      {selectedPapers.length > 0 && (
        <div className="mb-3">
          <label className="form-label">Supply entries</label>
          {selectedPapers.map((p) => (
            <div key={p.type} className="mb-2 d-flex gap-2 align-items-center">
              <div style={{ minWidth: 60 }}><strong>{p.type}</strong></div>
              <input type="number" className="form-control" value={p.supply} onChange={(e) => updatePaper(p.type, e.target.value)} placeholder="Supply" />
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" type="submit">Submit Vendor</button>
      </div>
    </form>
  );
}

function OHVisitForm({ onSubmit }) {
  const [visitName, setVisitName] = useState('');
  const [type, setType] = useState('hotel');
  const [remark, setRemark] = useState('');

  const submit = (ev) => {
    ev.preventDefault();
    const data = {
      kind: 'oh',
      visitName,
      type,
      remark,
      submittedAt: new Date().toISOString(),
    };
    console.log('OH Visit submitted:', data);
    if (onSubmit) onSubmit(data);
    setVisitName('');
    setType('hotel');
    setRemark('');
  };

  return (
    <form onSubmit={submit} className="card p-4">
      <h4>OH Visit</h4>
      <div className="mb-3">
        <label className="form-label">Visit / Institution Name</label>
        <input className="form-control" value={visitName} onChange={(e) => setVisitName(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Type</label>
        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="hotel">Hotel</option>
          <option value="education">Education</option>
          <option value="govt">Government</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Remark / Purpose of Visit</label>
        <textarea className="form-control" value={remark} onChange={(e) => setRemark(e.target.value)} rows={6} />
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" type="submit">Submit OH Visit</button>
      </div>
    </form>
  );
}

function ReaderForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [sex, setSex] = useState('male');
  const [feedback, setFeedback] = useState('');

  const submit = (ev) => {
    ev.preventDefault();
    const digits = (mobile || '').replace(/\D/g, '');
    if (digits.length !== 10) {
      alert('Enter a valid 10-digit mobile number (excluding country code)');
      return;
    }

    const data = {
      kind: 'reader',
      name,
      mobile: digits,
      address,
      occupation,
      sex,
      feedback,
      submittedAt: new Date().toISOString(),
    };
    console.log('Reader form submitted:', data);
    if (onSubmit) onSubmit(data);
    // reset
    setName('');
    setMobile('');
    setAddress('');
    setOccupation('');
    setSex('male');
    setFeedback('');
  };

  return (
    <form onSubmit={submit} className="card p-4">
      <h4>Reader</h4>

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Mobile (10 digits, exclude country code)</label>
        <input
          className="form-control"
          inputMode="numeric"
          pattern="[0-9]*"
          value={mobile}
          onChange={(e) => {
            // allow only digits and limit to 10 characters
            const digits = (e.target.value || '').replace(/\D/g, '').slice(0, 10);
            setMobile(digits);
          }}
          placeholder="9876543210"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Address</label>
        <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} rows={4} />
      </div>

      <div className="mb-3">
        <label className="form-label">Occupation</label>
        <input className="form-control" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Sex</label>
        <select className="form-select" value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="trans">Trans</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Feedback</label>
        <textarea className="form-control" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={6} />
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" type="submit">Submit Reader</button>
      </div>
    </form>
  );
}

export default function UserHome() {
  const { user } = useAuth();
  const [kind, setKind] = useState('stall');

  // set of options
  const options = [
    { value: 'stall', label: 'Stall' },
    { value: 'dealer', label: 'Dealer' },
    { value: 'depo', label: 'Depo' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'oh', label: 'OH Visit' },
    { value: 'reader', label: 'Reader' },
  ];

  const handleGenericSubmit = (data) => {
    // POST to server and show simple feedback
    (async () => {
      try {
        const token = (window.localStorage.getItem('token') || window.sessionStorage.getItem('token')) || null;
        const res = await submitEntry(data, token);
        console.log('Saved entry:', res.data.entry);
        alert('Entry saved');
      } catch (err) {
        console.error('Failed to save entry', err?.response?.data || err.message);
        alert('Failed to save entry');
      }
    })();
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="mb-1">Hello {user?.name || 'Guest'} 👋</h1>
        <p className="text-secondary mb-0">Choose an entry type and submit the form. Data will be logged to the console.</p>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Select entry type</label>
            <select className="form-select" value={kind} onChange={(e) => setKind(e.target.value)}>
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          {kind === 'stall' && <StallForm onSubmit={handleGenericSubmit} />}
          {kind === 'dealer' && <DealerForm onSubmit={handleGenericSubmit} />}
          {kind === 'depo' && <DepoForm onSubmit={handleGenericSubmit} />}
          {kind === 'vendor' && <VendorForm onSubmit={handleGenericSubmit} />}
          {kind === 'oh' && <OHVisitForm onSubmit={handleGenericSubmit} />}
          {kind === 'reader' && <ReaderForm onSubmit={handleGenericSubmit} />}
        </div>
      </div>
    </div>
  );
}
