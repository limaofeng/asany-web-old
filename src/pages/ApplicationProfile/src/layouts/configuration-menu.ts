/**
 * 路由 目录配置
 */

const PREFIX_URL = '' ?? '/manage';

export const configurationMenus = [
  {
    id: 'portal',
    name: '门户设置',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/portal`,
  },
  {
    id: 'information',
    name: '基础信息',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/information`,
  },
  {
    id: 'organization',
    name: '组织架构',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/organization`,
  },
  {
    id: 'notification',
    name: '通知设置',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/notification`,
  },
  {
    id: 'login',
    name: '登录设置',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/login`,
  },
  {
    id: 'layout',
    name: '布局设置',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/layout`,
  },
  {
    id: 'module',
    name: '模块配置',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/modules`,
  },
  {
    id: 'routes',
    name: '路由配置',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/routes`,
  },
  {
    id: 'publish',
    name: '应用发布',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/publish`,
  },
  {
    id: 'forgetPsd',
    name: '忘记密码',
    icon: 'demo-pli-mine',
    group: 'app',
    url: `${PREFIX_URL}/application/configuration/forgetPsd`,
  },
  {
    id: 'thirdPartyIntegration',
    name: '第三方集成',
    icon: 'demo-pli-mine',
    group: 'thirdParty',
    url: `${PREFIX_URL}/application/configuration/thirdparty`,
  },
  {
    id: 'ding',
    name: '集成钉钉',
    icon: 'demo-pli-mine',
    group: 'dingtalk',
    url: `${PREFIX_URL}/application/configuration/ding`,
  },
  {
    id: 'maillist',
    name: '通讯录同步',
    icon: 'demo-pli-mine',
    group: 'dingtalk',
    url: `${PREFIX_URL}/application/configuration/maillist`,
  },
  {
    id: 'oa',
    name: '集成EZOFFICE',
    icon: 'demo-pli-mine',
    group: 'ezoffice',
    url: `${PREFIX_URL}/application/configuration/oa`,
  },
  {
    id: 'oamaillist',
    name: 'EZOFFICE通讯录同步',
    icon: 'demo-pli-mine',
    group: 'ezoffice',
    url: `${PREFIX_URL}/application/configuration/oamaillist`,
  },
];
