import React, { useState } from 'react';
import { Col, Empty, Input, Row, Tabs, message, Image, Tooltip } from 'antd';
import {
  applications as APPLICATIONS,
  createFavorite as CREATE_FAVORITE,
  removeFavorite as REMOVE_FAVORITE, // 取消收藏
} from '../../gqls/ApplicationsGql.gql';
import styles from './index.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useMutation } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { connect } from 'dva';

const { TabPane } = Tabs;
const { Search } = Input;

interface RenderAppsProps {
  apps: any[];
  onFavoriteCreate: () => void;
  onFavoriteRemove: () => void;
}

function RenderApps(props: RenderAppsProps) {
  const { apps, onFavoriteCreate, onFavoriteRemove } = props;
  return (
    <>
      {apps.map((app: any) => (
        <div
          className="appIcon"
          key={app.id}
          style={{
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <Image
            src={app.logo}
            width="84px"
            height="84px"
            title={app.name}
            style={{ objectFit: 'unset' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Tooltip title={app.name} placement='bottom'>
              <p style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {app.name}
              </p>
            </Tooltip>
            <div>
              {/* { */}
              {/*  app?.starrable?.viewerHasStarred ? ( */}
              {/*    <Button size='small' onClick={() => handleFavoriteCreate(app.id)}>取消收藏</Button> */}
              {/*  ) : ( */}
              {/*    <Button size='small' onClick={() => handleFavoriteCreate(app.id)}>收藏</Button> */}
              {/*  ) */}
              {/* } */}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function Applications() {
  const { data, refetch } = useQuery(APPLICATIONS);
  const [createFavorite] = useMutation(CREATE_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);

  const [searchStr, setSearchStr] = useState('');

  const handleFavoriteCreate = async () => {
    await createFavorite({
      variables: {},
    });
    message.success('收藏成功');
    refetch();
  };

  const handleFavoriteRemove = async () => {
    await removeFavorite({
      variables: {},
    });
    message.success('取消收藏成功');
    refetch();
  };

  const applications = data?.apps || [];

  return (
    <>
      <div className="desktop">
        <Row>
          <Col span={20} offset={2}>
            <div className="searchInput">
              <Search
                size="small"
                style={{ width: '20%', borderRadius: '20px' }}
                onSearch={(value) => setSearchStr(value)}
                placeholder="搜索"
              />
            </div>
            <Tabs style={{ textAlign: 'left' }} defaultActiveKey="4">
              <TabPane tab="常用" key="4">
                <div className={styles.appContainer}>
                  <RenderApps
                    apps={applications
                      .filter((x: any) => (searchStr ? x.name.includes(searchStr) : x))
                      .filter((item: any) => item.starrable && item.starrable.viewerHasStarred)}
                    onFavoriteCreate={handleFavoriteCreate}
                    onFavoriteRemove={handleFavoriteRemove}
                  />
                </div>
              </TabPane>
              <TabPane tab="全部" key="1">
                <div className={styles.appContainer}>
                  <RenderApps
                    apps={applications.filter((x: any) =>
                      searchStr ? x.name.includes(searchStr) : x,
                    )}
                    onFavoriteCreate={handleFavoriteCreate}
                    onFavoriteRemove={handleFavoriteRemove}
                  />
                </div>
              </TabPane>
              <TabPane tab="网页应用" key="2">
                <div className={styles.appContainer}>
                  <RenderApps
                    apps={applications.filter((x: any) =>
                      searchStr ? x.name.includes(searchStr) : x,
                    )}
                    onFavoriteCreate={handleFavoriteCreate}
                    onFavoriteRemove={handleFavoriteRemove}
                  />
                </div>
              </TabPane>
              <TabPane tab="桌面应用" key="3">
                <Empty />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    </>
  );
}

const ApplicationWrapper = (props: any) => (props?.currentUser?.token ? <Applications /> : null);

export default connect(({ auth: { currentUser }, global: { organization } }: any) => ({
  currentUser,
  organization,
}))(ApplicationWrapper);
