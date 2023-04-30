import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const router = useRouter()

  const changeLanguage = async (lang: string) => {
    // await i18n.changeLanguage(lang) // only change the languge, do not update the url
    localStorage.setItem('userLanguage', lang)
    const { pathname, asPath, query } = router
    console.log(pathname, asPath, query)
    router.replace({ pathname, query }, asPath, { locale: lang })
  }

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <Link
        onClick={() => localStorage.setItem('userLanguage', 'zh')}
        href="/trans"
        locale="zh"
        replace
      >
        <button>chinese</button>
      </Link>
    </div>
  )
}

export default LanguageSwitcher
