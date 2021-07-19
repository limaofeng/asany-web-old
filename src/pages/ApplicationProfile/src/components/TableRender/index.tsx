import React from 'react';
import moment from 'moment';
import { history as router }  from 'umi';

enum EmailPriorityStatus{
    URGENT= 'URGENT',
    ORDINARY= 'ORDINARY',
}

export function TimeRender(time: number): JSX.Element {
  console.log(time);
  return <div>{moment(time).format('YYYY-MM-DD HH:mm')}</div>;
}
export function EmailPriority(type: string): JSX.Element {
  return (
    <div>
      {type === EmailPriorityStatus.URGENT ? '紧急' : ''}
      {type === EmailPriorityStatus.ORDINARY ? '普通' : ''}
    </div>
  );
}

function handleView(id: number) {
    router.push(`/mail/mail-send-view/${id}`)
}

export function EmailInboxViewPriority(account: string,data: any): JSX.Element {
    return (
        <div>
            <a onClick={()=>{handleView(data.id)}}>{account} 管理员</a>
        </div>
    );
}
// export default { TimeRender, EmailPriority };