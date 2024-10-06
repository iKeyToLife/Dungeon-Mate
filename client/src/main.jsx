import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Error handling for Apollo Client
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create Apollo Client
const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);