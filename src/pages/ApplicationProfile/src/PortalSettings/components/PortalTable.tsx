import React, { useState } from 'react';

import {
  Tag,
  Space,
  Table,
  Row,
  Col,
  Button,
  Input,
  Tooltip,
  Popconfirm,
  Upload,
  message,
} from 'antd';
import {
  SettingTwoTone,
  EditFilled,
  CopyFilled,
  PlusOutlined,
  DeleteFilled,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

import { useDrag, useDrop } from 'react-dnd';

import { PortalData, PortalTypeEnum } from './data.d';

import '../style/PortalTable.less';

import { exportExcel, importExcel, formatExcelData } from '../utils/excelUtils';
import { PortalTypeList } from '../utils/portalUtils';

const type = 'DragableBodyRow';

const excelHeader = [
  { title: '门户名称', key: 'name' },
  { title: '门户类型', key: 'type' },
  { title: '路由', key: 'path' },
  { title: '是否启用', key: 'useable' },
  { title: '是否默认', key: 'default' },
  { title: '描述', key: 'description' },
  { title: '图标', key: 'icon' },
  { title: '组件', key: 'component' },
];

const DragableBodyRow = ({ index, onMove, className, style, ...restProps }: any) => {
  const ref = React.useRef<any>();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      onMove(item.index, index);
    },
  });

  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

interface PortalTableProps {
  loading?: boolean;
  dataSource?: PortalData[];
  onAdd?: () => void;
  onAdds?: (data: PortalData[]) => void;
  onEdit?: (data: PortalData) => void;
  onCopy?: (data: PortalData) => void;
  onDesign?: (data: PortalData) => void;
  onDelete?: (id: string) => void;
  onSearch?: (data: PortalData) => void;
  onMove?: (id: string, index: number) => void;
}

const PortalTable: React.FC<PortalTableProps> = ({
  loading = false,
  dataSource = [],
  onAdd,
  onEdit,
  onCopy,
  onDesign,
  onDelete,
  onAdds,
  onSearch,
  onMove,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  // 选择
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => setSelectedRowKeys(selectedRowKeys),
  };

  const columns: ColumnsType<PortalData> = [
    {
      title: '设计',
      dataIndex: 'component',
      key: 'component',
      width: 100,
      render: (_, record) => (
        <>
          {record.type === PortalTypeEnum.CONFIG && (
            <SettingTwoTone twoToneColor="#eb2f96" onClick={() => onDesign && onDesign(record)} />
          )}
        </>
      ),
    },
    {
      title: '门户名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '门户类型',
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      render: (text) => <span>{PortalTypeList.find((e) => e.value === text)?.name}</span>,
    },
    {
      title: '适用范围',
      dataIndex: 'viewable',
      key: 'viewable',
      ellipsis: true,
      render: (text) => <span>{text && text.length > 0 ? text.join('、') : '全部'}</span>,
    },
    {
      title: '是否启用',
      dataIndex: 'useable',
      key: 'useable',
      render: (text) => <Tag color={text ? 'success' : 'error'}>{text ? '是' : '否'}</Tag>,
    },
    {
      title: '修改人',
      dataIndex: 'modifier',
      key: 'modifier',
      ellipsis: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
      ellipsis: true,
    },

    {
      title: '操作',
      key: 'operation',
      width: 280,
      render: (text, record) => (
        <>
          <Button type="link" icon={<EditFilled />} onClick={() => onEdit && onEdit(record)}>
            编辑
          </Button>

          <Button type="link" icon={<CopyFilled />} onClick={() => onCopy && onCopy(record)}>
            复制
          </Button>

          {!record.system && (
            <Popconfirm
              title="删除后不可恢复，是否继续？"
              okType="danger"
              onConfirm={() => onDelete && onDelete(record.id || '')}
            >
              <Button type="link" icon={<DeleteFilled />} danger>
                删除
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  // 查询
  const handleSearch = (value: string) => {
    return onSearch && onSearch({ name: value });
  };

  const handleMoveRow = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex === hoverIndex) {
      return;
    }

    let index = 0;

    const dragData = dataSource[dragIndex];
    const hoverData = dataSource[hoverIndex];
    const hoverDataIndex = hoverData.index || 10000;

    // 第一条
    if (hoverIndex === 0) {
      index = parseInt((hoverDataIndex / 2).toString(), 10);
    } else if (hoverIndex === dataSource.length - 1) {
      // 最后一条
      index = hoverDataIndex + 50000;
    } else {
      const hoverUpData = dataSource[hoverIndex - 1];
      const hoverUpDataIndex = hoverUpData.index || 10000;
      index = parseInt(((hoverUpDataIndex + hoverDataIndex) / 2).toString(), 10);
    }

    return onMove && onMove(dragData.id || '', index);
  };

  const handleExport = () => {
    let data: any[] = [...dataSource];
    if (selectedRowKeys.length > 0) {
      data = data.filter((e) => selectedRowKeys.includes(e.id));
    }

    exportExcel(
      excelHeader,
      data.map((e) => ({
        name: e.name,
        type: e.type,
        path: e.path,
        useable: e.useable ? '是' : '否',
        default: e.default ? '是' : '否',
        description: e.description,
        icon: e.icon && JSON.stringify(e.icon),
        component: e.component && JSON.stringify(e.component),
      })),
    );
  };

  const handleChange = (info: any) => {
    const { file } = info;

    if (file.status === 'done') {
      importExcel(file, (res: any[]) => {
        if (!res) {
          message.error('未获取到数据');
          return;
        }
        // 获取第一个页签的数据
        if (res[0].length === 0) {
          message.error('未获取到数据');
          return;
        }
        // 解析数据
        const excelData: any = formatExcelData(excelHeader, res[0]);
        if (!excelData) {
          message.error('文件模板不正确');
          return;
        }
        // 格式化数据
        let data;
        try {
          data = excelData.map((e: any) => ({
            name: e.name,
            type: e.type,
            path: e.path,
            useable: e.useable === '是',
            default: e.default === '是',
            description: e.description,
            icon: e.icon ? JSON.parse(e.icon) : null,
            component: e.component ? JSON.parse(e.component) : null,
          }));
        } catch (e) {
          message.error('数据解析错误');
          return;
        }

        if (data) {
          onAdds && onAdds(data);
        }
      });
    }
  };

  return (
    <>
      <Row style={{ marginBottom: '20px' }}>
        <Col span={18}>
          <Space>
            <Button icon={<PlusOutlined />} type="primary" onClick={onAdd}>
              新建
            </Button>
            <Tooltip title="未勾选数据，则默认全部导出">
              <Button
                icon={<ExportOutlined />}
                type="primary"
                ghost
                onClick={handleExport}
                disabled={dataSource.length === 0}
              >
                导出
              </Button>
            </Tooltip>

            <Upload name="file" accept=".xls,.xlsx" onChange={handleChange} showUploadList={false}>
              <Button type="primary" ghost icon={<ImportOutlined />}>
                导入
              </Button>
            </Upload>
          </Space>
        </Col>
        <Col span={6}>
          <Input.Search placeholder="请输入门户名称" onSearch={handleSearch} enterButton />
        </Col>
      </Row>

      <Table<PortalData>
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        components={{
          body: {
            row: DragableBodyRow,
          },
        }}
        onRow={(record, index) => ({
          index,
          onMove: handleMoveRow,
        })}
        id="portal-table-drag-sorting"
        className="portal-table"
      />
    </>
  );
};

export default PortalTable;
