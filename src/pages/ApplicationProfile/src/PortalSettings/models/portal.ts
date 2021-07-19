import { Effect, Reducer } from 'umi';

import { routerRedux } from 'dva';

import { Dispatch } from 'redux';

import {
  queryPortalRoutes as QUERY_PORTAL_ROUTES,
  queryPortals as QUERY_PORTALS,
} from '../../gqls/portal.gql';

import { PortalData } from '../components/data.d';

export interface IconData {
  color?: string;
  type?: string;
  theme?: string;
}

export interface componentData {
  id?: string;
  template?: string;
  props?: any;
}

const { client } =
  process.env.NODE_ENV === 'development'
    ? require('@/.umi/apollo')
    : require('@/.umi-production/apollo');

// 查询门户路由数据
const queryPortalRoutes = async (applicationId: string) => {
  const {
    data: { routes },
  } = await client.query({
    query: QUERY_PORTAL_ROUTES,
    variables: {
      filter: {
        applicationId,
        type: 'portal',
      },
    },
  });

  return routes || [];
};

// 查询门户数据
const queryPortals = async (applicationId: string) => {
  const {
    data: { portals },
  } = await client.query({
    query: QUERY_PORTALS,
    variables: {
      applicationId,
    },
  });

  return portals || [];
};

export interface PortalModelState {
  // 所有门户数据
  allPortals?: PortalData[];
  // 有效门户数据（可用的、范围内的）
  validPortals?: PortalData[];
  // 系统默认门户数据
  systemPortal?: PortalData;
  // 当前门户数据
  currentPortal?: PortalData;
  // 门户路由数据
  portalRoute?: any;
}

export interface PortalModelType {
  namespace: 'portal';
  state: PortalModelState;
  effects: {
    load: Effect;
    validPortals: Effect;
    changePortal: Effect;
    redirect: Effect;
  };
  reducers: {
    savePortals: Reducer<PortalModelState>;
  };
  subscriptions: {
    init: any;
    listen: any;
  };
}

const PortalModel: PortalModelType = {
  namespace: 'portal',

  state: {
    allPortals: [],
    validPortals: [],
    systemPortal: undefined,
    currentPortal: undefined,
    portalRoute: undefined,
  },

  effects: {
    // 初始化
    *load({ payload: applicationId }: any, { call, put, select }: any) {
      // 获取门户路由数据
      // const portalRoutes = yield call(queryPortalRoutes, applicationId);

      // 没有数据，终止操作
      // if (portalRoutes.length === 0) {
      //   return;
      // }
      // 获取门户数据
      // const allPortals = yield call(queryPortals, applicationId);

      // yield put({
      //   type: 'savePortals',
      //   payload: {
      //     allPortals,
      //     validPortals: allPortals.filter((e: PortalData) => e.useable),
      //     systemPortal: allPortals.find((e: PortalData) => e.system),
      //     // 默认为系统门户
      //     currentPortal: allPortals.find((e: PortalData) => e.system),
      //     // 只取第一条数据
      //     portalRoute: portalRoutes[0],
      //   },
      // });

      // 加载门户
      // const state = yield select((state: any) => state?.auth?.currentUser);

      // yield put({
      //   type: 'changePortal',
      //   payload: state ? state.portalId : '',
      // });
    },

    // 加载有效门户
    *validPortals({ payload: user }: any, { select, put }: any) {
      // 获取所有门户
      const allPortals = yield select((state: any) => state.portal.allPortals);
      // 获取启用的
      const useablePortals = allPortals.filter((e: PortalData) => e.useable);
      // 范围内的
      // TODO
      yield put({
        type: 'savePortals',
        payload: {
          validPortals: useablePortals,
        },
      });
    },

    // 切换门户
    *changePortal({ payload: portalId }: any, { select, put }: any) {
      // 获取所有门户
      // const allPortals = yield select((state: any) => state.portal.allPortals);
      // 查找门户
      // let portal = allPortals.find((e: PortalData) => e.id === portalId);

      // if (!portal) {
      //   // 默认系统门户
      //   portal = yield select((state: any) => state.portal.systemPortal);
      // }
      yield console.log('todo: 为什么会执行到这??');
      // 拷贝数据，深拷贝
      // const copyPortal = JSON.parse(JSON.stringify(portal));

      // yield put({
      //   type: 'savePortals',
      //   payload: {
      //     currentPortal: copyPortal,
      //   },
      // });
    },

    // 重定向
    *redirect(_: any, { select, put }: any) {
      // 获取门户路由数据
      const portalRoute = yield select((state: any) => state.portal.portalRoute);

      if (portalRoute && portalRoute.path) {
        yield put(routerRedux.replace(portalRoute.path));
      } else {
        yield put(routerRedux.replace('/home'));
      }
    },
  },

  reducers: {
    savePortals(state: PortalModelState, { payload }: any) {
      return { ...state, ...payload };
    },
  },

  subscriptions: {
    async init({ dispatch }: { dispatch: Dispatch }) {
      dispatch({ type: 'load', payload: process.env.APPID });
    },

    async listen({ dispatch, history }: any) {
      return history.listen(({ pathname }: any) => {
        if (pathname === '/') {
          dispatch({ type: 'redirect' });
        }
      });
    },
  },
};

export default PortalModel;
