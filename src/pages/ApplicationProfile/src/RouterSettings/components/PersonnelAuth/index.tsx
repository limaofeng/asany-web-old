import { useState } from 'react';
import React from 'react';
import { Somepeople } from '@asany/components';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';


interface PersonnelAuthProps {
  organization: string;
  onChange?:(data:string[]) => void;
  value?:string[]
}

function PersonnelAuth(props: PersonnelAuthProps) {
  const { organization, onChange: propOnChange, value = [] } = props;
  const [state, setState] = useState({
    value: [...value],
  });
  const onChange = (value: any) => {
    setState({ value });
    propOnChange && propOnChange(value);
  };
  const client = new ApolloClient({
    uri: 'http://nuwa.new.thuni-h.com/graphql',
    cache: new InMemoryCache(),
  });
  
  return (
    <ApolloProvider client={client}>
      <Somepeople organization={organization} value={state.value} onChange={onChange} />
    </ApolloProvider>
  )
}

export default PersonnelAuth;