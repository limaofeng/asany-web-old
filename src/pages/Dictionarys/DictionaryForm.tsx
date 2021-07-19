import * as React from 'react';

import { Col, Input, Modal, Row, Spin, message } from 'antd';
import { Form } from '@ant-design/compatible';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Mutation } from '@apollo/client/react/components';
import {
  creatDataDictionary as CREATDATADICTIONARY,
  updateDataDictionary as UPDATEDATADICTIONARY,
} from './gqls/dictionarys.gql';
import style from './dictionarys.less';
import { generateFormFields } from '../WisdomPartyBuilding/utils/utils';
import TreeSelectData from '../WisdomPartyBuilding/components/TreeSelectData';
import TreeSelectDataType from '../WisdomPartyBuilding/components/TreeSelectDataType';

interface DictionaryFormProps extends FormComponentProps {
  data?: any;
  submit: (input: any) => any;
  onSuccess: (value: any) => void;
}

class DictionaryForm extends React.Component<DictionaryFormProps, any> {
  handleSave = () => {
    const { submit, onSuccess } = this.props;
    const { validateFields } = this.props.form;
    validateFields(async (error, values) => {
      if (error) {
        return;
      }
      const input = values;
      const {
        data: { route },
      } = await submit(input);
      message.success('保存成功');
      onSuccess(route);
      this.setState({
        visible: false,
      });
    });
  };

  render() {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={style.login_form}>
        <div className={style.budgetInfoForm}>
          <Row>
            <Col span={12}>
              <Form.Item label="编号" className={style.formItem}>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/^[^\u4e00-\u9fa5]+$/g),
                      message: '请输入正确的编号！',
                    },
                  ],
                })(<Input type="text" style={{ width: 200 }} disabled={!!data.id} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="类型" className={style.formItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请输入类型！' }],
                })(<TreeSelectDataType disabled={!!data.id} style={{ width: 200 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="名称" className={style.formItem}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入名称！' }],
                })(<Input type="text" style={{ width: 200 }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="描述" className={style.formItem}>
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: '请输入描述！' }],
                })(<Input type="text" style={{ width: 200 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="请选择上级数据字典">
                {getFieldDecorator('parent', {})(<TreeSelectData allowClear />)}
              </Form.Item>
            </Col>
          </Row>
          {/**
            <Form.Item>
              <Button onClick={this.handleClose}>取消</Button>
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={this.handleSave}>
                保存
              </Button>
            </Form.Item>
             */}
        </div>
      </Form>
    );
  }
}

const formOptions = {
  mapPropsToFields: (props: any): any => {
    const data = props.data || {};
    return generateFormFields(data, {});
  },
};

const DictionaryFormCreate = Form.create(formOptions)((props: any) => {
  const submit = createRoute => input =>
    createRoute({
      variables: {
        input,
      },
    });
  return (
    <Mutation mutation={CREATDATADICTIONARY}>
      {(createRoute, { loading }): any => (
        <Spin spinning={loading}>
          <DictionaryForm ref={props.dictionaryFormRef} {...props} submit={submit(createRoute)} />
        </Spin>
      )}
    </Mutation>
  );
});

const DictionaryFormUpdate = Form.create(formOptions)((props: any) => {
  const submit = updateRoute => input =>
    updateRoute({
      variables: {
        id: props.data.id,
        input,
      },
    });
  return (
    <Mutation mutation={UPDATEDATADICTIONARY}>
      {(updateRoute, { loading }): any => (
        <Spin spinning={loading}>
          <DictionaryForm ref={props.dictionaryFormRef} {...props} submit={submit(updateRoute)} />
        </Spin>
      )}
    </Mutation>
  );
});

interface DictionaryFormModalProps {
  onSuccess: () => void;
  data?: any;
}

class DictionaryFormModal extends React.Component<DictionaryFormModalProps, any> {
  public state = {
    visible: false,
    data: undefined,
  };

  dictionaryForm = React.createRef<DictionaryForm>();

  private close = () => {
    this.setState({ visible: false });
  };

  public open = (data?: any) => {
    this.setState({
      data,
      visible: true,
    });
  };

  handleSaveSuccess = () => {
    this.props.onSuccess();
  };

  handleSubmit = () => {
    this.dictionaryForm.current!.handleSave();
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, data = {} } = this.state;
    console.log(data);
    if (data.type && data.type) data.type = data.type.id;
    return (
      <Modal
        visible={visible}
        okText="提交"
        title={data.id ? '更新数据字典' : '新增数据字典'}
        onCancel={this.close}
        onOk={this.handleSubmit}
      >
        {data.id ? (
          <DictionaryFormUpdate
            dictionaryFormRef={this.dictionaryForm}
            data={data}
            onSuccess={this.handleSaveSuccess}
          />
        ) : (
          <DictionaryFormCreate
            dictionaryFormRef={this.dictionaryForm}
            data={data}
            onSuccess={this.handleSaveSuccess}
          />
        )}
      </Modal>
    );
  }
}

interface DictionaryFormModalWrapperProps {
  onSuccess: () => void;
  data?: any;
}

export class DictionaryFormModalWrapper extends React.Component<DictionaryFormModalWrapperProps, any> {
  dictionaryFormModal = React.createRef<DictionaryFormModal>();

  handleOpen = () => {
    const { data = {} } = this.props;
    const dataid = data;
    const obj = {
      ...data,
      // type: data.type && data.type.id, //数据字典返回一个类型id
      parent: data.parent && data.parent.id,
    };
    this.dictionaryFormModal.current!.open(obj);
  };

  render() {
    const { children, ...props } = this.props;
    return (
      <>
        <a onClick={this.handleOpen}>{children}</a>
        <DictionaryFormModal {...props} ref={this.dictionaryFormModal} />
      </>
    );
  }
}
export default DictionaryFormModal;
