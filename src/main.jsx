import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import { store, persistor } from './store/store'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1B3A2D',
                            color: '#C9A84C',
                            border: '1px solid #C9A84C',
                            fontWeight: '600',
                        },
                        success: {
                            iconTheme: {
                                primary: '#C9A84C',
                                secondary: '#1B3A2D',
                            },
                        },
                        error: {
                            style: {
                                background: '#1B3A2D',
                                color: '#dc2626',
                                border: '1px solid #dc2626',
                            },
                            iconTheme: {
                                primary: '#dc2626',
                                secondary: '#1B3A2D',
                            },
                        }
                    }}
                />
                <App />
            </PersistGate>
        </Provider>
    </StrictMode>
)