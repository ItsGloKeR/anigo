import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { UserListProvider } from './context/UserListContext.jsx'
import { LoadingProvider } from './context/LoadingContext.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <UserListProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </UserListProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>,
)
