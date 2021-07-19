import { DeleteOutlined } from '@ant-design/icons';
import { Button, Select, Tag } from 'antd';
import classnames from 'classnames';
import { useClickAway } from 'react-use';
import React, { useRef, useCallback, useEffect, useState } from 'react';

import style from './../style/index.less';
import Panel from '../components/Panel';

const { Option } = Select;

function SchemaBatchOperation() {
  const ref = useRef<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handleDelete = useCallback(() => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return;
    }
    console.log('xxxxx');
  }, []);

  useClickAway(ref, () => {
    console.log('xxx', ref);
    setDeleteConfirmation(false);
  });

  useEffect(() => {
    if (!deleteConfirmation) {
      return;
    }
    const timer = setTimeout(() => {
      setDeleteConfirmation(false);
    }, 3000);
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timer);
  }, [deleteConfirmation]);

  return (
    <Panel
      style={{ marginBottom: 0 }}
      className={classnames(style.schema_container, 'flex items-center justify-center')}
    >
      <div className={classnames(style.operations, 'flex flex-col space-y-4')}>
        <Button className={classnames(style.deselect, 'text-main text-semibold')}>取消选择</Button>
        <Button
          ref={ref}
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          className={classnames(style.delete, 'flex text-main items-center justify-center text-semibold')}
        >
          {deleteConfirmation ? <>确认删除吗?</> : <>删除 2 资源 </>}
        </Button>
        <div className={classnames(style.edit_group, 'space-y-4')}>
          <div className={classnames(style.operation_title, 'flex items-center')}>批量编辑分组</div>
          <div className={classnames(style.current_groups, 'flex-initial flex-col')}>
            <Tag className="mb-2">Tag 1</Tag>
            <Tag className="mb-2">
              <a href="https://github.com/ant-design/ant-design/issues/1862">Link</a>
            </Tag>
            <Tag closable className="mb-2 flex-initial items-center">
              Tag 2
            </Tag>
            <Tag closable className="mb-2 flex-initial items-center">
              Prevent Default
            </Tag>
          </div>
          <Select defaultValue="lucy" className="w-full">
            <Option value="lucy">Lucy</Option>
          </Select>
        </div>
      </div>
    </Panel>
  );
}

export default SchemaBatchOperation;
