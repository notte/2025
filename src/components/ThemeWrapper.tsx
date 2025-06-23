'use client'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
  ThemeProvider
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { materialTheme } from '@/assets/theme'

type ThemeContextType = {
  toggleTheme: () => void
  mode: 'light' | 'dark'
}

const defaultContext: ThemeContextType = {
  toggleTheme: () => {
    console.warn('toggleTheme not implemented')
  },
  mode: 'light'
}

export const ThemeContext = createContext<ThemeContextType>(defaultContext)

export const useTheme = () => useContext(ThemeContext)

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  type Mode = 'light' | 'dark'

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme')
      return storedTheme === 'dark' ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    document.documentElement.setAttribute('data-mui-color-scheme', mode)
    localStorage.setItem('theme', mode)
  }, [mode])

  const toggleTheme = useCallback(() => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
  }, [])

  const contextValue = useMemo(
    () => ({
      toggleTheme,
      mode
    }),
    [toggleTheme, mode]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <MaterialCssVarsProvider defaultMode={mode} theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <ThemeProvider theme={materialTheme}>
          <CssBaseline enableColorScheme />
          {children}
        </ThemeProvider>
      </MaterialCssVarsProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeWrapper
