import React from 'react'
import AppRoutes from './routes'
import Header from './components/Header'
import { ToastProvider } from './components/Toast'
import './App.css'

export default function App() {
  return (
    <ToastProvider>
      <div className="app-root">
        <Header />
        <main>
          <AppRoutes />
        </main>
      </div>
    </ToastProvider>
  )
}
