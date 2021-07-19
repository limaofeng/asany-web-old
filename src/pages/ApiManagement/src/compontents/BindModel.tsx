/* eslint-disable no-nested-ternary */

import React, { useState } from 'react'
import { Form, Select, Button, message } from 'antd';
import { useQuery, useMutation } from "@apollo/client";
import { schemaApis as GET_SCHEMAAPIS, bindApi as POST_BINDAPI } from '../gqls/api.gql';
const FormItem = Form.Item;
const { Option } = Select;

interface BindModelProps {
  updateState: (value: any) => void;
  visible?: boolean;
  edit?: boolean;
  recordData?: any;
  refetch: any;
  genreId: string;
  selectedNodes?: any;
  selectKey?: any;
  showTypeInput?: boolean;
  apiTypes?: any; // apiTypes类型数据
  api?: any;
}

function BindModel(props: BindModelProps) {
  const { edit, recordData, selectedNodes, updateState, refetch } = props;
  const { data } = useQuery(GET_SCHEMAAPIS);
  const [bindApi] = useMutation(POST_BINDAPI );

  const [state, setState] = useState({
    parameter: false,
    argumentsObj: (recordData && recordData.arguments) || [],
    tags: [],
    argumentsData: {},
    newly: true,
    presentId: '',
    delegateVisible: false,
    apiType: props && props.recordData && props.recordData.type || '',
    selectApisArr: [], // 选中的职务列表
    selectApis: []
  });

  const [form] = Form.useForm();

  const { schema = { apis: []} } = data || '';

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { offset: 22, span: 2 },
  };

  const  handleSelectChange = (data: any) => async (value: any) => {
    const selectJobsArrTemp = [];
    for (const k in value) {
      selectJobsArrTemp.push({ name: value[k] });
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const res = await bindApi({ variables: { fields: values.fields, apiType: selectedNodes.id} }).catch(error => {
        message.error("新建失败！", error);
      });
      if (res.data.bindApi && res.data.bindApi === true) {
          updateState({
            visible: false,
            edit: false
          });
          form.resetFields();
          await refetch();
          message.success('新建成功', 3);
      } else {
        message.error("新建失败！");
      }
  };

  return (
      <>
        <Form
            {...layout}
            form={form}
        >
          <FormItem
              label="接口"
              name="fields"
              rules={[{ required: true, message: '接口必选' }]}
          >
            <Select style={{ width: '564px' }} mode="tags" onChange={handleSelectChange(schema && schema.apis)}>
              {schema.apis &&
                schema.apis.map((v: any) => <Option value={v.id} key={v.id}>{v.id}</Option>)}
            </Select>
          </FormItem>
          <FormItem {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              确认
            </Button>
          </FormItem>
        </Form>
      </>
  )
}

export default BindModel;
