import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ForgotPassword from './pages/ForgotPassword'
import VerifyCode from './pages/VerifyCode'
import ResetPassword from './pages/ResetPassword'
import PergolaOnboarding from './pages/onBoarding'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import MainPage from './pages/MainPage'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#E8E1D8',
              color: '#3D1609',
              border: '1px solid #A73249',
              fontFamily: 'Nunito',
              fontWeight: '600'
            },
            success: {
              iconTheme: {
                primary: '#59FF00',
                secondary: '#E8E1D8'
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#E8E1D8'
              }
            }
          }}
        />
        <Routes>
          {/* Rutas publicas */}
          <Route path="/" element={<PergolaOnboarding/>}/>
          <Route path="/register" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/verify-code" element={<VerifyCode/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          {/* Rutas protegidas */}
          <Route path="*" element={<Navigate to="/" replace/>}/>
          <Route path="/main" element={<MainPage/>}/>
        </Routes>
      </div>
    </AuthProvider>
  )
}
export default App