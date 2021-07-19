import { Checkbox } from 'antd';
import React, { useCallback } from 'react';
import classnames from 'classnames';

import Input from '../asany-editor/components/aside/components/data-entry/Input';
import TextArea from '../asany-editor/components/aside/components/data-entry/TextArea';
import Icon from '../icon';
import TypeSelector from './TypeSelector';
import Validations from './Validations';
import BasicInfo from './BasicInfo';
import { ObjectType } from './Schema';

export type Status = 'view' | 'inline-edit' | 'edit';

export type GraphQLSchemaRowProps = {
  status: Status;
  data: ObjectType;
  level?: number;
  switchStatus: (status: Status) => void;
};

function GraphQLSchemaRow(props: GraphQLSchemaRowProps) {
  const { status, data, switchStatus, level = 1 } = props;
  const editing = status === 'edit';

  const { children: items = [] } = data;

  const handleEditing = useCallback(() => {
    switchStatus(status == 'edit' ? 'inline-edit' : 'edit');
  }, [status]);

  return (
    <>
      <li className={classnames('gse_row flex flex-row', { gse_row_open: editing })}>
        <div className="gse_row_details_handle space-x-px flex flex-row">
          <span
            onClick={handleEditing}
            className={classnames('gse_row_action editing flex justify-center items-center', {
              editing,
              disable: data.id === 'arguments',
            })}
          >
            {editing ? <Icon name="Check" /> : <Icon name="EditOutlined" />}
          </span>
          {data.id === 'arguments' && (
            <span className="gse_row_action flex justify-center items-center">
              <Icon name="PlusBlack" />
            </span>
          )}
        </div>
        <div className="gse_row_wrapper flex-col flex-1">
          <div
            className="gse_row_inner flex flex-1 flex-row items-center"
            style={{ paddingLeft: 32 + (level - 1) * 20 }}
          >
            {data.name && (
              <div className="gse_row_name flex-row items-center">
                <Input width="adaptive" value={data.name} />
              </div>
            )}
            <div className="gse_row_types flex-1 flex flex-row">
              {data.name && <div className="spacer">:</div>}
              <div className="gse_row_type flex-1 flex">
                <div className="typeof_string">{data.type}</div>
                <a className="flex-1 goto_ref">(查看详情)</a>
              </div>
              {!!items.length && <div className="gse_row_child-count flex items-center">{`{${items.length}}`}</div>}
            </div>
            <div className="gse_row_meta flex flex-row items-center">
              {!items.length && (
                <>
                  <div className="gse_row_meta_item flex items-center">
                    <Icon name="Check" />
                    默认值
                  </div>
                  <div className="gse_row_meta_item flex items-center">
                    <Icon name="Check" />
                    参数
                  </div>
                  <div className="gse_row_meta_item flex items-center">
                    <Icon name="Check" />
                    描述
                  </div>
                  <div className="gse_row_meta_item hover_underline">0 validations</div>
                  <div className="gse_row_meta_item hover_underline flex items-center">
                    <Checkbox>必需的</Checkbox>
                  </div>
                  <div className="gse_row_meta_item action-remove ">
                    <Icon name="Close" />
                  </div>
                </>
              )}
            </div>
          </div>
          {editing && (
            <div className="gse_row_details flex flex-row">
              <div className="gse_row_details_column">
                <BasicInfo />
              </div>
              <div className="gse_row_details_column">
                <TypeSelector />
              </div>
              <div className="gse_row_details_column">
                <Validations />
              </div>
            </div>
          )}
        </div>
      </li>
      {items.map((item) => (
        <GraphQLSchemaRow data={item} key={item.id} status={item.status} level={level + 1} />
      ))}
    </>
  );
}

{
  /*switchStatus={handleSwitchStatus(item.id)}*/
}

export default GraphQLSchemaRow;
