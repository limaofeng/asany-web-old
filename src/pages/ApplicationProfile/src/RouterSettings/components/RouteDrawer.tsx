// eslint-disable-next-line max-classes-per-file
import { LibraryManager, IconSelect, ComponentPicker } from '@asany/components';
import { generateFormFields } from '../../utils/utils';
import { Button, Cascader, Drawer, Input, message, Select, Spin } from 'antd';
import { isEqual } from 'lodash';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Mutation } from '@apollo/client/react/components';
import { Form } from '@ant-design/compatible';
import { createRoute as CREATE_ROUTES, updateRoute as UPDATE_ROUTE } from '../../gqls/routes.gql';
import '../assets/treeSettings.less';
import ComponentSketch from '../../components/ComponentSketch';
import PersonnelAuth from './PersonnelAuth';
import '../style/RouterDrawer.less';
import { AppManager } from '@asany/components';

const { Option } = Select;

interface RouteFormProps {
  data?: any;
  libraries: any[];
  organization: any;
  submit: (input: any) => any;
  onSuccess: (value: any) => void;
  onClickConfiguration: (value: any) => void;

  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
enum routeType {
  ROUTE = 'route',
  MENU = 'menu',
  HEADER = 'header',
  DIVIDER = 'divider',
}

interface ComponentStatus {
  id?: string;
  props?: any[];
  template: string;
  routeWrapper?: {
    template: string;
    props?: [];
  };
}

class RouteForm extends React.Component<
  RouteFormProps,
  { showComponentSketch: boolean; component?: any }
> {
  state = {
    showComponentSketch: false,
    icon: {} as any,
  };

  componentDidMount() {
    const { data } = this.props;
    const icon = data?.icon
      ? {
          type: data.icon || '',
          theme: 'Outlined',
        }
      : {};
    this.setState({ icon });
  }

  componentWillReceiveProps(nextProps: Readonly<RouteFormProps>) {
    if (nextProps.data.icon !== this.state.icon) {
      const icon = nextProps.data?.icon
        ? {
            type: nextProps.data.icon || '',
            theme: 'Outlined',
          }
        : {};
      this.setState({ icon });
    }
  }

  handleIconSet = (data: any) => this.setState({ icon: data || {} });

  handleConfigurationClose = () => {
    this.setState({
      showComponentSketch: false,
      component: null,
    });
  };

  handleReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
  };

  handleClickConfiguration = (
    template: string,
    name: string,
    props: any,
    onChange: (project: any) => void,
  ) => () => {
    this.setState({
      showComponentSketch: true,
      component: { template, name, props, onChange },
    });
  };

  handleComponentData = (data: any) => {
    const { componentProps, component, componentWrap, routeWrapperProps } = data;
    let componentStatus: ComponentStatus = {} as ComponentStatus;
    // 获取当前选择的模版 template
    const template = component && Array.isArray(component) ? component[component.length - 1] : '';
    // 获取配置的模版
    const propTemplate = componentProps?.data?.template || '';

    if (componentProps && propTemplate !== template) {
      componentStatus.template = template;
    } else {
      // 如果没有 props 或者 id 相等，不进行操作
      componentStatus = {
        ...(componentProps?.data || {}),
        template,
      };
    }

    if (componentWrap) {
      componentStatus = {
        ...componentStatus,
        routeWrapper: {
          template: componentWrap,
          props: routeWrapperProps,
        },
      };
    }
    return componentStatus;
  };

  handleSave = () => {
    const { data, submit, onSuccess } = this.props;
    const { validateFields } = this.props.form;
    validateFields(async (error: any, values: any) => {
      if (error) {
        return;
      }
      const componentStatus = this.handleComponentData(values);
      const input = {
        name: values.name,
        icon: this.state.icon.type || '',
        type: values.type,
        path: (data.parentPath || '') + (values.currentPath || ''),
        component: { ...componentStatus },
        parentRoute: data.parent ? data.parent.id : undefined,
        hideInMenu: values.hideInMenu === 'true',
        hideInBreadcrumb: values.hideInBreadcrumb === 'true',
        redirect: values.redirect,
        hideChildrenInMenu: values.hideChildrenInMenu === 'true',
        authority: values.authority,
      };
      // 如果当前选项不是路由,去除组建的 component 属性，否则当模块是菜单时，子路由无法使用
      if (input.type !== routeType.ROUTE) {
        input.component = {} as any;
      }
      console.log('wp-input', input);
      const {
        data: { route },
      } = await submit(input);
      message.success('保存成功');
      onSuccess(route);
    });
  };

