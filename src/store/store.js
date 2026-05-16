import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import tenantsReducer from './tenantSlice'

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

const persistConfig = {
    key: 'pg-manager',
    storage: customStorage,
}

const persistedReducer = persistReducer(persistConfig, tenantsReducer)

export const store = configureStore({
    reducer: {
        tenants: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)

export default store