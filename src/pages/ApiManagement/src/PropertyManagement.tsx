
import { PageContainer } from '@asany/components';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Row, Button, Table, Col, message, Modal, Card, Divider } from 'antd';
import PropertyModel from './compontents/PropertyModel';
import GenreModel from './compontents/GenreModel';
import { schema as GET_SCHEMA, removeGraphQLFieldDefinition as DELETE_PROPERTY, typeDefinitions as GET_GENRETABLED, updateGraphQLTypeDefinition as POST_UPDATE_TYPE } from './gqls/api.gql';
import styles from './index.less';
import EnumModel from './compontents/EnumModel';
import value from './index.less';

const { confirm } = Modal;

interface PropertyManagementProps { }
function PropertyManagement(props: PropertyManagementProps) {
  const genreId = props.match.params && props.match.params.id;
  const { data: genreData } = useQuery(GET_GENRETABLED);

  const { data, error, refetch, loading } = useQuery(GET_SCHEMA, {
    variables: {
      id: genreId
    },
    fetchPolicy:"no-cache"
  });

  const [deleteProperty] = useMutation(DELETE_PROPERTY);
  const [updateGraphQLTypeDefinition] = useMutation(POST_UPDATE_TYPE);
  if (error) {
    console.warn(error);
  }

  const { typeDefinitions = [] } = genreData || {};
  const { fileds = [] } = data && data.schema && data.schema.type || {};
  const { enumerations = [] } = data && data.schema && data.schema.type || {};

  const { type = {} } = data && data.schema || {};
  const [state, setState] = useState({
    selectedKeys: {},
    selectedKeysId: [],
    meunCrumb: [],
    repeated: null,
    visible: false,
    edit: false,
    visibleEnum: false,
    editEnum: false,
    recordData: {},
    recordDataEnum: {},
    genre: false
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

  //新增枚举值
  const addEnumeration = () => {
    updateState({ visibleEnum: true, editEnum: false })
  }

  //修改
  const handleMaterial = (value: any) => (e: any) => {
    console.log('当前行', value)
    e.stopPropagation();
    e.preventDefault();
    updateState({ visible: true, edit: true, recordData: value })
  }

  // 修改枚举值
  const handleMaterialEnum = (value: any) => (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    updateState({ visibleEnum: true, editEnum: true, recordDataEnum: value })
  }

  //删除
  const deleteModuleEnum = (value: any) => (e: any) => {
    confirm({
      title: '属性管理',
      content: '确定要删除此属性吗',
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        const index = type.enumerations.indexOf(value);
        type.enumerations.splice(index, 1);
        type.enumerations.forEach((element: any) => {
          delete element.__typename;
          return element;
        });
        const editModul = await updateGraphQLTypeDefinition({
          variables: {
            id: type.id,
            input: {
              title: type && type.title,
              description: type && type.description,
              kind: 'Enum',
              interfaces: type && type.interfaces,
              types: type && type.types,
              enumerations: type.enumerations
            }
          }
        }).catch(error => {
          message.error("修改失败！", error)
        });
        if (editModul.data.updateGraphQLTypeDefinition && editModul.data.updateGraphQLTypeDefinition.id) {
          updateState({
            visibleEnum: false,
            editEnum: false
          });
          // form.resetFields();
          await refetch();
          message.success('删除成功', 3);
        } else {
          message.error("删除失败！")
        }
      },
      onCancel() {
      }
    });
  }

  //删除
  const deleteModule = (value: any) => (e: any) => {
    confirm({
      title: '枚举管理',
      content: '确定要删除此枚举值吗',
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        const deleteRes = await deleteProperty({
          variables: {
            id: value.id
          }
        }).catch(error => {
          message.error("删除失败！", error);
        });
        if (deleteRes.data.removeGraphQLFieldDefinition === false) {
          message.error("删除失败！");
        } else {
          await refetch();
          message.success('删除成功', 3);
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

  const hideModalEnum = () => {
    updateState({
      visibleEnum: false
    });
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '中文名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '返回类型',
      dataIndex: 'kind',
      key: 'kind',
      render: (text: "", record: any) => {
        return (
          <span>{record.type.kind && record.type.kind.name}</span>
        )
      }
    },
    {
      title: '委托',
      dataIndex: 'delegate',
      key: 'delegate',
      render: (text: "") => {
        return text && text.name || ""
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

  const columnsEnumerations = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'deprecated',
      key: 'deprecated',
    },
    {
      title: '是否启用',
      dataIndex: 'deprecated',
      key: 'deprecated',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <div>
          <span onClick={handleMaterialEnum(record)}>修改</span>
          <Divider type="vertical" />

          <span onClick={deleteModuleEnum(record)}>删除</span>
        </div>
      )
    },
  ];

  const genreShow = () => {
    updateState({ genre: true })
  }

  const hideGenre = () => {
    updateState({
      genre: false
    });
  }

  const { edit, visible, recordData, genre, editEnum, visibleEnum, recordDataEnum } = state;

  return (
    <PageContainer title="类型管理" contentClassName="api-document-content">
      <Card>
        <Row>
          <Col span={22}>类型详情</Col>

          <Col span={2}>
            <Button type="primary" onClick={genreShow}>修改</Button>
          </Col>
        </Row>

        <Row>
          <Col span={8}> 类型名称：  {type.name} </Col>
          <Col span={8}> 中文名：  {type.title} </Col>
          <Col span={8}> 描述：  {type.description} </Col>
        </Row>

        <Row>
          <Col span={8}> 类型：  {type.kind} </Col>
          <Col span={8}> 继承的类型：  {type.interfaces && type.interfaces[0] && type.interfaces[0].name} </Col>
          <Col span={8}> 联合类型：  {type.types && type.types[0] && type.types[0].name} </Col>
        </Row>

        <Divider />

        
          <Row style={{ margin: 10 }}>
            <Col span={22}>
            </Col>
            { type.enumerations == undefined ||  type.enumerations.length <= 0 &&  
              <Col span={2}>
                <Button type="primary" onClick={addService}>新增</Button>
              </Col>
            }
            { type.enumerations && type.enumerations.length > 0 && 
              <Col span={2}>
                <Button type="primary" onClick={addEnumeration}>新增</Button>
              </Col> 
            }
          </Row>

        { type.enumerations == undefined ||  type.enumerations.length <= 0 &&
          <Row>
            <Table
              style={{ width: "100%" }}
              columns={columns}
              // onChange={handleTableChange}
              dataSource={fileds}
              loading={loading}
              rowKey={(record: any) => record.id + 'already-flow'}
              pagination={{
                showQuickJumper: true,
                // total: processForms.totalCount,
                showTotal: total => `总共${total}条记录`
              }}
            />
          </Row>
        }
        { type.enumerations && type.enumerations.length > 0 && 
          <Row>
            <Table
              style={{ width: "100%" }}
              columns={columnsEnumerations}
              // onChange={handleTableChange}
              dataSource={enumerations}
              loading={loading}
              rowKey={(record: any) => record.id + 'already-flow'}
            />
          </Row>
        }
      </Card>

      <Modal
        destroyOnClose={true}
        width="800px"
        title={edit ? "修改" : "新建"}
        visible={visible}
        onCancel={hideModal}
        footer={null}
      >
        <PropertyModel updateState={updateState} edit={edit} recordData={recordData} refetch={refetch} genreId={genreId} />
      </Modal>

      <Modal
        destroyOnClose={true}
        width="800px"
        title={editEnum ? "修改" : "新建"}
        visible={visibleEnum}
        onCancel={hideModalEnum}
        footer={null}
      >
        <EnumModel updateState={updateState} typeData={type} edit={editEnum} recordData={recordDataEnum} refetch={refetch} genreId={genreId} />
      </Modal>


      {/* 类型 */}
      <Modal
        destroyOnClose={true}
        width="800px"
        title="修改"
        visible={genre}
        onCancel={hideGenre}
        footer={null}
      >

        <GenreModel updateState={updateState} edit={true} recordData={type} refetch={refetch} typeDefinitions={typeDefinitions} />
      </Modal>

    </PageContainer>
  );
}

export default PropertyManagement;
