import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('user_token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 > Date.now() && payload.type === 'user') {
          setUser(payload)
        } else { logout() }
      } catch { logout() }
    }
  }, [token])

  function login(tok, userData) {
    localStorage.setItem('user_token', tok)
    setToken(tok)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('user_token')
    setToken(null)
    setUser(null)
  }

  function updateUser(data) {
    setUser(prev => ({ ...prev, ...data }))
  }

  return (
    <UserContext.Provider value={{ user, token, isLoggedIn: !!user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
