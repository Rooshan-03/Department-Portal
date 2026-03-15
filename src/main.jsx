import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux' // ADD THIS
import { store } from './Redux/Store'  // ADD THIS (check the exact filename in your Redux folder)
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>           {/* WRAP YOUR APP */}
      <App />
    </Provider>
  </StrictMode>,
)