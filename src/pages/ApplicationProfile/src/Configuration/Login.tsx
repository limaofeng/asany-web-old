// eslint-disable-next-line import/no-extraneous-dependencies
import {withApollo} from '@apollo/client/react/hoc';
import {Card, message, Radio, Row, Space, Switch} from 'antd';
import React, {useEffect, useState} from 'react';
import {updateRoute as UPDATE_ROUTE} from
    '../gqls/routes.gql';
import './style/Login.less'
import ComponentSketch from "../components/ComponentSketch";
import {DEFAULT_MODULE_IMG} from "../base/consts";
import { useReduxSelector } from '@asany/components/lib/utils';

const getLoginComponents = () => [
  { id: 'com.thuni.him.base.login.BasicLogin', name: '基础登陆' }
];


interface LoginComponentsProps {
  /** 所有的登录组件 */
  components: any[];
  /** 当前的组件id */
  template: string;
  onChange: (id: string) => void;
}

function LoginStyleComponents(props: LoginComponentsProps) {
  const { components, template, onChange } = props
  return (<div style={{ display: "flex", flexWrap: 'wrap' }}>
    {
      components.map((item: any) => (
        <div key={item.id} style={{ margin: '8px' }}>
          <Card
            hoverable
            style={{ minWidth: 120 }}
            cover={
              <img
                style={{
                  width: '120px'
                }}
                alt="example"
                src={DEFAULT_MODULE_IMG}
              />
            }
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>

              <div>{item.name}</div>
              <Radio
                onClick={() => onChange(item.id)}
                checked={template === item.id}
              />
            </div>
          </Card>
        </div>))
    }
  </div>)
}


interface LoginProps {
  location: any;
  client: any;
}

interface LoginComponentParams {
  id: string;
  template: string;
  props: any;
}

function Login(props: LoginProps) {
  const { location, client } = props
  // const sourceData = location?.state?.data || {}
  const sourceData = useReduxSelector(state => state.global.application)
  const [data, setData] = useState({});
  console.log('sourceData',sourceData)
  useEffect(() => {
    setData(sourceData)
  })
  // 当前 登陆组件 id
  const [loginComponent, setLoginComponent] = useState<LoginComponentParams>(sourceData?.loginRoute?.component)

  const [loginConfigVisible, setLoginConfigVisible] = useState<boolean>(false)

  const loginComponents = getLoginComponents();

  const handleConfigurationComponent = () => {
    if (!loginComponent?.template) {
      message.warning('请选择登录页布局')
      return;
    }
    if (!loginComponents.some(x => x?.id === loginComponent.template)) {
      message.warning('当前登陆页布局已经不存在，请重新选择')
      return;
    }
    setLoginConfigVisible(true)
  }


  const handleEnableChange = async (enabled: boolean) => {
    const { refetch } = location!.state;
    const { loginRoute } = data;
    await client.mutate({
      mutation: UPDATE_ROUTE,
      variables: {
        id: loginRoute.id,
        input: {
          enabled
        },
      },
    });
    message.success(`${enabled ? '启用' : '禁用'}登录成功`)
    await refetch();
    setData(location!.state.data)
  };

  const handleLoginConfigurationClose = () => setLoginConfigVisible(false)

  const handleLoginComponentChange = (template: string) => {
    setLoginComponent({
      ...loginComponent,
      template
    })
  }


  const loginRoute = data.loginRoute || { enabled: false };

  const handleLoginConfigurationChange = async (loginComponentParams: any) => {
    const uploadComponentParams = loginComponentParams.data || {
      template: loginComponent?.template
    }
    await client.mutate({
      mutation: UPDATE_ROUTE,
      variables: {
        id: loginRoute.id,
        input: {
          component: uploadComponentParams,
        }
      },
    });
    setLoginComponent({ ...loginComponent, ...uploadComponentParams })
    handleLoginConfigurationClose()
  }

  const componentInfo = {
    name: loginComponents.find(x => x.id === loginComponent.template)?.name || '组件名',
    template: loginComponent.template || '',
    props: loginComponent.props
  }
  return (
    <Space
      direction="vertical"
      size="middle"
    >
      <Row>
        <Space>
          <div
            className="pad-hor text-main text-sm text-uppercase text-bold">
            启用登录
          </div>
          <Switch
            checkedChildren="启用"
            unCheckedChildren="关闭"
            onChange={handleEnableChange}
            checked={loginRoute.enabled}
          />
        </Space>
      </Row>
      {loginRoute.enabled && (
        <Space direction='vertical'>
          <Space>
            <div>登录地址:</div>
            <span>{loginRoute.path} </span>
          </Space>
          <Space>
            <div>选择登录页风格:</div>
            <div className='login-config'>
              <LoginStyleComponents
                components={loginComponents}
                template={loginComponent?.template || ''}
                onChange={handleLoginComponentChange}
              />
            </div>
          </Space>
          <Space>
            <a
              onClick={handleConfigurationComponent}
            >配置登录风格</a>
          </Space>
        </Space>
      )}
      {
        // TODO 传递出多倍数据,暂时重新建立组件解决
        loginConfigVisible && <ComponentSketch
          componentInfo={componentInfo}
          onClose={handleLoginConfigurationClose}
          onChange={handleLoginConfigurationChange}
          visible={loginConfigVisible}
        />
      }
    </Space>
  );
}

// @ts-ignore
export default withApollo(Login);
