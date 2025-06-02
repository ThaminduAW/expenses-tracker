import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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

  useEffect(() => { 
    fetchReminders(); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <StyledWrapper>
      <div className="dashboard-container">
        <Header>
          <h1>Expense Tracker Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </Header>

        <Card>
          <CardHeader>
            <h2>Add Subscription</h2>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CardHeader>
          <form className="subscription-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label>Subscription Name</label>
                <input 
                  name="name" 
                  placeholder="e.g. Netflix, Spotify" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Amount ($)</label>
                <input 
                  name="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={form.amount} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Frequency</label>
                <select name="frequency" value={form.frequency} onChange={handleChange}>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>
              <div className="input-group">
                <label>Start Date</label>
                <input 
                  name="startDate" 
                  type="date" 
                  value={form.startDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editing ? 'Update Subscription' : 'Add Subscription'}
              </button>
              {editing && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => { 
                    setEditing(null); 
                    setForm({ name: '', amount: '', frequency: 'Monthly', startDate: '' }); 
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <h2>Your Subscriptions</h2>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H1l8-8 8 8h-8v11H9V11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CardHeader>
          {subs.length === 0 ? (
            <EmptyState>
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No subscriptions yet</p>
              <span>Add your first subscription above to get started</span>
            </EmptyState>
          ) : (
            <SubscriptionGrid>
              {subs.map(sub => (
                <SubscriptionCard key={sub._id}>
                  <div className="subscription-info">
                    <h3>{sub.name}</h3>
                    <div className="amount">${sub.amount}</div>
                    <div className="frequency">{sub.frequency}</div>
                    <div className="start-date">Started: {sub.startDate.slice(0, 10)}</div>
                  </div>
                  <div className="subscription-actions">
                    <button className="btn-edit" onClick={() => handleEdit(sub)}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(sub._id)}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </SubscriptionCard>
              ))}
            </SubscriptionGrid>
          )}
        </Card>

        <div className="analytics-grid">
          <Card>
            <CardHeader>
              <h2>Monthly Breakdown</h2>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </CardHeader>
            <div className="breakdown-controls">
              <div className="input-group">
                <label>Year</label>
                <input 
                  placeholder="2025" 
                  value={year} 
                  onChange={e => setYear(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Month</label>
                <input 
                  placeholder="01-12" 
                  value={month} 
                  onChange={e => setMonth(e.target.value)} 
                />
              </div>
              <button className="btn-primary" onClick={handleBreakdown}>
                Get Breakdown
              </button>
            </div>
            {breakdown.length > 0 && (
              <BreakdownList>
                {breakdown.map(sub => (
                  <BreakdownItem key={sub._id}>
                    <span className="name">{sub.name}</span>
                    <span className="amount">${sub.amount}</span>
                    <span className="frequency">({sub.frequency})</span>
                  </BreakdownItem>
                ))}
              </BreakdownList>
            )}
          </Card>

          <Card>
            <CardHeader>
              <h2>Upcoming Renewals</h2>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </CardHeader>
            <span className="subtitle">Next 30 Days</span>
            {reminders.length === 0 ? (
              <EmptyState>
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>No upcoming renewals</p>
              </EmptyState>
            ) : (
              <RemindersList>
                {reminders.map(sub => (
                  <ReminderItem key={sub._id}>
                    <div className="reminder-info">
                      <span className="name">{sub.name}</span>
                      <span className="date">Renews on {sub.startDate.slice(0, 10)}</span>
                    </div>
                    <div className="reminder-icon">
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </ReminderItem>
                ))}
              </RemindersList>
            )}
          </Card>
        </div>

        <RecurringPayments />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  /* Button Styles */
  .btn-primary {
    padding: 0.75rem 1.5rem;
    background-color: #151717;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;

    &:hover:not(:disabled) {
      background-color: #252727;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .btn-secondary {
    padding: 0.75rem 1.5rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;

    &:hover:not(:disabled) {
      background-color: #5a6268;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .btn-edit {
    padding: 0.5rem 1rem;
    background-color: #2d79f3;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;

    &:hover {
      background-color: #1e5bb8;
    }
  }

  .btn-delete {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    color: #151717;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  .subscription-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      color: #151717;
      font-weight: 600;
      font-size: 0.9rem;
    }

    input, select {
      padding: 0.75rem;
      border: 1.5px solid #ecedec;
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.2s ease-in-out;

      &:focus {
        outline: none;
        border-color: #2d79f3;
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
  }

  .breakdown-controls {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .subtitle {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    display: block;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    color: #151717;
    font-size: 1.5rem;
    font-weight: 600;
  }

  svg {
    color: #2d79f3;
  }
`;

const SubscriptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const SubscriptionCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
  }

  .subscription-info {
    margin-bottom: 1rem;

    h3 {
      margin: 0 0 0.5rem 0;
      color: #151717;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d79f3;
      margin-bottom: 0.25rem;
    }

    .frequency {
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .start-date {
      color: #6c757d;
      font-size: 0.8rem;
    }
  }

  .subscription-actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;

  svg {
    color: #6c757d;
    margin-bottom: 1rem;
  }

  p {
    margin: 0 0 0.5rem 0;
    color: #151717;
    font-weight: 600;
  }

  span {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const BreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e9ecef;

  .name {
    font-weight: 600;
    color: #151717;
  }

  .amount {
    font-weight: 700;
    color: #2d79f3;
  }

  .frequency {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const RemindersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ReminderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 10px;

  .reminder-info {
    display: flex;
    flex-direction: column;

    .name {
      font-weight: 600;
      color: #151717;
      margin-bottom: 0.25rem;
    }

    .date {
      color: #856404;
      font-size: 0.85rem;
    }
  }

  .reminder-icon {
    svg {
      color: #856404;
    }
  }
`;

export default DashboardPage;