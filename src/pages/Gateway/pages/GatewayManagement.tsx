/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@apollo/client';
import { message } from 'antd';
import classnames from 'classnames';
import { EventEmitter } from 'events';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { useWindowSize } from 'react-use';
import { useHistory } from 'umi';


import ResourceGroup from '../components/ResourceGroup';
import SidebarFilter from '../components/SidebarFilter';
import { getSchema as GET_SCHEMA } from '../graphql/schema.gql';
import style from './../style/index.less';

import type { SidebarFilterAction } from '../components/SidebarFilter';
import type { ISortableItem } from '@asany/components/lib/sortable/typings';

export interface ResourceDragObject extends ISortableItem {
  id: string;
  type: string;
  selectable?: boolean;
  skeleton: boolean;
  itemType: 'Query' | 'Mutation' | 'Model';
  [key: string]: any;
}

export type ModelGroup = {
  id: string;
  name: string;
  items: ResourceDragObject[];
  handleClick?: (e: React.MouseEvent) => void;
};

export type ScrollViewport = {
  start: number;
  end: number;
  height: number;
};

type GroupState = {
  emitter: EventEmitter;
  viewport: ScrollViewport;
  expandAll: boolean;
  groups: ModelGroup[];
  actions: SidebarFilterAction[];
  checkedKeys: string[];
  selectedKeys: string[];
  expandedKeys: string[];
};

