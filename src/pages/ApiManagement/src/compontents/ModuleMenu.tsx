import React from 'react';
import { Input, Tree, AutoComplete, Row, Col, Tooltip, Menu, Dropdown, message, Modal } from 'antd';
import { treeFormat } from '../utils/utils';
import { EditFilled } from '@ant-design/icons';
import { deleteApiTypeManage as DELETE_MODULES__NOTE } from '../gqls/api.gql';
import { useMutation } from '@apollo/client';
const { Search } = Input;
const { DirectoryTree } = Tree;
const { confirm } = Modal;

interface selectedNodesItem {
  id?: string;
  name?: string;
  note?: string;
  parentId?: string;
}
interface ModuleMenuProps {
  interfaceTypes?: any;
  selectedKeysId?: any;
  updateState: (value: any) => void;
  visible: boolean;
  selectedNodes?: selectedNodesItem;
  edit: boolean;
  selectKey: string;
  refetch: any;
}
function ModuleMenu(props: ModuleMenuProps) {
  const [deleteModuleData] = useMutation(DELETE_MODULES__NOTE);
  const { interfaceTypes = [], updateState, selectedKeysId, selectedNodes, refetch } = props;

  let treeData: any = interfaceTypes && treeFormat(
    [
      ...interfaceTypes.map((b: any) => ({
        ...b,
        oid: b.id,
        id: b.id,
        parentId: !!b.parent ? b.parent.id : ''
      }))
    ].map((item: any) => ({ ...item, key: item.id, title: `${item.name}` })));

  const handleSearch = (value: any, option: any) => {
    updateState({
      selectedKeysId: option.key === 'status' ? [option.key] : selectedKeysId,
      selectedKeys: { id: option.key, name: value },
      meunCrumb: [{ id: option.key, key: option.key, name: value }]
    })
  }
  const onSelect = (selectedKeys: any, e: any) => {
    updateState({
      selectedNodes: e.selectedNodes && e.selectedNodes[0],
      selectedKeysId: selectedKeys[0] === 'status' ? selectedKeys : selectedKeysId,
      selectedKeys: { id: selectedKeys[0], name: e.node.props.name },
      meunCrumb: [{ id: selectedKeys[0], key: selectedKeys[0], name: e.node.props.name }]
    })
    // }
  }
  const onExpand = (expandedKeys: any, e: any) => {
    updateState({
      selectedKeysId: expandedKeys,
    })
  };

  //点击修改
  const edit = () => {
    if (selectedNodes && selectedNodes.id) {
      updateState({ visible: true, edit: true })
    } else {
      message.error('请先选择要修改的节点', 3);
    }
  }

  //删除节点
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
            const deleteData = await deleteModuleData({
              variables: {
                id: selectedNodes.id
              }
            }).catch(error => {
              message.error('删除失败！', error);
            });
            if (deleteData.data.deleteApiTypeManage && deleteData.data.deleteApiTypeManage === true) {
              await refetch();
              message.success('删除成功', 3);
            } else {
              message.error('删除失败！');
            }
          },
          onCancel() {
          }
        });
      }
    } else {
      message.error('请先选择要删除的节点', 3);
    }
  }

  //点击新增
  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          if (selectedNodes && selectedNodes.id) {
            updateState({ visible: true, edit: false, selectKey: '1' })
          } else {
            message.error('请先选择节点', 3);
          }
        }}
      >
        添加当前节点下的模块
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() =>
          updateState({ visible: true, edit: false, selectKey: '2' })
        }
      >
        添加一级模块
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <AutoComplete
        filterOption
        onSelect={handleSearch}
        dataSource={[...interfaceTypes.filter((item: any) => item.parent)]}
      >
        <Search placeholder="请输入搜索内容" style={{ width: 280 }} />
      </AutoComplete>
      <hr />

      <Row>
        <Col span={22}>
          <DirectoryTree
            multiple
            expandedKeys={selectedKeysId}
            defaultSelectedKeys={selectedKeysId}
            treeData={treeData}
            onSelect={onSelect}
            onExpand={onExpand}
          ></DirectoryTree>
        </Col>

        <Col span={2} className='handle'>
          <Tooltip title='添加模块'>
            <Dropdown overlay={menu}>
              <i className='iconfont icontianjia_add leftIcon' />
            </Dropdown>
          </Tooltip>

          <Tooltip title='修改选中节点'>
            <div className='edit' onClick={edit}><EditFilled /></div>
          </Tooltip>

          <Tooltip title='删除选中节点'>
            <i className='iconfont iconlajitong1-copy leftIcon' onClick={deleteModule} style={{ fontSize: 18 }} />
          </Tooltip>
        </Col>
      </Row>
    </>
  );
};

export default ModuleMenu;