import React from 'react';
import { Input, Form, message, Button } from "antd";
import { createApiTypeManage as POST_ADD_MODULE, updateApiTypeManage as POST_EDIT } from './../gqls/api.gql';
import { useMutation } from '@apollo/client';

const FormItem = Form.Item;
const { TextArea } = Input;

interface FormModelProps {
  selectedNodes: object,
  updateState: (value: any) => void;
  visible?: boolean;
  edit?: boolean;
  selectKey: string;
  refetch: any;
}

function FormModel(props: FormModelProps) {
  const [form] = Form.useForm();
  form.resetFields();
  const [addModuleData] = useMutation(POST_ADD_MODULE);
  const [editModuleData] = useMutation(POST_EDIT);
  const { updateState, selectedNodes, edit, selectKey, refetch } = props;
  const tailLayout = {
    wrapperCol: { offset: 22, span: 2 },
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (edit) {
      //编辑时提交
      if (selectedNodes.parentId) {
        values.parent = selectedNodes.parentId;
      }
      delete values.id;
      const editModul = await editModuleData({
        variables: {
          id: selectedNodes.id,
          input: values,
        }
      }).catch(error => {
        message.error("修改失败！", error)
      });
      if (editModul.data.updateApiTypeManage && editModul.data.updateApiTypeManage.id) {
        updateState({
          visible: false,
          edit: false
        });
        form.resetFields();
        await refetch();
        message.success('修改成功', 3);
      } else {
        message.error("修改失败！")
      }
    } else {
      if (selectKey === "1") {
        values.parent = selectedNodes.id;
      }
      const addModule = await addModuleData({ variables: { input: values } }).catch(error => {
        message.error("新建失败！", error);
      });

      if (addModule.data.createApiTypeManage && addModule.data.createApiTypeManage.id) {
        updateState({
          visible: false,
          edit: false
        });
        form.resetFields();
        await refetch()
        message.success('新建成功', 3);
      } else {
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
        label="模块名称"
        name="name"
        initialValue={edit ? selectedNodes.name : ""}
        rules={[{ required: true, message: '模块名称必填' }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="模块英文名"
        name="id"
        initialValue={edit ? selectedNodes.id : ""}
        rules={[{ required: true, message: '模块英文名必填', pattern: /^[A-Za-z]+$/ }]}
      >
        <Input disabled={edit} />
      </FormItem>

      <FormItem
        label="模块概述"
        name="note"
        initialValue={edit ? selectedNodes.note : ""}
        rules={[{ required: true, message: '模块概述必填' }]}
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

export default FormModel;


