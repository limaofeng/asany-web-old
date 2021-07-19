import { PortalTypeEnum } from '../components/data.d';

export const PortalTypeList = [
  { value: PortalTypeEnum.CONFIG, name: '自定义门户' },
  { value: PortalTypeEnum.ROUTE, name: '路由门户' },
];

export const getRouteTree = (
  rootRouteId: string,
  routes: Array<any>,
  filter: boolean,
): Array<any> => {
  let validRoutes = routes;
  if (filter) {
    // 过滤 enabled: true, hideInMenu: false, type: menu, route
    validRoutes = routes.filter(
      (e) => e.enabled && !e.hideInMenu && ['menu', 'route'].includes(e.type),
    );
  }

  if (validRoutes.length === 0) {
    return [];
  }

  return validRoutes
    .filter((e) => e?.parent?.id === rootRouteId)
    .map((e) => ({
      value: e.path,
      label: e.name,
      children: getRouteTree(e.id, validRoutes, false),
    }));
};
