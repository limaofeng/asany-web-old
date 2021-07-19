
import React, { useState } from 'react'
import { createFromIconfontCN } from '@ant-design/icons';
import { Tabs } from 'antd';
import styles from '../index.less';
import ParametsTable from './ParametsTable';
import { Form, Divider, Button, Row, Col, Modal, Input, Select, message } from 'antd';
import { useQuery, useMutation } from '@apollo/client';
import { typeDefinitions as GET_GENREDATA, updateGraphQLFieldDefinition as POST_UPDATE_PROPERTY } from './../gqls/api.gql';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

interface ApiItemProps {
    interfaceInfo: any;
    getNameInfo?: any;
    getTypeInfo?: any;
    fieldDefinition: any;
    typeDefinition: any;
    meunCrumb: any;
    repeated: any;
    updataStatus: (value: any) => void;
    refetch: any;
    saveTypeDefiniton?: any;
}
function ApiItem(props: ApiItemProps) {
    const [state, setState] = useState({
        parameter: false,
        edit: false,
        recordData: {},
        hint: false,
    })

    const localityState = (value: any) => {
        setState({
            ...state,
            ...value,
        });
    };
    const [form] = Form.useForm();
    const [formS] = Form.useForm();
    const { data } = useQuery(GET_GENREDATA);
    const [editProperty] = useMutation(POST_UPDATE_PROPERTY);
    const { typeDefinitions = [] } = data || {};

    const {
        interfaceInfo,
        getNameInfo,
        getTypeInfo,
        fieldDefinition,
        typeDefinition,
        meunCrumb,
        updataStatus,
        repeated,
        refetch,
        saveTypeDefiniton
    } = props;


    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    };

    const tailLayout = {
        wrapperCol: { offset: 22, span: 2 },
    };


    const basicType = ['ID', 'String', 'Number', 'Boolean', 'Null', 'Undefind', 'FileObject', 'Data', 'Long', 'Int'];
    const typeData: any = {
        title: '类型',
        dataIndex: 'type.kind.name',
        key: 'type.kind.name',
        render: (text: any, record: any) => {
            if (!basicType.includes(record.type.kind.id)) {
                return <div style={{ color: '#FBA834' }} onClick={handleTypeJump(record)}>{text}</div>
            } else {
                return <>{text}</>
            }
        }
    }
    const paramsColumns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => {
                if (!basicType.includes(record.type.kind.name)) {
                    return <div style={{ color: '#2573CB' }} onClick={handleTypeJump(record, 'name')}>{record.type.repeated ? `[${text}]` : text}</div>
                } else {
                    return <>{text}</>
                }
            }
        },
        { ...typeData },
        {
            title: '是否必填',
            dataIndex: 'type.required',
            key: 'type.required',
            render: (text: any, record: any) => (
                text ? "必填" : '选填'
            )
        },
        {
            title: '默认值',
            dataIndex: 'defaultValue',
            key: 'defaultValue',
        },
        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (record: any) => (
                <div>
                    <span style={{ display: "inline-block" }} onClick={handleMaterial(record)}>修改</span>
                    <Divider type="vertical" />
                    <span style={{ display: "inline-block" }} onClick={deleteModule(record)}>删除</span>
                </div>
            )
        },
    ];
    const returnValueColumns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => {
                if (!basicType.includes(record.type.kind.id)) {
                    return <div style={{ color: '#2573CB' }} onClick={handleNameJump(record)}>{record.type.repeated ? `[${text}]` : text}</div>
                } else {
                    return <>{text}</>
                }
            }
        },
        { ...typeData },
        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
        },
    ]
    const handleGetNameInfo = (value: any) => {
        getNameInfo({ id: value.id })
        getTypeInfo({ id: '' })
    }
    const handleGetTypeInfo = (value: any) => {
        getTypeInfo({ id: value.id })
        getNameInfo({ id: '' })
    }
    const handleNameJump = (value: any) => (e: any) => {
        if (value.type.repeated) {
            if (value.arguments.length || value.type.kind.fileds.length) {
                saveNameData(value)
            }
        } else {
            saveNameData(value)
        }
    }
    const saveNameData = (value: any) => {
        updataStatus({ repeated: value.type.repeated })
        handleGetNameInfo(value)
        meunCrumb.push({ id: value.id, key: value.id, name: value.name, repeated: value.type.repeated, refetch: handleGetNameInfo })
    }
    const saveData = (value: any, type?: string) => {
        updataStatus({ repeated: type ? value.type.repeated : null })
        handleGetTypeInfo({ id: value.type.kind.id })
        meunCrumb.push({
            key: value.type.kind.id,
            id: value.type.kind.id,
            type: type,
            repeated: type ? value.type.repeated : null,
            name: type ? value.name : value.type.kind.name,
            refetch: handleGetTypeInfo
        })
    }
    const handleTypeJump = (value: any, type?: string) => (e: any) => {
        // console.log('dianji')
        saveTypeDefiniton()
        if (type) {
            if (!value.type.kind.repeated || (value.type.kind.repeated && value.type.kind.fileds.length)) {
                saveData(value, type)
            }
        } else {
            saveData(value)
        }
    }
    const discription = (fieldDefinition && repeated == false) ? fieldDefinition : typeDefinition ? typeDefinition : interfaceInfo;
    const attribute = discription.graphql && discription.graphql.interface
    const paramsData = fieldDefinition ? fieldDefinition.arguments : (typeDefinition && repeated !== null) ? typeDefinition.fileds : interfaceInfo.graphql.interface.arguments;
    const returnValueData = fieldDefinition ? fieldDefinition.type.kind.fileds : interfaceInfo.graphql.interface.type.kind.fileds;

    const parameterShow = () => {
        localityState({ parameter: true });
    }

    const hideModal = () => {
        localityState({ parameter: false });
        form.resetFields();
    }

    const argumentsSubmit = async () => {
        const values = await form.validateFields();
        const argumentsObj = attribute.arguments.map(({ __typename, ...item }: any) => {
            delete item.__typename
            item.type = {
                repeated: item.type.repeated,
                required: item.type.required,
                kind: item.type.kind.id
            };
            return item;
        })
        const argumentsNative = {
            id: values.idArguments,
            name: values.nameArguments,
            description: values.descriptionArguments,
            defaultValue: values.defaultValueArguments,
            type: {
                repeated: values.repeatedArguments === "是" ? true : false,
                required: values.requiredArguments === "是" ? true : false,
                kind: values.kindArguments
            }
        };

        delete values.idArguments;
        delete values.descriptionArguments;
        delete values.defaultValueArguments;

        argumentsObj.push(argumentsNative);
        values.arguments = argumentsObj;
        // Object.keys(values).forEach((item:any)=>{
        //     let exectAry = ["idArguments","nameArguments","descriptionArguments", "defaultValueArguments","repeatedArguments","kindArguments"]
        //     if(exectAry.includes(item)){
        //         delete values[item]
        //     }
        // })

        if (values.idrguments) {
            delete values.idArguments
        }
        if (values.nameArguments) {
            delete values.nameArguments
        }
        if (values.descriptionArguments) {
            delete values.descriptionArguments
        }
        if (values.defaultValueArguments) {
            delete values.defaultValueArguments
        }
        if (values.repeatedArguments) {
            delete values.repeatedArguments
        }
        if (values.requiredArguments) {
            delete values.requiredArguments;
        }
        if (values.kindArguments) {
            delete values.kindArguments;
        }
        // console.log('--------attribute', attribute);
        if (attribute != undefined &&  attribute.title) {
            values.title = attribute.title;
        }
        if (attribute != undefined && attribute.tags) {
            values.tags = attribute.tags;
        }
        if (attribute != undefined && attribute.description) {
            values.description = attribute.description;
        }
        if (attribute != undefined && attribute.defaultValue) {
            values.defaultValue = attribute.defaultValue;
        }
        if (attribute != undefined && attribute.delegate && attribute.delegate.id) {
            values.delegate = [attribute.delegate.id];
        }
        if (attribute != undefined && attribute.deprecated) {
            values.deprecated = attribute.deprecated;
        }
        values.type = {
            repeated: attribute.type.repeated,
            required: attribute.type.required,
            kind: attribute.type.kind && attribute.type.kind.id
        };

        if (edit) {
            const resEdit = await editProperty({
                variables: {
                    id: attribute.id,
                    input: values,
                }
            }).catch(error => {
                message.error("修改失败！", error);
            });
            if (resEdit.data.updateGraphQLFieldDefinition && resEdit.data.updateGraphQLFieldDefinition.id) {
                localityState({ parameter: false });
                form.resetFields();
                await refetch()
                message.success('修改成功', 3);
            } else {
                message.error("修改失败！");
            }
        } else {
            const resEdit = await editProperty({
                variables: {
                    id: attribute.id,
                    input: values,
                }
            }).catch(error => {
                message.error("新增失败！", error);
            });

            if (resEdit.data.updateGraphQLFieldDefinition && resEdit.data.updateGraphQLFieldDefinition.id) {
                localityState({ parameter: false });
                form.resetFields();
                await refetch()
                message.success('新增成功', 3);
            } else {
                message.error("新增失败！");
            }
        }
    };

    //删除
    const deleteModule = (value: any) => (e: any) => {
        const argumentsObj = attribute.arguments;
        argumentsObj.map((item: any) => {
            delete item.__typename
            return (
                item.type = {
                    repeated: item.type.repeated,
                    required: item.type.required,
                    kind: item.type.kind.id
                }
            )
        })
        const pitch = [value.id];
        const newestData = argumentsObj.filter(function (item: any) {
            return pitch.indexOf(item.id) < 0;
        })

        form.validateFields()
            .then(values => {
                values.arguments = newestData;
                if (values.idrguments) {
                    delete values.idArguments
                }
                if (values.nameArguments) {
                    delete values.nameArguments
                }
                if (values.descriptionArguments) {
                    delete values.descriptionArguments
                }
                if (values.defaultValueArguments) {
                    delete values.defaultValueArguments
                }
                if (values.repeatedArguments) {
                    delete values.repeatedArguments
                }
                if (values.requiredArguments) {
                    delete values.requiredArguments;
                }
                if (values.kindArguments) {
                    delete values.kindArguments;
                }
                if (attribute.title) {
                    values.title = attribute.title;
                }
                if (attribute.tags) {
                    values.tags = attribute.tags;
                }
                if (attribute.description) {
                    values.description = attribute.description;
                }
                if (attribute.defaultValue) {
                    values.defaultValue = attribute.defaultValue;
                }
                if (attribute.delegate && attribute.delegate.id) {
                    values.delegate = [attribute.delegate.id];
                }
                if (attribute.deprecated) {
                    values.deprecated = attribute.deprecated;
                }
                values.type = {
                    repeated: attribute.type.repeated,
                    required: attribute.type.required,
                    kind: attribute.type.kind && attribute.type.kind.id
                };

                confirm({
                    title: '参数管理',
                    content: '确定要删除此参数吗',
                    okText: "确定",
                    okType: "danger",
                    cancelText: "取消",
                    async onOk() {
                        const resEdit = await editProperty({
                            variables: {
                                id: attribute.id,
                                input: values,
                            }
                        }).catch(error => {
                            message.error("删除失败！", error);
                        });
                        if (resEdit.data.updateGraphQLFieldDefinition && resEdit.data.updateGraphQLFieldDefinition.id) {
                            localityState({ parameter: false });
                            form.resetFields();
                            await refetch()
                            message.success('删除成功', 3);
                        } else {
                            message.error("删除失败！");
                        }
                    },
                    onCancel() {
                    }
                });
            });
    }

    //修改
    const handleMaterial = (value: any) => (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        localityState({ parameter: true, edit: true, recordData: value })
    }

    const hintShow = () => {
        localityState({ hint: true });
    }

    const hintModal = () => {
        localityState({ hint: false });
    }

    const genreSubmit = async () => {
        const values = await formS.validateFields();
        values.type = {
            repeated: values.repeated === "是" ? true : false,
            required: values.required === "是" ? true : false,
            kind: values.kind
        };

        delete values.repeated
        delete values.required
        delete values.kind

        const resEdit = await editProperty({
            variables: {
                id: attribute.id,
                input: values,
            }
        }).catch(error => {
            message.error("修改失败！", error);
        });
        if (resEdit.data.updateGraphQLFieldDefinition && resEdit.data.updateGraphQLFieldDefinition.id) {
            localityState({ hint: false });
            form.resetFields();
            await refetch()
            message.success('修改成功', 3);
        } else {
            message.error("修改失败！");
        }
    }

    const { parameter, edit, recordData, hint } = state;

    return (
        <div>
            {
                (!fieldDefinition || (fieldDefinition && repeated == false)) && (!typeDefinition || (typeDefinition && repeated === false)) || repeated == null ?
                    <>
                        <span className={styles.title}>{attribute && attribute.title}</span>
                        <span className={styles.updateTime}>{attribute && attribute.id}</span>
                        <span className={styles.title}>模块概述:</span>
                        <span className={styles.discription}>{attribute && attribute.description}</span>

                    </> : ''
            }
            {
                !typeDefinition && !fieldDefinition &&
                <>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="graphql" key="1">
                        </TabPane>
                    </Tabs>
                    <span className={styles.title}>请求方式: {interfaceInfo.graphql.method}</span>
                </>
            }
            {
                (!typeDefinition || (typeDefinition && repeated !== null)) &&
                <>
                    {
                        paramsData.length ? <>

                            <Row>
                                <Col span={22}><span className={styles.title}>请求参数:</span></Col>

                                <Col span={2}>
                                    <Button type="primary" onClick={parameterShow}>新增</Button>
                                </Col>
                            </Row>

                            <ParametsTable columns={paramsColumns} dataSource={paramsData} />
                        </> : ''
                    }
                    {
                        returnValueData.length && !typeDefinition ?
                            <>
                                <Row>
                                    <Col span={22}>
                                        <span className={styles.title}>{`${!typeDefinition && !fieldDefinition ? "返回值" : ''}类型(${!fieldDefinition ? interfaceInfo.graphql.interface.type.kind.id : fieldDefinition.name})`}: </span>
                                    </Col>

                                    <Col span={2}>
                                        <Button type="primary" onClick={hintShow}>修改</Button>
                                    </Col>
                                </Row>
                                <ParametsTable columns={returnValueColumns} dataSource={returnValueData} />
                            </> : ''
                    }
                </>
            }

            <Modal
                destroyOnClose={true}
                width="800px"
                title={edit ? "修改参数" : "新增参数"}
                visible={parameter}
                onCancel={hideModal}
                footer={null}
            >
                <Form
                    {...layout}
                    form={form}
                >
                    <FormItem
                        label="参数id"
                        name="idArguments"
                        rules={[{ required: true, message: '参数id必填' }]}
                        initialValue={edit ? recordData.id : ""}
                    >
                        <Input placeholder="例如: Query.users.page" />
                    </FormItem>

                    <FormItem
                        label="参数名称"
                        name="nameArguments"
                        rules={[{ required: true, message: '参数名称必填' }]}
                        initialValue={edit ? recordData.name : ""}
                    >
                        <Input placeholder="例如: page" />
                    </FormItem>

                    <FormItem
                        label="参数描述"
                        name="descriptionArguments"
                        initialValue={edit ? recordData.description : ""}
                    >
                        <Input />
                    </FormItem>

                    <FormItem
                        label="参数默认值"
                        name="defaultValueArguments"
                        initialValue={edit ? recordData.defaultValue : ""}
                    >
                        <Input />
                    </FormItem>

                    <Row>
                        <Col span={24}>参数返回类型</Col>
                    </Row>

                    <FormItem
                        label="是否为数组"
                        name="repeatedArguments"
                        rules={[{ required: true, message: '是否为数组必选' }]}
                        initialValue={edit ? recordData.type && recordData.type.repeated === false ? "否" : recordData.type && recordData.type.repeated === true ? "是" : "" : ""}

                    >
                        <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} placeholder="是否为数组">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>
                    </FormItem>

                    <FormItem
                        label="是否必填"
                        name="requiredArguments"
                        rules={[{ required: true, message: '是否必填必选' }]}
                        initialValue={edit ? recordData.type && recordData.type.required === false ? "否" : recordData.type && recordData.type.required === true ? "是" : "" : ""}
                    >
                        <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} placeholder="是否必填">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>
                    </FormItem>

                    <FormItem
                        label="参数类型"
                        name="kindArguments"
                        rules={[{ required: true, message: '参数类型必选' }]}
                        initialValue={edit ? recordData.type && recordData.type.kind && recordData.type.kind.id : ""}
                    >
                        <Select style={{ width: "564px" }}
                            allowClear={true}
                            showSearch={true}
                            getPopupContainer={triggerNode => triggerNode.parentElement}
                        >
                            {
                                typeDefinitions.map(v => {
                                    return <Option value={v.name} key={v.name}>{v.name}</Option>
                                })
                            }
                        </Select>
                    </FormItem>

                    <FormItem {...tailLayout}>
                        <Button type="primary" htmlType="submit" onClick={argumentsSubmit}>
                            确认
                        </Button>
                    </FormItem>
                </Form>
            </Modal>

            <Modal
                destroyOnClose={true}
                width="800px"
                title="修改返回型"
                visible={hint}
                onCancel={hintModal}
                footer={null}
            >
                <Form
                    {...layout}
                    form={formS}
                >
                    <FormItem
                        label="中文名"
                        name="title"
                        rules={[{ required: true, message: '中文名必填' }]}
                        initialValue={attribute.title}
                    >
                        <Input placeholder="例如: Query.users.page" />
                    </FormItem>

                    <FormItem
                        label="模块概述"
                        name="description"
                        rules={[{ required: true, message: '模块概述必填' }]}
                        initialValue={attribute && attribute.description}
                    >
                        <Input placeholder="例如: page" />
                    </FormItem>

                    <FormItem
                        label="是否为数组"
                        name="repeated"
                        rules={[{ required: true, message: '是否为数组必选' }]}
                        initialValue={attribute != undefined ?  (attribute.type && attribute.type.repeated === false ? "否" : attribute.type && attribute.type.repeated === true ? "是" : "") : ""}

                    >
                        <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} placeholder="是否为数组">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>
                    </FormItem>

                    <FormItem
                        label="是否必填"
                        name="required"
                        rules={[{ required: true, message: '是否必填必选' }]}
                        initialValue={attribute != undefined ?  (attribute.type && attribute.type.required === false ? "否" : attribute.type && attribute.type.required === true ? "是" : "") : ""}
                    >
                        <Select style={{ width: 564 }} getPopupContainer={triggerNode => triggerNode.parentElement} placeholder="是否必填">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>
                    </FormItem>

                    <FormItem
                        label="参数类型"
                        name="kind"
                        rules={[{ required: true, message: '参数类型必选' }]}
                        initialValue={attribute != undefined ?  ( attribute.type && attribute.type.kind && attribute.type.kind.id) : ""}
                    >
                        <Select style={{ width: "564px" }}
                            allowClear={true}
                            showSearch={true}
                            getPopupContainer={triggerNode => triggerNode.parentElement}
                        >
                            {
                                typeDefinitions.map(v => {
                                    return <Option value={v.name} key={v.name}>{v.name}</Option>
                                })
                            }
                        </Select>
                    </FormItem>

                    <FormItem {...tailLayout}>
                        <Button type="primary" htmlType="submit" onClick={genreSubmit}>
                            确认
                        </Button>
                    </FormItem>
                </Form>
            </Modal>

        </div>
    );
}

export default ApiItem;
