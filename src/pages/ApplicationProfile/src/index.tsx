import ConfigurationLayout from './layouts/Configuration';
import ConfigurationComponents from './Configuration';
import Applications from './components/Applications/index';
import Thirdpartys from './Thirdparty';
import { TimeRender } from './components/TableRender';
import './index.less';
import ApplicationCard from './Configuration/components/ApplicationCard';

export default {
  id: 'application',
  name: '应用管理',
  components: [
    {
      id: '/Application/layouts/Configuration',
      name: '应用配置布局',
      component: ConfigurationLayout,
    },
    {
      id: 'com.thuni.his.table.column.render.TimeRender',
      tags: ['列表渲染器/时间戳/时间渲染'],
      name: '收件箱详情',
      component: TimeRender,
    },
    ...Thirdpartys,
    ...ConfigurationComponents,
    {
      id: '/Application/layouts/Applications',
      name: '应用中心展示',
      tags: ['布局组件/基础布局/弹出层'],
      component: Applications,
    },
    {
      id: 'com.thuni-h.module.form.Applications',
      name: '应用',
      tags: ['表单布局/组件/应用中心展示'],
      component: Applications,
    },
    {
      id: 'com.thuni-h.module.form.ApplicationsCard',
      name: '应用',
      tags:["基础布局/页面布局/左边栏/应用卡片"],
      component: ApplicationCard,
    },
  ],
};
