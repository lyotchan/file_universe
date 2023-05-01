import { useTranslation } from 'next-i18next'
import {
  // GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult
} from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LanguageSwitcher from '@/components/LanguageSwitcher'
interface Props {
  _nextI18Next?: {
    initialI18nStore: any
    initialLocale: string
    ns: string[]
    userConfig: any | null
  }
  timeout: Number
}
function HomePage({ timeout }) {
  const { t } = useTranslation(['common', 'index'])
  return (
    <>
      <LanguageSwitcher />
      <h1 className="justify-center text-center align-top text-orange-600 underline">
        {t('common:title') + t('index:title')} {timeout}
      </h1>
    </>
  )
}

export async function getStaticProps({
  locale
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'index'])),
      ...(await new Promise(resolve => {
        setTimeout(() => {
          resolve({ timeout: Math.random() })
        })
      }))
    }
  }
}
// export const getStaticProps: GetStaticProps<Props> = async ({
//   locale
// }: GetStaticPropsContext) => ({
//   props: {
//     ...(await serverSideTranslations(locale ?? 'en', ['common', 'index']))
//   }
// })
export default HomePage
