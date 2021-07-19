// eslint-disable-next-line max-classes-per-file
import {Button, Col, Divider, Input, message, Row, Spin} from 'antd';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {  MutationResult } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import {  Mutation } from '@apollo/client/react/components';
import {generateFormFields} from '../../utils/utils';
import {createDataSource as CREATEFORM, updateDataSource as UPDATEDATA} from '../../gqls/ApplicationGql.gql';
import {Form} from '@ant-design/compatible'

const { TextArea } = Input;

interface DataSourceFormProps {
  submit: (value: any) => Promise<void>;
  type: 'dingtalk' | 'ezoffice';

  [key: string]: any;
}

class DataSourceForm extends React.Component<DataSourceFormProps> {
  handleSubmit = (e: any) => {
    e.preventDefault();
    const { submit, form } = this.props;
    // eslint-disable-next-line consistent-return
    form.validateFieldsAndScroll(async (err: any, values: any) => {
      if (err) {
        return console.log(err);
      }
      await submit({
        ...values,
        type: this.props.type,
      });
      message.success('保存成功');
    });
  };

  getConfigParams = () => {
    switch (this.props.type) {
      case 'dingtalk':
        return [
          {
            name: 'configuration.agentId',
            label: 'agentId',
          },
          {
            name: 'configuration.corpId',
            label: 'corpId',
          },
          {
            name: 'configuration.appKey',
            label: 'appKey',
          },
          {
            name: 'configuration.appSecret',
            label: 'appSecret',
          },
        ];
      case 'ezoffice':
        return [
          {
            name: 'configuration.host',
            label: 'host',
          },
          {
            name: 'configuration.key',
            label: 'key',
          },
          {
            name: 'configuration.serviceKey',
            label: 'serviceKey',
          },
          {
            name: 'configuration.fixedStr',
            label: 'fixedStr',
          },
        ];
      default:
        return [];
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        // @ts-ignore
        onSubmit={this.handleSubmit}
      >
        <Row gutter={24}>
          <Col style={{ display: 'inline-block' }}>
            <h5>{this.props.title}</h5>
          </Col>
          <Col style={{ display: 'inline-block' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Divider/>
        <Row>
          <Form.Item label="配置名称" style={{ display: 'inline-flex' }}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '名称' }],
            })(<Input style={{ width: 200 }}/>)}
          </Form.Item>
        </Row>
        {this.getConfigParams().map((item) => (
          <Row key={item.name}>
            <Form.Item label={item.label} style={{ display: 'inline-flex' }}>
              {getFieldDecorator(item.name, {})(<Input style={{ width: 200 }}/>)}
            </Form.Item>
          </Row>
        ))}
        <Row>
          <Form.Item label="说明" style={{ display: 'inline-flex' }}>
            {getFieldDecorator(
              'description',
              {}
            )(
              <TextArea
                placeholder="请输入说明"
                // @ts-ignore
                autosize={{ minRows: 2, maxRows: 10 }}
              />
            )}
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

const formSettings = {
  mapPropsToFields: (props: any): any => {
    const { data, type } = props;
    let params;
    if (type === 'dingtalk') {
      params = {
        'configuration.agentId': ({ configuration = {} }: any) => configuration.agentId,
        'configuration.corpId': ({ configuration = {} }: any) => configuration.corpId,
        'configuration.appKey': ({ configuration = {} }: any) => configuration.appKey,
        'configuration.appSecret': ({ configuration = {} }: any) => configuration.appSecret,
      };
    } else if (type === 'ezoffice') {
      params = {
        'configuration.host': ({ configuration = {} }: any) => configuration.host,
        'configuration.key': ({ configuration = {} }: any) => configuration.key,
        'configuration.serviceKey': ({ configuration = {} }: any) => configuration.serviceKey,
        'configuration.fixedStr': ({ configuration = {} }: any) => configuration.fixedStr,
      };
    }
    return generateFormFields(data, params);
  },
};

// @ts-ignore
const DataSourceFormCreate = Form.create(formSettings)((props: any) => {
  const submit = (create: any) => async (input: any) => {
    const { data } = await create({
      variables: {
        input,
      },
    });
    props.onSave(data.dataSource);
  };

  return (
    <Mutation mutation={CREATEFORM}>
      {(create: any, { loading }: MutationResult): any => (
        <Spin spinning={loading}>
          <DataSourceForm {...props} submit={submit(create)}/>
        </Spin>
      )}
    </Mutation>
  );
});

// @ts-ignore
const DataSourceFormUpdate = Form.create(formSettings)((props: any) => {
  const submit = (update: any) => async (input: any) => {
    const { data } = await update({
      variables: {
        id: props.data.id,
        input,
      },
    });
    props.onSave(data.dataSource);
  };

  return (
    <Mutation mutation={UPDATEDATA}>
      {(update: any, { loading }: MutationResult): any => (
        <Spin spinning={loading}>
          <DataSourceForm {...props} submit={submit(update)}/>
        </Spin>
      )}
    </Mutation>
  );
});

export interface DataSourceProps {
  title: string;
  type: 'dingtalk' | 'ezoffice';
  location: any;
}

export default class ThirdPartyManage extends React.Component<DataSourceProps, any> {
  save: any;

  constructor(props: any) {
    super(props);
    const { data, refresh } = props.location!.state;
    const { dingtalk, ezoffice } = (data.configuration || {}) as any;
    // eslint-disable-next-line react/no-unused-state
    this.state = { dingtalk, data, ezoffice };
    const { updateApplication } = props.location!.state;
    this.save = updateApplication('configuration', refresh);
  }

  refresh = async () => {
    const { refetch } = this.props.location!.state;
    await refetch();
    const { data } = this.props.location!.state;
    const { dingtalk, ezoffice } = (data.configuration || {}) as any;
    // eslint-disable-next-line react/no-unused-state
    this.setState({ dingtalk, ezoffice, data });
  };

  getData = () => {
    switch (this.props.type) {
      case 'dingtalk':
        return this.state.dingtalk;
      case 'ezoffice':
        return this.state.ezoffice;
      default:
        return null;
    }
  };

  handleSave = async ({ id }: any) => {
    const data = this.getData();
    console.log('data data data', data)
    if (data) {
      this.refresh();
    } else {
      const { dingtalk, ezoffice } = this.state;
      const input = {
        dingtalk: dingtalk && dingtalk.id,
        ezoffice: ezoffice && ezoffice.id,
      };
      // eslint-disable-next-line default-case
      switch (this.props.type) {
        case 'dingtalk':
          input.dingtalk = id;
          break;
        case 'ezoffice':
          input.ezoffice = id;
          break;
      }
      await this.save(input);
    }
  };

  render() {
    const data = this.getData();
    if (data) {
      return <DataSourceFormUpdate {...this.props} data={data} type={this.props.type} onSave={this.handleSave}/>;
    }
    return (
      <DataSourceFormCreate
        {...this.props}
        data={data || { type: this.props.type }}
        type={this.props.type}
        onSave={this.handleSave}
      />
    );
  }
}
