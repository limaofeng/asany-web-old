import { updateApplication as UPDATE_APPLICATION } from '../gqls/ApplicationGql.gql';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

type applicationIdType = string | undefined;
function useUpdateApp() {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [update_app] = useMutation(UPDATE_APPLICATION);
  const useUpdateAppData = async (input: any, applicationId: applicationIdType) => {
    try {
      await update_app({
        variables: {
          id: applicationId,
          input,
        },
      });
      setSuccess(true);
    } catch (e) {
      console.log(e);
      setError(true);
    }
    setSuccess(false);
    setError(false);
  };
  return {
    success,
    error,
    useUpdateAppData,
  };
}
export default useUpdateApp;
