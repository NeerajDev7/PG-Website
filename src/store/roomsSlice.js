import {createSlice } from '@reduxjs/toolkit'
const initialState = {
    rooms : [ 
        {id : 1, number : '101', type: 'single', price : 25000, occupied : false},
        {id : 2, number : '102', type: 'single', price : 25000, occupied : true},
        {id : 3, number : '203', type: 'Double', price : 12000, occupied : true},
        {id : 4, number : '204', type: 'Double', price : 12000, occupied : true},
        {id : 5, number : '305', type: 'Triple', price : 9000, occupied : true},
        {id : 6, number : '510', type: 'Double', price : 12000, occupied : true}
    ]
}

const roomSlice = createSlice({
    name : 'rooms',
    initialState,
    reducers : {
        occupyRoom : (state, action) =>{
            const room = state.room.find(r=>r.number ===action.payload.roomNumber)
                if(room){
                    room.occupied = true
                    room.tenant = action.payload.tenantName
                }
        },
        vacateRoom: (state,action)=>{
            const room = state.room.find(r=> r.number === action.payload)
            if(room){
                room.occupied = false
                room.tenant = null
            }
        }
    }
})

export const { occupyRoom,vacateRoom} = roomSlice.actions
export default roomSlice.reducer