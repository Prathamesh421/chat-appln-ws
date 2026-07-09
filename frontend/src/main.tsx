import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
        <>
        <Toaster position='top-left' toastOptions={{
                style: {
                        width: "210px",
                        height:"45px",
                        fontSize: "14px"
                }
        }}/>
        <App />
        </>
    
)
