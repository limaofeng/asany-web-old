// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import pageRoutes from './router.config';
export default defineConfig({
  app: {
    id: process.env.APPID,
  },
  apollo: {
    uri: process.env.GRAPHQL_URL,
  },
  hash: true,
  antd: {},
  mfsu: { production: { output: '.mfsu-production' } },
  dva: {
    hmr: true,
  },
  locale: {},
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: pageRoutes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  define: {
    'process.env.APPID': process.env.APPID,
    'process.env.STORAGE_URL': process.env.STORAGE_URL,
    'process.env.STORAGE_DEFAULT_SPACE': process.env.STORAGE_DEFAULT_SPACE,
    'process.env.GRAPHQL_URL': process.env.GRAPHQL_URL
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack(memo) {
    memo.module
      .rule('raw')
      .test(/\.xls|.xlsx$/)
      .exclude.add(/node_modules/)
      .end()
      .use('raw-loader')
      .loader('raw-loader');
  },
});
