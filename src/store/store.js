import { configureStore } from "@reduxjs/toolkit";
import tenantsReducer from './tenantSlice'
import roomsReducer from './roomsSlice'
import { loadState,saveState} from './localStorage'

const preloadState = loadState() 

const store = configureStore({
    reducer : {
        tenants : tenantsReducer,
        rooms : roomsReducer,
    },
    preloadState : preloadState,
})

store.subscribe(()=>{
    saveState(store.getState())
})

export default store