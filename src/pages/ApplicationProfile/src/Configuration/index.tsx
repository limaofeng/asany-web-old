import BasicInformation from './BasicInformation';
import Organization from './Organization';
import Layout from './Layout';
import Login from './Login';
import Route from './Route';
import Publish from './Publish';
import Cases from './Cases';
import ThirdParty from './ThirdParty';
import Portal from './Portal';

// import Settings from './Settings';

export default [
  {
    id: '/Application/Configuration/Portal',
    name: '应用配置-门户设置',
    component: Portal,
  },
  {
    id: '/Application/Configuration/BasicInformation',
    name: '应用配置-基本信息',
    component: BasicInformation,
  },
  {
    id: '/Application/Configuration/Organization',
    name: '应用配置-组织架构',
    component: Organization,
  },
  {
    id: '/Application/Configuration/Login',
    name: '应用配置-登录',
    component: Login,
  },
  {
    id: '/Application/Configuration/Layout',
    name: '应用配置-布局',
    component: Layout,
  },
  {
    id: '/Application/Configuration/ThirdParty',
    name: '应用配置-第三方集成',
    component: ThirdParty,
  },
  {
    id: '/Application/Configuration/Module',
    name: '应用配置-模块',
    component: Cases,
  },
  {
    id: '/Application/Configuration/Route',
    name: '应用配置-路由',
    component: Route,
  },
  {
    id: '/Application/Configuration/Publish',
    name: '应用配置-发布',
    component: Publish,
  },
  // {
  //   id: '/Application/Configuration/Settings',
  //   name: '应用配置-应用设置',
  //   component: Settings,
  // },
];
