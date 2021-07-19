import { Form, Input, message, Select } from 'antd';
import classnames from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import React from 'react';
import Panel from '../components/Panel';

import style from './../style/index.less';

const { Option } = Select;

function Workspace() {
  const actions: any[] = [
    {
      name: '保存草稿',
      onClick: () => {
        message.info('保存草稿.');
      },
    },
    {
      name: '取消发布',
      color: 'danger',
      onClick: () => {
        message.error('取消发布.');
      },
    },
    {
      type: 'divider',
    },
    {
      name: '删除',
      color: 'danger',
      type: 'button',
      onClick: () => {},
    },
  ];
  return (
    <div className={classnames(style.schema_container, style.endpoint_details)}>
      <OverlayScrollbarsComponent
        className="os-theme-nifty"
        options={{
          scrollbars: { autoHide: 'scroll' },
        }}
      >
        <Form layout="vertical">
          <div>{/* <ActionButton actions={actions} /> */}</div>
          <Panel collapse={true} title="接口基本信息">
            <div className="grid grid-flow-row grid-cols-4 grid-rows-2 gap-4 gap-y-8">
              <div className="col-span-2 pad-no">
                <Form.Item label="名称" name="requiredMarkValue">
                  <Input placeholder="input placeholder" />
                </Form.Item>
              </div>
              <div>
                <Form.Item label="编码" name="requiredMarkValue">
                  <Input placeholder="input placeholder" />
                </Form.Item>
              </div>
              <div>
                <Form.Item label="操作ID" name="requiredMarkValue">
                  <Input placeholder="input placeholder" />
                </Form.Item>
              </div>
              <div className="col-span-4 pad-no flex">
                <div className="pr-4">
                  <Form.Item label="地址" name="requiredMarkValue">
                    <Select defaultValue="lucy" style={{ width: 120 }}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>
                        Disabled
                      </Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="flex-1">
                  <Form.Item label="地址" name="requiredMarkValue">
                    <Input placeholder="input placeholder" />
                  </Form.Item>
                </div>
              </div>
              <div className="col-span-2 pad-no">
                <Form.Item label="分组" name="requiredMarkValue">
                  <Select defaultValue="lucy" style={{ width: '100%' }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                      Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-span-2 pad-no">
                <Form.Item label="Mocking" name="requiredMarkValue">
                  <Select defaultValue="lucy" style={{ width: '100%' }}>
                    <Option value="jack">True</Option>
                    <Option value="lucy">False</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Panel>
          <Panel collapse={true} title="说明">
            待实现功能
          </Panel>
          <Panel collapse={true} title="身份验证">
            待实现功能
          </Panel>
          <Panel collapse={true} title="请求">
            待实现功能
          </Panel>
          <Panel collapse={true} title="响应">
            待实现功能
          </Panel>
        </Form>
      </OverlayScrollbarsComponent>
    </div>
  );
}

export default Workspace;
