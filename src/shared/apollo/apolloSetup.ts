import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

// link of server 
const httpLink = new HttpLink({
    uri: 'http://localhost:81'
});

export default new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink
});