import { useState,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addExpense, editExpense, deleteExpense,setExpenses } from '../store/expenseSlice'
import Sidebar from '../components/Sidebar'
import PageTransition from '../components/PageTransition'
import toast from 'react-hot-toast'

const CATEGORIES = ['Salary', 'Food', 'Maintenance', 'Utilities', 'Other']

const CATEGORY_ICONS = {
    Salary: '👷',
    Food: '🍽️',
    Maintenance: '🔧',
    Utilities: '💡',
    Other: '📦',
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const now = new Date()
const CURRENT_MONTH = now.getMonth()
const CURRENT_YEAR = now.getFullYear()

const PREV_MONTH = CURRENT_MONTH === 0 ? 11 : CURRENT_MONTH - 1
const PREV_YEAR = CURRENT_MONTH === 0 ? CURRENT_YEAR - 1 : CURRENT_YEAR

function StatCard({ label, value, sub, highlight }) {
    return (
        <div
            className='rounded-xl p-5 shadow-sm'
            style={{
                backgroundColor: highlight ? 'var(--bg-primary)' : 'var(--bg-card)',
                border: highlight ? '2px solid var(--border-color)' : '1px solid var(--border-color)',
            }}
        >
            <p className='text-xs font-semibold mb-1' style={{ color: highlight ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{label}</p>
            <p className='text-3xl font-bold' style={{ color: highlight ? 'var(--accent)' : 'var(--text-primary)' }}>{value}</p>
            {sub && <p className='text-xs mt-1' style={{ color: highlight ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{sub}</p>}
        </div>
    )
}

function AnalyticsPage() {
    const dispatch = useDispatch()
    const tenants = useSelector((state) => state.tenants.tenants ?? [])
    const expenses = useSelector((state) => state.expenses.expenses ?? [])

    useEffect(() => {
        fetch('https://pg-manager-backend-mryl.onrender.com/api/expenses')
            .then(res => res.json())
            .then(data => dispatch(setExpenses(data)))
            .catch(err => console.error('Failed to fetch expenses:', err))
    }, [])

    const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH)
    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ title: '', amount: '', category: 'Salary' })
    const [formErrors, setFormErrors] = useState({})

    // ── Income ──
    const totalIncome = tenants.reduce((sum, t) => sum + (t.rent || 0), 0)
    const collected = tenants.filter(t => t.paid).reduce((sum, t) => sum + (t.rent || 0), 0)
    const pending = totalIncome - collected

    // Previous month income (same logic, just for comparison label)
    const prevMonthName = MONTHS[PREV_MONTH]
    const currMonthName = MONTHS[selectedMonth]

    // ── Expenses for selected month ──
    const monthExpenses = expenses.filter(
        e => e.month === selectedMonth && e.year === selectedYear
    )
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const netIncome = collected - totalExpenses

    // ── Previous month expenses ──
    const prevMonthExpenses = expenses.filter(
        e => e.month === PREV_MONTH && e.year === PREV_YEAR
    )
    const prevTotalExpenses = prevMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

    // ── Expense by category ──
    const byCategory = CATEGORIES.map(cat => ({
        cat,
        amount: monthExpenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0)
    })).filter(c => c.amount > 0)

    // ── Meal breakdown ──
    const vegCount = tenants.filter(t => t.mealType === 'vegetarian').length
    const nonVegCount = tenants.filter(t => t.mealType === 'non-vegetarian').length
    const unknownCount = tenants.length - vegCount - nonVegCount

    // ── Form handlers ──
    const validateForm = () => {
        const errors = {}
        if (!form.title.trim()) errors.title = 'Title is required'
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errors.amount = 'Enter a valid amount'
        return errors
    }

    const handleSubmit = () => {
        const errors = validateForm()
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return }

        const expenseData = {
            ...form,
            amount: Number(form.amount),
            month: selectedMonth,
            year: selectedYear
        }

        if (editingId) {
            fetch(`https://pg-manager-backend-mryl.onrender.com/api/expenses/${editingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData),
            })
                .then(res => res.json())
                .then(() => {
                    dispatch(editExpense({ id: editingId, ...expenseData }))
                    toast.success('Expense updated!')
                })
                .catch(err => {
                    console.error('Failed to update expense:', err)
                    toast.error('Failed to update expense')
                })
        } else {
            fetch('https://pg-manager-backend-mryl.onrender.com/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData),
            })
                .then(res => res.json())
                .then(savedExpense => {
                    dispatch(addExpense(savedExpense))
                    toast.success('Expense added!')
                })
                .catch(err => {
                    console.error('Failed to add expense:', err)
                    toast.error('Failed to add expense')
                })
        }

        setForm({ title: '', amount: '', category: 'Salary' })
        setFormErrors({})
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (expense) => {
        setForm({ title: expense.title, amount: String(expense.amount), category: expense.category })
        setEditingId(expense.id)
        setShowForm(true)
        setFormErrors({})
    }

   const handleDelete = (id) => {
        fetch(`https://pg-manager-backend-mryl.onrender.com/api/expenses/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(() => {
                dispatch(deleteExpense(id))
                toast.success('Expense deleted')
            })
            .catch(err => {
                console.error('Failed to delete expense:', err)
                toast.error('Failed to delete expense')
            })
    }

    const handleCancel = () => {
        setForm({ title: '', amount: '', category: 'Salary' })
        setFormErrors({})
        setEditingId(null)
        setShowForm(false)
    }

    const inputStyle = (field) => ({
        border: formErrors[field] ? '1px solid var(--danger)' : '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
    })

    return (
        <PageTransition>
            <div className='flex min-h-screen' style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <Sidebar />
                <div className='flex-1 p-4 md:p-8 mt-16 md:mt-0 max-w-5xl'>

                    {/* Header */}
                    <div className='mb-6'>
                        <h1 className='text-2xl md:text-3xl font-bold' style={{ color: 'var(--text-primary)' }}>Analytics</h1>
                        <p className='mt-1 text-sm' style={{ color: 'var(--text-secondary)' }}>Track income, expenses and net profit</p>
                    </div>

                    {/* Month Selector */}
                    <div className='flex gap-3 mb-8 flex-wrap'>
                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(Number(e.target.value))}
                            className='px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none'
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                            {MONTHS.map((m, i) => (
                                <option key={m} value={i}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={e => setSelectedYear(Number(e.target.value))}
                            className='px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none'
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                            {[CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* ── Income Section ── */}
                    <h2 className='text-base font-bold mb-3' style={{ color: 'var(--text-primary)' }}>💰 Income — {currMonthName} {selectedYear}</h2>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                        <StatCard label='Total Expected' value={`₹${totalIncome.toLocaleString('en-IN')}`} sub={`${tenants.length} tenants`} />
                        <StatCard label='Collected' value={`₹${collected.toLocaleString('en-IN')}`} sub={`${tenants.filter(t => t.paid).length} paid`} />
                        <StatCard label='Pending' value={`₹${pending.toLocaleString('en-IN')}`} sub={`${tenants.filter(t => !t.paid).length} unpaid`} />
                        <StatCard label='Net Income' value={`₹${netIncome.toLocaleString('en-IN')}`} sub='after expenses' highlight />
                    </div>

                    {/* ── Month over Month Comparison ── */}
                    <h2 className='text-base font-bold mb-3' style={{ color: 'var(--text-primary)' }}>📊 Month Comparison</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
                        <div className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs font-semibold mb-3' style={{ color: 'var(--text-secondary)' }}>Total Expenses</p>
                            <div className='flex justify-between items-end'>
                                <div>
                                    <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>{prevMonthName}</p>
                                    <p className='text-xl font-bold' style={{ color: 'var(--text-primary)' }}>₹{prevTotalExpenses.toLocaleString('en-IN')}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>{currMonthName}</p>
                                    <p className='text-xl font-bold' style={{ color: 'var(--accent)' }}>₹{totalExpenses.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            {prevTotalExpenses > 0 && (
                                <p className='text-xs mt-3 font-semibold'
                                    style={{ color: totalExpenses > prevTotalExpenses ? 'var(--danger)' : 'var(--bg-secondary)' }}>
                                    {totalExpenses > prevTotalExpenses
                                        ? `▲ ₹${(totalExpenses - prevTotalExpenses).toLocaleString('en-IN')} more than ${prevMonthName}`
                                        : `▼ ₹${(prevTotalExpenses - totalExpenses).toLocaleString('en-IN')} less than ${prevMonthName}`
                                    }
                                </p>
                            )}
                        </div>

                        <div className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs font-semibold mb-3' style={{ color: 'var(--text-secondary)' }}>Expense Entries</p>
                            <div className='flex justify-between items-end'>
                                <div>
                                    <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>{prevMonthName}</p>
                                    <p className='text-xl font-bold' style={{ color: 'var(--text-primary)' }}>{prevMonthExpenses.length}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-xs mb-1' style={{ color: 'var(--text-secondary)' }}>{currMonthName}</p>
                                    <p className='text-xl font-bold' style={{ color: 'var(--accent)' }}>{monthExpenses.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-span-2 md:col-span-1 rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs font-semibold mb-3' style={{ color: 'var(--text-secondary)' }}>Biggest Expense Category</p>
                            {byCategory.length > 0 ? (
                                <>
                                    <p className='text-2xl mb-1'>{CATEGORY_ICONS[byCategory.sort((a, b) => b.amount - a.amount)[0].cat]}</p>
                                    <p className='text-xl font-bold' style={{ color: 'var(--text-primary)' }}>
                                        {byCategory[0].cat}
                                    </p>
                                    <p className='text-sm font-semibold' style={{ color: 'var(--accent)' }}>
                                        ₹{byCategory[0].amount.toLocaleString('en-IN')}
                                    </p>
                                </>
                            ) : (
                                <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>No expenses yet</p>
                            )}
                        </div>
                    </div>

                    {/* ── Meal Breakdown ── */}
                    <h2 className='text-base font-bold mb-3' style={{ color: 'var(--text-primary)' }}>🍽️ Meal Breakdown</h2>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                        <StatCard label='🥦 Vegetarian' value={vegCount} sub='tenants' />
                        <StatCard label='🍖 Non-Vegetarian' value={nonVegCount} sub='tenants' />
                        <StatCard label='Total Tenants' value={tenants.length} sub='on meal plan' />
                        {unknownCount > 0 && (
                            <StatCard label='Not Set' value={unknownCount} sub='no preference' />
                        )}
                        {/* Veg names */}
                        <div className='col-span-2 rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs font-semibold mb-2' style={{ color: 'var(--text-secondary)' }}>🥦 Vegetarian Tenants</p>
                            {tenants.filter(t => t.mealType === 'vegetarian').length > 0
                                ? tenants.filter(t => t.mealType === 'vegetarian').map(t => (
                                    <p key={t.id} className='text-sm font-medium' style={{ color: 'var(--text-primary)' }}>
                                        {t.name} <span style={{ color: 'var(--text-secondary)' }}>· {t.room}</span>
                                    </p>
                                ))
                                : <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>None</p>
                            }
                        </div>
                        <div className='col-span-2 rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <p className='text-xs font-semibold mb-2' style={{ color: 'var(--text-secondary)' }}>🍖 Non-Veg Tenants</p>
                            {tenants.filter(t => t.mealType === 'non-vegetarian').length > 0
                                ? tenants.filter(t => t.mealType === 'non-vegetarian').map(t => (
                                    <p key={t.id} className='text-sm font-medium' style={{ color: 'var(--text-primary)' }}>
                                        {t.name} <span style={{ color: 'var(--text-secondary)' }}>· {t.room}</span>
                                    </p>
                                ))
                                : <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>None</p>
                            }
                        </div>
                    </div>

                    {/* ── Expense Manager ── */}
                    <div className='flex justify-between items-center mb-3'>
                        <h2 className='text-base font-bold' style={{ color: 'var(--text-primary)' }}>🧾 Expenses — {currMonthName} {selectedYear}</h2>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className='px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition'
                                style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--border-color)' }}
                            >
                                + Add Expense
                            </button>
                        )}
                    </div>

                    {/* Add/Edit Form */}
                    {showForm && (
                        <div className='rounded-xl p-6 shadow-sm mb-5' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                            <h3 className='font-bold text-sm mb-4' style={{ color: 'var(--text-primary)' }}>
                                {editingId ? 'Edit Expense' : 'New Expense'}
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                                <div>
                                    <label className='block text-xs font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Title *</label>
                                    <input
                                        value={form.title}
                                        onChange={e => { setForm({ ...form, title: e.target.value }); setFormErrors({ ...formErrors, title: '' }) }}
                                        placeholder='e.g. Cook salary'
                                        className='w-full px-3 py-2 rounded-lg text-sm focus:outline-none'
                                        style={inputStyle('title')}
                                    />
                                    {formErrors.title && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{formErrors.title}</p>}
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Amount (₹) *</label>
                                    <input
                                        value={form.amount}
                                        onChange={e => { setForm({ ...form, amount: e.target.value }); setFormErrors({ ...formErrors, amount: '' }) }}
                                        placeholder='15000'
                                        className='w-full px-3 py-2 rounded-lg text-sm focus:outline-none'
                                        style={inputStyle('amount')}
                                    />
                                    {formErrors.amount && <p className='text-xs mt-1' style={{ color: '#dc2626' }}>{formErrors.amount}</p>}
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Category</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        className='w-full px-3 py-2 rounded-lg text-sm focus:outline-none'
                                        style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='flex gap-3'>
                                <button
                                    onClick={handleCancel}
                                    className='flex-1 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition'
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className='flex-1 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition'
                                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent)', border: '2px solid var(--border-color)' }}
                                >
                                    {editingId ? 'Update' : 'Add Expense'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Expense List */}
                    <div className='rounded-xl shadow-sm mb-8 overflow-hidden' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        {monthExpenses.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-12'>
                                <p className='text-4xl mb-3'>📭</p>
                                <p className='font-semibold mb-1' style={{ color: 'var(--text-primary)' }}>No expenses for {currMonthName}</p>
                                <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Click "Add Expense" to log one</p>
                            </div>
                        ) : (
                            <table className='w-full'>
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                                        <th className='text-left px-4 py-3 text-xs font-semibold' style={{ color: 'var(--accent)' }}>Title</th>
                                        <th className='text-left px-4 py-3 text-xs font-semibold' style={{ color: 'var(--accent)' }}>Category</th>
                                        <th className='text-left px-4 py-3 text-xs font-semibold' style={{ color: 'var(--accent)' }}>Amount</th>
                                        <th className='text-left px-4 py-3 text-xs font-semibold' style={{ color: 'var(--accent)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthExpenses.map((expense, index) => (
                                        <tr
                                            key={expense.id}
                                            style={{
                                                backgroundColor: index % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-input)',
                                                borderBottom: '1px solid var(--border-subtle)'
                                            }}
                                        >
                                            <td className='px-4 py-3 text-sm font-medium' style={{ color: 'var(--text-primary)' }}>{expense.title}</td>
                                            <td className='px-4 py-3 text-sm' style={{ color: 'var(--text-secondary)' }}>
                                                {CATEGORY_ICONS[expense.category]} {expense.category}
                                            </td>
                                            <td className='px-4 py-3 text-sm font-bold' style={{ color: 'var(--accent)' }}>
                                                ₹{Number(expense.amount).toLocaleString('en-IN')}
                                            </td>
                                            <td className='px-4 py-3'>
                                                <div className='flex gap-2'>
                                                    <button
                                                        onClick={() => handleEdit(expense)}
                                                        className='px-3 py-1 rounded-lg text-xs font-semibold hover:opacity-80 transition'
                                                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(expense.id)}
                                                        className='px-3 py-1 rounded-lg text-xs font-semibold hover:opacity-80 transition'
                                                        style={{ backgroundColor: 'var(--bg-card)', color: '#dc2626', border: '1px solid var(--danger)' }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                                        <td colSpan={2} className='px-4 py-3 text-xs font-bold' style={{ color: 'var(--text-muted)' }}>Total Expenses</td>
                                        <td colSpan={2} className='px-4 py-3 text-sm font-bold' style={{ color: 'var(--accent)' }}>
                                            ₹{totalExpenses.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>

                    {/* ── Category Breakdown ── */}
                    {byCategory.length > 0 && (
                        <>
                            <h2 className='text-base font-bold mb-3' style={{ color: 'var(--text-primary)' }}>📂 Expense by Category</h2>
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
                                {CATEGORIES.map(cat => {
                                    const amt = monthExpenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0)
                                    if (!amt) return null
                                    return (
                                        <div key={cat} className='rounded-xl p-5 shadow-sm' style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                            <p className='text-2xl mb-1'>{CATEGORY_ICONS[cat]}</p>
                                            <p className='text-xs font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>{cat}</p>
                                            <p className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>₹{amt.toLocaleString('en-IN')}</p>
                                            <p className='text-xs mt-1' style={{ color: 'var(--text-secondary)' }}>
                                                {totalExpenses > 0 ? `${Math.round((amt / totalExpenses) * 100)}% of expenses` : ''}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </PageTransition>
    )
}

export default AnalyticsPage