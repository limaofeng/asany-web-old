import React from 'react';
import {Form, Input, Button, Divider} from 'antd'
import '../style/index.less'
import { withApollo } from '@apollo/client/react/hoc';
import {
  createDataSource,
  updateDataSource
} from '../../gqls/ApplicationGql.gql';

interface DingProps {
  /** 阿波罗服务 */
  client: any;

  /** 路由数据绑定 */
  location: any
}

function Ding(props: DingProps) {
  const { client, location } = props
  const { data, refetch, } = location.state;

  const { dingtalk: DingTalkData } = (data.configuration || {}) as any;

  const [form] = Form.useForm();

  const handleSave = async () => {
    const res = await form.validateFields()
    const editedData: Record<string, any> = {
      name: res.name,
      description: res.description,
      type: "dingtalk",
      configuration: {
        agentId: res['configuration.agentId'],
        corpId: res['configuration.corpId'],
        appKey: res['configuration.appKey'],
        appSecret: res['configuration.appSecret'],
      }
    }
    if (DingTalkData.id) {
      await client.mutate({
        mutation: updateDataSource,
        variables: {
          id: DingTalkData.id,
          input: editedData
        },
      })
    } else {
      await client.mutate({
        mutation: createDataSource,
        variables: {
          input: editedData
        },
      })
    }
    refetch()
  }

  return <>
    <div className='header'>
      <div className='title'>集成钉钉</div>
      <Button onClick={handleSave}>保存</Button>
    </div>
    <Divider/>
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{
        name: DingTalkData?.name || '',
        'configuration.agentId': DingTalkData?.configuration?.agentId || '',
        'configuration.corpId': DingTalkData?.configuration?.corpId || '',
        'configuration.appKey': DingTalkData?.configuration?.appKey || '',
        'configuration.appSecret': DingTalkData?.configuration?.appSecret || '',
        description: DingTalkData?.description || ''
      }}
    >

      <Form.Item
        label="配置名称"
        name="name"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="agentId"
        name="configuration.agentId"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="corpId"
        name="configuration.corpId"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="appKey"
        name="configuration.appKey"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="appSecret"
        name="configuration.appSecret"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="描述"
        name='description'
      >
        <Input/>
      </Form.Item>
    </Form>
  </>
}

// @ts-ignore
export default withApollo(Ding)
