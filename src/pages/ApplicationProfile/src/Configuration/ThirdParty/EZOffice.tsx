import React from 'react';
import {Form, Input, Button, Divider} from 'antd'
import '../style/index.less'
import { withApollo } from '@apollo/client/react/hoc';
import {
  createDataSource,
  updateDataSource
} from '../../gqls/ApplicationGql.gql';


function EZOffice(props: any) {
  const { client, location } = props
  const { data, refetch, } = location.state;

  const { ezoffice: EZOfficeData } = (data.configuration || {}) as any;

  const [form] = Form.useForm();

  const handleSave = async () => {
    const res = await form.validateFields()
    const editedData: Record<string, any> = {
      name: res.name,
      description: res.description,
      type: "ezoffice",
      configuration: {
        host: res['configuration.host'],
        key: res['configuration.key'],
        serviceKey: res['configuration.serviceKey'],
        fixedStr: res['configuration.fixedStr'],
      }
    }
    if (EZOfficeData.id) {
      await client.mutate({
        mutation: updateDataSource,
        variables: {
          id: EZOfficeData.id,
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
      <div className='title'>集成 EZOffice</div>
      <Button onClick={handleSave}>保存</Button>
    </div>
    <Divider/>
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{
        name: EZOfficeData?.name || '',
        'configuration.host': EZOfficeData?.configuration?.host || '',
        'configuration.key': EZOfficeData?.configuration?.key || '',
        'configuration.serviceKey': EZOfficeData?.configuration?.serviceKey || '',
        'configuration.fixedStr': EZOfficeData?.configuration?.fixedStr || '',
        description: EZOfficeData?.description || ''
      }}
    >

      <Form.Item
        label="配置名称"
        name="name"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="host"
        name="configuration.host"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="key"
        name="configuration.key"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="serviceKey"
        name="configuration.serviceKey"
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="fixedStr"
        name="configuration.fixedStr"
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

export default withApollo(EZOffice)
