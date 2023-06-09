import '@/styles/globals.css'
import 'plyr/dist/plyr.css'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { ThemeProvider } from '../contexts/ThemeContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import store from '../store'
function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('userLanguage')
      const userPreferredLanguage =
        storedLanguage || window.navigator.language.slice(0, 2)

      if (
        router.locale !== userPreferredLanguage &&
        router.locales?.includes(userPreferredLanguage) // 使用可选链操作符
      ) {
        router.replace(router.asPath, undefined, {
          locale: userPreferredLanguage
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  )
}
export default appWithTranslation(App)
// export function reportWebVitals(metric) {
//   console.log(metric)
// }
