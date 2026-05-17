import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
import tenantsReducer from './tenantSlice'
import expensesReducer from './expenseSlice'

// Custom storage engine
const customStorage = {
    getItem: (key) => {
        return Promise.resolve(localStorage.getItem(key))
    },
    setItem: (key, value) => {
        localStorage.setItem(key, value)
        return Promise.resolve()
    },
    removeItem: (key) => {
        localStorage.removeItem(key)
        return Promise.resolve()
    }
}

const rootReducer = combineReducers({
    tenants: tenantsReducer,
    expenses: expensesReducer,
})

const persistConfig = {
    key: 'pg-manager',
    storage: customStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)

export default store