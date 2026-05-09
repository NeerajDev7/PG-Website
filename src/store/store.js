import { configureStore } from "@reduxjs/toolkit";
import tenantsSlice from './tenantSlice'
import tenantsReducer from './tenantSlice'

const store = configureStore({
    reducer : {
        tenants : tenantsReducer,
    }
})

export default store