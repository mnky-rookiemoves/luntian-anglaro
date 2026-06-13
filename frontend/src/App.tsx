import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import HomePage from '@/pages/HomePage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--luntian-bg)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--luntian-surface)',
              color: 'var(--luntian-text)',
              border: '1px solid var(--luntian-primary)',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App