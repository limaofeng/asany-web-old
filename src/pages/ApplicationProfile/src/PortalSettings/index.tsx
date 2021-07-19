import React, { useState, useRef, useEffect } from 'react';

import { Spin, message, Modal, Cascader, Drawer } from 'antd';

import { useQuery, useMutation } from '@apollo/client';

import PortalTable from './components/PortalTable';
import PortalForm from './components/PortalForm';
import ComponentSketch from '../components/ComponentSketch';

import moment from 'moment';

import { utils } from '@asany/components';

import { PortalData, PortalTypeEnum } from './components/data.d';

import {
  queryPortals as QUERYPORTALS,
  createPortal as CREATEPORTAL,
  updatePortal as UPDATEPORTAL,
  removePortal as REMOVEPORTAL,
  createPortals as CREATEPORTALS,
} from '../gqls/portal.gql';

const defaultPortalComponent = {
  name: '门户',
  template: 'com.thuni-h.components.Portal',
  props: null,
};

const getTableData = (data: any): PortalData[] => {
  const portals = data && data.portals;
  if (!portals) {
    return [];
  }

  return portals.map((e: any) => ({
    id: e.id,
    name: e.name,
    viewable: e.viewable,
    useable: e.useable,
    default: e.default,
    system: e.system,
    index: e.index,
    description: e.description,
    component: {
      template: e.component && e.component.template,
      props: e.component && e.component.props,
    },
    icon: {
      type: e.icon && e.icon.type,
      color: e.icon && e.icon.color,
      theme: e.icon && e.icon.theme,
    },
    creator: e.creator && e.creator.name,
    modifier: e.modifier && e.modifier.name,
    createdAt: e.createdAt && moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: e.updatedAt && moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    type: e.type,
    path: e.path,
  }));
};

const getDefaultIndex = (data: any) => {
  let res = 10000;

  const portals: PortalData[] = getTableData(data);

  if (portals.length === 0) {
    return res;
  }

  portals.forEach((e) => {
    const index = e.index || 0;

    res = res < index ? index : res;
  });

  // 加 10000
  res = res + 50000;
  return res > 999999999 ? 999999999 : res;
};

const { useReduxSelector } = utils;

