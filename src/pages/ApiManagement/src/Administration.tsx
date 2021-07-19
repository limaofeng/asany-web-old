/* eslint-disable no-console */
import { PageContainer } from '@asany/components';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { treeFormat } from './utils/utils';
import { Modal, Spin } from 'antd';
import ContainerApi from './compontents/ContainerApi';
import ModuleTree from './compontents/ModuleTree';
import {
  typeDefinitions as GET_GENRETABLED,
  apiTreeTypes as GET_TREEDATA,
  api as GET_API_INFO,
} from './gqls/api.gql';
import styles from './index.less';
import PropertyModel from './compontents/PropertyModel';
import BindModel from './compontents/BindModel';
import GenreManagement from "./GenreManagement";
function Administration(props:any) {
  const [state, setState] = useState({
    selectedKeys: {},
    selectedKeysId: [],
    meunCrumb: [],
    selectedNodes: {},
    selectKey: '',
    visible: false,
    edit: false,
    genreId: '',
    itemInterFaceId: '', // ContainerApi组件 控制接口详情数据
    showTypeInput: false, // PropertyModel组件 编辑模式弹窗
    typeOrInterface: false, // 控制右边显示接口详情还是类型详情
    genreManagementParamId: '', // 类型kind
    bindData: false
  });
  const updateState = (value: any) => {
    setState({
      ...state,
      ...value,
    });
  };

  const hideModal = () => {
    updateState({
      visible: false,
    });
  }
  // 传入子接口数据到apiItem中(修改ContainerApi的interfaceInfo)
  const { data: apiInfo, error: apiInfoErr, refetch: apiInfoRefetch } = useQuery(GET_API_INFO, {
    variables: {
      id: '',
    },
  })
  // const [form] = Form.useForm();
  const { data: genretableData, error: genretableErr, loading } = useQuery(GET_GENRETABLED);
  const { data: treeData, error: treeErr, refetch: getTreeData, loading: treeDataLoaing } = useQuery(GET_TREEDATA, { fetchPolicy: 'no-cache' });
  if (treeErr || genretableErr || apiInfoErr) {
    console.warn(treeErr || genretableErr || apiInfoErr);
  }
  const { api: interfaceInfo = {} } = apiInfo || {};
  const { apiTypes = [] } = treeData || {};
  const { typeDefinitions = [] } = genretableData || {}
  // 处理树形结构
  const doData = (arr: Array<any>) => {
    const apiArrInterfaces = arr.map((item: any) => {
      if (item.children) {
        doData(item.children);
      }
      if (item.interfaces && item.interfaces.length > 0) {
        item.interfaces.map((i: any) => {
          i.key = i.id;
          i.title = i.name;
          i.parentId = item.id;
          i.parentName = item.name
        })
        item.children = item.interfaces;
      }
      return item;
    })
    return apiArrInterfaces;
  }
  const newTreeArr = () => {
    let typeName: string = ''
    const interfaceArr: any = {};
    const typeDefinitionsArr: any[] = [];
    const obj = {}
    const treeList = typeDefinitions;
    treeList.forEach((item: any, index: number) => {
      item = {
        ...item,
        key:index,
        title:item.name
      };
      if (obj[`${item.kind}`]) {
        obj[`${item.kind}`].push(item);
      } else {
        obj[`${item.kind}`] = [item];
      }
    });
    Object.keys(obj).forEach((name: string) => {
      if (name === 'Scalar') {
        typeName = '基本数据类型'
      } else if (name === 'Type') {
        typeName = '自定义类型'
      } else if (name === 'Input') {
        typeName = '输入类型'
      } else if (name === 'Enum') {
        typeName = '枚举类型'
      } else if (name === 'Union') {
        typeName = '联合类型'
      } else if (name === 'Interface') {
        typeName = '接口类型'
      } else {
        typeName = name
      }
      const item = {
        key: name,
        oid: obj[`${name}`][0].name,
        title: typeName,
        id: name,
        children: obj[`${name}`],
      }
      typeDefinitionsArr.push(item)
    })
    interfaceArr.id = 'types';
    interfaceArr.oid = 'types';
    interfaceArr.key = 'types';
    interfaceArr.title = '类型';
    interfaceArr.children = typeDefinitionsArr
    const apiTypesArr = apiTypes && treeFormat(
      [
        ...apiTypes.map((i: any) => ({
          ...i,
          oid: i.id,
          id: i.id,
          parentId: i.parent ? i.parent.id : '',
        })),
      ].map((item: any) => ({ ...item, key: item.id, title: `${item.name}` })));
    const apitypeTree = doData(apiTypesArr);
    return [...apitypeTree, interfaceArr]
  }

  // deal new data
  const graphql =
    (interfaceInfo && Object.entries(interfaceInfo).length !== 0) ?
      interfaceInfo.graphql.interface : null;
  const dealApiData = () => {
    const data =
      interfaceInfo ?
        {
          id: interfaceInfo.id || '',
          name: (graphql && graphql.name) || '',
          title: (graphql && graphql.title) || '',
          tags: (graphql && graphql.tags && graphql.tags[0]) || '',
          description: (graphql && graphql.description) || '',
          defaultValue: (graphql && graphql.defaultValue) || '',
          delegate: (graphql && graphql.delegate && graphql.delegate.id) || '',
          deprecated: (graphql && graphql.deprecated) || Boolean,
          type: {
            repeated: graphql && graphql.type && graphql.type.repeated,
            required: graphql && graphql.type && graphql.type.required,
            kind: {
              id: graphql && graphql.type && graphql.type.kind && graphql.type.kind.id,
            },
          },
          arguments: (graphql && graphql.arguments) || [],
        } : {}
    return data;
  }

  const {
    selectKey,
    selectedNodes,
    selectedKeysId,
    edit,
    visible,
    genreId,
    showTypeInput,
    typeOrInterface,
    genreManagementParamId,
    bindData
  } = state;
  // console.log('adkasdks', props)


  // console.log('-----------bind', bindData);
  return (
    <PageContainer title="API管理" contentClassName="api-document-content">
      <div className={styles.normal}>
        <div className={styles.sider}>
          <Spin
              spinning= {treeDataLoaing || loading}
          />
          {
            !treeDataLoaing && !loading &&
            <ModuleTree
                selectedNodes={selectedNodes}
                updateState={updateState}
                interfaceTypes={newTreeArr()}
                selectedKeysId={selectedKeysId}
                meunCrumb={state.meunCrumb}
                apiInfoRefetch={apiInfoRefetch}
                refetch={getTreeData}
            />
          }
        </div>

       {typeOrInterface ?
          (<div className={styles.container}>
            <GenreManagement genreManagementParamId={genreManagementParamId}/>
          </div>)
          : ''}
        {!typeOrInterface ?
          (<div className={styles.container}>
            <ContainerApi
              selectedKeys={state.selectedKeys}
              meunCrumb={state.meunCrumb}
              apiInfoRefetch={apiInfoRefetch}
              updateState={updateState}
              interfaceInfo={interfaceInfo}
            />
          </div>)
            : ''
         }
      </div>

      {
            !bindData &&
              <Modal
                destroyOnClose
                width="800px"
                title={edit ? '修改' : '新建'}
                visible={visible}
                onCancel={hideModal}
                footer={null}
              >
                <PropertyModel
                  updateState={updateState}
                  genreId={genreId}
                  selectedNodes={selectedNodes}
                  edit={edit}
                  selectKey={selectKey}
                  showTypeInput={showTypeInput}
                  recordData={dealApiData()}
                  apiTypes={treeData}
                  api={apiInfo}
                  refetch={getTreeData}
                />
              </Modal>
      }
      {
            bindData &&
            <Modal
              destroyOnClose
              width="800px"
              title={edit ? '修改' : '新建'}
              visible={visible}
              onCancel={hideModal}
              footer={null}
            >
              <BindModel
                updateState={updateState}
                genreId={genreId}
                selectedNodes={selectedNodes}
                edit={edit}
                selectKey={selectKey}
                showTypeInput={showTypeInput}
                recordData={dealApiData()}
                apiTypes={treeData}
                api={apiInfo}
                refetch={getTreeData}
              />
            </Modal>
      }
    
      

    </PageContainer>
  );
}

export default Administration;
