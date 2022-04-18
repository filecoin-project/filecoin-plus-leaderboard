import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import type { AppProps } from 'next/app';
import {
  createDOMRenderer,
  RendererProvider,
  SSRProvider,
  FluentProvider,
  teamsLightTheme,
  webLightTheme,
} from '@fluentui/react-components';

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

function MyApp({ Component, pageProps, renderer }) {
  return (
    // 👇 accepts a renderer from <Document /> or creates a default one
    <RendererProvider renderer={renderer || createDOMRenderer()}>
      <SSRProvider>
        <ApolloProvider client={createApolloClient()}>
          <FluentProvider theme={webLightTheme}>
            <Component {...pageProps} />
          </FluentProvider>
        </ApolloProvider>
      </SSRProvider>
    </RendererProvider>
  );
}

export default MyApp;
