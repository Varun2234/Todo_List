import { Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import ProtectedRoute from './components/auth/ProtectedRoute'
import TaskBoard from './components/board/TaskBoard'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route 
          path="/board" 
          element={
            <ProtectedRoute>
              <TaskBoard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/board" replace />} />
      </Routes>
    </div>
  )
}

export default App