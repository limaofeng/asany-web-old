import React, { useEffect } from 'react';

import { utils, PageContainer, useSketchComponent } from '@asany/components';

import { history } from 'umi';

const { useReduxSelector } = utils;

export const PortalId = 'com.thuni.his.portal.BasicPortal';

const Portal: React.FC = () => {
  // 门户缓存
  const portalCache = useReduxSelector((state) => state.portal) || {};
  // 当前门户
  const { currentPortal = {} } = portalCache;
  // 生成门户配置展示页面
  const Component = useSketchComponent(currentPortal?.component?.template, currentPortal?.component?.props);

  useEffect(() => {
    if (currentPortal?.type === 'route' && currentPortal?.path?.length > 0) {
      // 获取路由地址
      const path = currentPortal.path[currentPortal.path.length - 1];

      history.push(path);
    }
  }, [currentPortal]);

  return (
    <>
      <PageContainer title="门户" hiddenPanel header={false}>
        <div style={{ padding: '20px 0' }}>{currentPortal?.type === 'config' && <Component />}</div>
      </PageContainer>
    </>
  );
};

export default Portal;
