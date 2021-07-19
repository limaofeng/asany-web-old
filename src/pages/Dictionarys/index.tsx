import { ILibrary } from '@asany/components';

import DataDictionaryIndex from './dataDictionarys';

export default {
  id: 'diction',
  name: '数字字典',
  components: [
    {
      id: './Dictionarys/dataDictionarys',
      name: '数据字典',
      component: DataDictionaryIndex,
    },
  ],
};

