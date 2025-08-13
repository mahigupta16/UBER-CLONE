import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

const applyThemeClass = (theme) => {
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-dark')
  root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
}

const ThemeProvider = ({ children }) => {
  const getInitial = () => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  const [theme, setTheme] = useState(getInitial)

  useEffect(() => {
    applyThemeClass(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    // Keep in sync with OS changes if user hasn't explicitly set (optional)
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      const saved = localStorage.getItem('theme')
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    try { mql.addEventListener('change', onChange) } catch { mql.addListener(onChange) }
    return () => {
      try { mql.removeEventListener('change', onChange) } catch { mql.removeListener(onChange) }
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export default ThemeProvider

