
import React, { useState } from 'react'
import { Input, Form, message, Button, Select } from "antd";
import { createGraphQLTypeDefinition as POST_ADD_GENRE, updateGraphQLTypeDefinition as POST_UPDATE_GENRE } from './../gqls/api.gql';
import { useMutation } from '@apollo/client';

const FormItem = Form.Item;
const { Option } = Select;

interface GenreModelProps {
  updateState: (value: any) => void;
  visible?: boolean;
  edit?: boolean;
  recordData?: any;
  refetch: any;
  typeDefinitions: any;
}

function GenreModel(props: GenreModelProps) {
  const [state, setState] = useState({
    kindType: props && props.recordData && props.recordData.kind || '',
  })
  const [form] = Form.useForm();
  // form.resetFields();
  const [addGenre] = useMutation(POST_ADD_GENRE);
  const [editGenre] = useMutation(POST_UPDATE_GENRE);
  const { updateState, edit, recordData, refetch, typeDefinitions } = props;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { offset: 22, span: 2 },
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (kindType === "Enum") {
      values.enumerations = {
        id: values.enumerationsId,
        name: values.enumerationsName,
        title: values.enumerationsTitle,
        deprecated: values.enumerationsDeprecated === "" ? Boolean : values.enumerationsDeprecated === "是" ? true : false,
        description: values.enumerationsDescription
      }
      delete values.enumerationsId;
      delete values.enumerationsName;
      delete values.enumerationsDeprecated;
      delete values.enumerationsTitle;
      delete values.enumerationsDescription;
    }
    if (values.interfaces === undefined) {
      delete values.interfaces
    }
    if (values.types === undefined) {
      delete values.types
    }

    if (edit) {
      //编辑时提交
      delete values.name;
      const resEdit = await editGenre({
        variables: {
          id: recordData.name,
          input: values,
        }
      }).catch(error => {
        message.error("修改失败！", error);
      });

      if (resEdit.data.updateGraphQLTypeDefinition && resEdit.data.updateGraphQLTypeDefinition.id) {
        updateState({
          visible: false,
          edit: false
        });
        form.resetFields();
        await refetch()
        message.success('修改成功', 3);
      } else {
        message.error("修改失败！");
      }
    } else {
      values.graphQLSchema = "master"
      const res = await addGenre({ variables: { input: values } }).catch(error => {
        message.error("新建失败！", error);
      });

      if (res.data.createGraphQLTypeDefinition && res.data.createGraphQLTypeDefinition.id) {
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

  const linkage = (value: "") => {
    setState({
      kindType: value
    });
  }

  const { kindType } = state;
  const interfacesData: any = []

  if(recordData.interfaces && recordData.interfaces.length > 0) {
    recordData.interfaces.map((item: any) => {
      return(
        interfacesData.push(item.name)
      )
    })
  }

  const typesData: any = []
  if(recordData.types && recordData.types.length > 0) {
    recordData.types.map((item: any) => {
      return(
        typesData.push(item.name)
      )
    })
  }

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
        rules={[{ required: true, message: '名称必填(请输入纯英文)', pattern: /^[A-Za-z]+$/ }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="中文名"
        name="title"
        initialValue={edit ? recordData.title : ""}
        rules={[{ required: true, message: '中文名必填' }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="描述"
        name="description"
        initialValue={edit ? recordData.description : ""}
        rules={[{ required: true, message: '描述必填' }]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="类型"
        name="kind"
        initialValue={edit ? recordData.kind : ""}
        rules={[{ required: true, message: '类型必选' }]}
      >
        <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} onChange={linkage}>
          <Option value="Scalar">Scalar</Option>
          <Option value="Type">Type</Option>
          <Option value="Input">Input</Option>
          <Option value="Enum">Enum</Option>
          <Option value="Union">Union</Option>
          <Option value="Interface">Interface</Option>
        </Select>
      </FormItem>

      {
        kindType === "Enum" && <div>
          <FormItem
            label="枚举id"
            name="enumerationsId"
            initialValue={edit ? recordData.enumerations && recordData.enumerations[0] && recordData.enumerations[0].id : ""}
            rules={[{ message: '请输入纯英文', pattern: /^[A-Za-z]+$/ }]}
          >
            <Input placeholder="例如：InterfaceType.QUERY" />
          </FormItem>

          <FormItem
            label="枚举名称"
            name="enumerationsName"
            initialValue={edit ? recordData.enumerations && recordData.enumerations[0] && recordData.enumerations[0].name : ""}
            rules={[{ message: '请输入纯英文', pattern: /^[A-Za-z]+$/ }]}
          >
            <Input placeholder="例如：QUERY" />
          </FormItem>

          <FormItem
              label="枚举标题"
              name="enumerationsTitle"
              initialValue={edit ? recordData.enumerations && recordData.enumerations[0] && recordData.enumerations[0].title : ""}
              // rules={[{ message: '请输入纯英文', pattern: /^[A-Za-z]+$/ }]}
          >
            <Input/>
          </FormItem>

          <FormItem
            label="是否弃用"
            name="enumerationsDeprecated"
            initialValue={edit ? recordData.enumerations && recordData.enumerations[0] && recordData.enumerations[0].deprecated : ""}
          >
            <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement}>
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
          </FormItem>

          <FormItem
            label="枚举描述"
            name="enumerationsDescription"
            initialValue={edit ? recordData.enumerations && recordData.enumerations[0] && recordData.enumerations[0].description : ""}
          >
            <Input />
          </FormItem>
        </div>
      }

      <FormItem
        label="继承的类型"
        name="interfaces"
        // initialValue={edit ? recordData.interfaces && recordData.interfaces[0] && recordData.interfaces[0].name : ""}
        initialValue={edit ? interfacesData : void[0]}
      >
        <Select style={{ width: "564px" }}
          mode="multiple"
          allowClear={true}
          showSearch={true}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          {
            typeDefinitions.map(v => {
              return <Option value={v.name} key={v.name}>{v.name}</Option>
            })
          }
        </Select>
      </FormItem>

      <FormItem
        label="联合类型"
        name="types"
      // initialValue={edit ? recordData.types && recordData.types[0] && recordData.types[0].name : ""}
      initialValue={edit ? typesData : void[0]}
      >
        <Select style={{ width: "564px" }}
          mode="multiple"
          allowClear={true}
          showSearch={true}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          {
            typeDefinitions.map(v => {
              return <Option value={v.name} key={v.name}>{v.name}</Option>
            })
          }
        </Select>
      </FormItem>

      <FormItem {...tailLayout}>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          确认
        </Button>
      </FormItem>
    </Form>
  )
}

export default GenreModel;


