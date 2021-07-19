import React from "react";
import { createFromIconfontCN } from '@ant-design/icons';
import moment from "moment";
import styles from '../index.less';

interface ApiListProps {
  meunCrumb: any;
  interfaceType: any;
  updateState?: (value: any) => void;
  refetch?: any;
  updataStatus:(value: any) => void;
  getNameInfo?: any;
  getTypeInfo?: any;
}

function ApiList(props: ApiListProps) {
  const { meunCrumb, interfaceType, updateState, refetch, updataStatus, getNameInfo, getTypeInfo } = props;
  const IconFont = createFromIconfontCN({
    scriptUrl: require('../assets/iconfont/iconfont.js'),
  });

  // 获取单个接口详细信息
  const switchPage = async(value: any,index: number) => {
    if (!meunCrumb.some((item: any) => item.id == value.id)) {
      meunCrumb.splice(1, 1, { id: value.id, key: value.id, name: value.name,refetch: refetch })
      updateState && updateState({meunCrumb})
      updataStatus({
        selectedApiIndex: index,
        firstTag: index === 0 ? false : true,
        lastTag: index === (interfaceType.interfaces.length - 1) ? false : true
      })
      await getNameInfo && getNameInfo({id: ''})
      await getTypeInfo && getTypeInfo({id: ''})
      refetch({ id: value.id })
    }
  }

  return (
    <>
      <span className={styles.title}>{interfaceType.name}</span>
      <span className={styles.updateTime}>{`更新时间: ${moment(interfaceType.updatedAt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")}`}</span>
      <div dangerouslySetInnerHTML={{__html:interfaceType.note}} />
    </>

  );
}

export default ApiList;
