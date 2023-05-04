// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext<[string, (theme: string) => void]>([
  'light',
  () => {}
])

// const ThemeContext = createContext(null)
export const useTheme = () => {
  return useContext(ThemeContext)
}
interface ThemeProviderProps {
  children: React.ReactNode
}
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState('light')
  // console.log('theme context provider ' + theme)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}
