import { atom } from 'recoil';

export default atom({
  key: 'notesState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial state)
});
