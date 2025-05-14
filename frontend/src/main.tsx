// index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './router'; // <-- no longer a `router` object
import { ContextProvider } from './contexts/StateContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ContextProvider>
            <AppRouter />
        </ContextProvider>
    </StrictMode>
);
