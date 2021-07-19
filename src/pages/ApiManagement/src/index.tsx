import ModuleManagement from './ModuleManagement';
import GenreManagement from './GenreManagement';
import ServiceManagement from './ServiceManagement';
import ApiEntrust from './ApiEntrust';
import Administration from './Administration';
import PropertyManagement from './PropertyManagement';
import InstructManagement from './InstructManagement';

export default {
  id: "ApiManagement",
  name: "API管理",
  components: [
    {
      id: "net.whir.hos.api.InstructManagement",
      name: "指令管理",
      component: InstructManagement
    },
    {
      id: "net.whir.hos.api.ModuleManagement",
      name: "分类管理",
      component: ModuleManagement
    },
    {
      id: "net.whir.hos.api.GenreManagement",
      name: "类型管理",
      component: GenreManagement
    },
    {
      id: "net.whir.hos.api.PropertyManagement",
      name: "属性管理",
      component: PropertyManagement
    },
    {
      id: "net.whir.hos.api.ServiceManagement",
      name: "服务管理",
      component: ServiceManagement
    },
    {
      id: "net.whir.hos.api.ApiEntrust",
      name: "API委托",
      component: ApiEntrust
    },
    {
      id: "net.whir.hos.api.Administration",
      name: "API管理",
      component: Administration
    },
  ]
};
