import { PageContainer } from '@asany/components';
import React from 'react';
import { useQuery } from '@apollo/client';
import { Row, Table, Col, Card, Input } from 'antd';
import { directiveDefinitions as GET_INSTRUCT } from './gqls/api.gql';

const { Search } = Input

interface InstructManagementProps { }
function InstructManagement(props: InstructManagementProps) {
  const { data, error, refetch, loading } = useQuery(GET_INSTRUCT)

  if (error) {
    console.warn(error);
  }
  const { directiveDefinitions = [] } = data || {};

  //查询
  const searchName = (value: any) => {
    refetch({ filter: { name: value } })
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '参数',
      dataIndex: 'inputs',
      key: 'inputs',
      render: (text: any, record: any) => {
        return (
        <span>{text && text.name} {text && text.name ? "：" : ""} {text.type}</span>
        )
      }
    },
    {
      title: '默认参数',
      dataIndex: 'defaults',
      key: 'defaults',
      render: (text: any, record: any) => {
        return (
        <span>{text && text.name} {text && text.name ? "：" : ""} {text.value}</span>
        )
      }
    },
    {
      title: '返回函数',
      dataIndex: 'overrides',
      key: 'overrides',
      render: (text: any, record: any) => {
        return text[0]
      }
    },
  ];
  
  return (
    <PageContainer title="指令管理" contentClassName="api-document-content">
      <Card>
        <Row style={{ margin: 10 }}>
          <Col span={22}>
            <Search
              placeholder="根据名称查询"
              onSearch={value => searchName(value)}
              style={{ width: 260 }}
            />
          </Col>
        </Row>

        <Row>
          <Table
            style={{ width: "100%" }}
            columns={columns}
            // onChange={handleTableChange}
            dataSource={directiveDefinitions}
            loading={loading}
            rowKey={(record: any) => record.id + 'already-flow'}
            pagination={{
              showQuickJumper: true,
              // total: processForms.totalCount,
              showTotal: total => `总共${total}条记录`
            }}
          />
        </Row>
      </Card>

    </PageContainer>
  );
}

export default InstructManagement;
