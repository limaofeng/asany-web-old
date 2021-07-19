import React, { useState } from "react";
import { Row, Button, Table, Col, Card,Tooltip,Modal, Space,Form,Input,Radio,message} from 'antd';
import {
    thirdPartyDataSources as THIRDPARTYDATA,deleteThirdPartyDataSource as DELETETHIRD,updateThirdPartyDataSource as UPDATETHIRD,createThirdPartyDataSource as CREATETHIRD
} from '../gqls/Thirdparty.gql';
import { useQuery, useMutation } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@asany/components';
import { history } from 'umi';
const Thirs = () => {

    // //删除方法
    const [deleteThirdPartyData] = useMutation(DELETETHIRD);
    const [updateThirdPartyData] = useMutation(UPDATETHIRD);
    const [createThirdPartyData] = useMutation(CREATETHIRD);
    const [visible,setVisible] = useState(false);
    const [mode,setMode] = useState("add");
    const [form] = Form.useForm();

    const showModal = () => {
        setVisible(true)
    };

    const handleOk  = async (value: any) => {
        if(mode === "add"){
            form.validateFields().then(async values => {
                const {id,...restValues} = values;
                try {
                    await createThirdPartyData({
                        variables: {
                            input: restValues
                        }
                    });
                    message.success('创建成功');
                    refetch();
                    setVisible(false)
                } catch (err) {
                    message.warn(err.message);
                }
            })
        }else{
            form.validateFields().then(async values => {
                const formId = values.id; 
                const {id,...restValues} = values;
                try {
                    await updateThirdPartyData({
                        variables: {
                            id:formId,
                            input: restValues
                        }
                    });
                    
                    message.success('修改成功');
                    refetch();
                    setVisible(false)
                } catch (err) {
                    message.warn(err.message);
                }

            })
        }

    }

    const handleCancel = (e:any) => {
        setVisible(false)
    };

    //第三方数据源
    const { data: thirdpartyData, loading, refetch } = useQuery(THIRDPARTYDATA, {
        variables: {
            "filter": {}
        },
        fetchPolicy: 'no-cache'
    })
    const { thirdPartyDataSources =  []  } = thirdpartyData || [];

    const updateThird = (value: any) => (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setMode("update");
        console.log("updateValue",value)
        form.setFieldsValue(value);
        showModal();
    }
    const addThird = () => {
        form.resetFields()
        setMode("add");
        showModal()

    }

    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
      };

    //删除
    const deleteThirdParty = (value: any) => (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        Modal.confirm({
            title: '删除',
            content: '确定删除此条数据吗？此操作不可逆转！',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteThirdPartyData({
                        variables: {
                            id: value.id,
                        }
                    });
                    message.success('删除成功');
                    refetch();
                } catch (err) {
                    message.warn(err.message);
                }
            },
            onCancel() {
                console.log("点击了取消")
            }
        }
        )
    }

    //table表格列的配置描述
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '类型',
            dataIndex: 'mobileType',
            key: 'mobileType',
        },
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '企业标识',
            dataIndex: 'corpId',
            key: 'corpId',
        },
        {
            title: '操作',
            key: 'action',
            render: (record: any) => (
                <Space className="is-flex">
                    <Tooltip title="修改">
                        <a className="btn-radius-color background-blue" onClick={updateThird(record)}>
                            <a className="operation-icon" />
                        </a>
                    </Tooltip> 
                
                    <Tooltip title="删除">
                        <a className="btn-radius-color background-red">
                            <a className="operation-icon" onClick={deleteThirdParty(record)} />
                        </a>
                    </Tooltip>
                </Space>
            )
        },
    ];
    return (
        <PageContainer title="列表定义">
            <Modal forceRender title="新增/修改" visible={visible} onOk={handleOk} onCancel={handleCancel} width={820}>
                <Form  {...formItemLayout} form={form} >
                <Form.Item label="id" name="id" hidden>
                    <Input/>
                 </Form.Item>
                 <Form.Item label="名字" name="name" rules={[{ required: true, message: '请输入名称' }]}>
                    <Input/>
                  </Form.Item>
                <Form.Item label="类型" name="mobileType" rules={[{ required: true, message: '请输入类型' }]}>
                    <Radio.Group>
                    <Radio value="dingtalk">钉钉</Radio>
                        <Radio value="WeChatCP">微信</Radio>
                        <Radio value="AnonymousLetter">飞书</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="企业CorpID" name="corpId" >
                    <Input />
                  </Form.Item>
                  <Form.Item label="应用key" name="appkey" >
                    <Input />
                  </Form.Item>
                  <Form.Item label="应用密钥" name="appSecret" >
                    <Input />
                  </Form.Item>
                  <Form.Item label="应用ID" name="agentId" >
                    <Input />
                  </Form.Item>
                  <Form.Item label="钉钉扫码登录" name="snsKey" >
                    <Input />
                  </Form.Item>
                  <Form.Item label="钉钉扫码登录密钥" name="snsSecret" >
                    <Input />
                  </Form.Item>
                  <Form.Item label="调用接口路径" name="baseApiUrl" >
                    <Input />
                  </Form.Item>
                  <Form.Item label="同步步骤" name="syncStep" >
                    <Radio.Group>
                            <Radio value="config">同步配置</Radio>
                            <Radio value="org">同步组织</Radio>
                            <Radio value="employee">同步人员</Radio>
                            <Radio value="app">同步应用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
            </Modal>
            <Card>
                <Row style={{ margin: 10 }}>
                    <Col span={24}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={addThird}>新增</Button>
                    </Col>
                </Row>
                <Row>
                    <Table
                        style={{ width: "100%" }}
                        columns={columns}
                        dataSource={thirdPartyDataSources}
                        loading={loading}
                        rowKey={(record: any) => record.id + 'already-flow'}
                        pagination={false}
                    />
                </Row>
            </Card>
        </PageContainer>
    )
}

export default React.memo(Thirs);
