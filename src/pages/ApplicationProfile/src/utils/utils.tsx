import { parse, stringify } from 'qs';

 import { Form } from '@ant-design/compatible';
import React from 'react';
import moment from 'moment';
// import nzh from 'nzh/cn';

export function fixedZero(val: any) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type: string) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList: any[], parentPath = '') {
  const arr: any[] = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export const sleep = (time: number) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });

// export function digitUppercase(n) {
//   return nzh.toMoney(n);
// }

function getRelation(str1: string, str2: string) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes: any[]) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path: string, routerData: any) {
  let routes = Object.keys(routerData).filter(routePath => routePath.indexOf(path) === 0 && routePath !== path);
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path: string) {
  return reg.test(path);
}

export function formatWan(val: any) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url: string, name: string) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });

const parentId = (data: any, pidKey: string) => {
  let value = data;
  pidKey.split('.').forEach(item => {
    if (!value) {
      return;
    }
    value = value[item];
  });
  return value;
};

export function tree<T>(
  list: T[],
  {
    idKey = 'id',
    pidKey = 'parent_id',
    childrenKey = 'children',
    getParentKey = (data: any) => parentId(data, pidKey),
    converter = (item: T) => item,
    sort = undefined,
  }: any
) {
  const start = new Date().getTime();
  try {
    // eslint-disable-next-line no-param-reassign
    list = list && list.map(converter);
    const roots =
      list &&
      list.filter(item => {
        if (getParentKey(item)) {
          const parent = list.find(x => (x as any)[idKey].toString() === getParentKey(item).toString());
          if (!parent) {
            return true;
          }
          if (!(parent as any)[childrenKey]) {
            (parent as any)[childrenKey] = [];
          }
          const children = (parent as any)[childrenKey];
          children.push(item);
          if (sort) {
            (parent as any)[childrenKey] = children.sort(sort);
          }
          return false;
        }
        return true;
      });
    return sort ? roots.sort(sort) : roots;
  } finally {
    console.log('list -> tree 耗时', new Date().getTime() - start, 'ms');
  }
}

export const getFieldsValue = (data: any, fields: any) => {
  const keys = new Set(Object.keys(data).concat(Object.keys(fields)));
  keys.forEach(key => {
    if (fields[key]) {
      // eslint-disable-next-line no-param-reassign
      fields[key] = fields[key](data);
    } else {
      // eslint-disable-next-line no-param-reassign
      fields[key] = data[key];
    }
  });
  return fields;
};

export const generateFormFields = (data: any, fields: any) => {
  const keys = new Set(Object.keys(data).concat(Object.keys(fields)));
  keys.forEach(key => {
    if (fields[key]) {
      // eslint-disable-next-line no-param-reassign
      fields[key] = fields[key](data);
    } else {
      // eslint-disable-next-line no-param-reassign
      fields[key] = data[key];
    }
    // eslint-disable-next-line no-param-reassign
    fields[key] = Form.createFormField({
      value: fields[key],
    });
  });
  return fields;
};

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function parseQuery(query: any) {
  if (query.page) {
    // eslint-disable-next-line radix,no-param-reassign
    query.page = parseInt(query.page);
  }
  return query;
}

export function urlToList(url: string) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}
