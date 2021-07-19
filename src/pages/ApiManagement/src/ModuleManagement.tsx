import { PageContainer } from '@asany/components';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Modal, Form } from "antd";
import ContainerPage from './compontents/ContainerPage';
import ModuleMenu from './compontents/ModuleMenu';
import { apiTypes as GET_TREEDATA } from './gqls/api.gql';
import styles from './index.less';
import FormModel from './compontents/FormModel';

interface APIDocumentProps { }
function ModuleManagement(props: APIDocumentProps) {
  const [form] = Form.useForm();
  const { data, error, refetch } = useQuery(GET_TREEDATA, {fetchPolicy: 'no-cache'});
  if (error) {
    console.warn(error);
  }
  const { apiTypes = [] } = data || {};

  const [state, setState] = useState({
    selectedKeys: {},
    selectedKeysId: [],
    meunCrumb: [],
    visible: false,
    edit: false,
    selectedNodes: {},
    selectKey: ""
  });
  const updateState = (value: any) => {
    setState({
      ...state,
      ...value,
    });
  };

  const hideModal = () => {
    updateState({
      visible: false
    });
  }

  const { selectKey, edit, visible, selectedNodes, selectedKeysId, } = state;

  return (
    <PageContainer title="分类管理" contentClassName="api-document-content">
      <div className={styles.normal}>
        <div className={styles.sider}>
          <ModuleMenu selectedNodes={selectedNodes} updateState={updateState} interfaceTypes={apiTypes} selectedKeysId={selectedKeysId} refetch={refetch} />
        </div>
        <div className={styles.container}>
          <ContainerPage selectedKeys={state.selectedKeys} meunCrumb={state.meunCrumb} updateState={updateState} />
        </div>
      </div>

      <Modal
        destroyOnClose={true}
        width="800px"
        title={edit ? "修改" : "新建"}
        visible={visible}
        onCancel={hideModal}
        footer={null}
      >
        <FormModel updateState={updateState} selectedNodes={selectedNodes} edit={edit} selectKey={selectKey} refetch={refetch} />
      </Modal>
    </PageContainer>
  );
}

export default ModuleManagement;


