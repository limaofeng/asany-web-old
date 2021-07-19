import { Button, Col, Input, Modal, Row, Select, message } from 'antd';
import { Form } from '@ant-design/compatible';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Mutation } from '@apollo/client/react/components';
import React from 'react';
import {
  creatDictionaryType as CREATDICTIONARYTYPE,
  deleteDictionaryType as DELETEDICTIONARYTYPE,
  updateDictionaryType as UPDATEDICTIONARYTYPE,
} from './gqls/dictionarys.gql';
import TreeSelectDataType from '../WisdomPartyBuilding/components/TreeSelectDataType';

// import style from '../Workshop/components/Tree.less';

const style = {};

const formInit = {
  mapPropsToFields: (props: any): any => {
    const fields = { parent: data => data.parent && data.parent.id };
    const data = props.data || {};
    Object.keys(data).forEach(key => {
      if (fields[key]) {
        fields[key] = fields[key](data);
      } else {
        fields[key] = data[key];
      }
      fields[key] = Form.createFormField({
        value: fields[key],
      });
    });
    // console.log(fields);
    return fields;
  },
};

interface DictionaryTypeSaveProps extends FormComponentProps {
  submit: () => void;
  onSave: () => void;
  isEdit: boolean;
}

@Form.create(formInit)
class DictionaryTypeSave extends React.Component<DictionaryTypeSaveProps & any> {
  public refetch?: any;

  public state = {
    visible: false,
    isEdit: false,
    updateId: 0,
  };

  private handleCancel = () => {
    this.setState({ visible: false });
  };

  handleSubmit = () => {
    const { form, isEdit } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      // console.log(values);
      // if(values && values.parent===null)values.parent=''

      console.log(values);
      values.layer = values.layer && parseInt(values.layer);
      await this.props.submit(values);
      Modal.success({
        title: isEdit ? '更新成功！' : '新增成功！',
      });
      this.handleCancel();
      await this.props.onSave();
    });
  };

  open = (data?: any) => {
    this.setState({ visible: true });
  };

  render() {
    const { form, isEdit } = this.props;
    const { getFieldDecorator } = form;
    return (
      <>
        <div onClick={this.open}>{this.props.children}</div>
        <Modal
          visible={this.state.visible}
          okText="提交"
          title={isEdit ? '更新数据字典类型' : '新增数据字典类型'}
          onCancel={this.handleCancel}
          footer={
            <>
              <Button onClick={this.handleCancel}>取消</Button>
              {/* 知识点 */}
              <Button type="primary" onClick={this.handleSubmit}>
                提交
              </Button>
            </>
          }
          width={600}
        >
          <Form className={style.login_form}>
            <div className={style.budgetInfo}>
              <div className={style.budgetInfoForm}>
                {/* <Row>
                  <Col span={12}>
                    <Form.Item label="编号" className={style.formItem}>
                      {getFieldDecorator('id', {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp(/^[^\u4e00-\u9fa5]+$/g),
                            message: '请输入编号！',
                          },
                        ],
                      })(<Input type="text" style={{ width: 200 }} disabled={isEdit} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="名称" className={style.formItem}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入名称！' }],
                      })(<Input type="text" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
               <Row>
                  <Col span={12}>
                    <Form.Item label="层级" className={style.formItem}>
                      {getFieldDecorator('layer', {
                        // rules: [{ required: true, message: '请输入层级！' }],
                      })(<Input type="text" style={{ width: 200 }} disabled={isEdit} />)}

                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="路径" className={style.formItem}>
                      {getFieldDecorator('path', {
                        // rules: [{ required: true, message: '请输入路径！' }],
                      })(<Input type="text" style={{ width: 200 }} />)}
                    </Form.Item>
                  </Col>
                </Row> */}
                <Row>
                  <Col span={5} />
                  <Col span={18}>
                    <Form.Item label="名称" className={style.formItem}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入名称！' }],
                      })(<Input type="text" style={{ width: 300 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={5} />
                  <Col span={18}>
                    <Form.Item label="描述" className={style.formItem}>
                      {getFieldDecorator('description', {
                        // rules: [{ required: true, message: '请输入描述！' }],
                      })(<Input type="text" style={{ width: 300 }} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={5} />
                  <Col span={18}>
                    <Form.Item label="请选择上级数据字典">
                      {/* {getFieldDecorator('parent', {})(<SuperiorDictionaryType style={{ width: 200 }} />)} */}
                      {getFieldDecorator(
                        'parent',
                        {}
                      )(<TreeSelectDataType style={{ width: 300 }} allowClear disabled={isEdit} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>
        </Modal>
      </>
    );
  }
}

export const DataDictionaryTypeNew = function(props) {
  return (
    <Mutation mutation={CREATDICTIONARYTYPE}>
      {(saveDictionaryType: any) => (
        // tslint:disable-next-line: jsx-no-lambda
        <DictionaryTypeSave
          submit={variables => saveDictionaryType({ variables: { dataDictionaryType: variables } })}
          {...props}
        >
          {props.children}
        </DictionaryTypeSave>
      )}
    </Mutation>
  );
};

export const DataDictionaryTypeEdit = function(props) {
  return (
    <Mutation mutation={UPDATEDICTIONARYTYPE}>
      {(saveDictionaryType: any) => (
        // tslint:disable-next-line: jsx-no-lambda
        <DictionaryTypeSave
          submit={variables => saveDictionaryType({ variables: { id: props.data.id, dataDictionaryType: variables } })}
          {...props}
          isEdit
        >
          {props.children}
        </DictionaryTypeSave>
      )}
    </Mutation>
  );
};

const showConfirm = (remove, value, onDelete) => () => {
  console.log(value);
  Modal.confirm({
    title: '删除',
    okText: '确认',
    visible: true,
    cancelText: '取消',
    onOk: async (): Promise<void> => {
      await remove({ variables: { id: value.id } });
      message.success('删除成功！');
      await onDelete();
    },
  });
};

export const DeleteDictionaryType = function(props) {
  return (
    <Mutation mutation={DELETEDICTIONARYTYPE}>
      {(delDictionaryType): any => (
        <div onClick={showConfirm(delDictionaryType, props.data, props.onDelete)}>{props.children}</div>
      )}
    </Mutation>
  );
};
