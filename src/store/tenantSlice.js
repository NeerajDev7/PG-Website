import {createSlice} from '@reduxjs/toolkit'
const initialState = {
    tenants : [
        {id : 1, name : 'Neeraj Kumar', room : 'Room 208', rent : 12000, paid : true},
        {id : 2, name : 'Hari Krishna', room : 'Room 208', rent : 12000, paid : true},
        {id : 3, name : 'Rohit', room : 'Room 504', rent : 12000, paid : false},
        {id : 4, name : 'Aditya', room : 'Room 511', rent : 12000, paid : false},
    ]
}

const tenantsSlice = createSlice({
    name : 'tenants',
    initialState,
    reducers : {
        addTenant : (state,action) => {
            state.tenants.push(action.payload)
        },
        markAsPaid : (state,action) => {
            const tenant = state.tenants.find( t=> t.id === action.payload)
            if( tenant) tenant.paid = true
        }
    }
})

export const {addTenant,markAsPaid} = tenantsSlice.actions
export default tenantsSlice.reducer