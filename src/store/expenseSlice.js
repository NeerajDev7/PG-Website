import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    expenses: [],
    // Each expense: { id, title, amount, category, month, year }
}

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        addExpense: (state, action) => {
            state.expenses.push({
                id: Date.now(),
                title: action.payload.title,
                amount: action.payload.amount,
                category: action.payload.category,
                month: action.payload.month,
                year: action.payload.year,
            })
        },
        editExpense: (state, action) => {
            const index = state.expenses.findIndex(e => e.id === action.payload.id)
            if (index !== -1) {
                state.expenses[index] = { ...state.expenses[index], ...action.payload }
            }
        },
        deleteExpense: (state, action) => {
            state.expenses = state.expenses.filter(e => e.id !== action.payload)
        },
    },
})

export const { addExpense, editExpense, deleteExpense } = expenseSlice.actions
export default expenseSlice.reducer