import useUpdateApp from '../hooks/useUpdateApp';
import { useReduxSelector } from '@asany/components/lib/utils';
import {Button, Space} from 'antd';
import React, { useState } from 'react';
import OrganizationSelect from '../UserManageMent/components/OrganizationSelect';


function Organization(){
  const organization = useReduxSelector((state) => state.global.organization)
  const applicationId = useReduxSelector((state) => state.global.application?.id);
  const [selectOrg,setOrg] = useState(organization)
  const [visible,setVisible] = useState(organization ? false : true)
  const { success, error, useUpdateAppData } = useUpdateApp();
  const handleSelect = (value: any) => {
   setOrg(value)
  };

  const handleUnbindOrganization = () => {
    useUpdateAppData({ 'organization': null }, applicationId);
    setOrg(null)
    setVisible(true)
  };

  const handleOrganization = () => {
    if (selectOrg) {
      useUpdateAppData({ 'organization': selectOrg.id }, applicationId);
      setVisible(false)
    }
  };
  if (!visible && selectOrg) {
    return (
      <Space direction='vertical'>
        <div>组织ID：{selectOrg.id}</div>
        <div>组织名：{selectOrg.name}</div>
        <a onClick={handleUnbindOrganization}>解除组织绑定</a>
      </Space>
    );
  }
  return (
      <Space direction='vertical' style={{ minHeight: '800px' }}>
        <Space>
          <span>组织: </span>
          <OrganizationSelect onSelect={handleSelect}/>
        </Space>
        <Button onClick={handleOrganization}>绑定组织</Button>
      </Space>
    );
}


export default Organization