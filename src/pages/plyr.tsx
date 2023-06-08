import Plyr from '@/components/Plyr'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
interface Props {
  _nextI18Next?: {
    initialI18nStore: any
    initialLocale: string
    ns: string[]
    userConfig: any | null
  }
  query: {
    routes: string
  }
}
type ExtendedGetStaticPropsContext = GetStaticPropsContext & {
  query: { routes: string }
}
const WatchVideo = ({ _nextI18Next, query }: Props) => {
  console.log(_nextI18Next, query)
  return (
    <div className="flex h-full flex-col">
      <div className="navbar bg-base-100">
        <a className="btn-ghost btn text-xl normal-case">daisyUI</a>
      </div>
      <div className="container mx-auto flex flex-1 items-center px-0 md:px-4">
        <Plyr videoId={query.routes} />
      </div>
      <footer className="footer footer-center mt-auto bg-base-300 p-4 text-base-content">
        <div>
          <p>Copyright © 2023 - All right reserved by ACME Industries Ltd</p>
        </div>
      </footer>
    </div>
  )
}

export async function getServerSideProps({
  locale,
  query
}: ExtendedGetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      query
    }
  }
}

export default WatchVideo
