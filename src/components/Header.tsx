"use client"
import { Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { Button } from './ui/button'

function Header() {
    const { theme, setTheme } = useTheme()
  return (
    <header className="sticky top-0 z-10 bg-background border-b">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Multi-Wallet Manager</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  </header>

  )
}

export default Header