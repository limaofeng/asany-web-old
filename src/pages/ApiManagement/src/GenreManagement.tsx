
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Row, Button, Table, Col, message, Modal, Card, Divider, Input } from 'antd';

import {history as router} from 'umi';
import GenreModel from './compontents/GenreModel';
import { typeDefinitions as GET_GENRETABLED, removeGraphQLTypeDefinition as DELETE_GENRE } from './gqls/api.gql';


const { Search } = Input;
const { confirm } = Modal;

interface GenreManagementProps {
  genreManagementParamId: String,
}
function GenreManagement(props: GenreManagementProps) {
  const { genreManagementParamId } = props;
  const { data, error, refetch, loading } = useQuery(GET_GENRETABLED, {
    variables: {
      filter: { kind: genreManagementParamId }
    }
  });

  const [deleteGenre] = useMutation(DELETE_GENRE);

  if (error) {
    console.warn(error);
  }
  const { typeDefinitions = [] } = data || {};

  const [state, setState] = useState({
    selectedKeys: {},
    selectedKeysId: [],
    meunCrumb: [],
    repeated: null,
    visible: false,
    edit: false,
    recordData: {},
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
    refetch({ filter: { name: value } })
  }

  //删除
  const deleteModule = (value: any) => (e: any) => {
    confirm({
      title: '类型管理',
      content: '确定要删除此类型吗',
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        const deleteRes = await deleteGenre({
          variables: {
            id: value.name
          }
        }).catch(error => {
          message.error("删除失败！", error);
        });
        if (deleteRes.data.removeGraphQLTypeDefinition === false) {
          message.error("删除失败！");
        }else {
          await refetch();
          message.success('删除成功', 3);
        }
      },
      onCancel() {
      }
    });

  }

  //跳转到属性页面
  const skipAttribute = (value: any) => (e: any) => {
    router.push(`/api-management/property/${value.name}`)
  }
  const hideModal = () => {
    updateState({
      visible: false
    });
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record: any) => (
        <span>
          <a onClick={skipAttribute(record)}>{text}</a>
        </span>
      )
    },
    {
      title: '中文名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类型',
      dataIndex: 'kind',
      key: 'kind',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
    <>
    <Card>
        <Row style={{ margin: 10 }}>
          <Col span={22}>
            <Search
              placeholder="根据名称查询"
              onSearch={value => searchName(value)}
              style={{ width: 260 }}
            />
          </Col>

          <Col span={2}>
            <Button type="primary" onClick={addService}>新增</Button>
          </Col>
        </Row>
        <Row>
          <Table
            style={{ width: "100%" }}
            columns={columns}
            // onChange={handleTableChange}
            dataSource={typeDefinitions}
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
        <GenreModel updateState={updateState} edit={edit} recordData={recordData} refetch={refetch} typeDefinitions={typeDefinitions} />
      </Modal>
    </>
  );
}

export default GenreManagement;
