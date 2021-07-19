/* eslint-disable no-nested-ternary */

import React, { useState } from 'react'
import { Input, Form, message, Button, Select, Row, Col, Modal, Tag } from 'antd';
import {
  typeDefinitions as GET_GENREDATA,
  delegates as GET_GENRETABLE,
  createGraphQLFieldDefinition as POST_ADD_PROPERTY,
  updateGraphQLFieldDefinition as POST_UPDATE_PROPERTY,
  services as GET_TABLEDATA,
  createGraphQLDelegateDefinition as POST_ADD_ENTRUST,
} from '../gqls/api.gql';
import {
  useQuery, useMutation,
} from '@apollo/client';

const FormItem = Form.Item;
const { Option } = Select;

interface PropertyModelProps {
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

function PropertyModel(props: PropertyModelProps) {
  const { updateState, edit, recordData, refetch, genreId, selectedNodes, showTypeInput, apiTypes, api } = props;
  const requestMethodTcon = ['query', 'create', 'update', 'delete'];
  const [state, setState] = useState({
    parameter: false,
    argumentsObj: (recordData && recordData.arguments) || [],
    tags: [],
    argumentsData: {},
    newly: true,
    presentId: '',
    delegateVisible: false,
    apiType: props && props.recordData && props.recordData.type || '',
  })
  console.log('recordData---------', recordData)
  const localityState = (value: any) => {
    setState({
      ...state,
      ...value,
    });
  };

  const updateDelegateState = (value: any) => {
    setState({
      ...state,
      ...value,
      apiType: value,
    });
  };


  const [form] = Form.useForm();
  const [formS] = Form.useForm();
  const [delegateform] = Form.useForm();
  // form.resetFields();
  const { data } = useQuery(GET_GENREDATA);
  const { data: entrustData } = useQuery(GET_GENRETABLE);
  const { data: servicesData } = useQuery(GET_TABLEDATA);
  const { typeDefinitions = [] } = data || {};
  const { delegates = [] } = entrustData || {};
  const [addProperty] = useMutation(POST_ADD_PROPERTY);
  const [addEntrust] = useMutation(POST_ADD_ENTRUST);
  const [editProperty] = useMutation(POST_UPDATE_PROPERTY);
  const { services = [] } = servicesData || {};
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { offset: 22, span: 2 },
  };

