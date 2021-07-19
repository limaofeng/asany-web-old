import React from "react";
import { createFromIconfontCN } from '@ant-design/icons';
import moment from "moment";
import styles from '../index.less';

interface ApiRegulateProps {
  meunCrumb: any;
  interfaceType: any;
  updateState?: (value: any) => void;
  refetch?: any;
  updataStatus: (value: any) => void;
  getNameInfo?: any;
  getTypeInfo?: any;
}

function ApiRegulate(props: ApiRegulateProps) {
  const { meunCrumb, interfaceType, updateState, refetch, updataStatus, getNameInfo, getTypeInfo } = props;
  const IconFont = createFromIconfontCN({
    scriptUrl: require('../assets/iconfont/iconfont.js'),
  });

  // 获取单个接口详细信息
  const switchPage = async (value: any, index: number) => {
    console.log('单个接口数据', value, index)
    if (!meunCrumb.some((item: any) => item.id == value.id)) {
      meunCrumb.splice(1, 1, { id: value.id, key: value.id, name: value.name, refetch: refetch })
      updateState && updateState({ meunCrumb })
      updataStatus({
        selectedApiIndex: index,
        firstTag: index === 0 ? false : true,
        lastTag: index === (interfaceType.interfaces.length - 1) ? false : true
      })
      await getNameInfo && getNameInfo({ id: '' })
      await getTypeInfo && getTypeInfo({ id: '' })
      refetch({ id: value.id })
    }
  }

  return (
    <>
      <span className={styles.title}>{interfaceType.name}</span>
      <span className={styles.updateTime}>{`更新时间: ${moment(interfaceType.updatedAt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")}`}</span>
      <div dangerouslySetInnerHTML={{ __html: interfaceType.note }} />
      <br />
      <span className={styles.title}>接口列表:</span>
      {
        (interfaceType.interfaces || []).map((item: any, index: number) =>
          <div className={styles.list_item} key={item.id}>
            <IconFont type={`${item.icon === 'query' ? 'iconGainlearning' :
              item.icon === 'create' ? 'iconNewstudy' :
                item.icon === 'update' ? 'iconModifylearning' : 'iconDeletelearning1'}`} />
            <div>
              <span onClick={() => switchPage(item, index)}>{item.name}</span>
              <span>{item.id}</span>
              <span>{item.describe}</span>
            </div>
          </div>
        )
      }
    </>

  );
}

export default ApiRegulate;
