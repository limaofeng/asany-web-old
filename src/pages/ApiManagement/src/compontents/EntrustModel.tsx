import React, { useState } from 'react';
import { Input, Form, message, Button, Select } from "antd";
import { updateGraphQLDelegateDefinition as POST_UPDATE_ENTRUST, services as GET_TABLEDATA, createGraphQLDelegateDefinition as POST_ADD_ENTRUST } from './../gqls/api.gql';
import { useQuery, useMutation } from '@apollo/client';

const FormItem = Form.Item;
const { Option } = Select;
interface ServerModelProps {
  updateState: (value: any) => void;
  visible?: boolean;
  edit?: boolean;
  recordData?: any;
  refetch: any;
}

function ServerModel(props: ServerModelProps) {
  const [state, setState] = useState({
    apiType: props && props.recordData && props.recordData.type || '',
  })
  const [form] = Form.useForm();
  // form.resetFields();
  const { data, error, refetch: servicesRefetch } = useQuery(GET_TABLEDATA);
  const [addEntrust] = useMutation(POST_ADD_ENTRUST);
  const [editEntrust] = useMutation(POST_UPDATE_ENTRUST);
  const { updateState, edit, recordData, refetch } = props;

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { offset: 22, span: 2 },
  };

  const { services = [] } = data || {};
  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (apiType === "Rewrite") {
      values.rule = { reject: values.reject, query: values.query, args: values.args };
      delete values.reject;
      delete values.query;
      delete values.args;
    } else if (apiType === "Restful") {
      values.rule = { path: values.path, method: values.method, parameter: values.parameter }
      delete values.path;
      delete values.method;
      delete values.parameter;
    }

    if (edit) {
      //编辑时提交
      const resEdit = await editEntrust({
        variables: {
          id: recordData.id,
          input: values,
        }
      }).catch(error => {
        message.error("修改失败！", error);
      });
      if (resEdit.data.updateGraphQLDelegateDefinition && resEdit.data.updateGraphQLDelegateDefinition.id) {
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
      const res = await addEntrust({ variables: { input: values } }).catch(error => {
        message.error("新建失败！", error);
      });
      if (res.data.createGraphQLDelegateDefinition && res.data.createGraphQLDelegateDefinition.id) {
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

  const pitch = (value: "") => {
    setState({
      apiType: value
    });
  }

  const { apiType } = state;

  return (
    <Form
      {...layout}
      name='global_state'
      form={form}
    >
      <FormItem
        label="中文名"
        name="name"
        initialValue={edit ? recordData.name : ""}
        rules={[{ required: true, message: '中文名必填' }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="英文名"
        name="id"
        initialValue={edit ? recordData.id : ""}
        rules={[{ required: true, message: '英文名必填' }, {  message: '请输入纯英文', pattern: new RegExp(/^[^\u4e00-\u9fa5]+$/)}]}
      >
        <Input disabled={edit} />
      </FormItem>

      <FormItem
        label="服务"
        name="service"
        initialValue={edit ? recordData.service && recordData.service.id : ""}
        rules={[{ required: true, message: '服务必填' }]}
      >
        <Select style={{ width: "564px" }}
          filterOption={false}
        >
          {
            services.map(v => {
              return <Option value={v.id} key={v.id}>{v.name}</Option>
            })
          }
        </Select>
      </FormItem>

      <FormItem
        label="类型"
        name="type"
        initialValue={edit ? recordData.type : ""}
        rules={[{ required: true, message: '类型必选' }]}
      >
        <Select style={{ width: 564 }} onChange={pitch}>
          <Option value="Direct">Direct</Option>
          <Option value="Rewrite">Rewrite</Option>
          <Option value="Script">Script</Option>
          <Option value="Restful">Restful</Option>
          <Option value="Local">Local</Option>
          <Option value="RefRewrite">RefRewrite</Option>
        </Select>
      </FormItem>

      {
        apiType === "Rewrite" && <div>
          <FormItem
            label="委托字段"
            name="reject"
            initialValue={edit ? recordData.rule && recordData.rule.reject[0] : ""}
          >
            <Input placeholder="例如 !obj.employee" />
          </FormItem>

          <FormItem
            label="请求接口"
            name="query"
            initialValue={edit ? recordData.rule && recordData.rule.query : ""}
          >
            <Input placeholder="例如 Query.employee" />
          </FormItem>

          <FormItem
            label="赋值属性"
            name="args"
            initialValue={edit ? recordData.rule && recordData.rule.args[0] : ""}
          >
            <Input placeholder="例如 id = obj.employee.id" />
          </FormItem>
        </div>
      }

      {
        apiType === "Restful" && <div>
          <FormItem
            label="路径"
            name="path"
            initialValue={edit ? recordData.rule.path : ""}
          >
            <Input />
          </FormItem>

          <FormItem
            label="请求方式"
            name="method"
            initialValue={edit ? recordData.rule.method : ""}
          >
            <Select style={{ width: 564 }} allowClear={true} >
              <Option value="post">post</Option>
              <Option value="get">get</Option>
              <Option value="put">put</Option>
              <Option value="delete">delete</Option>
              <Option value="patch">patch</Option>
            </Select>
          </FormItem>

          <FormItem
            label="请求参数"
            name="parameter"
            initialValue={edit ? recordData.rule.parameter : ""}
          >
            <Input />
          </FormItem>
        </div>
      }

      <FormItem {...tailLayout}>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          确认
        </Button>
      </FormItem>
    </Form>
  )
}

export default ServerModel;


