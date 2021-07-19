import React, { useState, useEffect, forwardRef } from 'react';

import { Form, Input, Switch, Alert, InputNumber, Radio, Cascader } from 'antd';

import { Somepeople, IconSelect, Icon, utils } from '@asany/components';

import { PortalData, PortalTypeEnum } from './data.d';

import { PortalTypeList, getRouteTree } from '../utils/portalUtils';

interface UserSelectProps {
  value?: string[];
  onChange?: (value: any) => void;
}

const UserSelect: React.FC<UserSelectProps> = ({ value = [], onChange }) => {
  return <Somepeople organization="1" value={value} onChange={onChange} />;
};

interface IconSelectProps {
  value?: any;
  onChange?: (value: any) => void;
}

const FormIconSelect: React.FC<IconSelectProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex' }}>
      {value && value.type && (
        <span style={{ color: value.color, margin: '0 20px', fontSize: '20px' }}>
          <Icon {...value} />
        </span>
      )}

      <IconSelect onChange={(data) => onChange && onChange(data)} />
    </div>
  );
};

interface PortalFormProps {
  dataSource?: PortalData;
  onSubmit?: (data: PortalData) => void;
}

const { useReduxSelector } = utils;

const PortalForm = forwardRef((props: PortalFormProps, ref: any) => {
  const { dataSource = {}, onSubmit } = props;

  const [type, setType] = useState(dataSource.type);

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    setType(dataSource.type);
  }, [dataSource]);

  const onFinish = (values: PortalData) => {
    let newValues: any = {
      ...dataSource,
      ...values,
    };

    return onSubmit && onSubmit(newValues);
  };

  const { layoutRoute = {}, routes = [] } =
    useReduxSelector((state) => state?.global?.application) || {};

  const routeTree = getRouteTree(layoutRoute.id, routes, true);

  return (
    <>
      <Form
        ref={ref}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        name="form"
        initialValues={dataSource}
        onFinish={onFinish}
      >
        <Form.Item
          label="门户名称"
          name="name"
          rules={[{ required: true, message: '请输入门户名称' }]}
        >
          <Input placeholder="请输入门户名称（限制 30 个汉字）" maxLength={30} />
        </Form.Item>

        <Form.Item
          label="门户图标"
          name="icon"
          rules={[{ required: true, message: '请选择门户图标' }]}
        >
          <FormIconSelect />
        </Form.Item>

        <Form.Item
          label="门户类型"
          name="type"
          rules={[{ required: true, message: '请选择门户类型' }]}
        >
          <Radio.Group buttonStyle="solid" onChange={(e) => setType(e.target.value)}>
            {PortalTypeList.map((e) => (
              <Radio.Button key={e.value} value={e.value}>
                {e.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {type === PortalTypeEnum.ROUTE && (
          <div id="portal-form-path-cascader-box">
            <Form.Item label="路由" name="path" rules={[{ required: true, message: '请选择路由' }]}>
              <Cascader
                options={routeTree}
                placeholder="请选择路由"
                getPopupContainer={() => document.getElementById('portal-form-path-cascader-box')}
              />
            </Form.Item>
          </div>
        )}

        {!dataSource.system && (
          <Form.Item label="适用范围">
            <Form.Item name="viewable" noStyle>
              <UserSelect />
            </Form.Item>
            <Alert message="默认全部适用" type="warning" showIcon style={{ marginTop: '10px' }} />
          </Form.Item>
        )}

        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="请输入描述（限制 100 个汉字）" maxLength={100} rows={4} />
        </Form.Item>

        <Form.Item label="排序" name="index" rules={[{ required: true, message: '请输入排序' }]}>
          <InputNumber precision={0} max={999999999} />
        </Form.Item>

        {!dataSource.system && (
          <Form.Item label="是否启用" name="useable" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}

        {!dataSource.system && (
          <Form.Item label="是否默认" name="default" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}
      </Form>
    </>
  );
});

export default PortalForm;