const Portal: React.FC = () => {
  const [spinning, setSpinning] = useState(false);

  const currentUser = useReduxSelector((state) => state.auth.currentUser) || { uid: '1' };

  // 列表
  const { data: queryData, loading: tableLoading, refetch: tableRefetch } = useQuery(QUERYPORTALS, {
    variables: {
      applicationId: process.env.APPID,
    },
  });

  const [tableData, setTableData] = useState<PortalData[]>([]);

  useEffect(() => {
    const data = getTableData(queryData);

    setTableData(data);
  }, [queryData]);

  const handleSearch = (params: PortalData) => {
    const data: PortalData[] = getTableData(queryData);

    const { name } = params;

    if (!name || !name.trim()) {
      setTableData(data);
      return;
    }

    setTableData(data.filter((e) => e.name && e.name.indexOf(name) > -1));
  };

  const [removePortal] = useMutation(REMOVEPORTAL);

  const handleDelete = async (params: string) => {
    setSpinning(true);

    const res = await removePortal({
      variables: {
        id: params,
      },
    });

    setSpinning(false);

    const result = res.data && res.data.result;

    if (result) {
      message.success('删除成功');
      tableRefetch();
      return;
    }

    message.error('删除失败，请重试');
  };

  const [updatePortal] = useMutation(UPDATEPORTAL);

  const handleMove = async (id: string, index: number) => {
    setSpinning(true);

    const input = {
      index,
    };

    const res = await updatePortal({
      variables: {
        id,
        input,
      },
    });

    setSpinning(false);

    const portal = res.data && res.data.portal;

    if (portal) {
      message.success('操作成功');

      tableRefetch();
      return;
    }

    message.error('操作失败，请重试');
  };

  // 表单
  const [title, setTitle] = useState('新增');
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<PortalData>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useRef<any>(null);

  const handleOpenForm = (title: string, params: PortalData) => {
    setSubmitLoading(false);
    setFormData(params);
    setTitle(title);
    setVisible(true);
  };

  const handleCloseForm = () => {
    setVisible(false);
  };

  const [createPortal] = useMutation(CREATEPORTAL);

  const handleSubmit = async (params: PortalData) => {
    setSubmitLoading(true);

    const newParams = {
      ...params,
    };

    delete newParams.id;
    delete newParams.creator;
    delete newParams.modifier;
    delete newParams.system;
    delete newParams.createdAt;
    delete newParams.updatedAt;

    // 编辑
    if (params.id) {
      const input: any = {
        ...newParams,
        modifier: currentUser.uid,
      };

      // 如果是路由门户，清除组件配置
      if (newParams.type === PortalTypeEnum.ROUTE) {
        input.component = null;
      }

      const res = await updatePortal({
        variables: {
          id: params.id,
          input,
        },
      });

      setSubmitLoading(false);

      const portal = res.data && res.data.portal;

      if (portal) {
        message.success('操作成功');

        tableRefetch();
        handleCloseForm();
        return;
      }

      message.error('操作失败，请重试');

      return;
    }

    // 新增
    let input: any = {
      ...newParams,
      application: process.env.APPID,
      creator: currentUser.uid,
      modifier: currentUser.uid,
    };

    const res = await createPortal({
      variables: {
        input,
      },
    });

    setSubmitLoading(false);

    const portal = res.data && res.data.portal;

    if (portal) {
      message.success('操作成功');
      tableRefetch();
      handleCloseForm();
      return;
    }

    message.error('操作失败，请重试');
  };

  // 设计器
  const [designVisible, setDesignVisible] = useState(false);
  const [designPortal, setDesignPortal] = useState<PortalData>();
  const [designData, setDesignData] = useState<any>();

  const handleDesign = (params: PortalData) => {
    const { component = {} } = params;

    setDesignData({ ...defaultPortalComponent, props: component.props });
    setDesignPortal({ ...params });
    setDesignVisible(true);
  };

  const handleDesignOk = async (params: any) => {
    setSpinning(true);

    const input = {
      component: params.data,
    };

    const res = await updatePortal({
      variables: {
        id: designPortal?.id,
        input,
      },
    });

    setSpinning(false);

    const portal = res.data && res.data.portal;

    if (portal) {
      message.success('操作成功');

      tableRefetch();
      setDesignVisible(false);
      return;
    }

    message.error('操作失败，请重试');
  };

  // 导入
  const [createPortals] = useMutation(CREATEPORTALS);
  const handleAdds = async (params: PortalData[]) => {
    setSubmitLoading(true);

    const index = getDefaultIndex(queryData);
    // 属性补全
    const inputs = params.map((e, i) => ({
      ...e,
      application: process.env.APPID,
      creator: currentUser.uid,
      modifier: currentUser.uid,
      index: index + index * i,
    }));

    const res = await createPortals({
      variables: {
        inputs,
      },
    });

    setSubmitLoading(false);

    const portal = res.data && res.data.portal;

    if (portal) {
      message.success('导入成功');
      tableRefetch();
      return;
    }

    message.error('导入失败，请重试');
  };

  return (
    <>
      <Spin spinning={spinning}>
        <PortalTable
          loading={tableLoading}
          dataSource={tableData}
          onSearch={handleSearch}
          onAdd={() =>
            handleOpenForm('新增', {
              index: getDefaultIndex(queryData),
              useable: true,
              default: false,
              type: PortalTypeEnum.CONFIG,
            })
          }
          onEdit={(data) => handleOpenForm('编辑', { ...data })}
          onCopy={(data) =>
            handleOpenForm('复制', { ...data, id: undefined, index: getDefaultIndex(queryData) })
          }
          onDelete={handleDelete}
          onDesign={handleDesign}
          onMove={handleMove}
          onAdds={handleAdds}
        />

        {designVisible && (
          <ComponentSketch
            componentInfo={designData}
            onClose={() => setDesignVisible(false)}
            onChange={handleDesignOk}
            visible={designVisible}
          />
        )}
      </Spin>

      <Modal
        width={1000}
        title={title}
        visible={visible}
        onCancel={handleCloseForm}
        onOk={() => form.current.submit()}
        confirmLoading={submitLoading}
        maskClosable={false}
      >
        <PortalForm ref={form} dataSource={formData} onSubmit={handleSubmit} />
      </Modal>
    </>
  );
};

export default Portal;
