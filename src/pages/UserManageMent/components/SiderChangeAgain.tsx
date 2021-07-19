import { Query } from '@apollo/client/react/components';
import React from 'react';
import { Select } from 'antd';
import { organizations as ALLORGANIZATION, queryDepartments as QUERY_ALL_DEPARTMENTS } from '../gqls/userManage.gql';
import { QueryResult,MutationResult } from '@apollo/client';
import { tree } from '@/pages/WisdomPartyBuilding/utils/utils';
import SiderTree,{ Tree, TreeItem, TreeItemGroup } from '@/pages/WisdomPartyBuilding/components/SiderTree';
interface SiderProps {
  onChange: (id: string, isAdd: object) => void;
  defaultOrganizationId?: string;
  defaultSelectedKey: string;
  onChangeOrganization?: (data: any) => void;
  getChildref?: (data: any) => void;
  showSearch?: boolean;
  categorys: any[];
}

interface AllOrganizationProps {
  onChange: (data: any) => void;
  value: string;
}
class AllOrganization extends React.Component<AllOrganizationProps, any> {
  organizations = [];

  handleChange = (id: any) => {
    this.props.onChange(this.organizations.find(item => item.id == id));
  };

  getOrganization(): any {
    return this.organizations.find(item => item.id == this.props.value);
  }

  render() {
    const { value } = this.props;
    console.log('组织ID', value);
    return (
      <Query query={ALLORGANIZATION}>
        {({ data, loading }): any => {
          const { organizations = [] } = data || [];
          this.organizations = organizations;
          return (
            <Select onChange={this.handleChange} style={{ width: '100%' }} value={value}>
              {organizations.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          );
        }}
      </Query>
    );
  }
}

interface SiderState {
  categoryTree: any[];
  selectedKey: string;
  lastDefaultSelectedKey: string;
  query?: { organization: string };
}

class SiderChangeAgain extends React.Component<SiderProps, SiderState> {
  public refetch?: any;

  orgs = React.createRef<AllOrganization>();

  public static defaultProps = {
    defaultSelectedKey: null,
    showSearch: true,
  };

  constructor(props: SiderProps) {
    super(props);
    const { defaultSelectedKey: selectedKey, categorys } = props;
    this.state = {
      categoryTree: categorys,
      lastDefaultSelectedKey: selectedKey,
      selectedKey,
      query: { organization: '1' },
    };
  }

  static getDerivedStateFromProps(nextProps: SiderProps, prevState: SiderState) {
    if (nextProps.defaultSelectedKey != prevState.lastDefaultSelectedKey) {
      return { selectedKey: nextProps.defaultSelectedKey, lastDefaultSelectedKey: nextProps.defaultSelectedKey };
    }
    return null;
  }

  getDepartment(id: string) {
    const department = this.departments.find(item => item.id == id);
    department.organization = this.orgs.current.getOrganization();
    return department;
  }

  componentDidMount = () => {
    console.log('propssss', this.props);
    if (this.props.getChildref) {
      this.props.getChildref(this);
    }
  };

  handleOrganizationChange = (org: any) => {
    this.props.onChangeOrganization && this.props.onChangeOrganization(org);
    // this.setState({ query: { organization: org.id } });
  };

  public handleClick = (id: string) => {
    const { onChange } = this.props;
    if (this.state.selectedKey !== id) {
      this.setState({ selectedKey: id });
      onChange(id);
    }
  };

  public crateMenu = (newDate, layer = 1) => {
    const newDoms = newDate.map(item => {
      if (item.children) {
        return (
          <TreeItemGroup key={item.id} title={item.name} layer={layer}>
            {this.crateMenu(item.children, layer + 1)}
          </TreeItemGroup>
        );
      }
      return <TreeItem key={item.id} title={item.name} layer={layer} />;
    });
    return newDoms;
  };

  public handleSuccess = (id: string) => {
    const { onChange } = this.props;
    this.setState({ selectedKey: id });
    onChange(id);
  };

  public render() {
    console.log(this.state.query);
    const { defaultOrganizationId } = this.props;
    return (
      <div>
        {this.props.showSearch ? (
          <AllOrganization ref={this.orgs} onChange={this.handleOrganizationChange} value={defaultOrganizationId} />
        ) : null}
        <Query query={QUERY_ALL_DEPARTMENTS} variables={{ ...this.state.query, organization: defaultOrganizationId }}>
          {this.renderSiderTree}
        </Query>
      </div>
    );
  }

  renderSiderTree = ({ data, loading, refetch }: QueryResult) => {
    const { defaultSelectedKey } = this.props;
    const { selectedKey } = this.state;
    this.refetch = refetch;
    const { departments = [] } = data || [];
    this.departments = departments;
    const departmentsTemp = departments.map((item: any) => ({ ...item }));
    const categoryTree = tree(departmentsTemp, {
      idKey: 'id',
      pidKey: 'parent.id',
      childrenKey: 'children',
    });
    return <SiderTree data={categoryTree} defaultSelectedKey={defaultSelectedKey} onChange={this.handleClick} />;
  };
}

export default SiderChangeAgain;
