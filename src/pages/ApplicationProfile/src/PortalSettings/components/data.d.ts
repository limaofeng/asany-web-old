export interface IconData {
  color?: string;
  type?: string;
  theme?: string;
}

export interface componentData {
  template?: string;
  props?: any;
}

export interface PortalData {
  id?: string;
  // 门户名称
  name?: string;
  // 适用范围
  viewable?: [];
  // 是否启用
  useable?: boolean;
  // 是否默认
  default?: boolean;
  // 系统
  system?: boolean;
  // 排序
  index?: number;
  // 描述
  description?: string;
  // 创建人
  creator?: string;
  // 修改人
  modifier?: string;
  // 创建时间
  createdAt?: string;
  // 修改时间
  updatedAt?: string;
  // 组件
  component?: componentData;
  // 图标
  icon?: IconData;
  // 类型
  type?: string;
  // 路由地址
  path?: [];
}

export enum PortalTypeEnum {
  // 配置
  CONFIG = 'config',
  // 路由
  ROUTE = 'route',
}
