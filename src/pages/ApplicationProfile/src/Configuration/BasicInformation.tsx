import * as React from 'react';
import { Col, Divider, Input, Row, Switch, Tag, Tooltip, message, Space } from 'antd';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from '@asany/components';

import { AutoInput } from '../components/TextField';
import AppIcon from './components/AppIcon';
import AppInput from './components/AppInput';
import { useReduxSelector } from '@asany/components/lib/utils';
import useUpdateApp from '../hooks/useUpdateApp';
import { useCallback, useState } from 'react';

function BasicInformation() {
  const application = useReduxSelector((state) => state.global.application);
  const [data, setData] = useState(application);
  const {
    id: applicationId,
    logo,
    name,
    description,
    dingtalkIntegration,
    ezofficeIntegration,
  } = data;
  const { success, error, useUpdateAppData } = useUpdateApp();
  console.log('data>props----外', success, error);
  const save = useCallback(
    (name: string) => (value: any) => {
      useUpdateAppData({ [name]: value }, applicationId);
      setData({...data,[name]:value})
    },
    [],
  );
  success && message.success('修改成功');
  error && message.error('修改失败');

  const handleCopy = () => {
    message.success('Token已复制到剪贴板！');
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Row>
        <Col span={12}>
          <Tag color="green">应用ID | {applicationId}</Tag>
        </Col>
        <Col span={12}>
          <Tag>
            Token | {applicationId} |
            <CopyToClipboard text={applicationId} onCopy={handleCopy}>
              <Tooltip placement="top" title="点击按钮复制Token">
                <span onClick={handleCopy}>
                  <Icon name="FileCopy2Lineopy" />
                </span>
              </Tooltip>
            </CopyToClipboard>
          </Tag>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Space>
          <div className="pad-all text-main text-sm text-uppercase text-bold">应用LOGO</div>
          <AppIcon
            value={logo}
            onChange={save('logo')}
            style={{
              marginLeft: '20px',
              display: 'inline-flex',
              alignItems: 'flex-end',
            }}
          />
        </Space>
      </Row>
      <Row>
        <Space style={{ width: '100%' }}>
          <div className="pad-hor text-main text-sm text-uppercase text-bold">应用名称</div>
          <AutoInput value={name} onChange={save('name')} />
        </Space>
      </Row>
      <Row>
        <Space style={{ width: '100%' }}>
          <p className="pad-all text-main text-sm text-uppercase text-bold">应用描述</p>
          <AppInput isTextArea value={description} onChange={save('description')} />
        </Space>
      </Row>
      <Row>
        <Col span={12}>
          <Space>
            <div className="text-main text-sm text-uppercase text-bold">集成钉钉</div>
            <Switch
              checkedChildren="启用"
              unCheckedChildren="关闭"
              onChange={save('dingtalkIntegration')}
              checked={dingtalkIntegration}
            />
          </Space>
        </Col>
        <Col span={12}>
          <Space>
            <div className="text-main text-sm text-uppercase text-bold">集成 EZOFFICE</div>
            <Switch
              checkedChildren="启用"
              unCheckedChildren="关闭"
              onChange={save('ezofficeIntegration')}
              checked={ezofficeIntegration}
            />
          </Space>
        </Col>
      </Row>
    </Space>
  );
}

export default BasicInformation;
