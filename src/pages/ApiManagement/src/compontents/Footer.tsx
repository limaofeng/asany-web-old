import React from "react";
import styles from '../index.less';
interface StateProps{
    selectedApiIndex: any;
    lastTag: boolean;
    firstTag: boolean;
}
interface FooterProps {
    value: StateProps;
    meunCrumb: any;
    apiType: any;
    refetch?: any;
    updataStatus: (value: any) => void;
    updateState?: (value: any) => void;
}

function Footer(props: FooterProps) {
  const { refetch, value, updateState, updataStatus, meunCrumb, apiType} = props;
  const {selectedApiIndex, lastTag, firstTag} = value;

  const handleJumpCatalog = (value: any, str: string) => (e:any) => {
    updataStatus({
      selectedApiIndex: (str === 'back' && (selectedApiIndex - 1 >= 0)) ? (selectedApiIndex - 1) : (str === 'next' && (selectedApiIndex + 1) <= (apiType.interfaces.length-1)) ? (selectedApiIndex + 1) : null,
      firstTag: (str === 'next' && (selectedApiIndex + 1) < (apiType.interfaces.length-1)) ? true : (str === 'back' && selectedApiIndex - 1 === 0) ? false : firstTag,
      lastTag: (str === 'back' && (selectedApiIndex - 1 > 0)) ? true : (str === 'next' && selectedApiIndex + 1 === apiType.interfaces.length-1) ? false : lastTag,
    })
    meunCrumb.splice(1,1,{
      id: value.id,
      name: apiType.interfaces.filter((item: any) => item.id == value.id)[0].name,
    })
    updateState && updateState({ meunCrumb: meunCrumb })
    refetch && refetch({id: value.id})
  }
  return (
      <>
          {
              !!apiType &&
              <div className={styles.footer}>
                  <span>
                      {
                          firstTag && selectedApiIndex !== null &&
                          <span onClick={handleJumpCatalog(apiType.interfaces[selectedApiIndex - 1], 'back')}>
                              <i className="iconfont iconxiangzuojiantou" />
                      上一篇: {apiType.interfaces[selectedApiIndex - 1].name}
                          </span>
                      }
                  </span>
                  <span>
                      {
                          lastTag && selectedApiIndex !== null &&
                          <span onClick={handleJumpCatalog(apiType.interfaces[selectedApiIndex + 1], 'next')}>
                              下一篇: {apiType.interfaces[selectedApiIndex + 1].name}
                              <i className="iconfont iconjiantou" />
                          </span>
                      }
                  </span>
              </div>
          }
      </>

  );
};

export default Footer;
