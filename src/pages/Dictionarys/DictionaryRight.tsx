import './dictionarys.less';

import * as React from 'react';

import { PlusCircleOutlined } from '@ant-design/icons';

import { Button, Col, Divider, Modal, Row, Table, message } from 'antd';
import { Mutation, Query } from '@apollo/client/react/components';
import {
  dataDictionarys as DATADICTIONARYS,
  deleteDataDictionary as DELETETDATADICTIONARY,
} from './gqls/dictionarys.gql';

import { DictionaryFormModalWrapper } from './DictionaryForm';

// graphql相关包
interface IProjectState {
  formRef?: any;
  query?: {
    page: number;
  };
}

interface DeleteDictionaryProps {
  data: any;
  onDelete: () => void;
}

class DeleteDictionary extends React.Component<DeleteDictionaryProps, any> {
  handleDelete = deleteDictionary => () => {
    Modal.confirm({
      title: '删除',
      content: '确定删除此条数据吗？数据删除后将不能恢复！',
      onOk: async (): Promise<void> => {
        await deleteDictionary({ variables: { id: this.props.data.id } });
        message.success('删除成功！');
        this.props.onDelete();
      },
    });
  };

  render() {
    return (
      <Mutation mutation={DELETETDATADICTIONARY}>
        {deleteDictionary => <a onClick={this.handleDelete(deleteDictionary)}>删除</a>}
      </Mutation>
    );
  }
}

export class DictionarysRight extends React.Component<any, IProjectState> {
  form?: any;

  refetch: any;

  state = { query: { page: 1 } };

  columns = [
    {
      title: '序号',
      dataIndex: 'numcolumns',
      key: 'num',
      render: (text, record, index) => <span>{((this.state.query.page || 1) - 1) * 10 + index + 1}</span>,
    },
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type.typeName',
      key: 'typeName',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '父级',
      dataIndex: 'parent.parentName',
      key: 'parentName',
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (text, record) => (
        <span>
          <DeleteDictionary data={record} onDelete={this.handleRefresh} />
          <Divider type="vertical" />
          <DictionaryFormModalWrapper data={record} onSuccess={this.handleRefresh}>
            编辑
          </DictionaryFormModalWrapper>
        </span>
      ),
    },
  ];

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.query.filter || prevState.query.filter.code !== nextProps.type) {
      console.log(nextProps && nextProps);
      return {
        query: {
          filter: { type: nextProps.type || '1' },
          // ,...prevState.query
        },
      };
    }
    console.log(query);
    return prevState;
  }

  handleRefresh = async () => {
    this.refetch();
  };

  handleTableChange = async (pagination, filters, sorter, extra) => {
    this.setState({
      query: {
        ...this.state.query,
        page: pagination.current,
      },
    });
  };

  // 编辑表格数据
  handleEditTable = record => () => this.dictionaryForm.current!.open(record);

  rowKey(record: any, index: any) {
    return `complete-${record.id}-${index}`;
  }

  render() {
    return <>
      <Row style={{ margin: 10 }}>
        <Col span={12} />
        <Col span={10} />
        <Col span={2}>
          <DictionaryFormModalWrapper onSuccess={this.handleRefresh}>
            <Button type="primary" icon={<PlusCircleOutlined />}>
              新建
            </Button>
          </DictionaryFormModalWrapper>
        </Col>
      </Row>
      <Query query={DATADICTIONARYS} variables={this.state.query}>
        {({ data, loading, refetch }): any => {
          console.log(data);
          this.refetch = refetch;
          const { dataDictionarys = { edges: [] } } = data || {};
          const dataSource = dataDictionarys.edges.map(edge => ({ ...edge.node }));
          return (
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={dataSource}
              onChange={this.handleTableChange}
              rowKey={this.rowKey}
              pagination={{ ...dataDictionarys, showSizeChanger: true, showQuickJumper: true }}
            />
          );
        }}
      </Query>
    </>;
  }
}
export default DictionarysRight;
