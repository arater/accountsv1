import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CounterMutations } from "../../mutations";

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  resolvers: {
    Mutation: {
      ...CounterMutations
    }
  }
});

const initialState = { 
  counter: 0,
  ratio: 3
 };
cache.writeData({ data: initialState });

export default client;