  const handleSubmit = async () => {
    // console.log('selectedNodes', selectedNodes)
    const values = await form.validateFields();

    values.type = {
      repeated: values.repeated === "是" ? true : false,
      required: values.required === "是" ? true : false,
      kind: values.kind,
    };
    delete values.repeated;
    delete values.required;
    delete values.kind;
    delete values.arguments;

    if (values.delegate) {
      values.delegate = [values.delegate];
    } else {
      delete values.delegate
    }

    if (values.tags) {
      values.tags = [values.tags];
    } else {
      delete values.tags;
    }

    if (!!state.argumentsObj.length) {
      values.arguments = state.argumentsObj;
    }

    if (values.interfaces) {
      values.interfaces = [values.interfaces]
    } else {
      delete values.interfaces
    }

    values.deprecated = values.deprecated === "是" ? true : false;

    if (selectedNodes != undefined && selectedNodes.id) {
      values.apiType = selectedNodes.id;
    } else {
      delete values.apiType;
    }

    if (values.types) {
      values.types = [values.types]
    } else {
      delete values.types
    }
    if (values.arguments != undefined && values.arguments.length > 0) {
      const dataAll = [];
      for (const item of values.arguments) {
        const typeData = {
          id: item.id,
          name: item.name,
          description: item.description,
          defaultValue: item.defaultValue,
          type: {
            repeated: item.type.repeated,
            required: item.type.required,
            kind: item.type.kind.id || item.type.kind
          }
        };
        dataAll.push(typeData);
      }
      values.arguments = dataAll;
      // values.arguments.forEach((item: any) => (
      //     item.type = {
      //       repeated: item.type.repeated,
      //       required: item.type.required,
      //       kind: item.type.kind.id || item.type.kind,
      //     },
      //     delete item.__typename
      // ))
    }
    // console.log("222222222", values)
    if (edit) {
      // 编辑时提交
      delete values.id;
      delete values.name;
      const resEdit = await editProperty({
        variables: {
          id: recordData.id,
          input: values,
        },
      }).catch(error => {
        message.error('修改失败！', error);
      });

      if (resEdit && resEdit.data && resEdit.data.updateGraphQLFieldDefinition && resEdit.data.updateGraphQLFieldDefinition.id) {
        updateState({
          visible: false,
          edit: false,
        });
        form.resetFields();
        await refetch()
        message.success('修改成功', 3);
      } else {
        message.error('修改失败！');
      }
      // console.log('修改弹窗入参', values)
    } else {
      const rootType = selectedNodes ? values.icon === 'query' ? 'Query' : 'Mutation' : genreId;
      console.log('fsdjfbdcbdvdfvfeve', values.id);
      const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

      if (reg.test(values.id)) {
        console.log('sdfwewefdvdvd', values.id);
        message.error('英文名包含中文，请重新输入！');
      } else {
        const params = {
          rootType,
          schema: 'master',
          input: values,
        }
        // let params = {}
        // if (selectedNodes) {
        //   params = {
        //     rootType,
        //     schema: 'master',
        //     input: values,
        //   }
        // } else {
        //   params = {
        //     rootType,
        //     schema: 'master',
        //     input: values,
        //   }
        // }
        // console.log('新增弹窗入参', params)
        const res = await addProperty({ variables: params }).catch(error => {
          message.error('新建失败！', error);
        });
        if (res && res.data && res.data.createGraphQLFieldDefinition && res.data.createGraphQLFieldDefinition.id) {
          updateState({
            visible: false,
            edit: false,
          });
          form.resetFields();
          await refetch()
          message.success('新建成功', 3);
        } else {
          message.error('新建失败！');
        }
      }

    }
  };

