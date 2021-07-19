import React from "react";
import {NavLink} from "umi";
import {configurationMenus} from "./configuration-menu";
import style from '../Application.less';

function ThirdParty(props: { application: any }) {
  const { application } = props
  if (!application.dingtalkIntegration && !application.ezofficeIntegration) {
    return null;
  }
  return (
    <>
      <p className="pad-all text-main text-sm text-uppercase text-bold">第三方配置</p>
      <div className={`list-group bg-trans ${style.appMenu}`}>
        {configurationMenus
          .filter((item) => item.group === 'thirdParty')
          .map((menu) => (
            <NavLink
              key={`meuns-${menu.id}`}
              to={menu.url}
              activeClassName={style.activelink}
              className="list-group-item"
            >
              <i className="demo-pli-mine icon-lg icon-fw"/> {menu.name}
            </NavLink>
          ))}
      </div>
    </>
  );
}

/**
 * 钉钉 配置
 * @param props
 * @constructor
 */
function DingDingTalk(props: { application: any }) {
  const { application } = props
  if (!application.dingtalkIntegration) {
    return null;
  }
  return (
    <>
      <p className="pad-all text-main text-sm text-uppercase text-bold">钉钉配置</p>
      <div className={`list-group bg-trans ${style.appMenu}`}>
        {configurationMenus
          .filter((item) => item.group === 'dingtalk')
          .map((menu) => (
            <NavLink
              key={`meuns-${menu.id}`}
              to={menu.url}
              activeClassName={style.activelink}
              className="list-group-item"
            >
              <i className="demo-pli-mine icon-lg icon-fw"/> {menu.name}
            </NavLink>
          ))}
      </div>
    </>
  );
}

/**
 * EZOffice 配置
 * @param props
 * @constructor
 */
function EzOffice(props: { application: any }) {
  const { application } = props
  if (!application.ezofficeIntegration) {
    return <></>;
  }
  return (
    <>
      <p className="pad-all text-main text-sm text-uppercase text-bold">EZOFFICE配置</p>
      <div className={`list-group bg-trans ${style.appMenu}`}>
        {configurationMenus
          .filter((item) => item.group === 'ezoffice')
          .map((menu) => (
            <NavLink
              key={`menu-${menu.id}`}
              to={menu.url}
              activeClassName={style.activelink}
              className="list-group-item"
            >
              <i className="demo-pli-mine icon-lg icon-fw"/> {menu.name}
            </NavLink>
          ))}
      </div>
    </>
  );
}

export default function ConfigurationSlider(props: { application: any }) {
  const { application } = props
  return (
    <>
      <div className="pad-all">
        <div style={{ marginLeft: '52px' }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img width="102" height="102" style={{ borderRadius: '10px' }} src={application.logo}/>
          <p
            className="text-main text-sm text-uppercase text-bold"
            style={{ marginTop: '20px', textAlign: 'center', width: '102px' }}
          >
            {application.name}
          </p>
        </div>
      </div>
      <hr className="new-section-xs"/>
      <p className="pad-all text-main text-sm text-uppercase text-bold">应用配置</p>
      <div className={`list-group bg-trans ${style.appMenu}`}>
        {configurationMenus
          .filter((item) => item.group === 'app')
          .map((menu) => (
            <NavLink
              key={`meuns-${menu.id}`}
              to={menu.url}
              activeClassName={style.activelink}
              className="list-group-item"
            >
              <i className="demo-pli-mine icon-lg icon-fw"/> {menu.name}
            </NavLink>
          ))}
      </div>
      <ThirdParty application={application}/>
      {/*  <DingDingTalk application={application}/> */}
      {/* <EzOffice application={application}/> */}
    </>
  );
}