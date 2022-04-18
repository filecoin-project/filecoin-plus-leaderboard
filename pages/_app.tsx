import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import type { AppProps } from 'next/app';
// import Link from 'next/link';

function createApolloClient() {
  const link = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    // ssrMode: true,
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={createApolloClient()}>
      <AppProvider
        // linkComponent={Link as any}
        i18n={enTranslations}
      >
        <Component {...pageProps} />
      </AppProvider>
    </ApolloProvider>
  );
}

export default MyApp;
