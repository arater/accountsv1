import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export const query = gql`
    query Counter {
        counter {
            ratio
        }
    }
`;

export default () => useQuery(query);