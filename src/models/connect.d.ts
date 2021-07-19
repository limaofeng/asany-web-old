import { GlobalModelState } from '../.umi/app/models/global';
import { CurrentUser, TokenCredential, AuthModelState } from '../.umi/app/models/auth';

export { GlobalModelState, CurrentUser, TokenCredential, AuthModelState };

export interface Loading {
  global: boolean;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  auth: AuthModelState;
  loading: Loading;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
