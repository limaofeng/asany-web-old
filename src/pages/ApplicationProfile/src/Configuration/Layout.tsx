import { withApollo } from '@apollo/client/react/hoc';
import { AppManager, EnvironmentManager, LibraryManager } from '@asany/components';
import { IRoute } from '@asany/components/lib/app-manager/AppManager';
import { useReduxSelector } from '@asany/components/lib/utils';
import { Card, message, Radio, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import { DEFAULT_MODULE_IMG } from '../base/consts';
import ComponentSketch from '../components/ComponentSketch';
import { updateRoute as UPDATE_ROUTE } from '../gqls/routes.gql';

const getLayoutComponents = () =>
  LibraryManager.getComponentsByTag('布局组件').filter((item) => item.component);

interface LayoutComponentsProps {
  /** 所有的登录组件 */
  components: any[];
  /** 当前的组件id */
  template: string;
  onChange: (id: string) => void;
}

function LayoutStyleComponents(props: LayoutComponentsProps) {
  const { components, template, onChange } = props;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {components.map((item: any) => (
        <div key={item.id} style={{ margin: '8px' }}>
          <Card
            hoverable
            style={{ width: 120 }}
            cover={
              <img
                style={{
                  width: '120px',
                }}
                alt="example"
                src={DEFAULT_MODULE_IMG}
              />
            }
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>{item.name}</div>
              <Radio onClick={() => onChange(item.id)} checked={template === item.id} />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}

interface LayoutProps {
  location: any;
  client: any;
  route: IRoute;
}

function Layout(props: LayoutProps) {
  const { location, client } = props;
//TODO: 旧版逻辑
  // useEffect(() => {
  //   const env = EnvironmentManager.currentEnvironment();
  //   let route = props.route;
  //   const parents = [route];
  //   while (route.parent) {
  //     route = route.parent;
  //     parents.push(route);
  //   }
  //   const [layoutRoute] = parents.slice(parents.length - 2, parents.length - 1);
  //   env.set('routing.route', layoutRoute);
  //   console.log('布局数据>>>>parents',parents,layoutRoute)
  // }, [props.route]);
  // const sourceData = location?.state?.data || {};
  const sourceData = useReduxSelector((state) => state.global.application);
  const state = useReduxSelector((state) => state);
  const { layoutRoute } = sourceData;

  // 当前 登陆组件 id
  const [layoutComponent, setLayoutComponent] = useState(layoutRoute!.component || {});

  const [layoutConfigVisible, setLayoutConfigVisible] = useState<boolean>(false);

  const layoutComponents = getLayoutComponents();

  const handleLayoutComponentChange = (template: string) => {
    setLayoutComponent({
      ...layoutComponent,
      template,
    });
  };

  const handleConfigurationComponent = () => {
    if (!layoutComponent?.template) {
      message.warning('请选择布局风格');
      return;
    }
    if (!layoutComponents.some((x) => x.id === layoutComponent.template)) {
      console.log(layoutComponents, layoutComponent.template);
      message.warning('当前布局风格已不存在，请重新选择');
      return;
    }
    setLayoutConfigVisible(true);
  };

  const handleLayoutConfigurationClose = () => setLayoutConfigVisible(false);

  const handleLayoutConfigurationChange = async (layoutComponentParams: any) => {
    const uploadComponentParams =
      //   {
      //   template: layoutComponent.template,
      //   props: []
      // } ||
      layoutComponentParams.data || {
        template: layoutComponent.template,
      };
    const { data } = await client.mutate({
      mutation: UPDATE_ROUTE,
      variables: {
        id: layoutRoute.id,
        input: { component: uploadComponentParams },
      },
    });

    AppManager.updateRoute(data.route);
    
    setLayoutComponent({
      ...layoutComponent,
      ...uploadComponentParams,
    });
    handleLayoutConfigurationClose();
  };

  const componentInfo = {
    name: layoutComponents.find((x) => x.id === layoutComponent.template)?.name || '组件名',
    template: layoutComponent.template || '',
    props: layoutComponent.props,
  };
  return (
    <>
      <Space direction="vertical">
        <Space>
          <div>选择布局风格:</div>
          <div className="login-config">
            <LayoutStyleComponents
              components={layoutComponents}
              template={layoutComponent?.template || ''}
              onChange={handleLayoutComponentChange}
            />
          </div>
        </Space>
        <Space>
          <a onClick={handleConfigurationComponent}>配置风格</a>
        </Space>
      </Space>

      {
        // TODO 传递出多倍数据,暂时重新建立组件解决
        layoutConfigVisible && (
          <ComponentSketch
            componentInfo={componentInfo}
            onClose={handleLayoutConfigurationClose}
            onChange={handleLayoutConfigurationChange}
            visible={layoutConfigVisible}
          />
        )
      }
    </>
  );
}

// @ts-ignore
export default withApollo(Layout);
