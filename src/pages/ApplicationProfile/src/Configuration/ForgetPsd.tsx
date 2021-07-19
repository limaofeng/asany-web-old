import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Col, Divider, Input, Row, Switch, Tag, Tooltip, Modal, message, Space, Form, Radio, InputNumber, Select } from 'antd';
import './style/index.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useMutation } from '@apollo/client';
import {
  sendConfigures as SENDCONFIG, updateSendConfigure as UPDATESENDCONFIGURE, emailTemplates as EMAILTEMPLATES, emailSystemAccounts as EMAILSYSTEMACCOUNTS,
  smsTemplates as SMSTEMPLATES, processDefinitions as PROCESSDEFINITIONS
} from '../gqls/ApplicationGql.gql';
import { isEqual } from 'lodash'
function deepCompareEquals(a: any, b: any) {
  return isEqual(a, b);
}
const { Option } = Select;
function useDeepCompareMemoize(value: any) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier
  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

export function useDeepCompareEffect(effect: React.EffectCallback, dependencies?: Object) {
  useEffect(effect, useDeepCompareMemoize(dependencies));
}
interface ForgetPsdProps {
  /** 阿波罗服务 */
  client: any;

  /** 路由数据绑定 */
  location: any;
}

function ForgetPsd(props: ForgetPsdProps) {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("");
  const [form] = Form.useForm();
  const showModal = (value: any) => (e: any) => {
    setVisible(true)
    setType(value.type)
    form.setFieldsValue(value);
  };

  const { location } = props;
  console.log("locations", location);
  const [updateSendConfig] = useMutation(UPDATESENDCONFIGURE);
  const { data: forgetConfig, loading, refetch } = useQuery(SENDCONFIG, {
    variables: {
      "filter": {
        appId: location.state.data.id
      }
    },
    fetchPolicy: 'no-cache'
  });
  const { sendConfigures = [] } = forgetConfig || [];
  sendConfigures.map((item: any) => {
    switch (item.type) {
      case "email":
        item.typeName = "邮件";
        break;
      case "massage":
        item.typeName = "短信";
        break;
      case "flow":
        item.typeName = "流程";
        break;
      default:
        item.typeName = "";
        break;
    }
  })
  console.log("send>:>:>:>:>:>:>:>", sendConfigures);
  const switchChange = (value: any) => async (e: any) => {
    const sendIds = value.id;
    const { id, typeName, __typename, disable, ...restValues } = value;
    restValues.disable = e;
    try {
      await updateSendConfig({
        variables: {
          id: sendIds,
          input: restValues
        }
      });
      message.success('修改成功');
      refetch();
    } catch (err) {
      message.warn(err.message);
    }
  }

  const handleOk = async (value: any) => {
    form.validateFields().then( async values => {
      const sendIds = values.id;
      const { id, typeName, __typename, disable, ...restValues } = values;
      restValues.type = type;
      try {
        await updateSendConfig({
            variables: {
                id:sendIds,
                input:restValues
            }
        });
        message.success('修改成功');
        refetch();
        setVisible(false)
    } catch (err) {
        message.warn(err.message);
    }
  })
  }

  const handleCancel = (e: any) => {
    setVisible(false)
  };
  //查询邮件模版
  const { data: emailTes } = useQuery(EMAILTEMPLATES, {
    variables: {
      "filter": {

      }
    },
    fetchPolicy: 'no-cache'
  });
  const { emailTemplates = [] } = emailTes || [];

  //查询邮件发件箱
  const { data: emailAcctount } = useQuery(EMAILSYSTEMACCOUNTS);
  const { emailSystemAccounts = [] } = emailAcctount || [];


  //查询 短信模版
  const { data: smsTem } = useQuery(SMSTEMPLATES);


  const {smsTemplates  = []} = smsTem || [];

  let templateData = [];

  if(type === "email"){
    templateData = emailTemplates;
  }else{
    templateData = smsTemplates;
  }

  //查询流程
  const { data: process } = useQuery(PROCESSDEFINITIONS, {
    variables: {
      "filter": {
        "category": "452"
      }
    },
    fetchPolicy: 'no-cache'
  });
  const { processDefinitions = { edges: [] } } = process || {};

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Row>
        <Col span={24}>忘记密码找回配置</Col>
      </Row>
      <Row>
        {sendConfigures &&
          !!sendConfigures.length && sendConfigures.map((m: any) => (
            <Col span={8}>
              <Space>
                <div className="text-main text-sm text-uppercase text-bold">{m.typeName}</div>
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="关闭"
                  onChange={switchChange(m)}
                  checked={m.disable}
                />{
                  m.disable == true && <a onClick={showModal(m)}>配置</a>
                }
              </Space>
            </Col>
          ))}
      </Row>
      <Modal forceRender title="修改" visible={visible} onOk={handleOk} onCancel={handleCancel} width={820}>
        <Form form={form}>
          <Form.Item label="id" name="id" hidden>
            <Input />
          </Form.Item>
          {
            (
              type === "email" || type === "massage"
            ) &&
            <>
              <Form.Item label="模版" name="template">
                <Select showSearch placeholder="请选择">
                  {templateData &&
                    !!templateData.length &&
                    templateData.map((m: any) => (
                      <Option value={m.id}>
                        {m.templateName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="发件箱" name="outbox">
                <Select showSearch placeholder="请选择">
                  {emailSystemAccounts &&
                    !!emailSystemAccounts.length &&
                    emailSystemAccounts.map((m: any) => (
                      <Option value={m.id}>
                        {m.account.account}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="到期时间" name="effectiveDuration">
                <Input />
              </Form.Item>

              <Form.Item label="跳转路径" name="path">
                <Input />
              </Form.Item>

              <Form.Item label="验证码的长度" name="wordLength">
                <Input />
              </Form.Item>

              <Form.Item label="验证码随机字符串" name="randomWord">
                <Input />
              </Form.Item>

              <Form.Item label="验证码重复生成时间" name="active">
                <Input />
              </Form.Item>

              <Form.Item label="验证码验证重试次数" name="retry">
                <Input />
              </Form.Item>
            </>

          }


          {type == "flow" &&
            <Form.Item label="流程" name="processKey">
              <Select showSearch placeholder="请选择">
                {processDefinitions.edges &&
                  !!processDefinitions.edges.length &&
                  processDefinitions.edges.map((m: any) => (
                    <Option value={m.node.key}>
                      {m.node.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          }
        </Form>
      </Modal>
    </Space>

  );
}

export default ForgetPsd;
