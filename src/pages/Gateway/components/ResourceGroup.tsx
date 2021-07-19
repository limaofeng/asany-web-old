import { SettingOutlined } from '@ant-design/icons';
import { Icon, Sortable } from '@asany/components';
import type { SortableChange, SortableItemContentProps } from '@asany/components/es/sortable/typings';
import { Checkbox, Skeleton } from 'antd';
import classnames from 'classnames';
import React, { useRef } from 'react';
import type { ModelGroup, ResourceDragObject, ScrollViewport } from '../pages/GatewayManagement';
import style from './../style/index.less';

function FieldItem(
  { data, remove, update, style: innerStyle, drag, className, ...props }: SortableItemContentProps<ResourceDragObject>,
  ref: React.RefObject<HTMLElement>
) {
  const { skeleton } = data;
  // console.log('Refresh Resource = ', data.id, skeleton);
  // console.log(style.group, style.checkbox, style.row_checkbox)
  return (
    <div
      className={classnames(className, style['dnd-item'])}
      {...props}
      style={{ ...innerStyle }}
      ref={drag(ref) as any}
    >
      {!skeleton && (
        <div
          className={classnames(style.inactive_inner, {
            [style.active]: data.selectable,
            [style.checked]: data.checked,
          })}
          onClick={data.onClick}
        >
          <div
            className={classnames(style.method_type, 'text-uppercase', {
              'text-success': data.itemType === 'Query',
              'text-warning': data.itemType === 'Mutation',
              'xxx-war': data.itemType === 'Model'
            })}
          >
            {data.itemType}
          </div>
          <div className={style.title}>{data.name}</div>
          <Checkbox className={style.row_checkbox} checked={data.checked} onChange={data.onCheck} />
        </div>
      )}
    </div>
  );
}

interface ResourceGroupProps {
  data: ModelGroup;
  collapsed: boolean;
  viewport?: ScrollViewport;
  visible: boolean;
  skeleton: boolean;
  selectedKeys: string[];
  checkedKeys: string[];
  onChange: SortableChange;
}

function ResourceGroup(props: ResourceGroupProps) {
  const {
    data: group,
    collapsed,
    visible,
    skeleton,
    selectedKeys,
    checkedKeys,
    viewport,
    onChange: handleChange,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const height = collapsed ? 32 : 32 + 14 + 34 * group.items.length;

  const visibleStyle = !visible && !collapsed ? { height } : {};

  return (
    <div
      className={classnames(style.group, {
        [style.collapsed]: collapsed,
      })}
      style={visibleStyle}
      ref={ref}
    >
      <div className={style.collapsible_handle}>
        <div onClick={group.handleClick} className={classnames(style.inactive_inner)}>
          <div className={classnames(style.method_type)}>
            <Icon name={!collapsed ? 'FolderOpen2Line' : 'FolderLine'} />
          </div>
          <div className={classnames(style.title, 'text-semibold text-uppercase text-main')}>
            {group.name} - ({visible ? '1' : '0'})
          </div>
          {!!group.id && (
            <div className={classnames(style.ending, 'group-settings')}>
              <SettingOutlined />
            </div>
          )}
        </div>
      </div>
      {!collapsed && visible ? (
        <Sortable
          accept={['dnd-item']}
          tag="div"
          items={group.items.map((item: any, i: number) => {
            const start = ref.current?.offsetTop || 0 + 32 + i * 34;
            const end = start + 34;
            const resourceSkeleton =
              !viewport ||
              !(Math.min(end, viewport.end + viewport.height) > Math.max(start, viewport.start - viewport.height));
            return {
              ...item,
              skeleton: resourceSkeleton,
              selectable: selectedKeys.includes(item.id) || checkedKeys.includes(item.id),
              checked: checkedKeys.includes(item.id),
            };
          })}
          className={style.collapsible_content}
          itemRender={FieldItem as any}
          onChange={handleChange}
        />
      ) : (
        skeleton && <Skeleton loading={!visible} title={false} paragraph={{ rows: group.items.length }} />
      )}
    </div>
  );
}

export default React.memo(ResourceGroup);
