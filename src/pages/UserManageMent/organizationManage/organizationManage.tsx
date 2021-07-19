import * as React from 'react';

import { PlusCircleOutlined } from '@ant-design/icons';

import { Button, Card, Col, Input, Modal, Row, Select, Spin, Table, message } from 'antd';
import { Form } from '@ant-design/compatible';
import { Mutation, Query } from '@apollo/client/react/components';
import moment from 'moment';
import { MutationResult } from '@apollo/client';
import { PageContainer } from '@asany/components';
import {
  createOrg as CREATE_ORG,
  deleteOrg as DELETE_ORG,
  getOrgs as GET_ORGS,
  updateOrg as UPDATE_ORG,
} from '../gqls/organizationManage.gql';
import { generateFormFields } from '@/pages/WisdomPartyBuilding/utils/utils';

const { confirm } = Modal;
const { Option } = Select;

export class OrganizationForm extends React.Component<any, any> {
  public refetch?: any;

  state = {
    visible: false,
    updateOrg: 'create',
    id: null,
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  // 知识点
  // 知识点2参数必传
  submit = () => {
    const { form, submit, onSuccess } = this.props;
    form.validateFieldsAndScroll(async (error: any, { ...values }: any) => {
      if (error) {
        return;
      }
      const {
        data: { organization },
      } = await submit(values);
      message.success('保存成功');
      await onSuccess(organization);
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row>
          <Col span={12}>
            <Form.Item label="组织id">
              {getFieldDecorator('id', {
                rules: [{ message: '请输入新增组织id！' }],
              })(<Input type="text" style={{ width: 200 }} disabled={this.state.updateOrg === 'update'} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="组织姓名">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入新增组织姓名！' }],
              })(<Input type="text" style={{ width: 200 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="组织相关描述">
              {getFieldDecorator('description', {})(<Input type="text" style={{ width: 200 }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const formSettings = {
  name: 'OrganizationForm',
  mapPropsToFields: (props: any): any => {
    const data = props.data || {};
    const fields = {};
    return generateFormFields(data, fields);
  },
};

export const OrganizationFormCreate = Form.create<any>(formSettings)(
  ({ formWrappedComponentRef: ref, ...props }: any) => {
    const submit = (createOrganization: any) => (input: any) =>
      createOrganization({
        variables: {
          input,
        },
      });
    const randerForm = (createOrganization: any, { loading }: MutationResult) => (
      <Spin spinning={loading}>
        <OrganizationForm {...props} ref={ref} submit={submit(createOrganization)} />
      </Spin>
    );
    return <Mutation mutation={CREATE_ORG}>{randerForm}</Mutation>;
  }
);
export const OrganizationFormUpdate = Form.create<any>(formSettings)(
  ({ formWrappedComponentRef: ref, ...props }: any) => {
    const submit = (updateOrganization: any) => (input: any) => {
      delete input.id;
      return updateOrganization({
        variables: {
          id: props.data.id,
          input,
        },
      });
    };

    const randerForm = (updateOrganization: any, { loading }: MutationResult) => (
      <Spin spinning={loading}>
        <OrganizationForm {...props} ref={ref} submit={submit(updateOrganization)} />
      </Spin>
    );
    return <Mutation mutation={UPDATE_ORG}>{randerForm}</Mutation>;
  }
);

interface OrganizationFormModalProps {
  onSuccess: (value?: any) => void;
}

interface OrganizationFormModalState {
  visible: boolean;
  data?: any;
}

export class OrganizationFormModal extends React.Component<OrganizationFormModalProps, OrganizationFormModalState> {
  state = { visible: false };

  organizationForm = React.createRef<OrganizationForm>();

  open = (data?: any) => {
    this.setState({ visible: true, data });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSubmit = () => {
    this.organizationForm.current!.submit();
  };

  organizationFormWrappedComponent = (ref: any) => {
    this.organizationForm = ref;
  };

  handleSaveSuccess = (value: any) => {
    this.setState({ data: value, visible: false }, () => {
      this.props.onSuccess(value);
    });
  };

  render() {
    const { visible, data = {} } = this.state;
    return (
      <Modal
        visible={visible}
        title={data.id ? '编辑组织信息' : '新增组织信息'}
        onCancel={this.handleClose}
        style={{ width: 900 }}
        footer={
          <>
            <Button onClick={this.handleClose}>取消</Button>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </>
        }
      >
        {data.id ? (
          <OrganizationFormUpdate
            formWrappedComponentRef={this.organizationForm}
            data={data}
            onSuccess={this.handleSaveSuccess}
          />
        ) : (
          <OrganizationFormCreate
            formWrappedComponentRef={this.organizationForm}
            data={data}
            onSuccess={this.handleSaveSuccess}
          />
        )}
      </Modal>
    );
  }
}

export default class OrganizationManage extends React.Component<any, any> {
  refetch?: any;

  organizationFormModal = React.createRef<OrganizationFormModal>();

  constructor(props: any) {
    super(props);
  }

  // test
  saveFormRef = formRef => {
    this.form = formRef;
  };

  handleRefresh = async () => {
    await this.refetch();
  };

  addOrg = () => {
    this.organizationFormModal.current!.open();
  };

  handleEditTable = (text: string, record: any, index: number) => () => {
    this.organizationFormModal.current!.open(record);
  };

  handleDelete = (text: string, record: any, index: number, deleteOrg: any) => () => {
    console.log(record);
    confirm({
      title: '确定删除该用户？',
      onOk: async () => {
        await deleteOrg({ variables: { id: record.id } });
        message.success('删除成功');
        this.refetch();
      },
      onCancel() {},
    });
  };

  rowKey = (record, index) => `complete${record.id}${index}`;

  column = [
    {
      title: '序号',
      dataIndex: 'num',
      render: (text, record, index) => ++index,
    },
    {
      title: '组织名称',
      dataIndex: 'name',
    },
    {
      title: '创建者',
      dataIndex: 'creator',
    },
    {
      title: '修改者',
      dataIndex: 'modifier',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => (
        <Mutation mutation={DELETE_ORG}>
          {(deleteOrg, { data, loading }): any => {
            if (data && data.removeOrganization === 'true') {
              Modal.success({
                title: '成功删除该用户！',
              });
              this.refetch();
            }
            return (
              <div>
                <span>
                  <a onClick={this.handleEditTable(text, record, index)}>编辑</a>
                </span>
                |
                <span>
                  <a onClick={this.handleDelete(text, record, index, deleteOrg)}>删除</a>
                </span>
              </div>
            );
          }}
        </Mutation>
      ),
    },
  ];

  render() {
    return (
      <PageContainer title="组织管理">
        <Card bordered={false}>
          <div className="bgWhite">
            <Button type="primary" icon={<PlusCircleOutlined />} style={{ margin: 10 }} onClick={this.addOrg}>
              新建组织55
            </Button>
            <Query query={GET_ORGS}>
              {({ data, loading, refetch }): any => {
                const { organizations = [] } = data || {};
                organizations.map(org => {
                  org.createdAt = moment(org.createdAt).format('YYYY-MM-DD');
                  org.updatedAt = moment(org.updatedAt).format('YYYY-MM-DD');
                });
                const dataSource = organizations.map(org => org);
                this.refetch = refetch;
                return <Table columns={this.column} dataSource={dataSource} pagination={false} rowKey={this.rowKey} />;
              }}
            </Query>
          </div>
        </Card>
        <OrganizationFormModal ref={this.organizationFormModal} onSuccess={this.handleRefresh} />
      </PageContainer>
    );
  }
}
