import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';

// Create Apollo Client
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);