import gql from "graphql-tag";
import { GET_COUNTER } from "../queries";

//GraphQL mutation and pass it to the useMutation
export const UPDATE_COUNTER = gql`
  mutation updateCounter($ratio: Number!) {
    updateCounter(ratio: $ratio) @client
  }
`;

export const UPDATE_RATIO = gql`
  mutation updateRatio($ratio: Number!) {
    updateRatio(ratio: $ratio) @client
  }
`;

//local resolver to update counter
export const CounterMutations = {
  //ratio will be in variables
  updateCounter: (_, variables, { cache }) => {
    //query existing data
    const data = cache.readQuery({ query: GET_COUNTER });
    //Calculate new counter value
    const newCounterValue = data.counter+ variables.ratio;
    cache.writeData({
      data: { counter: newCounterValue}
    });
    return null; //best practice
  },
  updateRatio: (_, variables, {cache}) => {
    const data = cache.readQuery({query: GET_COUNTER});
    const newRatioValue = variables.ratio;
    cache.writeData({
      data: { ratio: newRatioValue}
    });
  }
};


