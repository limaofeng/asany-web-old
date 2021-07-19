import React from 'react';
import { Input, Form, message, Button } from "antd";
import { createService as POST_ADD_SERVICE, updateService as POST_UPDATE_SERVICE } from './../gqls/api.gql';
import { useMutation } from '@apollo/client';

const FormItem = Form.Item;

interface ServerModelProps {
  updateState: (value: any) => void;
  visible?: boolean;
  edit?: boolean;
  recordData?: any;
  refetch: any;
}

function ServerModel(props: ServerModelProps) {
  const [form] = Form.useForm();
  // form.resetFields();
  const [addServiceData] = useMutation(POST_ADD_SERVICE);
  const [editServiceData] = useMutation(POST_UPDATE_SERVICE);
  const { updateState, edit, recordData, refetch} = props;

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { offset: 22, span: 2 },
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    values.endpoints = {graphql: values.graphql, development_graphql: values.development_graphql}
    delete values.graphql;
    delete values.development_graphql;
    if (edit) {
      //编辑时提交
      delete values.id;
      const resEdit = await editServiceData({
        variables: {
          id: recordData.id,
          input: values,
        }
      }).catch(error => {
        message.error("修改失败！", error);
      });

      if(resEdit.data.updateService && resEdit.data.updateService.id) {
        updateState({
          visible: false,
          edit: false
        });
        form.resetFields();
        await refetch()
        message.success('修改成功', 3);
      }else {
        message.error("修改失败！");
      }
    } else {
      const res = await addServiceData({ variables: { input: values } }).catch(error => {
        message.error("新建失败！", error);
      });
      if(res.data.createService && res.data.createService.id) {
        updateState({
          visible: false,
          edit: false
        });
        form.resetFields();
        await refetch()
        message.success('新建成功', 3);
      }else {
        message.error("新建失败！");
      }
    }
  };

  return (
    <Form
      {...layout}
      name='global_state'
      form={form}
    >
      <FormItem
        label="名称"
        name="name"
        initialValue={edit ? recordData.name : ""}
        rules={[{ required: true, message: '名称必填' }]}
      >
        <Input />
      </FormItem>

      <FormItem
          label="编码"
          name="id"
          rules={[{ required: true, message: '英文必填(请输入纯英文)', pattern: /^[A-Za-z]+$/ }]}
          initialValue={edit ? recordData.id : ""}
        >
          <Input disabled={edit} />
      </FormItem>

      <FormItem
        label="服务地址"
        name="host"
        initialValue={edit ? recordData.host : ""}
        rules={[{ required: true, message: '服务地址必填' }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="集群地址"
        name="graphql"
        initialValue={edit ? recordData.endpoints && recordData.endpoints.graphql : ""}
        rules={[{ required: true, message: '集群地址必填' }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="外网地址"
        name="development_graphql"
        initialValue={edit ? recordData.endpoints && recordData.endpoints.development_graphql : ""}
      >
        <Input />
      </FormItem>

      <FormItem {...tailLayout}>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          确认
        </Button>
      </FormItem>
    </Form>
  )
}

export default ServerModel;


