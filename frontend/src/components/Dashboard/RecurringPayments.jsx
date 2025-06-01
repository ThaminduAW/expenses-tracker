import { useState, useEffect } from 'react';
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

    const handleSubmit = async e => {
        e.preventDefault();
        const data = { ...form, totalAmount: Number(form.totalAmount), installments: installmentsInput.map(i => ({ ...i, amount: Number(i.amount) })) };
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

    const handleSchedule = async id => setSchedule(await getPaymentSchedule(id));

    const handleMarkPaid = async (paymentId, installmentId) => {
        await markInstallmentPaid(paymentId, installmentId);
        handleSchedule(paymentId);
        fetchPayments();
    };

    return (
        <div style={{ marginTop: 40 }}>
            <h2>Recurring Payments (Installments)</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input name="provider" placeholder="Provider (e.g. Afterpay)" value={form.provider} onChange={handleChange} />
                <input name="totalAmount" type="number" placeholder="Total Amount" value={form.totalAmount} onChange={handleChange} required />
                <div>
                    <b>Installments:</b>
                    {installmentsInput.map((inst, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                            <input name="dueDate" type="date" value={inst.dueDate} onChange={e => handleInstallmentChange(idx, e)} required />
                            <input name="amount" type="number" placeholder="Amount" value={inst.amount} onChange={e => handleInstallmentChange(idx, e)} required />
                        </div>
                    ))}
                    <button type="button" onClick={addInstallmentField}>Add Installment</button>
                </div>
                <button type="submit">{editing ? 'Update' : 'Add'}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', provider: '', totalAmount: '', installments: [] }); setInstallmentsInput([{ dueDate: '', amount: '' }]); }}>Cancel</button>}
            </form>
            <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: 24 }}>
                <thead>
                    <tr><th>Name</th><th>Provider</th><th>Total</th><th>Installments</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {(Array.isArray(payments) ? payments : []).map(payment => (
                        <tr key={payment._id}>
                            <td>{payment.name}</td>
                            <td>{payment.provider}</td>
                            <td>{payment.totalAmount}</td>
                            <td>{payment.installments.length}</td>
                            <td>
                                <button onClick={() => handleEdit(payment)}>Edit</button>
                                <button onClick={() => handleDelete(payment._id)}>Delete</button>
                                <button onClick={() => handleSchedule(payment._id)}>View Schedule</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {schedule && (
                <div style={{ marginBottom: 24 }}>
                    <h3>Payment Schedule</h3>
                    <div>Next Due: {schedule.nextDue ? `${schedule.nextDue.dueDate.slice(0, 10)} (${schedule.nextDue.amount})` : 'All paid'}</div>
                    <div>Amount Remaining: {schedule.amountRemaining}</div>
                    <h4>Payment History</h4>
                    <ul>
                        {schedule.paymentHistory.map(inst => (
                            <li key={inst._id}>
                                {inst.dueDate.slice(0, 10)} - {inst.amount} - {inst.status}
                                {inst.status === 'pending' && <button onClick={() => handleMarkPaid(schedule.paymentHistory[0].payment, inst._id)}>Mark Paid</button>}
                                {inst.status === 'paid' && inst.paidAt && ` (Paid at ${new Date(inst.paidAt).toLocaleDateString()})`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <h3>Upcoming Installment Reminders (Next 7 Days)</h3>
            <ul>
                {(Array.isArray(reminders) ? reminders : []).map(rem => (
                    <li key={rem.installmentId}>{rem.name} ({rem.provider}) - {rem.amount} due on {rem.dueDate.slice(0, 10)}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecurringPayments;
