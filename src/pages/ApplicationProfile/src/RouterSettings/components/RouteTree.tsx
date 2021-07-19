import 'react-sortable-tree/style.css';

import { Button, Modal, Skeleton, message } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryResult } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Query, Mutation } from '@apollo/client/react/components';
import React, { Component } from 'react';
// @ts-ignore
import SortableTree from 'react-sortable-tree';
import { PlusCircleOutlined, ZoomInOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { isEqual } from 'lodash';
import RouteNodeRenderer from './RouteNodeRenderer';
import { moveRoute as MOVE_ROUTE, removeRoute as REMOVE_ROUTES } from '../../gqls/routes.gql';
import { tree } from '../../utils/utils';

// 获取展开keys
const getOpenKeys = (data: any[] = []) => {
  const openKeys: any[] = [];
  data.forEach((item) => {
    if (item.expanded) {
      openKeys.push(item.id);
      openKeys.push(...getOpenKeys(item.children));
    }
  });
  return openKeys;
};

const expandRoutes = (treeItems: any[], parent?: any) => {
  const routes: any[] = [];
  treeItems.forEach((x, index) => {
    // eslint-disable-next-line no-param-reassign
    x.parent = parent;
    // eslint-disable-next-line no-param-reassign
    x.index = index + 1;
    routes.push(x);
    if (x.children) {
      routes.push(...expandRoutes(x.children, x));
    }
  });
  return routes;
};

interface RouteTreeProps {
  onClick: (data?: any) => void;
  routes: any[];
  refetch: () => void;
  root: any;
  onRemove: (data: any, parent: any) => void;
}

interface RouteTreeState {
  openKeys: string[];
  expanded: boolean;
  current: any;
  routes: any[];
}

export default class RouteTree extends Component<RouteTreeProps, RouteTreeState> {
  root: any = undefined;

  state = {
    openKeys: [],
    expanded: false,
    current: undefined,
    routes: [] as any[],
  };

  handleChange = (routes: any) => {
    this.setState({
      openKeys: getOpenKeys(routes),
      routes: expandRoutes(routes),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMove = (moveRoute: any) => async ({
    treeData: routes,
    nextPath,
    prevPath,
    node,
    nextParentNode,
    ...args
  }: any) => {
    const { root } = this.props;
    // eslint-disable-next-line no-param-reassign
    nextParentNode = nextParentNode || root;
    await moveRoute({
      variables: {
        id: node.id,
        parent: nextParentNode ? nextParentNode.id : root.id,
        location: this.getTreeNode(node.id)?.index || '',
      },
    });
    message.success('路由移动成功');
    this.refresh();
  };

  handleExpandAll = () => {
    this.setState({ expanded: true, openKeys: [] });
  };

  handleCollapseAll = () => {
    this.setState({ expanded: false, openKeys: [] });
  };

  handleToggleExpand = () => {
    this.setState((preState) => ({
      expanded: !preState.expanded,
      openKeys: [],
    }));
  };

  handleCreate = () => {
    this.props.onClick();
  };

  handleOpenWindow = ({ node }: any) => () => {
    // TODO manage 路由去除，后面修改
    const path = node.path.split('/manage')[1];
    window.open(`${window.location.protocol}//${window.location.host}${path ? path : ''}`);
  };

  handleRemove = ({ node, parentNode }: any) => (removeRoute: any) => async () => {
    // eslint-disable-next-line no-param-reassign
    const { root } = this.props;
    parentNode = parentNode || root;
    await removeRoute({ variables: { id: node.id } });
    message.success('路由删除成功');
    this.props.onRemove(node, parentNode);
    this.refresh();
  };

  handleCreateChild = ({ node }: any) => () => {
    this.props.onClick({ parent: node });
  };

  handleClick = ({ node, parentNode }: any) => () => {
    // eslint-disable-next-line no-param-reassign
    const { root } = this.props;
    parentNode = parentNode || root;
    const data = { ...node, parent: { ...parentNode } };
    this.state.current = data.id;
    this.props.onClick(data);
  };

  getTreeNode = (id: string) => {
    const { routes: treeRoutes } = this.state;
    return treeRoutes.find((node) => node.id === id);
  };

  refresh = async () => {
    const { refetch } = this.props;
    await refetch();
  };

  render() {
    const { routes } = this.props;
    const { openKeys, expanded } = this.state;
    // const [root] = tree<any>(
    //   routes.map((item: any) => ({ ...item, children: [] })),
    //   {
    //     idKey: 'id',
    //     childrenKey: 'children',
    //     pidKey: 'parent.id',
    //   },
    // );
    const treeData = tree<any>(
      routes.map((item: any) => ({ ...item, title: item.name, subtitle: item.path, children: [] })),
      {
        idKey: 'id',
        // eslint-disable-next-line no-shadow
        getParentKey: (data: any) => {
          const routeNode: any = this.getTreeNode(data.id);
          if (!routeNode) {
            return data.parent && data.parent.id;
          }
          return routeNode.parent && routeNode.parent.id;
        },
        childrenKey: 'children',
        sort: (left: any, right: any) => {
          const leftRouteNode = this.getTreeNode(left.id) || left;
          const rightRouteNode = this.getTreeNode(right.id) || right;
          return leftRouteNode.index - rightRouteNode.index;
        },
        converter: (item: any) => {
          // eslint-disable-next-line no-param-reassign
          item.expanded = expanded || openKeys.some((key) => key === item.id);
          return item;
        },
      },
    );
    return (
      <>
        <Button style={{ margin: 10 }} type="primary" onClick={this.handleCreate}>
          新建路由
        </Button>
        <Button style={{ margin: 10 }} type="primary" onClick={this.handleToggleExpand}>
          {expanded ? '全部收起' : '全部展开'}
        </Button>
        <Mutation mutation={MOVE_ROUTE}>{this.routerSortableTree(treeData)}</Mutation>
      </>
    );
  }

  routerSortableTree = (treeData: any) => (updateRoute: any) => (
    <SortableTree
      style={{ height: '100%' }}
      isVirtualized={false}
      treeData={treeData}
      onChange={this.handleChange}
      onMoveNode={this.handleMove(updateRoute)}
      generateNodeProps={this.generateNode}
      nodeContentRenderer={RouteNodeRenderer}
    />
  );

  generateNode = (rowInfo: any) => ({
    onContentClick: this.handleClick(rowInfo),
    buttons: [
      <div key="buttons">
        <Button
          style={{ marginRight: 5 }}
          key="open-window"
          type="primary"
          onClick={this.handleOpenWindow(rowInfo)}
          icon={<ZoomInOutlined />}
        />
        <Button
          style={{ marginRight: 5 }}
          key="plus"
          type="primary"
          onClick={this.handleCreateChild(rowInfo)}
          icon={<PlusCircleOutlined />}
        />
        <RemoveRoute name={rowInfo.node.name} onClick={this.handleRemove(rowInfo)} />
      </div>,
    ],
    style: { height: '50px' },
  });
}

const RemoveRoute = (props: any) => {
  const handleClick = (removeRoute: any) => {
    const remove = props.onClick(removeRoute);
    return () => {
      // eslint-disable-next-line no-shadow
      const message = Modal.confirm({
        title: `是否确定删除路由"${props.name}"?`,
        content: '如果存在子路由，请先删除子路由。或者选择将子路由移动到其他位置',
        onOk: async () => {
          await remove();
          message.destroy();
        },
      });
    };
  };

  return (
    <Mutation mutation={REMOVE_ROUTES}>
      {(removeRoute: any): any => (
        <Button
          onClick={handleClick(removeRoute)}
          key="del"
          danger
          icon={<CloseCircleOutlined />}
        />
      )}
    </Mutation>
  );
};
