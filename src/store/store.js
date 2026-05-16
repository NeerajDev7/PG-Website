import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import tenantsReducer from './tenantSlice'

const persistConfig = {
    key: 'pg-manager',
    storage,
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