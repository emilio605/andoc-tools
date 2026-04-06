import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchRole(session) {
    // 1. Try app_metadata (no RLS needed, set via admin API)
    const metaRole = session?.user?.app_metadata?.role
    if (metaRole) return metaRole

    // 2. Fallback: try user_roles table
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session?.user?.id)
        .single()
      if (error) throw error
      return data?.role || 'viewer'
    } catch {
      return 'viewer'
    }
  }

  useEffect(() => {
    let mounted = true

    // Obtener sesión inicial con timeout de seguridad
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setUser(null)
        setRole(null)
        setLoading(false)
      }
    }, 8000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      if (session?.user) {
        setUser(session.user)
        const r = await fetchRole(session)
        if (mounted) setRole(r)
      } else {
        setUser(null)
        setRole(null)
      }
      if (mounted) setLoading(false)
    }).catch(() => {
      if (mounted) {
        setUser(null)
        setRole(null)
        setLoading(false)
      }
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      if (session?.user) {
        setUser(session.user)
        const r = await fetchRole(session)
        if (mounted) setRole(r)
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