  const addService = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    formS.resetFields();
    localityState({ parameter: true, newly: true })
  }

  const hideModal = () => {
    localityState({ parameter: false });
    formS.resetFields();
  }

  // 添加参数
  const argumentsSubmit = async () => {
    const value = await formS.getFieldsValue([
      'id',
      'name',
      'description',
      'defaultValue',
      'repeated',
      'required',
      'kind',
    ]);

    const argumentValue = {
      id: value.id,
      name: value.name,
      description: value.description,
      defaultValue: value.defaultValue,
      type: {
        repeated: value.repeated === '' ? Boolean : value.repeated,
        required: value.required === '' ? Boolean : value.required,
        kind: value.kind,
      },
    };

    if (state.newly) {
      const obj = state.argumentsObj;
      obj.push(argumentValue);
      await formS.validateFields(['id', 'name', 'description', 'defaultValue', 'repeated', 'required', 'kind'])
          .then(values => {
            localityState({
              argumentsObj: obj,
              parameter: false,
            });
            formS.resetFields();
          }).catch(errorInfo => {
            console.log('errorInfo', errorInfo)
          });

    } else {
      const originalData = state.argumentsObj;
      const pitch = [state.presentId];
      const newestData = originalData.filter(function (item: any) {
        return pitch.indexOf(item.id) < 0;
      })
      newestData.push(argumentValue);
      await formS.validateFields(['id', 'name', 'description', 'defaultValue', 'repeated', 'required', 'kind'])
          .then(values => {
            localityState({
              argumentsObj: newestData,
              parameter: false,
            })
            formS.resetFields();
          }).catch(errorInfo => {
            console.log('errorInfo', errorInfo)
          });
    }
  }

  const preventDefault = (tag: any) => (e: any) => {
    e.preventDefault();
    const obj = state.argumentsObj;
    const b = [tag.id];
    const newest = obj.filter(function (item: any) {
      return b.indexOf(item.id) < 0;
    })
    localityState({
      argumentsObj: newest,
    });
  }

  const handleChange = (value: any) => () => {
    formS.resetFields();
    localityState({
      argumentsData: value,
      parameter: true,
      newly: false,
      presentId: value.id,
    })
  };

  const delegateHideModal = () => {
    updateDelegateState({
      delegateVisible: false
    });
  }

  const { delegateVisible, apiType } = state;

  const handleChangeVisible = () => {
    updateDelegateState({ delegateVisible: true })
  };

  const handleDelegateSubmit = async () => {
    const values = await delegateform.validateFields();
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

    const res = await addEntrust({ variables: { input: values } }).catch(error => {
      message.error("新建失败！", error);
    });

    if (res.data.createGraphQLDelegateDefinition && res.data.createGraphQLDelegateDefinition.id) {
      recordData.delegate = res.data.createGraphQLDelegateDefinition;
      delegates.push(recordData.delegate);
      form.setFieldsValue({ delegate: recordData.delegate.id});
      updateDelegateState({
        delegateVisible: false,
        edit: false
      });
      // console.log(form.getFieldsValue());
      // setTimeout(() => {
      //   form.setFieldsValue({ delegate: recordData.delegate.id});
      //     console.log(form.getFieldsValue());
      // }, 1000);

      // form.resetFields();
      // await refetch()
      message.success('新建成功', 3);
    }else {
      message.error("新建失败！");
    }
  };

  const { parameter, argumentsObj, argumentsData, newly } = state;

  //console.log("1111111111720", recordData);
  // console.log("delegates", delegates)
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', form.getFieldsValue());

  return (
      <>
        <Form
            {...layout}
            form={form}
        >
          <FormItem
              label="英文名"
              name="id"
              initialValue={edit ? recordData.id : ''}
              // rules={[{ required: true, message: '英文名必填(请输入纯英文)', pattern: /^[A-Za-z]*\.[A-Za-z]+$/    /^[^\s]*$/;}]}
              rules={[{ required: true, message: '英文名必填' }, {  message: '请输入纯英文', pattern: new RegExp(/^[^\u4e00-\u9fa5]+$/)}, {  message: '不允许输入空格', pattern: new RegExp(/^[^\s]*$/)}]}
          >
            <Input placeholder="例如: Query.employee" disabled={edit} />
          </FormItem>

          <FormItem
              label="名称"
              name="name"
              initialValue={edit ? recordData.name : ''}
              rules={[{ required: true, message: '名称必填'}, { message: '请输入纯英文', pattern: new RegExp(/^[^\u4e00-\u9fa5]+$/)  }, {  message: '不允许输入空格', pattern: new RegExp(/^[^\s]*$/)}]}
          >
            <Input placeholder="例如: employee" disabled={edit} />
          </FormItem>

          {
            showTypeInput ?
                <FormItem
                    label="分类"
                    name="apiType"
                    initialValue={edit ? api.api.type.id : ''}
                    rules={[{ required: true, message: '请选择一种分类' }]}
                >
                  <Select style={{ width: '564px' }}
                          allowClear
                          showSearch
                          getPopupContainer={triggerNode => triggerNode.parentElement}
                          filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                  >
                    {
                      apiTypes.apiTypes.map(v => <Option value={v.id} key={v.id}>{v.name}</Option>)
                    }
                  </Select>
                </FormItem> : ''
          }
          {
            selectedNodes ?
                <FormItem
                    label="请求方式"
                    name="icon"
                    initialValue={edit ? api.api.icon : ''}
                    rules={[{ required: true, message: '请选择一种请求方式' }]}
                >
                  <Select style={{ width: '564px' }}
                          allowClear
                          showSearch
                          getPopupContainer={triggerNode => triggerNode.parentElement}
                          filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                  >
                    {
                      requestMethodTcon.map(v => <Option value={v} key={v}>{v}</Option>)
                    }
                  </Select>
                </FormItem> : ''
          }
          <FormItem
              label="中文名"
              name="title"
              initialValue={edit ? recordData.title : ''}
              rules={[{ required: true, message: '中文名必填(请输入正确格式)' }]}
          >
            <Input />
          </FormItem>

          <FormItem
              label="标记"
              name="tags"
              initialValue={edit ? recordData.tags && recordData.tags[0] : ''}
          >
            <Input />
          </FormItem>

          <FormItem
              label="描述"
              name="description"
              initialValue={edit ? recordData.description : ''}
          >
            <Input />
          </FormItem>

          <FormItem
              label="默认值"
              name="defaultValue"
              initialValue={edit ? recordData.defaultValue : ''}
          >
            <Input />
          </FormItem>


          <Row>
            <Col span={24}>
              <FormItem
                  label="委托"
                  name="delegate"
                  initialValue={edit ? recordData.delegate && recordData.delegate.name : ''}
              >
                <Select style={{ width: '500px' }}
                        allowClear
                        showSearch
                        getPopupContainer={triggerNode => triggerNode.parentElement}
                >
                  {
                    delegates.map((v: any) => <Option value={v.id} key={v.id}>{v.name}</Option>)
                  }
                </Select>
              </FormItem>

            </Col>
            <Col style={{position: "absolute",right:88}}>
              <Button type="primary" shape="circle" onClick={handleChangeVisible}>
                +
              </Button>
            </Col>
          </Row>

          <FormItem
              label="不推荐使用"
              name="deprecated"
              initialValue={edit ? recordData.deprecated === true ? "是" : "否" : "否"}
          >
            <Select
                style={{ width: 564 }}
                getPopupContainer={triggerNode => triggerNode.parentElement}
            >
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
          </FormItem>

          <Row>
            <Col span={24}>返回类型</Col>
          </Row>

          <FormItem
              label="是否为数组"
              name="repeated"
              initialValue={edit ? recordData.type && recordData.type.repeated === true ? '是' : '否' : ''}
              rules={[{ required: true, message: '是否为数字必选' }]}
          >
            <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} placeholder="是否为数组">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
          </FormItem>

          <FormItem
              label="是否必填"
              name="required"
              initialValue={edit ? ((recordData && recordData.type) ? recordData.type.required === true ? '是' : '否' : '') : ''}
              rules={[{ required: true, message: '是否必填必选' }]}
          >
            <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} placeholder="是否必填">
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>
          </FormItem>

          <FormItem
              label="类型"
              name="kind"
              initialValue={edit ? recordData.type && recordData.type.kind && recordData.type.kind.id : ''}
              rules={[{ required: true, message: '类型必选' }]}
          >
            <Select style={{ width: '564px' }}
                    allowClear
                    showSearch
                    getPopupContainer={triggerNode => triggerNode.parentElement}
            >
              {
                typeDefinitions.map((v: any) => <Option value={v.name} key={v.name}>{v.name}</Option>)
              }
            </Select>
          </FormItem>

          <FormItem
              label="参数"
              name="arguments"
          >
            <div>
              {(argumentsObj || []).map((tag: any, index: any) => (
                  <Tag key={index} closable onClick={handleChange(tag)} onClose={preventDefault(tag)} >
                    {tag.name} ：{tag.type.kind && tag.type.kind.id ? tag.type.kind.id : tag.type.kind}
                  </Tag>
              ))}
              <i className='iconfont icontianjia_add leftIcon' onClick={addService} />
            </div>

          </FormItem>

          <FormItem {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              确认
            </Button>
          </FormItem>
        </Form>

        <Modal
            destroyOnClose
            width="800px"
            title={newly ? '新建参数' : '修改参数'}
            visible={parameter}
            onCancel={hideModal}
            footer={null}
        >
          <Form
              {...layout}
              form={formS}
          >
            <FormItem
                label="参数id"
                name="id"
                rules={[{ required: true, message: '参数id必填' }]}
                initialValue={newly ? '' : argumentsData.id}
            >
              <Input placeholder="例如: Query.users.page" />
            </FormItem>

            <FormItem
                label="参数名称"
                name="name"
                rules={[{ required: true, message: '参数名称必填' }]}
                initialValue={newly ? '' : argumentsData.name}
            >
              <Input placeholder="例如: page" />
            </FormItem>

            <FormItem
                label="参数描述"
                name="description"
                initialValue={newly ? '' : argumentsData.description}
            >
              <Input />
            </FormItem>

            <FormItem
                label="参数默认值"
                name="defaultValue"
                initialValue={newly ? '' : argumentsData.defaultValue}
            >
              <Input />
            </FormItem>

            <Row>
              <Col span={24}>参数返回类型</Col>
            </Row>

            <FormItem
                label="是否为数组"
                name="repeated"
                rules={[{ required: true, message: '是否为数组必选' }]}
                initialValue={newly ? "" : argumentsData.type && argumentsData.type.repeated}
            >
              <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} placeholder="是否为数组">
                <Option value={true}>是</Option>
                <Option value={false}>否</Option>
              </Select>
            </FormItem>

            <FormItem
                label="是否必填"
                name="required"
                rules={[{ required: true, message: '是否必填必选' }]}
                initialValue={newly ? "" : argumentsData.type && argumentsData.type.required}
            >
              <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} placeholder="是否必填">
                <Option value={true}>是</Option>
                <Option value={false}>否</Option>
              </Select>
            </FormItem>

            <FormItem
                label="参数类型"
                name="kind"
                rules={[{ required: true, message: '参数类型必选' }]}
                initialValue={newly ? '' : argumentsData.type && argumentsData.type.kind && argumentsData.type.kind.id ? argumentsData.type.kind.id : argumentsData.type.kind}
            >
              <Select style={{ width: '564px' }}
                      allowClear
                      showSearch
                      getPopupContainer={triggerNode => triggerNode.parentElement}
              >
                {
                  typeDefinitions.map((v: any) => <Option value={v.name} key={v.name}>{v.name}</Option>)
                }
              </Select>
            </FormItem>

            <FormItem {...tailLayout}>
              <Button type="primary" htmlType="submit" onClick={argumentsSubmit}>
                确认
              </Button>
            </FormItem>
          </Form>
        </Modal>

        <Modal
            width="800px"
            title={"新建"}
            visible={delegateVisible}
            onCancel={delegateHideModal}
            footer={null}>
          <Form
              {...layout}
              name='global_state'
              form={delegateform}
          >
            <FormItem
                label="中文名"
                name="name"
                rules={[{ required: true, message: '中文名必填' }]}
            >
              <Input />
            </FormItem>

            <FormItem
                label="英文名"
                name="id"
                rules={[{ required: true, message: '英文必填(请输入纯英文)', pattern: /^[A-Za-z]+$/ }]}
            >
              <Input disabled={edit} />
            </FormItem>

            <FormItem
                label="服务"
                name="service"
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
                rules={[{ required: true, message: '类型必选' }]}
            >
              <Select style={{ width: 564 }} onChange={updateDelegateState}>
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
                >
                  <Input placeholder="例如 !obj.employee" />
                </FormItem>

                <FormItem
                    label="请求接口"
                    name="query"
                >
                  <Input placeholder="例如 Query.employee" />
                </FormItem>

                <FormItem
                    label="赋值属性"
                    name="args"
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
                >
                  <Input />
                </FormItem>

                <FormItem
                    label="请求方式"
                    name="method"
                >
                  <Select style={{ width: 564 }} >
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
                >
                  <Input />
                </FormItem>
              </div>
            }

            <FormItem {...tailLayout}>
              <Button type="primary" htmlType="submit" onClick={handleDelegateSubmit}>
                确认
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </>
  )
}

export default PropertyModel;
