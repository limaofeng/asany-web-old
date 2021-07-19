import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, message, Modal } from 'antd';
import * as React from 'react';
import { Mutation, Query } from '@apollo/client/react/components';
import { history as router } from 'umi';

import { department as QUERY_DEPARTMENT, removeDepartment as REMOVE_DEPARTMENT } from '../gqls/department.gql';
import DepartmentAdd from '../departmentManage/departmentAdd';
import style from './less/departmentManage.less';
import { QueryResult,MutationResult } from '@apollo/client';
const { confirm } = Modal;

interface DepartmentProps {
  department: string;
  organization: string;
}

export default class Department extends React.Component<DepartmentProps, any> {
  public form?: any;

  private refetch?: any;

  public treeRef?: any;

  private dataSource?: any;

  constructor(props: any) {
    super(props);
    this.state = {
      addCutVisible: false,
      formRef: '',
      isEdit: 'add',
      isEditIndex: 0,
      index: 1,
      categoryTree: [],
      pageCurrent: 1,
      departmentData: [], // 部门信息
      addrganizationId: '1', // 组织id
      departmentId: '', // 部门Id
      clientObj: '',
      organization: { id: '1' }, // 组织ID
    };
  }

  handleClick = (client: any) => async (id: string) => {
    this.setState({ departmentId: id, clientObj: client });
  };

  handleRefresh = async () => {
    await this.refetch();
  };

  public getOrganizationId = (data: any) => {
    router.push(`/manage/system/organizations/${data.id}/departments`);
  };

  public addNewDepartment = () => {
    this.form.open(this.props.department, 'create', {});
  };

  public changeOrganization = () => {
    this.setState({ departmentId: '' });
  };

  // 刷新树形
  public refetchTreeData = () => {
    this.treeRef.refetch();
  };

  // 获取树形节点
  public getChildref = treeRef => {
    this.treeRef = treeRef;
  };

  // 删除部门
  public removeDepartment = removeDepartment => {
    confirm({
      title: '确定删除当前部门吗？',
      // content: '',
      onOk: async () => {
        await removeDepartment({ variables: { id: this.props.department } });
        message.success('删除成功！');
        await this.setState({ departmentId: '' });
        this.treeRef.refetch();
      },
      onCancel() {},
    });
  };

  // 修改部门
  public modifyDepartment = () => {
    this.form.open(this.props.department, 'update', this.state);
  };

  // 新增一级部门
  public addFirstNewDepartment = () => {
    this.form.open('', 'firstCreate', {});
  };

  render() {
    const { department } = this.props;
    return (
      <Query query={QUERY_DEPARTMENT} variables={{ id: department }}>
        {this.renderDepartment}
      </Query>
    );
  }

  renderDepartment = ({ data }: QueryResult) => {
    const { department } = data || {};
    console.log(data);
    // const { departmentData } = this.state;
    const { organization } = this.props;
    console.log('organization', organization);
    return (
      <Card bordered={false}>
        <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.addFirstNewDepartment}>
          新增一级部门
        </Button>
        &nbsp;
        {department && (
          <>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.addNewDepartment}>
              新增下级部门
            </Button>
            &nbsp;
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={this.modifyDepartment}>
              修改部门
            </Button>
            &nbsp;
            <Mutation mutation={REMOVE_DEPARTMENT}>
              {(removeDepartment, { data }) => (
                <Button type="danger" icon={<CloseOutlined />} onClick={() => this.removeDepartment(removeDepartment)}>
                  删除部门
                </Button>
              )}
            </Mutation>
          </>
        )}
        {department && (
          <div className={style.departmentDetail}>
            <div>
              <span>部门编码：{department.sn}</span>
            </div>
            <div>
              <span>部门名称：{department.name}</span>
            </div>
            <div>
              <span>上级机构：{department.parent && department.parent.name}</span>
            </div>
            <div>
              <span>组织机构：{department.organization && department.organization.name}</span>
            </div>
            <div>
              <span>部门描述信息：{department.description}</span>
            </div>
            <div>
              <span>
                职务信息：
                {department.jobs.map(ele => (
                  <span>{ele.name} </span>
                ))}
              </span>
            </div>
          </div>
        )}
        <DepartmentAdd
          wrappedComponentRef={form => (this.form = form)}
          organization={organization}
          refetchTreeData={this.refetchTreeData}
          // departmentRefetch={this.queryDepartmentInfo}
        />
      </Card>
    );
  };
}
