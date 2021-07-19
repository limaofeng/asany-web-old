
import { PageContainer } from '@asany/components';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Row, Button, Table, Col, message, Modal, Card, Divider, Input } from 'antd';
import EntrustModel from './compontents/EntrustModel';
import { delegates as GET_GENRETABLE, removeGraphQLDelegateDefinition as DELETE_ENTRUST } from './gqls/api.gql';
import styles from './index.less';

const { Search } = Input;
const { confirm } = Modal;

interface ApiEntrustProps { }
function ApiEntrust(props: ApiEntrustProps) {
  const { data, error, refetch, loading } = useQuery(GET_GENRETABLE);
  const [deleteEntrust] = useMutation(DELETE_ENTRUST);


  if (error) {
    console.warn(error);
  }
  const { delegates = [] } = data || {};

  const [state, setState] = useState({
    selectedKeys: {},
    selectedKeysId: [],
    meunCrumb: [],
    repeated: null,
    visible: false,
    edit: false,
    recordData: {}
  });
  const updateState = (value: any) => {
    setState({
      ...state,
      ...value,
    });
  };


  //新增
  const addService = () => {
    updateState({ visible: true, edit: false })
  }

  //修改
  const handleMaterial = (value: any) => (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    updateState({ visible: true, edit: true, recordData: value })
  }

  //查询
  const searchName = (value: any) => {
    refetch({filter:{name: value}})
  }

  //删除
  const deleteModule = (value: any) => (e: any) => {
    confirm({
      title: 'API委托',
      content: '确定要删除此api委托吗',
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        const deleteRes  = await deleteEntrust({
          variables: {
            id: value.id
          }
        }).catch(error => {
          message.error("删除失败！", error);
        });

        if (deleteRes.data.removeGraphQLDelegateDefinition && deleteRes.data.removeGraphQLDelegateDefinition === true) {
          await refetch();
          message.success('删除成功', 3);
        }else {
          message.error("删除失败！");
        }
      },
      onCancel() {
      }
    });

  }

  const hideModal = () => {
    updateState({
      visible: false
    });
  }

  const columns = [
    {
      title: '英文名',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '中文名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '服务',
      dataIndex: 'service',
      key: 'service',
      render: (text: any, record: any) => {
        return text && text.name
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <div>
          <span onClick={handleMaterial(record)}>修改</span>
          <Divider type="vertical" />

          <span onClick={deleteModule(record)}>删除</span>
        </div>
      )
    },
  ];

  const { edit, visible, recordData } = state;

  return (
    <PageContainer title="API委托" contentClassName="api-document-content">
      <Card>
        <Row style={{ margin: 10 }}>
          <Col span={22}>
            <Search
              placeholder="根据中文名查询"
              onSearch={value => searchName(value)}
              style={{ width: 260 }}
            />
          </Col>

          <Col span={2}>
            <Button type="primary" onClick={addService}>新增 </Button>
          </Col>
        </Row>
        <Row>
          <Table
            style={{ width: "100%" }}
            columns={columns}
            // onChange={handleTableChange}
            dataSource={delegates}
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
      <Modal
        destroyOnClose={true}
        width="800px"
        title={edit ? "修改" : "新建"}
        visible={visible}
        onCancel={hideModal}
        footer={null}
      >
        <EntrustModel updateState={updateState} edit={edit} recordData={recordData} refetch={refetch} />
      </Modal>
    </PageContainer>
  );
}

export default ApiEntrust;