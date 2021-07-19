import { ApolloConsumer, Mutation, Query } from '@apollo/client/react/components';
import { Input, Modal, Select, message } from 'antd';
import { Form } from '@ant-design/compatible';
import React, { Component } from 'react';
import {
  createDepartment as CREATE_DEPARTMENT,
  queryJobs as QUERY_JOBS,
  department as QUERY_PARENT,
  updateDepartment as UPDATE_DEPARTMENT,
} from '../gqls/department.gql';

import style from './departmentAdd.less';
import PageLoading from '@/pages/WisdomPartyBuilding/components/PageLoading';

const { Option } = Select;

interface IDepartmentAddProps {
  wrappedComponentRef: (ref: any) => void;
  organization: any;
  refetchTreeData?: () => void;
  departmentRefetch: any;
}
@Form.create({ name: 'department' })
export default class DepartmentAdd extends Component<IDepartmentAddProps> {
  public state = {
    visible: false,
    departmentId: '',
    edit: 'create', // 操作标志位
    selectJobsArr: [], // 选中的职务列表
    clientObj: '',
  };

  public open = (departmentId, edit, state) => {
    this.props.form.resetFields();
    if (edit === 'update') {
      const jobsArr = [];
      const departmentDataTemp = JSON.parse(JSON.stringify(state.departmentData));
      departmentDataTemp.jobs.map(ele => {
        jobsArr.push(ele.name);
      });
      departmentDataTemp.jobs = jobsArr;
      const formData = JSON.parse(JSON.stringify(departmentDataTemp));
      this.props.form.setFieldsValue(formData);
    }
    this.setState({ visible: true, departmentId, edit, clientObj: state.clientObj });
  };

  public edit = () => {
    this.setState({ visible: true });
  };

  public close = () => {
    this.setState({ visible: false });
  };

  public onOk = (editDepartment, client) => {
    this.props.form.validateFields(async (error, values) => {
      // 下级部门新增
      if (this.state.edit === 'create') {
        // 给当前选择的部门添加下级部门,传入当前id
        values.parent = this.state.departmentId;
        values.jobs = this.state.selectJobsArr;
        console.log('表单数据', values);
        await editDepartment({
          variables: {
            organization: this.props.organization,
            input: values,
          },
        });
        message.success('增加成功！');
        // 部门更新
      } else if (this.state.edit === 'update') {
        // 请求部门信息， 拿到父id
        const { data } = await client.query({
          query: QUERY_PARENT,
          variables: { id: this.state.departmentId },
        });
        if (data.department.parent !== null) {
          values.parent = data.department.parent.id;
        }
        // 转换JOB格式， 方便回显
        const valusJobsCopy = JSON.parse(JSON.stringify(values.jobs));
        const jobsArr = [];
        if (valusJobsCopy.length > 0) {
          valusJobsCopy.map(ele => {
            jobsArr.push({ name: ele });
          });
          values.jobs = jobsArr;
        }
        // 请求更新接口
        await editDepartment({
          variables: {
            id: this.state.departmentId,
            input: values,
          },
        });
        message.success('更新成功！');
        this.props.departmentRefetch(this.state.clientObj, this.state.departmentId);
        // 一级部门新增
      } else if (this.state.edit === 'firstCreate') {
        values.jobs = this.state.selectJobsArr;
        await editDepartment({
          variables: {
            organization: this.props.organization,
            input: values,
          },
        });
        message.success('增加成功！');
      }
      this.close();
      await this.props.refetchTreeData();
    });
  };

  public handleSelectChange = value => {
    const selectJobsArrTemp = [];
    for (const k in value) {
      selectJobsArrTemp.push({ name: value[k] });
    }
    this.setState({ selectJobsArr: selectJobsArrTemp });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <ApolloConsumer>
          {client => (
            <Mutation
              mutation={
                this.state.edit === 'create' || this.state.edit === 'firstCreate'
                  ? CREATE_DEPARTMENT
                  : UPDATE_DEPARTMENT
              }
            >
              {(editDepartment, { data }) => (
                <Query query={QUERY_JOBS} variables={{ id: this.props.organization }}>
                  {({ data, loading }) => {
                    if (loading) return <PageLoading />;
                    const { organization = { jobs: [] } } = data || {};
                    return (
                      <Modal
                        visible={this.state.visible}
                        title={this.state.edit === 'create' ? '新增部门' : '修改部门'}
                        okText="保存"
                        onCancel={this.close}
                        onOk={() => this.onOk(editDepartment, client)}
                      >
                        <Form layout="inline">
                          <Form.Item label="部门编码:">{getFieldDecorator('sn')(<Input type="text" />)}</Form.Item>
                          <Form.Item label="部门名称:">{getFieldDecorator('name')(<Input type="text" />)}</Form.Item>
                          <Form.Item label="部门描述:">
                            {getFieldDecorator('description')(<Input type="text" />)}
                          </Form.Item>
                          <Form.Item label="添加职务:" style={{ width: '100%' }} className={style.addJobs}>
                            {getFieldDecorator('jobs')(
                              <Select mode="tags" onChange={this.handleSelectChange}>
                                {organization.jobs.map(ele => (
                                  <Option key={ele.name}>{ele.name}</Option>
                                ))}
                              </Select>
                            )}
                          </Form.Item>
                        </Form>
                      </Modal>
                    );
                  }}
                </Query>
              )}
            </Mutation>
          )}
        </ApolloConsumer>
      </div>
    );
  }
}