  render() {
    const { data, libraries, organization } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const leaf = !(data.routes && data.routes.length);
    const componentId = (getFieldValue('component') || []).length && getFieldValue('component')[1];
    const componentWrap = getFieldValue('componentWrap');
    const componentName = getFieldValue('name') || '';
    getFieldDecorator('componentProps');
    getFieldDecorator('routeWrapperProps');
    const component = data.component;
    const routeWrapper = component && component.routeWrapper;
    return (
      <Form
        className="formSettings router-setting"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item label="菜单显示名称">
          {getFieldDecorator('name', {
            initialValue: getFieldValue('name'),
          })(<Input placeholder="请输入名称" />)}
        </Form.Item>
        <Form.Item label="菜单显示图标">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconSelect value={this.state.icon} onChange={this.handleIconSet} />
          </div>
        </Form.Item>

        <Form.Item label="是否隐藏菜单：">
          {getFieldDecorator('hideInMenu', {
            initialValue: getFieldValue('hideInMenu'),
          })(
            <Select style={{ width: 160, height: 30 }}>
              <Option value="true">是</Option>
              <Option value="false">否</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="是否在面包屑中隐藏：">
          {getFieldDecorator('hideInBreadcrumb', {
            initialValue: getFieldValue('hideInBreadcrumb'),
          })(
            <Select style={{ width: 160, height: 30 }}>
              <Option value="true">是</Option>
              <Option value="false">否</Option>
            </Select>,
          )}
        </Form.Item>
        {!leaf && (
          <Form.Item label="是否隐藏子菜单：">
            {getFieldDecorator('hideChildrenInMenu', {
              initialValue: getFieldValue('hideChildrenInMenu'),
            })(
              <Select style={{ width: 160, height: 30 }}>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
              </Select>,
            )}
          </Form.Item>
        )}

        <Form.Item label="类型">
          {getFieldDecorator('type', {
            initialValue: getFieldValue('type'),
          })(
            <Select
              style={{
                width: 160,
                height: 30,
              }}
            >
              <Option value={routeType.ROUTE}>路由</Option>
              <Option value={routeType.MENU}>菜单</Option>
              <Option value={routeType.HEADER}>标题</Option>
              <Option value={routeType.DIVIDER}>分割符</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="权限" style={{ marginBottom: 10 }}>
          {getFieldDecorator('authority', {
            initialValue: getFieldValue('authority'),
          })(<PersonnelAuth organization={organization && organization.id} />)}
        </Form.Item>
        <Form.Item label="路由">
          {getFieldDecorator('currentPath', {
            initialValue: getFieldValue('currentPath'),
          })(<Input addonBefore={data.parentPath} type="text" />)}
        </Form.Item>

        <Form.Item label="重定向">
          {getFieldDecorator('redirect', {})(<Input type="text" />)}
        </Form.Item>
        <Form.Item label="组件">
          {getFieldDecorator('component', {
            initialValue: getFieldValue('component'),
          })(<Cascader options={libraries} expandTrigger="hover" />)}
          {!!componentId && (
            <div
              className="btn-config"
              onClick={this.handleClickConfiguration(
                componentId,
                '',
                (component && component.props) || [],
                (project: any) => {
                  setFieldsValue({
                    componentProps: project,
                  });
                },
              )}
            >
              配置组件
            </div>
          )}
        </Form.Item>
        <Form.Item label="组件容器">
          {getFieldDecorator('componentWrap', {
            initialValue: getFieldValue('componentWrap'),
          })(<ComponentPicker tagPrefix="页面容器" />)}
          {!!componentWrap && (
            <div
              className="btn-config"
              onClick={this.handleClickConfiguration(
                componentWrap,
                '页面容器',
                (routeWrapper && routeWrapper.props) || [],
                (project: any) => {
                  setFieldsValue({
                    routeWrapperProps: project.data.props,
                  });
                },
              )}
            >
              配置组件
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <Button onClick={this.handleReset}>重置</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.handleSave}>
            保存
          </Button>
        </Form.Item>
        <ComponentSketch
          componentInfo={this.state.component!}
          onClose={this.handleConfigurationClose}
          onChange={(data: any) => {
            this.state.component!.onChange(data);
            this.handleConfigurationClose();
          }}
          visible={this.state.showComponentSketch}
        />
      </Form>
    );
  }
}

const formSettings = {
  name: 'router-config',
  mapPropsToFields: (props: any): any => {
    const data = props.data || {};
    data.parentPath = data.parent && data.parent.path;
    const fields = {
      parent: (item: any) => item.parent && item.parent.id,
      hideInMenu: (item: any) => (item.hideInMenu ? 'true' : 'false'),
      hideChildrenInMenu: (item: any) => (item.hideInMenu ? 'true' : 'false'),
      hideInBreadcrumb: (item: any) => (item.hideInBreadcrumb ? 'true' : 'false'),
      currentPath: (item: any) =>
        item.path ? item.path.replace(new RegExp(`^${data.parentPath}`), '') : undefined,
      componentProps: (item: any) => {
        let { props, template, id } = item.component || {};
        return { data: { props, template } };
      },
      componentWrap: (item: any) => {
        let component: any;
        if (item.component && item.component.routeWrapper) {
          component = LibraryManager.getComponent(item.component.routeWrapper.template);
        }
        return component ? component!.id : undefined;
      },
      component: (item: any) => {
        let component: any;
        if (item.component) {
          if (typeof item.component === 'string') {
            component = LibraryManager.getComponent(item.component);
          } else if (item.component.template) {
            component = LibraryManager.getComponent(item.component.template);
          }
        }
        return component ? [component!.library!.id, component!.id] : undefined;
      },
    };
    return generateFormFields(data, fields);
  },
};

const RouteFormCreate = Form.create(formSettings)((props: any) => {
  const { applicationId: application} = props;
  
  const submit = (createRoute: any) => (input: any) =>
    createRoute({
      variables: {
        application,
        input:{
          ...input,
          "protocol":"web",
        },
      },
    });
  return (
    <Mutation mutation={CREATE_ROUTES}>
      {(createRoute: any, { loading }: any): any => (
        <Spin spinning={loading}>
          <RouteForm {...props} submit={submit(createRoute)} />
        </Spin>
      )}
    </Mutation>
  );
});

const RouteFormUpdate = Form.create(formSettings)((props: any) => {
  const submit = (updateRoute: any) => (input: any) => {
    return updateRoute({
      variables: {
        id: props.data.id,
        input,
      },
    });
  };

  return (
    // @ts-ignore
    <Mutation mutation={UPDATE_ROUTE}>
      {/* @ts-ignore */}
      {(updateRoute, { loading }): any => (
        <Spin spinning={loading}>
          <RouteForm {...props} submit={submit(updateRoute)} />
        </Spin>
      )}
    </Mutation>
  );
});

interface RouteDrawerProps {
  route: any;
  organization?: any;
  onSuccess: () => void;
  onClickConfiguration: (route: any) => void;
  applicationId: any;
}

interface RouteDrawerState {
  visible: boolean;
  lastRoute: any;
  route: any;
}

export default class RouteDrawer extends React.Component<RouteDrawerProps, RouteDrawerState> {
  state = { visible: false, route: undefined as any, lastRoute: undefined };

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (!isEqual(nextProps.route, prevState.lastRoute)) {
      return { lastRoute: nextProps.route, route: nextProps.route, visible: true };
    }
    return null;
  }

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSaveSuccess = (value: any) => {
    AppManager.updateRoute(value);
    this.setState({ route: value }, this.props.onSuccess);
  };

  render() {
    const { visible, route = {} } = this.state;
    const { onClickConfiguration, organization, applicationId } = this.props;
    const libraries = LibraryManager.getLibraries().map((item) => ({
      value: item.id,
      label: item.name,
      children: item.components.map((com) => ({ value: com.id, label: com.name })),
    }));
    return (
      <Drawer
        title={route?.id ? '详细设置' : '新增路由'}
        placement="right"
        closable
        width={600}
        mask={false}
        maskClosable
        onClose={this.handleClose}
        visible={visible}
        className="route-drawer"
      >
        <div className="treeSettings_details">
          {route.id ? (
            <RouteFormUpdate
              data={route}
              onSuccess={this.handleSaveSuccess}
              organization={organization}
              libraries={libraries}
              onClickConfiguration={onClickConfiguration}
            />
          ) : (
            <RouteFormCreate
              data={route}
              organization={organization}
              onSuccess={this.handleSaveSuccess}
              libraries={libraries}
              applicationId={applicationId}
            />
          )}
        </div>
      </Drawer>
    );
  }
}
