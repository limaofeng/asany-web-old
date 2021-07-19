import React, { useEffect, useState } from 'react';
import { Button, message, Menu, Dropdown, Popover, Modal, Badge } from 'antd';
import './style/CaseCard.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withApollo } from '@apollo/client/react/hoc';
import { getCases, caseUseApplication, removeCaseUseApplication } from '../gqls/Cases.gql';
import { compareVersion } from '../utils/compare-version';
import { DEFAULT_MODULE_IMG } from '../base/consts';
import { CheckOutlined } from '@ant-design/icons';
import { useReduxSelector } from '@asany/components/lib/utils';

interface CaseVersion {
  id: string;
  /** 版本名称 */
  name: string;
  /** 版本版本 */
  version: string;
  /** 版本描述 */
  description: string;
  use: boolean;
}

/**
 * 模块管理
 */
interface ApplicationCase {
  id: string;
  /** 描述信息 */
  description: string;
  /** 图标 */
  icon: string;
  /** 模块名称 */
  name: string;
  /** 模块版本 */
  version: CaseVersion[];
  /** 已经使用 */
  install: boolean;
}

interface ModuleCardProps {
  /** 模块数据 */
  data: ApplicationCase;
  /** 模块安装 */
  onModuleInstall: (id: string, version: string) => void;
  onModuleUninstall: (id: string, version: string) => void;
}

function usedIcon() {
  return (
    <div
      style={{
        width: 0,
        height: 0,
        top: '10px',
        right: '10px',
        borderTop: '22px solid #1890ff',
        borderLeft: '22px solid transparent',
      }}
    >
      <span
        style={{
          position: 'absolute',
          right: 0,
          top: '-22px',
        }}
      >
        <CheckOutlined
          style={{
            color: 'white',
          }}
        />
      </span>
    </div>
  );
}

function ModuleCard(props: ModuleCardProps) {
    const { data, onModuleInstall, onModuleUninstall } = props;
    console.log('data----模块',data)
    const usedVersion = data.version.find((x) => x.use)?.version || '';
    const handleInstall = (version: string) => () => {
      const versionIndex = data.version.findIndex((v) => v.version === version);
      const versionMsg = versionIndex === data.version.length - 1 ? '最新版本' : `${version} 版本`;
      Modal.confirm({
        title: '安装确认',
        content: `确认安装 "${data.name}" 模块的${versionMsg}吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => onModuleInstall(data.id, version),
      });
    };

    const handleMenuClick = (e: any) => handleInstall(e.key)();

    const handleInstallLast = () => {
      const lastVersion = data.version[data.version.length - 1]?.version;
      handleInstall(lastVersion)();
    };

    const handleUninstall = () => {
      Modal.confirm({
        title: '卸载确认',
        content: `确认卸载 "${data.name}" 模块吗？`,
        okText: '确认',
        cancelText: '取消',
        okButtonProps: {
          danger: true,
        },
        onOk: () => onModuleUninstall(data.id, usedVersion),
      });
    };

    const menu = (
      <Menu onClick={handleMenuClick}>
        {data.version.map((x) => (
          <Menu.Item key={x.version}>{x.version}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div className="case-card case-card-hover" style={{ minHeight: '60px' }}>
        <Badge count={data.install ? usedIcon() : null}>
          <div className="case-card__body px-2">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img width="60px" height="60px" src={data.icon || DEFAULT_MODULE_IMG} alt="" />
              <div className="case-card__body--right">
                <div className="case-card__title">{data.name}</div>
                <div
                  style={{
                    fontSize: '13px',
                  }}
                >
                  <Popover title="使用版本" content={usedVersion} trigger="hover">
                    <span> {usedVersion}</span>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="mt-1">{data.description}</div>
          </div>
          <div className="case-card__foot p-2 text-right">
            {
              // eslint-disable-next-line no-nested-ternary
              !data.install ? (
                data.version.length > 1 ? (
                  <Dropdown.Button size="small" overlay={null ?? menu} onClick={handleInstallLast}>
                    安装最新版本
                  </Dropdown.Button>
                ) : (
                  <Button size="small" onClick={handleInstallLast}>
                    安装最新版本
                  </Button>
                )
              ) : (
                <Button onClick={handleUninstall} size="small">
                  卸载
                </Button>
              )
            }
          </div>
        </Badge>
      </div>
    );
}

interface ModuleProps {
  client: any;
  location: any;
}

/**
 * 模块管理
 * @param props
 * @constructor
 */
function Cases(props: ModuleProps) {
  const { client, location } = props;
  const applicationId = useReduxSelector((state) => state.global.application?.id);
  const [modules, setModule] = useState<ApplicationCase[]>([]);

  const queryCases = () => {
    client
      .query({
        query: getCases,
        variables: { applicationId },
        fetchPolicy: 'no-cache',
      })
      .then((res: any) => {
        const cases: ApplicationCase[] = res?.data?.cases || [];
        cases.forEach((x) => {
          x.version.sort((perv, next) => {
            const prevVer = perv.version.split('VERSION')[1];
            const nextVer = next.version.split('VERSION')[1];
            return compareVersion(prevVer, nextVer);
          });
        });
        setModule(cases);
      });
  };

  useEffect(() => queryCases(), []);

  const [mutateIds, setMutateIds] = useState<string[]>([]);

  const handleCaseInstall = async (caseId: string, version: string) => {
    console.log('安装模块---',caseId,version)
    if (mutateIds.includes(caseId)) {
      message.warning('当前模块修改请求未完成，请等待...');
      return;
    }

    // TODO 更新路由模块
    try {
      setMutateIds([...mutateIds, caseId]);
      await client.mutate({
        mutation: caseUseApplication,
        variables: {
          caseId,
          version,
          applicationId,
        },
      });
      setMutateIds(mutateIds.filter((x) => x !== caseId));
      message.success('模块安装成功');
    } catch (e) {
      console.log('安装模块---eeeeee',e)
      setMutateIds(mutateIds.filter((x) => x !== caseId));
    }
    queryCases();
  };

  const handleCaseUninstall = async (caseId: string, version: string) => {
    const applicationId = location.state.data.id;
    await client.mutate({
      mutation: removeCaseUseApplication,
      variables: {
        caseId,
        version,
        applicationId,
      },
    });
    message.success('模块卸载成功');
    queryCases();
  };

  return (
    <>
      <main className="card-deck px-2">
        {modules.map((x) => (
          <ModuleCard data={x} key={x.id} onModuleInstall={handleCaseInstall} onModuleUninstall={handleCaseUninstall} />
        ))}
        {
          // flex 布局填充时
          // 一共 7个 一行 6 个，剩余一个会满屏幕展示
          // 添加 12 个 最小宽度 220 px 的小伙伴 （220 * 13）远远超过当前屏幕
          // visibility 仍旧会占据位置 1800px 够用
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((item) => (
            <div className="case-card case-card-ghost" key={item} />
          ))
        }
      </main>
    </>
  );
}

// @ts-ignore
export default withApollo(Cases);
