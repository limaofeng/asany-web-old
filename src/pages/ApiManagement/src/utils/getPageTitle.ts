import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';

import { title } from '../../config/defaultSettings';

export const matchParamsPath = (pathname, breadcrumbNameMap) => {
  const pathKey = Object.keys(breadcrumbNameMap).find(key =>
    pathToRegexp(key).test(pathname)
  );
  return breadcrumbNameMap[pathKey];
};

const getPageTitle = (pathname, breadcrumbNameMap) => {
  const currRouterData = matchParamsPath(pathname, breadcrumbNameMap);
  if (!currRouterData) {
    return title;
  }
  const pageName = currRouterData.name;
  // const pageName = menu.disableLocal
  // ? currRouterData.name
  // : formatMessage({
  //     id: currRouterData.locale || currRouterData.name,
  //     defaultMessage: currRouterData.name,
  //   });

  return `${pageName}`; // 刘莎改的
  return `${pageName} - ${title}`;
};

export default memoizeOne(getPageTitle, isEqual);
