import { configureStore } from "@reduxjs/toolkit";
import tenantsSlice from './tenantSlice'
import tenantsReducer from './tenantSlice'
import roomsReducer from './roomSlice'

const store = configureStore({
    reducer : {
        tenants : tenantsReducer,
        rooms : roomsReducer,
    }
})

export default store