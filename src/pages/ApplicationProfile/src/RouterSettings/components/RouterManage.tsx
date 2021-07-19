import React, { Component } from 'react';
import RouteDrawer from './RouteDrawer';
import RouteTree from './RouteTree';

interface RouterManageProps {
  // rootPath: string;
  // organization?: any;
  app: any;
  refetch: any;
}

interface IRouterManageState {
  route: any;
}

class RouterManage extends Component<RouterManageProps, IRouterManageState> {
  private routeTree = React.createRef<RouteTree>();

  private routeDrawer = React.createRef<RouteDrawer>();

  state = {
    route: undefined,
  };

  handleRouteClick = (data: any) => {
    const {
      app: { layoutRoute },
    } = this.props;
    this.setState({ route: data || { parent: { ...layoutRoute } } });
  };

  handleRefreshRouteTree = () => {
    const { refetch } = this.props;
    refetch();
  };

  handleRouteRemove = (route: { id: any }, parent: any) => {
    const routeDrawer = this.routeDrawer.current!;
    if (!routeDrawer.state.route) {
      return;
    }
    if (routeDrawer.state!.route!.id === route.id) {
      if (parent) {
        this.setState({ route: parent });
      } else {
        routeDrawer.handleClose();
      }
    }
  };

  handleConfigurationComponent = (route: any) => {
    this.setState({ route });
  };

  render() {
    const { route } = this.state;
    const {
      refetch,
      app: { id, organization, routes, rootRoute, loginRoute, layoutRoute },
    } = this.props;
    return (
      <>
        <RouteTree
          ref={this.routeTree}
          routes={routes.filter(
            (item: any) => ![rootRoute.id, loginRoute.id, layoutRoute.id].includes(item.id) && item.type !== 'portal'
          )}
          refetch={refetch}
          root={{ ...layoutRoute }}
          onRemove={this.handleRouteRemove}
          onClick={this.handleRouteClick}
        />
        <RouteDrawer
          ref={this.routeDrawer}
          route={route}
          organization={organization}
          onSuccess={this.handleRefreshRouteTree}
          onClickConfiguration={this.handleConfigurationComponent}
          applicationId={id}
        />
      </>
    );
  }
}

export default RouterManage;
