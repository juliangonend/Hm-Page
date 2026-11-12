import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminApp } from '../features/backoffice/ui/AdminApp'
import { createAdminApi } from '../features/backoffice/infrastructure/adminApi'
import { API_BASE } from '../shared/api/apiBase'
import '../shared/styles/global.css'

// Separate entry from the landing: none of this code ships in the public site bundle
const api = createAdminApi(API_BASE || '/api')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminApp api={api} />
  </StrictMode>,
)
