import useGetAppData from '../../hooks/useGetAppData';
import { DingtalkOutlined, GroupOutlined } from '@ant-design/icons';
import { useReduxSelector } from '@asany/components/lib/utils';
import { Space } from 'antd';
import React from 'react';
import appLogo from '../../image/app-logo.svg';

function ApplicationCard() {
  const applicationId = useReduxSelector((state) => state.global.application?.id);
  const {data} = useGetAppData(applicationId)
  const {application={}} = data || {}
  const { logo, name, dingtalkIntegration, ezofficeIntegration } = application;
  console.log('应用卡片信息', application,data);
  return (
    <div className="panel pos-rel" style={{ marginBottom: 0 }}>
      <div className="pad-all text-center">
        <div className="widget-control">
          <span>版本1.0</span>
        </div>
        <a href="#">
          <img
            alt="应用logo"
            className="mar-ver"
            style={{ borderRadius: '4px', width: 64, height: 64 }}
            src={logo || appLogo}
          />
          <p className="text-lg text-semibold mar-no text-main">{name}</p>
        </a>
        <div className="pad-top btn-groups">
          <Space>
            {dingtalkIntegration && <DingtalkOutlined />}
            {ezofficeIntegration && <GroupOutlined />}
          </Space>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;
