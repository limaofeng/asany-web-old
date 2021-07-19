import React from 'react';
import {
  Button,
  Switch,
  Select,
  Divider,
  message, Form
} from 'antd';
import { withApollo } from '@apollo/client/react/hoc';


const { Option } = Select;

function EZOfficeMailList(props: any) {
  const { location, client } = props

  const [form] = Form.useForm()

  const handleSave = () => {
    console.log(location, client)
    message.success('保存成功')
  }

  const handleImmediateSync = () => {
    message.success('同步成功')
  }

  return <>
    <div className='header'>
      <div className='title'>EZOffice 通讯录同步</div>
      <div>
        <Button
          onClick={handleSave}
        >保存同步设置</Button>
        <Button
          className='right-button-space'
          onClick={handleImmediateSync}
        >立即同步</Button>
      </div>
    </div>
    <Divider/>

    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{}}
    >
      <Form.Item
        label="同步"
        name="sysSwitch"
      >
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"/>
      </Form.Item>

      <Form.Item
        label="设置人员同步范围"
      />

      <Form.Item
        label='同步方式'
        name='syncType'
        rules={[{ required: true, message: '请选择同步方式' }]}
      >
        <Select
          allowClear
          placeholder="请选择同步方式"
        >
          <Option key="1" value="1">
            自动同步
          </Option>
          <Option key="2" value="2">
            手动同步
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        label='同步周期'
        name='cron'
        rules={[{ required: true, message: '请选择同步周期' }]}
      >
        <Select
          allowClear
          placeholder="请选择同步周期"
        >
          <Option key="1" value="3">
            每3分钟同步一次
          </Option>
          <Option key="2" value="30">
            每30分钟同步一次
          </Option>
          <Option key="3" value="60">
            每一小时同步一次
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="同步"
        name='q'
      >
        <Switch checkedChildren="开" unCheckedChildren="关"/>
      </Form.Item>
    </Form>
  </>
}
// @ts-ignore
export default withApollo(EZOfficeMailList)