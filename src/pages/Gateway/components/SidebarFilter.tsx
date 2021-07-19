import { Icon } from '@asany/components';
import { Input } from 'antd';
import classnames from 'classnames';
import React from 'react';
import style from './../style/index.less';

export interface SidebarFilterAction {
  id: string;
  icon: string;
  name: string;
  handler: () => void;
}

interface SidebarFilterProps {
  actions: SidebarFilterAction[];
}

function SidebarFilter(props: SidebarFilterProps) {
  const { actions } = props;
  return (
    <div className={classnames(style['sidebar-filter'], 'flex items-center')}>
      <div className={classnames(style.filter_search, 'flex-1 flex items-center')}>
        <Icon name="Search" />
        <Input placeholder="搜索资源" className="ant-input-rimless bg-transparent text-main" />
      </div>
      <div className={classnames(style.filter_actions, 'flex items-center justify-center')}>
        <Icon className={style.filter_action_icon} name="Filter2Line" />
        <div className={classnames(style.filter_action_box, 'space-y-6')}>
          <div className={style.filter_action_section}>
            <div className={classnames(style.filter_action_header, 'text-semibold text-main')}>筛选</div>
            <ul className={classnames(style.filter_list, 'inline-flex space-x-4')}>
              <li className="text-main">
                <a className={classnames(style.filter_list_item_inner, style.active)}>全部(10)</a>
              </li>
              <li className="text-main">
                <a className={classnames(style.filter_list_item_inner)}>接口(6)</a>
              </li>
              <li className="text-main">
                <a className={classnames(style.filter_list_item_inner)}>模型(8)</a>
              </li>
            </ul>
          </div>
          <div className={style.filter_action_section}>
            <div className={classnames(style.filter_action_header, 'text-semibold text-main')}>操作</div>
            <ul className={classnames(style.filter_list, 'space-y-4')}>
              {actions.map((item) => (
                <li key={item.id} className="text-main">
                  <div className={classnames(style.filter_list_item_inner, 'inline-flex items-center')}>
                    <Icon name={item.icon} className="pr-2" />
                    <a onClick={item.handler} className="no-underline hover:underline">
                      {item.name}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarFilter;
