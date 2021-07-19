import React from 'react';
import { Input, Form, message, Button, Select } from "antd";
import { updateGraphQLTypeDefinition as POST_UPDATE_TYPE } from './../gqls/api.gql';
import { useMutation } from '@apollo/client';
import { any } from 'prop-types';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

interface EnumModelProps {
  updateState: (value: any) => void;
  recordData: any;
  genreId: string;
  visible?: boolean;
  edit?: boolean;
  refetch: any;
  typeData: any;
}

function EnumModel(props: EnumModelProps) {
  const [form] = Form.useForm();
  form.resetFields();
  const [updateGraphQLTypeDefinition] = useMutation(POST_UPDATE_TYPE);
  
  const { updateState,  edit,  refetch, recordData, genreId, typeData } = props;
  const tailLayout = {
    wrapperCol: { offset: 22, span: 2 },
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (values.deprecated == 'true') {
      values.deprecated = true;
    } else{
      values.deprecated = false;
    }
    if (edit) {
      const enumerationsData: any = [];
      const index = typeData.enumerations.indexOf(recordData);
      typeData.enumerations.splice(index, 1);
      
      typeData.enumerations.forEach((element: any) => {
        delete element.__typename;
        return element;
      });
      enumerationsData.push(...typeData.enumerations);
      enumerationsData.push(values);
      const editModul = await updateGraphQLTypeDefinition({
        variables: {
          id: typeData.id,
          input: {
            title: typeData && typeData.title,
            description: typeData && typeData.description,
            kind: 'Enum',
            interfaces: typeData && typeData.interfaces,
            types: typeData && typeData.types,
            enumerations: enumerationsData
          }
        }
      }).catch(error => {
        message.error("修改失败！", error)
      });
      if (editModul.data.updateGraphQLTypeDefinition && editModul.data.updateGraphQLTypeDefinition.id) {
        updateState({
          visibleEnum: false,
          editEnum: false
        });
        form.resetFields();
        await refetch();
        message.success('修改成功', 3);
      } else {
        message.error("修改失败！")
      }
    } else {
      const enumerationsData: any = [];
      typeData.enumerations.forEach((element: any) => {
        delete element.__typename;
        return element;
      });
      enumerationsData.push(...typeData.enumerations);
      enumerationsData.push(values);
      const editModul = await updateGraphQLTypeDefinition({
        variables: {
          id: typeData.id,
          input: {
            title: typeData && typeData.title,
            description: typeData && typeData.description,
            kind: 'Enum',
            interfaces: typeData && typeData.interfaces,
            types: typeData && typeData.types,
            enumerations: enumerationsData
          }
        }
      }).catch(error => {
        message.error("新建！", error)
      });
      if (editModul.data.updateGraphQLTypeDefinition && editModul.data.updateGraphQLTypeDefinition.id) {
        updateState({
          visibleEnum: false,
          editEnum: false
        });
        form.resetFields();
        await refetch();
        message.success('新建成功', 3);
      } else {
        message.error("新建失败！")
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
        label="枚举Id"
        name="id"
        initialValue={edit ? recordData.id : ""}
        rules={[{ required: true, message: '模块名称必填' }]}
      >
        <Input placeholder="例如: LoginType.password" />
      </FormItem>

      <FormItem
        label="枚举值"
        name="name"
        initialValue={edit ? recordData.name : ""}
        rules={[{ required: true, message: '模块名称必填' }]}
      >
        <Input placeholder="例如: password"/>
      </FormItem>

      {/* <FormItem
        label="是否弃用"
        name="deprecated"
        initialValue={edit ? recordData.deprecated : ""}
       //  rules={[{ required: true, message: '模块英文名必填', pattern: /^[A-Za-z]+$/ }]}
      >
        <Input />
      </FormItem> */}

        <FormItem
              label="是否弃用"
              name="deprecated"
              initialValue={edit ? recordData.deprecated === true ? "true" : "false" : "false"}
          >
            <Select
                style={{ width: 564 }}
                getPopupContainer={triggerNode => triggerNode.parentElement}
            >
              <Option value="true">true</Option>
              <Option value="false">false</Option>
            </Select>
        </FormItem>

      <FormItem
        label="描述"
        name="description"
        initialValue={edit ? recordData.description : ""}
        // rules={[{ required: true, message: '模块概述必填' }]}
      >
        <TextArea rows={4} />
      </FormItem>

      <FormItem {...tailLayout}>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          确认
        </Button>
      </FormItem>
    </Form>
  )
}

export default EnumModel;


