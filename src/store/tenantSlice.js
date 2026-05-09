import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tenants: [
        { id: 1, name: 'Neeraj Kumar', room: 'Room 203', rent: 12000, paid: true },
        { id: 2, name: 'Hari Krishna', room: 'Room 204', rent: 12000, paid: true },
        { id: 3, name: 'Rohit', room: 'Room 305', rent: 12000, paid: false },
        { id: 4, name: 'Aditya', room: 'Room 510', rent: 12000, paid: false },
    ]
}

const tenantsSlice = createSlice({
    name: 'tenants',
    initialState,
    reducers: {
        addTenant: (state, action) => {
            state.tenants.push(action.payload)
        },
        markAsPaid: (state, action) => {
            const tenant = state.tenants.find(t => t.id === action.payload)
            if (tenant) tenant.paid = true
        },
        removeTenant: (state, action) => {
            state.tenants = state.tenants.filter(t => t.id !== action.payload)
        },
        resetMonth : (state) =>{
            state.tenants.forEach(t=> t.paid = false)
        }
    }
})

export const { addTenant, markAsPaid, removeTenant,resetMonth } = tenantsSlice.actions
export default tenantsSlice.reducer