/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Input, Tree, Row, Col, Tooltip, Menu, Dropdown, message, Modal } from 'antd';
import { EditFilled, BlockOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import {
  removeGraphQLFieldDefinition as DELETE_MODULES__NOTE,
} from '../gqls/api.gql';
import {history as router} from 'umi';
const { Search } = Input;
const { confirm } = Modal;

interface selectedNodesItem {
  id?: string;
  name?: string;
  note?: string;
  parentId?: string;
  children?: string;
}
interface selectedKeysItem {
  id: string;
  key: string;
  name: string;
  type?: any;
  repeated?: any;
  refetch?: (value: any) => void;
}
interface ModuleTreeProps {
  interfaceTypes?: any;
  selectedKeysId?: any;
  updateState: (value: any) => void;
  selectedNodes?: selectedNodesItem;
  refetch: any;
  meunCrumb: selectedKeysItem[];
  apiInfoRefetch?: any;
}
function ModuleTree(props: ModuleTreeProps) {
  const [removeGraphQLFieldDefinition] = useMutation(DELETE_MODULES__NOTE);
  const { interfaceTypes = [], updateState, selectedKeysId, selectedNodes, refetch, apiInfoRefetch } = props;

  // 搜索框
  const handleSearch = (value: any, option: any) => {
    updateState({
      selectedKeysId: option.key === 'status' ? [option.key] : selectedKeysId,
      selectedKeys: { id: option.key, name: value },
      meunCrumb: [{ id: option.key, key: option.key, name: value }],
    })
  }
  const onSelect = (selectedKeys: any, e: any) => {
    console.log('selectTree', e)

    updateState({
      selectedNodes: e.selectedNodes && e.selectedNodes[0],
    })
    if ((!e.node.__typename && e.node?.id !== 'types') || e.node?.__typename === 'GraphQLTypeDefinition') {
      // 跳转typeDefinitions类型
      if (e.node.__typename === 'GraphQLTypeDefinition') {
        router.push(`/api-management/property/${e.node.name}`);
      } else {
        // router.push(`/api-management/administration/genre-management`)
        if(e.node.parent) {
          updateState({
            selectedNodes: e.selectedNodes && e.selectedNodes[0],
            selectedKeysId: selectedKeys[0] === 'status' ? selectedKeys : selectedKeysId,
            selectedKeys: { id: selectedKeys[0], name: e.node.props.name },
            meunCrumb: [{ id: selectedKeys[0], key: selectedKeys[0], name: e.node.props.name }],
            genreId: e.node.parent ? e.node.parent.id : e.node.parentId,
            typeOrInterface: true,
            genreManagementParamId: e.node && e.node.id,
          })
        } else {
          // 选中类型 右侧跳转类型列表
          updateState({
            selectedNodes: e.selectedNodes && e.selectedNodes[0],
            typeOrInterface: true,
            genreManagementParamId: e.node && e.node.id,
          })
        }
      }
    } else if ((e.node.parent && e.node.parent.__typename === 'ApiType') || e.node.__typename === 'Api') {
      // 跳转apitypes接口
      // console.log(2)
      // 点击接口调api接口 将数据传入
      let thisMenuCrumb: Array<any> = []
      // console.log('点接口父级', e.selectedNodes)
      if (
        (e.selectedNodes && e.selectedNodes[0].children) ||
        (e.node.parent && e.node.parent.__typename === 'ApiType')
      ) {
        // console.log(3)
        // 点击
        thisMenuCrumb = [{ id: selectedKeys[0], key: selectedKeys[0], name: e.node.props.name }]
      } else {
        // console.log(4)
        thisMenuCrumb = [
          { id: e.selectedNodes[0].parentId, key: e.selectedNodes[0].parentId, name: e.selectedNodes[0].parentName },
          { id: selectedKeys[0], key: selectedKeys[0], name: e.node.props.name },
        ]
      }
      // 更新apiItem数据
      apiInfoRefetch({ id: selectedKeys[0] })
      updateState({
        selectedNodes: e.selectedNodes && e.selectedNodes[0],
        selectedKeysId: selectedKeys[0] === 'status' ? selectedKeys : selectedKeysId,
        selectedKeys: { id: selectedKeys[0], name: e.node.props.name },
        meunCrumb: thisMenuCrumb,
        genreId: e.node.parent ? e.node.parent.id : e.node.parentId,
        itemInterFaceId: selectedKeys[0].id,
        typeOrInterface: false,
      })
    }
  }
  const onExpand = (expandedKeys: any, e: any) => {
    updateState({
      selectedKeysId: expandedKeys,
    })
  };
  // 点击修改
  const edit = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          // console.log('点击修改', selectedNodes)
          if (selectedNodes && selectedNodes.id) {
            // console.log('点击修改', selectedNodes)
            updateState({ visible: true, edit: true, selectKey: '1', showTypeInput: true })
            // updateState({ visible: true, edit: true, selectKey: '1', showTypeInput: true })
          } else {
            message.error('请先选择节点', 3);
          }
        }}
      >
        修改选中节点
      </Menu.Item>
    </Menu>
  )

  // 删除节点
  const deleteModule = async () => {
    if (selectedNodes && selectedNodes.id) {
      if (selectedNodes && selectedNodes.children) {
        message.error('当前选中节点下存在子节点，不能整个删除', 3);
      } else {
        confirm({
          title: '分类管理',
          content: '确定要删除当前选中的节点吗',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          async onOk() {
            const deleteData = await removeGraphQLFieldDefinition({
              variables: {
                id: selectedNodes.id,
              },
            }).catch(error => {
              message.error('删除失败！', error);
            });
            if (deleteData &&
              deleteData.data &&
              deleteData.data.removeGraphQLFieldDefinition &&
              deleteData.data.removeGraphQLFieldDefinition === true) {
              await refetch();
              message.success('删除成功', 3);
            } else {
              message.error('删除失败！');
            }
          },
          onCancel() {
          },
        });
      }
    } else {
      message.error('请先选择要删除的节点', 3);
    }
  }

  // 点击修改
  const bind = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          if (selectedNodes && selectedNodes.id) {
            updateState({ visible: true, edit: true, selectKey: '1', showTypeInput: true, bindData: true })
          } else {
            message.error('请先选择节点', 3);
          }
        }}
      >
        绑定已有接口
      </Menu.Item>
    </Menu>
  )

  // 点击新增
  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          console.log('点击新增', selectedNodes)
          if (selectedNodes && selectedNodes.id) {
            updateState({ visible: true, edit: false, selectKey: '1', showTypeInput: false })
          } else {
            message.error('请先选择节点', 3);
          }
        }}
      >
        添加当前节点下的接口
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Search placeholder="请输入搜索内容" style={{ width: 280 }} onSearch={handleSearch} />
      <hr />
      <Row>
        <Col span={22}>
          <Tree
            expandedKeys={selectedKeysId}
            defaultSelectedKeys={selectedKeysId}
            treeData={interfaceTypes}
            onSelect={onSelect}
            onExpand={onExpand}
          >
          </Tree>
        </Col>

        <Col span={2} className="handle">
          <Tooltip title="添加模块">
            <Dropdown overlay={menu}>
              <i className="iconfont icontianjia_add leftIcon" />
            </Dropdown>
          </Tooltip>

          <Tooltip title="修改选中节点">
            <div className="edit">
              <Dropdown overlay={edit}>
                <EditFilled />
              </Dropdown>
            </div>
          </Tooltip>

          <Tooltip title="删除选中节点">
            <i className="iconfont iconlajitong1-copy leftIcon" onClick={deleteModule} style={{ fontSize: 18 }} />
          </Tooltip>

          
          <Tooltip title="绑定已有接口">
            <div>
              <Dropdown overlay={bind}>
                <BlockOutlined />
              </Dropdown>
            </div>
          </Tooltip>

        </Col>

      </Row>
    </>
  );
}

export default ModuleTree;
