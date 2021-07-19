import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withApollo } from '@apollo/client/react/hoc';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Query } from '@apollo/client/react/components';
import { Skeleton, message } from 'antd';
import { PageContainer } from '@asany/components';
import { queryApplication, updateApplication as UPDATE_APPLICATION } from '../gqls/ApplicationGql.gql';
import ConfigurationSlider from './ConfigurationSlider';
import { connect } from 'dva';

const titlePathMap = {
  information: '基础信息',
  organization: '组织架构',
  notification: '通知设置',
  login: '登陆设置',
  layout: '布局设置',
  modules: '模块配置',
  routes: '路由配置',
  publish: '应用发布',
  forgetPsd: '忘记密码',
  thirdparty: '第三方集成',
};

interface ConfigurationProps {
  [key: string]: any;
}

export class Configuration extends React.Component<ConfigurationProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  save = (data: any, refetch: any) => (name: string, callback: () => Promise<void>) => async (value: string | any) => {
    const input = { [name]: value?.url ?? value?.value ?? value };

    const clientUpdate = await this.props.client.mutate({
      mutation: UPDATE_APPLICATION,
      variables: { id: data.id, input },
    });
    if (clientUpdate?.data) {
      message.success('修改成功');
    }
    await refetch();
    if (callback) {
      await callback();
    }
  };

  render() {
    const { application } = this.props || {};
    console.log(queryApplication);
    return (
      <Query 
        query={queryApplication} 
        variables={application && application.id ? { id: application.id } : { id: process.env.APPID }}
        fetchPolicy="no-cache"
      >
        {this.renderLayout}
      </Query>
    );
  }

  renderLayout = ({ data, loading, refetch, error }: any) => {
    const { children } = this.props;
    const { application } = data || {};

    if (!application?.id) {
      console.error(error);
      return <></>;
    }

    this.props.location.state = {
      data: application,
      refetch,
      updateApplication: this.save(application, refetch),
    };

    const key = Object.keys(titlePathMap).find((x) => this.props.location.pathname.endsWith(x)) || '';
    const title = key ? titlePathMap[key] : '';

    return (
      <PageContainer
        title={title}
        hiddenHeader={!title}
        breadcrumb={false}
        sidebar={<ConfigurationSlider application={application} />}
      >

        <Skeleton loading={loading} active paragraph={{ rows: 7 }}>
          {React.Children.map(children, (o: any) => o)}
        </Skeleton>
      </PageContainer>
    );
  };
}

export default withApollo(connect(({ global: { application }}: any) => ({
  application,
}))(Configuration));
