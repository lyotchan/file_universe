import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
}

const SEO = ({ title, description, keywords }: SEOProps) => {
  const defaultTitle = 'My Website'
  const defaultDescription = 'This is the default description for my website.'
  const defaultKeywords = 'default, keywords, nextjs'

  return (
    <Head>
      <title>{title ? title : defaultTitle}</title>
      <meta
        name="description"
        content={description ? description : defaultDescription}
      />
      <meta name="keywords" content={keywords ? keywords : defaultKeywords} />
      {/* 其他全局元信息 */}
    </Head>
  )
}

export default SEO
