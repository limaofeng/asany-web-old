import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styles from '../index.less';
import {apiType as GET_INTERFACE_TYPE,
  api as GET_API_INFO,
  typeDefinition as GET_TYPE_INFO,
  fieldDefinition as GET_NAME_INFO,
} from '../gqls/api.gql';
// import ApiItem from './ApiItem';
import ApiList from './ApiList';
// import StatusCode from './StatusCode';

interface selectedKeysItem {
  id: string;
  key: string;
  name: string;
  type?: any;
  repeated?: any;
  refetch?: (value: any) => void;
}
interface ContainerPageProps {
  selectedKeys: selectedKeysItem | any;
  meunCrumb: selectedKeysItem[];
  updateState?: (value: any) => void;
}

function ContainerPage(props: ContainerPageProps) {
  const { selectedKeys, meunCrumb, updateState } = props;
  const [state, setState] = useState({
    selectedApiIndex: null,
    lastTag: false,
    firstTag: false,
    filedValue: undefined,
    repeated: null,
  })
  const updataStatus = (value: any) => {
    setState({ ...state, ...value })
  }


  const { data: nameInfo, refetch: getNameInfo } = useQuery(GET_NAME_INFO, {
    variables: { id: '' },
    fetchPolicy: 'network-only',
  })
  const { data: typeInfo, refetch: getTypeInfo } = useQuery(GET_TYPE_INFO, {
    variables: { id: '' },
    fetchPolicy: 'network-only',
  })
  const { fieldDefinition } = nameInfo || {}
  const { typeDefinition } = typeInfo || {}

  // 请求所有接口
  const { data } = useQuery(GET_INTERFACE_TYPE, {
    variables: {
      id: meunCrumb.length > 0 && meunCrumb[0].id !== 'status' ? selectedKeys.id : ''
    }
  })
  // 请求单个接口
  const { data: apiInfo, refetch } = useQuery(GET_API_INFO, {
    variables: {
      id: ''
    }
  })
  const { apiType } = data || {}
  const { api: interfaceInfo = {} } = apiInfo || {};

  // 点击面包屑
  const handleClick = (value: any, index: number) => async(e: any) => {
    if (index < meunCrumb.length - 1) {
      if (value.id === 'status') {
        updateState && updateState({ meunCrumb: [value], selectedKeys: value, selectedKeysId: [value.id] });
      } else {
        meunCrumb.splice(index+1, (meunCrumb.length-1)-(index))
        updateState && updateState({ meunCrumb });
        if(index === 1){
          await getNameInfo({id: ''})
          await getTypeInfo({id: ''})
        }
        value.refetch && value.refetch(value)
      }
      if(index < 2) {
        updataStatus({repeated: null})
      } else {
        updataStatus({repeated: value.repeated })
      }
    }
  }
  return (
    <>
      <div className={`${styles.container_page} scrollContainer`}>
        {
          apiType && Object.getOwnPropertyNames(selectedKeys).length ?
            <ApiList
              meunCrumb={meunCrumb}
              interfaceType={apiType}
              updateState={updateState}
              refetch={refetch}
              updataStatus={updataStatus}
              getNameInfo={getNameInfo}
              getTypeInfo={getTypeInfo}
            /> : ""
        }
      </div>

    </>
  );
};
export default ContainerPage;
