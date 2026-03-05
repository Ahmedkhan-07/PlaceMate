'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('theme')
        if (saved === 'dark') {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleTheme = () => {
        setIsDark(prev => {
            const next = !prev
            if (next) {
                document.documentElement.classList.add('dark')
                localStorage.setItem('theme', 'dark')
            } else {
                document.documentElement.classList.remove('dark')
                localStorage.setItem('theme', 'light')
            }
            return next
        })
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {!mounted ? (
                <div style={{ visibility: 'hidden', display: 'contents' }}>{children}</div>
            ) : (
                children
            )}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
