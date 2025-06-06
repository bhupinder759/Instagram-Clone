import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

let persistor = persistStore(store)

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null}>
      <App />
    <Toaster/>
    </PersistGate>
    </Provider>
  </BrowserRouter>
)
