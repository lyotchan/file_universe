const path = require('path')
module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en',
    locales: ['zh', 'en']
  },
  localeSubpaths: 'all', // 为所有语言（包括默认语言）设置子路径
  localePath:
    typeof window === 'undefined'
      ? path.resolve('./public/locales')
      : '/public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development'
  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  // saveMissing: false,
  // strictMode: true,
  // serializeConfig: false,
  // react: { useSuspense: false }
}
