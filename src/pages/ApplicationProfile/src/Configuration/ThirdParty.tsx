import React, { useState, useEffect,useRef,useReducer } from 'react';
import { Form, Select, Button, Divider, Menu,  Row, Col } from 'antd';
import './style/index.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery,useMutation } from '@apollo/client';
import { thirdPartyDataSources as THIRDPARTY,updateApplication as UPDATEAPPLICATION,dataSources as DATASOURCES } from '../gqls/ApplicationGql.gql';
import {isEqual} from 'lodash'
import { CodeSandboxCircleFilled } from '@ant-design/icons';
function deepCompareEquals(a: any, b: any) {
  return isEqual(a, b);
}

function useDeepCompareMemoize(value: any) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier
  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(effect: React.EffectCallback, dependencies?: Object) {
  useEffect(effect, useDeepCompareMemoize(dependencies));
}
interface ThirdPartyProps {
  /** 阿波罗服务 */
  client: any;

  /** 路由数据绑定 */
  location: any;
}

function Thirds(value:{}){
  const { data: ThirdPartys } = useQuery(THIRDPARTY,{
    variables: {
      filter: value,
    },
    fetchPolicy: 'no-cache',
  });
  const { thirdPartyDataSources =  []  } = ThirdPartys || {};
  return thirdPartyDataSources;
}


function DataSource(){
  const { data: DataSource } = useQuery(DATASOURCES);
  const { dataSources =  []  } = DataSource || {};
  return dataSources.filter((i:any)=>{return i.type ==="ezoffice"});
}



function TypeJudgment(currentConfig:string,selectData:string,data:any,type:Number){
  let app:any = null;
  let appData:any = null;
  let appDataChanel:any = null;
  console.log("data>>>",data);
  if(currentConfig === "dingtalk"){
    app = {dingtalk:selectData,dAnonymousLetter:data.dAnonymousLetter&&data.dAnonymousLetter.id,weChatCP:data.weChatCP&&data.weChatCP.id,ezoffice:data.configuration.ezoffice&&data.configuration.ezoffice.id};
    appDataChanel = {dingtalk:null,dAnonymousLetter:data.dAnonymousLetter&&data.dAnonymousLetter.id,weChatCP:data.weChatCP&&data.weChatCP.id,ezoffice:data.configuration.ezoffice&&data.configuration.ezoffice.id};
    appData = data.dingtalk;
   }else if(currentConfig === "WeChatCP"){
    app = {weChatCP:selectData,dAnonymousLetter:data.dAnonymousLetter&&data.dAnonymousLetter.id,dingtalk:data.dingtalk&&data.dingtalk.id,ezoffice:data.configuration.ezoffice&&data.configuration.ezoffice.id};
    appDataChanel = {weChatCP:null,dAnonymousLetter:data.dAnonymousLetter&&data.dAnonymousLetter.id,dingtalk:data.dingtalk&&data.dingtalk.id,ezoffice:data.configuration.ezoffice&&data.configuration.ezoffice.id};
    appData = data.weChatCP;
   }else if(currentConfig === "AnonymousLetter"){
    app = {dAnonymousLetter:selectData,dingtalk:data.dingtalk && data.dingtalk.id,weChatCP:data.weChatCP&&data.weChatCP.id,ezoffice:data.configuration.ezoffice&&data.configuration.ezoffice.id};
    appDataChanel = {dAnonymousLetter:null,dingtalk:data.dingtalk && data.dingtalk.id,weChatCP:data.weChatCP&&data.weChatCP.id,ezoffice:data.configuration.ezoffice&&data.configuration.ezoffice.id};
    appData = data.dAnonymousLetter;
   }else{
    app = {ezoffice:selectData,dAnonymousLetter:data.dAnonymousLetter&&data.dAnonymousLetter.id,dingtalk:data.dingtalk && data.dingtalk.id,weChatCP:data.weChatCP&&data.weChatCP.id};
    appDataChanel = {ezoffice:null,dAnonymousLetter:data.dAnonymousLetter&&data.dAnonymousLetter.id,dingtalk:data.dingtalk && data.dingtalk.id,weChatCP:data.weChatCP&&data.weChatCP.id};
    appData = data.configuration.ezoffice;
   };
   if(type === 1){
     return app;
   }else if(type === 2){
     return appData;
   }else{
     return appDataChanel;
   }
}


const DingForm =  (props:any) => {  
  const { data, refetch, input, forceRender,currentConfig}= props;
  const [form] = Form.useForm();
  form.setFieldsValue({ selectdata: null });
  let appData:any = null;
  const [updateApplication] = useMutation(UPDATEAPPLICATION);
  const handleThird = async () => {
    const selectdata = form.getFieldValue('selectdata');
    let app = TypeJudgment(currentConfig,selectdata,input.state.data,1);
    await updateApplication({
       variables: {
             id:input.state.data.id,
             input:{configuration:app}
       }
    });
    await refetch();
    forceRender();
  };
  const chanel = async() => {  
      await updateApplication({
        variables: {
              id:input.state.data.id,
              input:{configuration:TypeJudgment(currentConfig,"",input.state.data,3)}
        }
      });
      await refetch();
      forceRender();
  }
  let thirdPartyDataSources = [];
  if(currentConfig === "ezOffice"){
     thirdPartyDataSources = DataSource();
  }else{
     thirdPartyDataSources = Thirds({"type":currentConfig});
  }
  const { Option } = Select;
  appData = TypeJudgment(currentConfig,"",input.state.data,2);
  console.log("appData",appData);
  if(appData){
    return (
      <>
        <Row>
          <Col span={24}>id: {appData.id}</Col>
          <Col span={24}>名称: {appData.name}</Col>
          {
            appData && appData.corpId ?<Col span={24}>企业CorpID: {appData.corpId}</Col>:null
          }
          <Button style={{marginTop:20}} onClick={chanel}>取消绑定</Button>
        </Row>
      </>
    );
  }else{
    return (
      <>
        <Form form={form} layout="inline">
        <Form.Item name="selectdata" label="">
          <Select style={{width:300,marginRight:15}}>
            {thirdPartyDataSources && !!thirdPartyDataSources.length && thirdPartyDataSources.map((d: any) => (
                <Option key={d.name} value={d.id}>{d.name}</Option>
            ))}
        </Select>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleThird}>绑定</Button>
        </Form.Item>
        </Form>
      </>
    );
  }
}

function ThirdParty(props: ThirdPartyProps) {
  const { location } = props;  
  const [, forceRender] = useReducer(s => s + 1, 0);
  const { data, refetch } = location.state;
  const { dingtalk: DingTalkData, ezoffice: EZOfficeData } = (data.configuration || {}) as any;
  const [currentConfig, setCurrentConfig] = useState(() => 'dingtalk');
  const handleConfigChange = (e: any) => setCurrentConfig(e.key);
  return (
    <div className="third-party">
      <div className="header">
        <Menu mode="horizontal" selectedKeys={[currentConfig]} onClick={handleConfigChange}>
          <Menu.Item key="dingtalk">钉钉</Menu.Item>
          <Menu.Item key="ezOffice">EzOffice</Menu.Item>
          <Menu.Item key="WeChatCP">企业微信</Menu.Item>
          <Menu.Item key="AnonymousLetter">飞书</Menu.Item>
        </Menu>
      </div>
      <Divider />
       <DingForm refetch={refetch} data={DingTalkData} input={location} forceRender={forceRender}  currentConfig = {currentConfig}  />
    </div>
  );
}

export default ThirdParty;
