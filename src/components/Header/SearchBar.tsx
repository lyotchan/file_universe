// components/SearchBar.tsx
import { useState } from 'react'
// import styles from '../styles/searchbar.module.css'
// styles.searchInput styles.show
import { useIndexContext } from '@/contexts/IndexContext'

interface showInputType {
  showInput: Boolean
  setShowInput: Function
  setSearchContent: Function
  searchContent: string
}

const SearchBar = ({
  showInput,
  setShowInput,
  setSearchContent,
  searchContent
}: showInputType) => {
  const {
    header: { searchBarPlaceholder, cancelBtn }
  } = useIndexContext()
  let content = searchContent
  const handleButtonClick = () => {
    setSearchContent('')
    setShowInput(!showInput)
  }

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setSearchContent(content)
    }
  }
  return (
    <div className="flex w-full">
      <div
        className={`flex w-full items-center gap-1 ${
          !showInput ? 'hidden' : ''
        }`}
      >
        {showInput && (
          <input
            type="text"
            placeholder={searchBarPlaceholder}
            className="input-bordered input flex-grow"
            onBlur={() => {
              if (!content) handleButtonClick()
            }}
            autoFocus
            onChange={e => {
              content = e.target.value
            }}
            onKeyDown={handleEnter}
          />
        )}
        <button onClick={handleButtonClick} className="btn-ghost btn">
          {cancelBtn}
        </button>
      </div>
      <button
        className={`btn-ghost btn-circle btn sm:hidden ${
          showInput ? 'hidden' : ''
        }`}
        onClick={handleButtonClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <div className="form-control hidden sm:block">
        <div className="input-group">
          <input
            type="text"
            placeholder={searchBarPlaceholder}
            className="input-bordered input"
            onChange={e => {
              content = e.target.value
              if (!e.target.value) {
                setSearchContent('')
              }
            }}
            onKeyDown={handleEnter}
          />
          <button
            className="btn-square btn"
            onClick={() => setSearchContent(content)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
