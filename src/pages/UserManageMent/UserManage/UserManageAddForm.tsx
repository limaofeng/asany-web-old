import {
  Cascader,
  Button,
  Col,
  DatePicker,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Radio,
  Card,
  Descriptions,
  Divider,
} from 'antd';
import { Form } from '@ant-design/compatible';
import * as React from 'react';
import { Mutation, Query, useMutation } from '@apollo/client/react/components';
import {history as router}  from 'umi';
import TableWrapper from '../components/TableWrapper';
import {
  addUser as ADD_USER,
  updateUser as UPDATE_USER,
  queryDepartments as QUERY_ALL_DEPARTMENTS,
} from '../gqls/userManage.gql';
import { generateFormFields } from '@/pages/WisdomPartyBuilding/utils/utils';
import { tree } from '@/pages/WisdomPartyBuilding/utils/utils';
import DictionarySelect from '@/pages/WisdomPartyBuilding/components/DictionarySelect';

const { Option } = Select;

class EmployeeForm extends React.Component<any, any> {
  public refetch?: any;

  public child?: any;

  state = {
    visible: false,
    updateUser: 'create',
    id: null,
    openVisible: false,
    choosenData: [], // 添加其他部门选中的部门
    tableSelectedData: [], // 表格中已有的
    onlyId: 0, // 全局唯一id
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  getDataOnChange = (date, dateString) => {
    console.log(date, dateString);
  };

  // 打开模拟框
  public openModalAdd = listData => {
    // 清除modal中已选的
    this.child.clearSelectedData();
    // 禁用在表格中已有的
    // this.child.treeDataIsDisabled(listData);
    // 保存表格已有的
    this.setState({ choosenData: [], tableSelectedData: listData, openVisible: true });
  };

  // 确定
  public handleModalOk = selectedData => {
    console.log('xuanzhongn', selectedData);
    this.setState({ openVisible: false, choosenData: selectedData });
  };

  // 取消
  public handleModalCancel = () => {
    this.setState({ openVisible: false });
  };

  public getModalRef = childRef => {
    this.child = childRef;
  };

  public deleteDepartment = (text, record, index) => {
    const tableSelectedDataTemp = this.state.tableSelectedData;
    const myIndex = tableSelectedDataTemp.findIndex(ele => ele.id === record.id);
    tableSelectedDataTemp.splice(myIndex, 1);
    this.setState({
      tableSelectedData: tableSelectedDataTemp,
      choosenData: [],
    });
  };

  public submitDepartment = (createuser, listData, selectedId) => {
    this.setState({ choosenData: [] }, () => {
      this.props.form.validateFields(async (error, values) => {
        if (!error) {
          values.birthday = values.birthday.format('YYYY-MM-DD');
          values.departments = [];
          listData.map(ele => {
            values.departments.push({
              department: ele.id,
              primary: false,
            });
          });
          values.departments.map(ele => {
            if (ele.department === selectedId) {
              ele.primary = true;
            }
          });
          if (this.props.location.state === 'create') {
            await createuser({ variables: { userInfo: values } });
            Modal.success({
              title: '用户新增成功！',
            });
            this.goBack();
          } else if (this.props.location.state === 'update') {
            await createuser({ variables: { id: this.props.match.params.id.split('_')[1], input: values } });
            Modal.success({
              title: '用户更新成功！',
            });
            this.goBack();
          }
        }
      });
    });
  };

  public goBack = () => {
    // this.props.lo.go(-1);
    window.history.back();
  };

  // 表格单选
  public selectRadio = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRadioId: selectedRows[0].id, choosenData: [] });
  };

  public clearChooseData = () => {
    this.setState({ choosenData: [] });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, submit } = this.props;
    form.validateFields(async (err, values) => {
      console.log('values of form: ', values);
      if (err) {
        return;
      }
      values.positions.forEach(ele => {
        if (ele.hasOwnProperty('value')) {
          ele.position = ele.value;
          delete ele.department;
          delete ele.value;
        }
        if (ele.primary === undefined) {
          ele.primary = false;
        }
      });
      const selectPositon = values.positions.find(ele => ele.primary === true);
      if (selectPositon.position === undefined) {
        message.warning('请先添加部门！');
        return;
      }
      await submit(values);
    });
  };

  render() {
    const { form, data, department, employee, organization } = this.props;
    console.log('传到表单里的', this.props);
    const { getFieldDecorator } = form;
    // const formItemLayout = {
    //   labelCol: { xs: { span: 24 }, sm: { span: 7 } },
    // };
    // {
    //   labelCol: { span: 4 },
    //   wrapperCol: { span: 14 },
    // }
    const org = JSON.stringify(employee) == '{}' ? organization : organization.id;
    console.log(org, 'liusha');
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form layout="horizontal" {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row>
          <Col span={14}>
            {organization ? (
              <h5 style={{ marginBottom: 10, display: 'inline-block' }}>
                当前组织: {organization && organization.name}
              </h5>
            ) : (
              <h5 style={{ marginBottom: 10, display: 'inline-block' }}>
                当前组织: {/* employee && employee.primaryDepartment.organization.name */}
              </h5>
            )}
          </Col>
        </Row>
        <br />
        <Card bordered={false}>
          <Divider>人员基本信息</Divider>
          <br />
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="工号">
                {getFieldDecorator('birthday', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="职员姓名">
                {getFieldDecorator('name', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="职员性别">
                {getFieldDecorator('sex', {})(
                  <Select allowClear style={{ width: 300 }}>
                    <Option key="女">女</Option>
                    <Option key="男">男</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="手机号">
                {getFieldDecorator('mobile', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="出生日期">
                {getFieldDecorator('birthday', {})(<DatePicker style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="年龄">
                {getFieldDecorator('email', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="邮箱">
                {getFieldDecorator('email', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="民族">
                {getFieldDecorator('sex', {})(<DictionarySelect type="9" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="入党时间">
                {getFieldDecorator('birthday', {})(<DatePicker style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="政治面貌">
                {getFieldDecorator('status', {})(
                  <Radio.Group>
                    <Radio value="正式党员">正式党员</Radio>
                    <Radio value="预备党员">预备党员</Radio>
                    <Radio value="群众">群众</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={16} />
          </Row>
        </Card>
        <br />
        <Card bordered={false}>
          <Divider>人员教育信息</Divider>
          <br />
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="学位">
                {getFieldDecorator('status', {})(<DictionarySelect type="12" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="学历">
                {getFieldDecorator('sex', {})(<DictionarySelect type="11" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8} />
          </Row>
        </Card>
        <br />
        <Card bordered={false}>
          <Divider>人员部门信息</Divider>
          <br />
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Query query={QUERY_ALL_DEPARTMENTS} variables={{ organization: org }}>
                {({ data, loading, refetch }) => {
                  this.refetch = refetch;
                  const { departments = [] } = data || [];
                  // const departmentsTemp = departments.map(item => ({ ...item }));
                  const options = tree((departments || []).map((item: any) => ({ ...item })), {
                    idKey: 'id',
                    pidKey: 'parent.id',
                    childrenKey: 'children',
                    converter: (item: any) => {
                      item.label = item.name;
                      item.value = item.id;
                      return item;
                    },
                  });
                  return (
                    <Form.Item label="所在部门">
                      {getFieldDecorator('birthday', {})(
                        <Cascader
                          options={options}
                          // onChange={this.onDependSelect}
                          placeholder="请选择部门"
                          allowClear
                          style={{ width: 300 }}
                        />
                      )}
                    </Form.Item>
                  );
                }}
              </Query>
            </Col>
            <Col span={8}>
              <Form.Item label="所在党支部">
                {getFieldDecorator('name', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="党员类型">
                {getFieldDecorator('sn', {})(
                  <Radio.Group>
                    <Radio value="在职">在职</Radio>
                    <Radio value="离职">离职</Radio>
                    <Radio value="离休">离休</Radio>
                    <Radio value="退休">退休</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <br />
        <Card bordered={false}>
          <Divider>职务信息</Divider>
          <br />
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="入职时间">
                {getFieldDecorator('birthday', {})(<DatePicker style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="院聘职称">
                {getFieldDecorator('email', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="所在科室">
                {getFieldDecorator('mobile', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="岗位类别">
                {getFieldDecorator('tel', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="教学职称">
                {getFieldDecorator('mobile', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="教学职称聘任日期">
                {getFieldDecorator('birthday', {})(<DatePicker style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="导师类别">
                {getFieldDecorator('tel', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="聘任导师学校">
                {getFieldDecorator('mobile', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="导师聘任日期">
                {getFieldDecorator('birthday', {})(<DatePicker style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span={8}>
              <Form.Item label="任职年月">
                {getFieldDecorator('birthday', {})(<DatePicker style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任职方式">
                {getFieldDecorator('mobile', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="职务级别">
                {getFieldDecorator('mobile', {})(<Input type="text" style={{ width: 300 }} />)}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Row>
          <Col span={14}>
            <h5>添加职务：</h5>
          </Col>
        </Row>
        <Row>
          <Col span={21}>
            <Form.Item>
              {getFieldDecorator('positions', {
                rules: [{ required: true, message: '请选择职员状态' }],
              })(<TableWrapper organization={org} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ textAlign: 'center', marginTop: 10 }}>
          <Col span={24} offset={1}>
            <Button onClick={this.goBack}>返回</Button>&nbsp;
            <Button
              type="primary"
              htmlType="submit"
              // onClick={() => this.submitDepartment(createuser, listData, this.state.selectedRadioId)}
            >
              提交
            </Button>
          </Col>
        </Row>
        {/* 部门
        <Query
          query={this.props.location.state === 'create' ? QUERY_DEPARTMENT_INFO : ORGANIZATIONSELECT}
          variables={
            this.props.location.state === 'create' ? { id: departmentId } : { filter: { department: departmentId } }
          }
        >
          {({ data, loading, error, refetch }) => {
            this.refetch = refetch;
            if (loading) return <PageLoading />;
            let listData = [];
            if (this.state.tableSelectedData.length > 0) {
              listData = this.state.tableSelectedData;
            } else {
              listData.push({
                department: data && data.department && data.department.name,
                id: data && data.department && data.department.id,
              });
            }
                        if (this.state.choosenData.length > 0) {
              this.state.choosenData.map(ele => {
                listData.push({ department: ele.name, id: ele.id });
              });
            }
            const listDataCopy = JSON.parse(JSON.stringify(listData));
            return (
              <>

              </>
            );
          }}
        </Query>
        */}
        {/* <AddOtherEmployee
          visible={this.state.openVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          organizationId={department.organization && department.organization.id}
          getModalRef={this.getModalRef}
        /> */}
      </Form>
    );
  }
}

const formSettings = {
  mapPropsToFields: (props: any): any => {
    const data = props.data || {};
    return generateFormFields(data, {
      positions: data => {
        if (!data.positions && props.department && props.department.id) {
          return [
            {
              primary: true,
              department: props.department.id,
            },
          ];
        }
        return data.positions;
      },
    });
  },
};

export const EmployeeFormCreate = Form.create(formSettings)((props: any) => {
  const submit = (createEmployee: any) => (input: any) => {
    const employee = createEmployee({
      variables: {
        input,
      },
    });
    message.success('添加成功！');
    router.go(-1);
    return employee;
  };
  const [mutate, result] = useMutation(ADD_USER);

  return (
    <Spin spinning={result.loading}>
      <EmployeeForm {...props} submit={submit(mutate)} />
    </Spin>
  );
});

const formUpdate = {
  mapPropsToFields: (props: any): any => {
    console.log(props);
    const data = props.employee || {};
    const primaryPosition = data.primaryPosition ? data.primaryPosition!.id : '';
    return generateFormFields(data, {
      positions: (data: any) =>
        (data.positions || []).map((ele: any) => ({
          primary: ele.id === primaryPosition,
          department: ele.department.id,
          value: ele.id,
        })),
    });
  },
};

export const EmployeeFormUpdate = Form.create(formUpdate)((props: any) => {
  console.log('看props', props);
  const submit = (updateEmployee: any) => (input: any) => {
    const employee = updateEmployee({
      variables: {
        id: props.employee.id,
        input,
      },
    });
    message.success('更新成功！');
    router.go(-1);
    return employee;
  };

  const [mutate, result] = useMutation(UPDATE_USER);

  return (
    <Spin spinning={result.loading}>
      <EmployeeForm {...props} submit={submit(mutate)} />
    </Spin>
  );
});
interface EmployeeFormSaveProps {
  organization?: any;
  employee?: any;
  department?: any;
}
export default class EmployeeFormSave extends React.Component<EmployeeFormSaveProps, any> {
  render() {
    console.log(this.props);
    const { employee = {}, organization, department } = this.props;
    return (
      <div>
        <Card>
          {employee ? (
            <EmployeeFormUpdate employee={employee} organization={organization} />
          ) : (
            <EmployeeFormCreate organization={organization} department={department} />
          )}
        </Card>
      </div>
    );
  }
}
