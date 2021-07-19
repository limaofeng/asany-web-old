import {
    queryApplication as QUERY_APP
} from '../gqls/ApplicationGql.gql'
import {useQuery} from '@apollo/client'
type IdType = string | undefined | null
function useGetAppData(id:IdType){
    const {data,refetch,loading,error} = useQuery(QUERY_APP,{
        variables:{
            id
        },
    })
    return {
        data,
        refetch,
        loading,
        error
    }
}

export default useGetAppData