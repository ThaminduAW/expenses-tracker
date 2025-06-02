import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    getRecurringPayments,
    addRecurringPayment,
    updateRecurringPayment,
    deleteRecurringPayment,
    getPaymentSchedule,
    markInstallmentPaid,
    getInstallmentReminders
} from '../../services/paymentService';

const RecurringPayments = () => {
    const [payments, setPayments] = useState([]);
    const [form, setForm] = useState({ name: '', provider: '', totalAmount: '', installments: [] });
    const [editing, setEditing] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [currentPaymentId, setCurrentPaymentId] = useState(null);
    const [reminders, setReminders] = useState([]);
    const [installmentsInput, setInstallmentsInput] = useState([{ dueDate: '', amount: '' }]);

    useEffect(() => {
        fetchPayments();
        fetchReminders();
    }, []);

    const fetchPayments = async () => {
        const result = await getRecurringPayments();
        setPayments(Array.isArray(result) ? result : []);
    };

    const fetchReminders = async () => {
        const result = await getInstallmentReminders();
        setReminders(Array.isArray(result) ? result : []);
    };

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleInstallmentChange = (idx, e) => {
        const updated = [...installmentsInput];
        updated[idx][e.target.name] = e.target.value;
        setInstallmentsInput(updated);
    };

    const addInstallmentField = () => setInstallmentsInput([...installmentsInput, { dueDate: '', amount: '' }]);

    const removeInstallmentField = (idx) => {
        if (installmentsInput.length > 1) {
            const updated = installmentsInput.filter((_, index) => index !== idx);
            setInstallmentsInput(updated);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const data = { 
            ...form, 
            totalAmount: Number(form.totalAmount), 
            installments: installmentsInput.map(i => ({ ...i, amount: Number(i.amount) })) 
        };
        
        if (editing) {
            await updateRecurringPayment(editing, data);
            setEditing(null);
        } else {
            await addRecurringPayment(data);
        }
        
        setForm({ name: '', provider: '', totalAmount: '', installments: [] });
        setInstallmentsInput([{ dueDate: '', amount: '' }]);
        fetchPayments();
    };

    const handleEdit = payment => {
        setEditing(payment._id);
        setForm({ name: payment.name, provider: payment.provider, totalAmount: payment.totalAmount });
        setInstallmentsInput(payment.installments.map(i => ({ dueDate: i.dueDate.slice(0, 10), amount: i.amount })));
    };

    const handleDelete = async id => {
        await deleteRecurringPayment(id);
        fetchPayments();
    };

    const handleSchedule = async id => {
        setCurrentPaymentId(id);
        setSchedule(await getPaymentSchedule(id));
    };

    const handleMarkPaid = async (paymentId, installmentId) => {
        await markInstallmentPaid(paymentId, installmentId);
        handleSchedule(paymentId);
        fetchPayments();
    };

    const closeSchedule = () => {
        setSchedule(null);
        setCurrentPaymentId(null);
    };

    return (
        <StyledWrapper>
            <Card>
                <CardHeader>
                    <h2>Recurring Payments & Installments</h2>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </CardHeader>

                <PaymentForm onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label>Payment Name</label>
                            <input 
                                name="name" 
                                placeholder="e.g. iPhone Purchase" 
                                value={form.name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <label>Provider</label>
                            <input 
                                name="provider" 
                                placeholder="e.g. Afterpay, Klarna" 
                                value={form.provider} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Total Amount ($)</label>
                        <input 
                            name="totalAmount" 
                            type="number" 
                            placeholder="0.00" 
                            value={form.totalAmount} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <InstallmentsSection>
                        <div className="installments-header">
                            <h3>Installment Schedule</h3>
                            <button 
                                type="button" 
                                className="btn-add-installment" 
                                onClick={addInstallmentField}
                            >
                                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Add Installment
                            </button>
                        </div>
                        
                        <InstallmentsList>
                            {installmentsInput.map((inst, idx) => (
                                <InstallmentItem key={idx}>
                                    <div className="installment-fields">
                                        <div className="input-group">
                                            <label>Due Date</label>
                                            <input 
                                                name="dueDate" 
                                                type="date" 
                                                value={inst.dueDate} 
                                                onChange={e => handleInstallmentChange(idx, e)} 
                                                required 
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Amount ($)</label>
                                            <input 
                                                name="amount" 
                                                type="number" 
                                                placeholder="0.00" 
                                                value={inst.amount} 
                                                onChange={e => handleInstallmentChange(idx, e)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    {installmentsInput.length > 1 && (
                                        <button 
                                            type="button" 
                                            className="btn-remove" 
                                            onClick={() => removeInstallmentField(idx)}
                                        >
                                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    )}
                                </InstallmentItem>
                            ))}
                        </InstallmentsList>
                    </InstallmentsSection>

                    <FormActions>
                        <button type="submit" className="btn-primary">
                            {editing ? 'Update Payment Plan' : 'Add Payment Plan'}
                        </button>
                        {editing && (
                            <button 
                                type="button" 
                                className="btn-secondary"
                                onClick={() => { 
                                    setEditing(null); 
                                    setForm({ name: '', provider: '', totalAmount: '', installments: [] }); 
                                    setInstallmentsInput([{ dueDate: '', amount: '' }]); 
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </FormActions>
                </PaymentForm>
            </Card>

            <Card>
                <CardHeader>
                    <h2>Payment Plans</h2>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </CardHeader>

                {payments.length === 0 ? (
                    <EmptyState>
                        <svg width={48} height={48} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <p>No payment plans yet</p>
                        <span>Add your first installment plan above to get started</span>
                    </EmptyState>
                ) : (
                    <PaymentGrid>
                        {payments.map(payment => (
                            <PaymentCard key={payment._id}>
                                <div className="payment-info">
                                    <h3>{payment.name}</h3>
                                    <div className="provider">{payment.provider}</div>
                                    <div className="total-amount">${payment.totalAmount}</div>
                                    <div className="installments-count">
                                        {payment.installments.length} installments
                                    </div>
                                </div>
                                <div className="payment-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(payment)}>
                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Edit
                                    </button>
                                    <button className="btn-schedule" onClick={() => handleSchedule(payment._id)}>
                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        Schedule
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(payment._id)}>
                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </PaymentCard>
                        ))}
                    </PaymentGrid>
                )}
            </Card>

            {schedule && (
                <ScheduleModal>
                    <ScheduleContent>
                        <ScheduleHeader>
                            <h2>Payment Schedule</h2>
                            <button className="close-btn" onClick={closeSchedule}>
                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </ScheduleHeader>

                        <ScheduleStats>
                            <StatCard>
                                <div className="stat-label">Next Due</div>
                                <div className="stat-value">
                                    {schedule.nextDue ? 
                                        `${schedule.nextDue.dueDate.slice(0, 10)}` : 
                                        'All Paid'
                                    }
                                </div>
                                {schedule.nextDue && (
                                    <div className="stat-amount">${schedule.nextDue.amount}</div>
                                )}
                            </StatCard>
                            <StatCard>
                                <div className="stat-label">Amount Remaining</div>
                                <div className="stat-value">${schedule.amountRemaining}</div>
                            </StatCard>
                        </ScheduleStats>

                        <PaymentHistory>
                            <h3>Payment History</h3>
                            <HistoryList>
                                {schedule.paymentHistory.map(inst => (
                                    <HistoryItem key={inst._id} className={inst.status}>
                                        <div className="history-info">
                                            <div className="date">{inst.dueDate.slice(0, 10)}</div>
                                            <div className="amount">${inst.amount}</div>
                                            <div className={`status ${inst.status}`}>
                                                {inst.status === 'paid' && '✓ Paid'}
                                                {inst.status === 'pending' && '⏳ Pending'}
                                                {inst.status === 'overdue' && '⚠️ Overdue'}
                                            </div>
                                            {inst.status === 'paid' && inst.paidAt && (
                                                <div className="paid-date">
                                                    Paid: {new Date(inst.paidAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        {inst.status === 'pending' && (
                                            <button 
                                                className="btn-mark-paid"
                                                onClick={() => handleMarkPaid(currentPaymentId, inst._id)}
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                    </HistoryItem>
                                ))}
                            </HistoryList>
                        </PaymentHistory>
                    </ScheduleContent>
                </ScheduleModal>
            )}

            <Card>
                <CardHeader>
                    <h2>Upcoming Installments</h2>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </CardHeader>
                <span className="subtitle">Next 7 Days</span>
                
                {reminders.length === 0 ? (
                    <EmptyState>
                        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p>No upcoming installments</p>
                    </EmptyState>
                ) : (
                    <RemindersList>
                        {reminders.map(rem => (
                            <ReminderItem key={rem.installmentId}>
                                <div className="reminder-info">
                                    <div className="name">{rem.name}</div>
                                    <div className="provider">via {rem.provider}</div>
                                    <div className="due-date">Due: {rem.dueDate.slice(0, 10)}</div>
                                </div>
                                <div className="amount">${rem.amount}</div>
                            </ReminderItem>
                        ))}
                    </RemindersList>
                )}
            </Card>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;

  .subtitle {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    display: block;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

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

    input {
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
`;

const InstallmentsSection = styled.div`
  .installments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      margin: 0;
      color: #151717;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .btn-add-installment {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.85rem;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: #218838;
      }
    }
  }
`;

const InstallmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InstallmentItem = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;

  .installment-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    flex: 1;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .btn-remove {
    padding: 0.5rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-start;

  .btn-primary {
    padding: 0.75rem 1.5rem;
    background-color: #151717;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #252727;
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
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #5a6268;
    }
  }
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const PaymentCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
  }

  .payment-info {
    margin-bottom: 1rem;

    h3 {
      margin: 0 0 0.5rem 0;
      color: #151717;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .provider {
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .total-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d79f3;
      margin-bottom: 0.25rem;
    }

    .installments-count {
      color: #6c757d;
      font-size: 0.85rem;
    }
  }

  .payment-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      font-size: 0.8rem;
    }

    .btn-edit {
      background-color: #2d79f3;
      color: white;

      &:hover {
        background-color: #1e5bb8;
      }
    }

    .btn-schedule {
      background-color: #17a2b8;
      color: white;

      &:hover {
        background-color: #138496;
      }
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;

      &:hover {
        background-color: #c82333;
      }
    }
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

const ScheduleModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ScheduleContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ScheduleHeader = styled.div`
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

  .close-btn {
    padding: 0.5rem;
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #f8f9fa;
    }
  }
`;

const ScheduleStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;

  .stat-label {
    color: #6c757d;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    color: #151717;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .stat-amount {
    color: #2d79f3;
    font-size: 1.1rem;
    font-weight: 700;
  }
`;

const PaymentHistory = styled.div`
  h3 {
    margin: 0 0 1rem 0;
    color: #151717;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;

  &.paid {
    background: #d4edda;
    border-color: #c3e6cb;
  }

  &.pending {
    background: #fff3cd;
    border-color: #ffeaa7;
  }

  &.overdue {
    background: #f8d7da;
    border-color: #f5c6cb;
  }

  .history-info {
    .date {
      font-weight: 600;
      color: #151717;
      margin-bottom: 0.25rem;
    }

    .amount {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2d79f3;
      margin-bottom: 0.25rem;
    }

    .status {
      font-size: 0.85rem;
      font-weight: 500;

      &.paid {
        color: #155724;
      }

      &.pending {
        color: #856404;
      }

      &.overdue {
        color: #721c24;
      }
    }

    .paid-date {
      font-size: 0.8rem;
      color: #6c757d;
    }
  }

  .btn-mark-paid {
    padding: 0.5rem 1rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.85rem;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #218838;
    }
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
    .name {
      font-weight: 600;
      color: #151717;
      margin-bottom: 0.25rem;
    }

    .provider {
      color: #856404;
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }

    .due-date {
      color: #856404;
      font-size: 0.8rem;
    }
  }

  .amount {
    font-size: 1.2rem;
    font-weight: 700;
    color: #856404;
  }
`;

export default RecurringPayments;