function GatewayManagement() {
  const history = useHistory();
  const scrollbar = useRef<any>();

  const handleChange = useCallback(() => {}, []);

  const [, forceRender] = useReducer((s) => s + 1, 0);
  const state = useRef<GroupState>({
    viewport: { start: 0, end: 0, height: 0 },
    emitter: new EventEmitter(),
    expandAll: true,
    groups: [],
    checkedKeys: [],
    selectedKeys: [],
    expandedKeys: [],
    actions: [
      {
        id: 'expand',
        icon: 'UpDown3Line',
        name: '展开分组',
        handler: () => {
          state.current.expandAll = true;
          state.current.expandedKeys = state.current.groups.map((item) => item.id);
          forceRender();
        },
      },
      {
        id: 'collapse',
        icon: 'UpDown3Line',
        name: '折叠分组',
        handler: () => {
          state.current.expandAll = false;
          state.current.expandedKeys = [];
          forceRender();
        },
      },
      {
        id: 'auto-group',
        icon: 'MagicWandLine',
        name: '自动分组',
        handler: () => {
          message.warn('还未实现');
        },
      },
    ],
  });

  // 跳转详情页
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const forwardDetails = useCallback((item: ResourceDragObject) => {
    // eslint-disable-next-line no-console
    console.log('forwardDetails', item);
    if (item.type === 'Mutation' || item.type === 'Query') {
      history.push(`/gateway/schema/endpoints/${item.id}`);
      return;
    }
    history.push(`/gateway/schema/models/${item.id}`);
  }, []);

  // 跳转批量操作页
  const forwardBatch = useCallback(() => {
    history.push('/gateway/schema/batch');
  }, []);

  const { data } = useQuery(GET_SCHEMA);

  // 点击分组 展开/折叠
  const buildHandleGroupClick = useCallback(
    (group: ModelGroup) => (e: React.MouseEvent) => {
      if ((e.target as any).className === 'group-settings') {
        return;
      }
      const { expandedKeys } = state.current;
      if (expandedKeys.includes(group.id)) {
        state.current.expandedKeys = expandedKeys.filter((key) => key !== group.id);
      } else {
        state.current.expandedKeys = [...expandedKeys, group.id];
      }
      forceRender();
    },
    []
  );

  const handleSubscribe = (event: string, callback: () => void) => {
    state.current.emitter.on(event, callback);
    return () => state.current.emitter.off(event, callback);
  };

  const handleScroll = useCallback(() => {
    const scroll = scrollbar.current.osInstance().scroll();
    state.current.viewport = {
      start: scroll.position.y,
      end: scroll.position.y + scroll.trackLength.y,
      height: scroll.trackLength.y,
    };
    forceRender();
  }, []);

  const { height } = useWindowSize();
  useEffect(() => {
    handleScroll();
  }, [height]);

  // 资源选中（复选框）
  const buildCheck = useCallback(
    (item: any) => (e: React.ChangeEvent) => {
      const { checked } = e.target as any;
      if (!checked) {
        state.current.checkedKeys = state.current.checkedKeys.filter((key) => key !== item.id);
        if (state.current.selectedKeys.includes(item.id)) {
          state.current.selectedKeys = [];
        }
        if (!state.current.checkedKeys.length) {
          state.current.selectedKeys = [item.id];
          forwardDetails(item);
        }
      } else if (checked && !state.current.checkedKeys.includes(item.id)) {
        state.current.checkedKeys = [...state.current.checkedKeys, item.id];
        if (state.current.checkedKeys.length === 1) {
          state.current.selectedKeys = [];
        }
      }
      if (state.current.checkedKeys.length) {
        forwardBatch();
      }
      forceRender();
    },
    [forwardBatch, forwardDetails]
  );

  // 资源选中
  const buildClick = useCallback(
    (item: any) => (e: React.MouseEvent) => {
      if ((e.target as any).className.includes('ant-checkbox')) {
        return;
      }
      const { selectedKeys, checkedKeys } = state.current;
      if (checkedKeys.length) {
        if (checkedKeys.includes(item.id)) {
          state.current.checkedKeys = checkedKeys.filter((key) => key !== item.id);
        } else {
          state.current.checkedKeys = [...checkedKeys, item.id];
        }
        forceRender();
        return;
      }
      if (selectedKeys.includes(item.id)) {
        return;
      }
      state.current.selectedKeys = [item.id];
      if (state.current.checkedKeys.length === 0) {
        forwardDetails(item);
      }
      forceRender();
    },
    [forwardDetails]
  );

  // 数据数据
  useEffect(() => {
    if (!data?.schema) {
      return;
    }

    const items = data.schema.ungrouped.map((item: any) => ({
      id: item.id,
      type: 'dnd-item',
      name: item.name,
      itemType: item.type,
      subscribe: handleSubscribe,
      onClick: buildClick(item),
      onCheck: buildCheck(item),
    }));

    // const groupByUngrouped = {
    //   id: 0,
    //   name: `Ungrouped`,
    //   handleClick: buildHandleGroupClick({ id: 0 } as any),
    //   items,
    // };

    const groupTemps = [];
    for (let i = 0; i < items.length; i += 100) {
      const groupByUngrouped = {
        id: 0 + i,
        name: `Ungrouped - ${i}`,
        handleClick: buildHandleGroupClick({ id: 0 + i } as any),
        items: items.slice(i, i + 100),
      };
      groupTemps.push(groupByUngrouped);
    }

    state.current.groups = [
      ...groupTemps,
      ...data.schema.groups.map((group: any) => ({
        ...group,
        handleClick: buildHandleGroupClick(group),
        items: group.items.map((item: any) => ({ id: item.id, type: 'dnd-item', name: item.resourceType })),
      })),
    ];

    state.current.expandedKeys = state.current.groups.map((item) => item.id);

    handleScroll();
  }, [buildHandleGroupClick, buildClick, buildCheck, data]);

  const { groups, expandedKeys, checkedKeys, actions, expandAll, selectedKeys, viewport } = state.current;

  let top = 0;

  return (
    <div className={classnames(style.sidebar, { [style.batch_operation]: !!checkedKeys.length })}>
      <SidebarFilter
        actions={actions.filter((item) => {
          if (item.id === 'collapse' && !expandAll) {
            return false;
          }
          if (item.id === 'expand' && expandAll) {
            return false;
          }
          return true;
        })}
      />
      <OverlayScrollbarsComponent
        ref={scrollbar}
        className="os-theme-nifty"
        options={{
          scrollbars: { autoHide: 'scroll' },
          callbacks: {
            onScroll: handleScroll,
          },
        }}
      >
        <div className="nano-content">
          {groups.map((group) => {
            const start = top;
            const collapsed = !expandedKeys.includes(group.id);
            const h = collapsed ? 32 : 32 + 14 + 34 * group.items.length;
            const end = top + h;
            top = end;
            const intersect = Math.min(end, viewport.end) > Math.max(start, viewport.start);
            const skeleton =
              Math.min(end, viewport.end + viewport.height) > Math.max(start, viewport.start - viewport.height);
            // console.log('group_', group.id, viewport.height, intersect, skeleton);
            return (
              <ResourceGroup
                key={`group_${group.id}`}
                data={group}
                collapsed={collapsed}
                viewport={intersect ? viewport : undefined}
                visible={intersect}
                skeleton={skeleton}
                checkedKeys={checkedKeys}
                selectedKeys={selectedKeys}
                onChange={handleChange}
              />
            );
          })}
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
}

export default GatewayManagement;
