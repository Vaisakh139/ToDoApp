import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function LoginPage() {
  const [mode, setMode]         = useState('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const isSignUp = mode === 'signup'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      // onAuthStateChanged in App.jsx handles the rest
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setMode(isSignUp ? 'signin' : 'signup')
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Task Manager</h1>
        <p className="login-subtitle">{isSignUp ? 'Create a new account' : 'Sign in to continue'}</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </label>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? (isSignUp ? 'Creating account…' : 'Signing in…') : (isSignUp ? 'Sign up' : 'Sign in')}
          </button>
        </form>

        <p className="login-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button className="btn-link" onClick={switchMode}>
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}
