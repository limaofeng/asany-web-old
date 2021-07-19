import * as React from 'react';

import { Card } from 'antd';
import { PageContainer } from '@asany/components';
import DictionarysRight from './DictionaryRight';
import SiderWrapper from './SiderWrapper';

export default class DataDictionarys extends React.Component<any, any> {
  state = { type: undefined };

  handleChangeType = (type: any) => {
    this.setState({ type });
    console.log(type);
  };

  public render() {
    return (
      <PageContainer title="数据字典分类" sidebar={<SiderWrapper onChange={this.handleChangeType} />}>
        <DictionarysRight type={this.state.type} />
      </PageContainer>
    );
  }
}
