import gql from 'graphql-tag';

//Queries
export const GET_COUNTER = gql`
    query GetCounterValue {
        counter @client
        ratio @client
    }
`;



