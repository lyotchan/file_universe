// src/components/Header.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useIndexContext } from '@/contexts/IndexContext'

import ThemeSwitcher from './ThemeSwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import SearchBar from './SearchBar'
import Link from 'next/link'

import type { searchContentProps } from '@/lib/types'
const Header = ({ searchContent, setSearchContent }: searchContentProps) => {
  const [showInput, setShowInput] = useState(false)
  const {
    header: { title }
  } = useIndexContext()
  const router = useRouter()
  return (
    <header className="navbar fixed left-0 right-0 top-0 z-10 justify-center bg-base-100 shadow-sm">
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
          <SearchBar
            setSearchContent={setSearchContent}
            searchContent={searchContent}
            showInput={showInput}
            setShowInput={setShowInput}
          />
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
