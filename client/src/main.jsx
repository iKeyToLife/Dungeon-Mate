import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import AuthService from './utils/auth';

// Error handling for Apollo Client
const errorLink = onError(async ({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
    const location = window.location.pathname;

    if (graphQLErrors[0].message.includes('not authenticate')) {

      // check current path "/login"
      if (location !== '/login') {
        const isTokenExpired = await AuthService.isTokenExpired();
        if (!isTokenExpired) {
          AuthService.logout();
        }
      }
    } else if (graphQLErrors[0].message.includes('duplicate key error')) {
      const match = graphQLErrors[0].message.match(/{ (.*)/);
      const duplicateKeyInfo = match ? match[0] : 'Invalid key';
      alert(`A user with this value already exists: ${duplicateKeyInfo}`);
    } else {
      alert(graphQLErrors[0].message);
    }
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