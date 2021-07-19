import React, { Component } from 'react';

// import Fullscreen from 'react-full-screen';
// import { ConnectState } from 'connect';
// import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import PageContainer from '@asany/components';
import RouterManage from './components/RouterManage';

interface ISettingsDetailsProps extends RouteComponentProps<any> {
  location: any;
  history: any;
  application: any;
  currentUser: any;
}

interface ISettingsDetailsState {}
// @connect(({ user: { currentUser } }: ConnectState) => ({
//   currentUser,
// }))
export class RouterSettings extends Component<ISettingsDetailsProps, ISettingsDetailsState> {
  state = { isFull: false };

  // 验证
  public componentWillMount() {
    /*  if (this.props.location.state !== 'entry') {
      this.props.history.push('/routerSettings');
    } */
  }

  goFull = () => {
    this.setState({ isFull: true });
  };

  render() {
    const { application = {} } = this.props;
    const organization = application.organization && application.organization.id;
    return (
      <PageContainer title="路由管理">
        <RouterManage organization={organization} app={application}/>
      </PageContainer>
    );
  }
}

export default RouterSettings;
