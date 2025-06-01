import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  getBreakdown,
  getReminders
} from '../services/subscriptionService';
import RecurringPayments from '../components/Dashboard/RecurringPayments';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [subs, setSubs] = useState([]);
  const [form, setForm] = useState({ name: '', amount: '', frequency: 'Monthly', startDate: '' });
  const [editing, setEditing] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const fetchSubs = async () => {
    setSubs(await getSubscriptions());
  };
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchSubs();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await updateSubscription(editing, form);
      setEditing(null);
    } else {
      await addSubscription(form);
    }
    setForm({ name: '', amount: '', frequency: 'Monthly', startDate: '' });
    fetchSubs();
  };

  const handleEdit = sub => {
    setEditing(sub._id);
    setForm({
      name: sub.name,
      amount: sub.amount,
      frequency: sub.frequency,
      startDate: sub.startDate.slice(0, 10)
    });
  };

  const handleDelete = async id => {
    await deleteSubscription(id);
    fetchSubs();
  };

  const handleBreakdown = async () => {
    setBreakdown(await getBreakdown({ year, month }));
  };

  const fetchReminders = async () => {
    setReminders(await getReminders());
  };
  useEffect(() => { fetchReminders(); }, []);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>Subscriptions</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="frequency" value={form.frequency} onChange={handleChange}>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', amount: '', frequency: 'Monthly', startDate: '' }); }}>Cancel</button>}
      </form>
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: 24 }}>
        <thead>
          <tr><th>Name</th><th>Amount</th><th>Frequency</th><th>Start Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {subs.map(sub => (
            <tr key={sub._id}>
              <td>{sub.name}</td>
              <td>{sub.amount}</td>
              <td>{sub.frequency}</td>
              <td>{sub.startDate.slice(0, 10)}</td>
              <td>
                <button onClick={() => handleEdit(sub)}>Edit</button>
                <button onClick={() => handleDelete(sub._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Breakdown</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input placeholder="Year (e.g. 2025)" value={year} onChange={e => setYear(e.target.value)} style={{ width: 120 }} />
        <input placeholder="Month (01-12)" value={month} onChange={e => setMonth(e.target.value)} style={{ width: 120 }} />
        <button onClick={handleBreakdown}>Get Breakdown</button>
      </div>
      <ul>
        {breakdown.map(sub => (
          <li key={sub._id}>{sub.name} - {sub.amount} ({sub.frequency})</li>
        ))}
      </ul>
      <h3>Upcoming Renewals (Next 30 Days)</h3>
      <ul>
        {reminders.map(sub => (
          <li key={sub._id}>{sub.name} renews on {sub.startDate.slice(0, 10)}</li>
        ))}
      </ul>
      <RecurringPayments />
    </div>
  );
};

export default DashboardPage;