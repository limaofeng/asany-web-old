import React from 'react';
import { Query } from '@apollo/client/react/components';
import { QueryResult } from '@apollo/client';
import { dataDictionaryTypes as DATADICTIONARYTYPES } from './gqls/dictionarys.gql';
import DataDictionaryTypeItem from './DataDictionaryTypeItem';
import { tree } from '../WisdomPartyBuilding/utils/utils';
import SiderTree from '../WisdomPartyBuilding/components/SiderTree';

interface SiderProps {
  onChange: (id: string) => void;
  defaultSelectedKey?: string;
}

interface SiderState {
  categoryTree: any[];
  selectedKey: string;
  query: any;
}
class Sider extends React.PureComponent<SiderProps, SiderState> {
  public static defaultProps = {
    defaultSelectedKey: null,
  };

  refetch: any;

  constructor(props: any) {
    super(props);
    const { defaultSelectedKey: selectedKey, categorys } = props;
    this.state = {
      categoryTree: categorys,
      selectedKey,
      query: undefined,
    };
  }

  public handleClick = id => {
    console.log(`handleClick:${id}`, `oldValue:${this.state.selectedKey}`);
    const { onChange } = this.props;
    if (this.state.selectedKey !== id) {
      this.setState({ selectedKey: id });
      onChange(id);
    }
  };

  // public crateMenu = (newDate, layer = 1) => {
  //   const newDoms = newDate.map(item => {
  //     if (item.children) {
  //       return (
  //         <TreeItemGroup
  //           key={item.id}
  //           title={item.title}
  //           content={<DataDictionaryTypeItem value={item} onSave={this.refetch} />}
  //           layer={layer}
  //         >
  //           {this.crateMenu(item.children, layer + 1)}
  //         </TreeItemGroup>
  //       );
  //     }
  //     return <TreeItem key={item.id} layer={layer}></TreeItem>;
  //   });
  //   return newDoms;
  // };

  // public handleSuccess = id => {
  //   const { onChange } = this.props;
  //   this.setState({ selectedKey: id });
  //   onChange(id);
  // };

  render() {
    const { selectedKey } = this.state;
    // console.log(`render selectedKey:${selectedKey}`);
    return (
      <Query query={DATADICTIONARYTYPES} variables={this.state.query}>
        {this.renderTree}
      </Query>
    );
  }

  renderTree = ({ data, loading, refetch }: QueryResult) => {
    const { defaultSelectedKey, onChange: handleClick } = this.props;
    const { dataDictionaryTypes = [] } = data || {};
    this.refetch = refetch;
    const categorys = dataDictionaryTypes.map((item: any) => ({ ...item }));
    const categoryTree = tree(categorys, {
      idKey: 'id',
      pidKey: 'parent.id',
      childrenKey: 'children',
      converter: (data: any) => ({ ...data, content: <DataDictionaryTypeItem value={data} onSave={refetch} /> }),
    });
    return <SiderTree data={categoryTree} defaultSelectedKey={defaultSelectedKey} onChange={handleClick} />;
  };
}

export default Sider;
