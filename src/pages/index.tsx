// src/components/FileGrid.tsx
import FileGrid from '@/components/FileGrid'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { useTranslation } from 'next-i18next'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { use, useState } from 'react'
import IndexContext from '@/contexts/IndexContext'
import type { IndexContextType } from '@/lib/types'
interface Props {
  _nextI18Next?: {
    initialI18nStore: any
    initialLocale: string
    ns: string[]
    userConfig: any | null
  }
}

const Home = () => {
  const { t } = useTranslation('common')
  const [searchContent, setSearchContent] = useState('')
  const indexData = t('index', {
    returnObjects: true
  }) as IndexContextType
  return (
    <div className="flex min-h-screen flex-col">
      <IndexContext.Provider value={indexData}>
        <Header
          setSearchContent={setSearchContent}
          searchContent={searchContent}
        />
        <FileGrid searchContent={searchContent} />
        <Footer />
      </IndexContext.Provider>
    </div>
  )
}

export async function getStaticProps({
  locale
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common']))
    }
  }
}
export default Home
