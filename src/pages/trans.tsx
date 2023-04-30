import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LanguageSwitcher from '@/components/LanguageSwitcher'
function HomePage() {
  const { t } = useTranslation(['common', 'index'])
  return (
    <>
      <LanguageSwitcher />
      <h1>{t('common:title') + t('index:title')}</h1>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'index']))
    }
  }
}

export default HomePage
