// src/components/Header.tsx
import ThemeSwitcher from './ThemeSwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import SearchBar from './SearchBar'
import { useState } from 'react'
import { useIndexContext } from '@/contexts/IndexContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
const Header = () => {
  const [showInput, setShowInput] = useState(false)
  const {
    header: { title }
  } = useIndexContext()
  const router = useRouter()
  return (
    <header className="navbar justify-center bg-base-100">
      <div className="container flex">
        <div className={`${showInput ? 'hidden' : ''}`}>
          <Link
            href="/"
            locale={router.locale}
            prefetch={false}
            className="btn-ghost btn text-xl normal-case"
          >
            {title}
          </Link>
        </div>
        <div className={`ml-auto${showInput ? ' flex-1' : ''}`}>
          <SearchBar showInput={showInput} setShowInput={setShowInput} />
        </div>
        <div className={`ml-2${showInput ? ' hidden' : ''}`}>
          <ThemeSwitcher />
        </div>
        <div className={`ml-2${showInput ? ' hidden' : ''}`}>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

export default Header
