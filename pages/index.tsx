import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import _ from 'lodash';
import {
  Frame,
  TopBar,
  Page,
  Card,
  Button,
  Navigation,
  Stack,
  Layout,
  TextStyle,
  ResourceList,
  ResourceItem,
} from '@shopify/polaris';

const logo = {
  width: 240,
  // Provides a path for a logo used on a dark background
  topBarSource: './filecoin-plus-leaderboard-logo.png',
  // Provides a path for a logo used on a light background
  contextualSaveBarSource: '',
  url: '/',
  accessibilityLabel: 'Filecoin Plus - Leaderboard',
};

const topBarMarkup = <TopBar />;

const navigationMarkup = (
  <Navigation location='/'>
    <Navigation.Section
      items={[
        {
          url: '/',
          label: 'Home',
          // icon: HomeMinor,
        },
      ]}
    />
  </Navigation>
);

const items = [
  {
    id: 106,
    url: '#',
    name: 'Mae Jemison',
    location: 'Decatur, USA',
  },
  {
    id: 206,
    url: '#',
    name: 'Ellen Ochoa',
    location: 'Los Angeles, USA',
  },
];

const App: NextPage = () => {
  return (
    <>
      <Head>
        <title>Filecoin Plus - Leaderboard</title>
        <meta name='description' content='Filecoin Plus - Leaderboard' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Frame logo={logo} topBar={topBarMarkup} navigation={navigationMarkup}>
        <Page fullWidth title='All notaries'>
          <Layout>
            {/* <Layout.Section fullWidth>
              <ResourceList
                resourceName={{ singular: 'notary', plural: 'notaries' }}
                items={items}
                renderItem={(item: any) => (
                  <ResourceItem id={item.id} url={item.url}>
                    <Layout.Section oneThird>
                      <Card title="Danny O'Brien">
                        <Card.Section>
                          <h2>
                            <TextStyle>Filecoin Foundation</TextStyle>
                          </h2>
                        </Card.Section>
                        <Card.Section title='Summary'>
                          <p>
                            View a summary of your online store’s performance.
                          </p>
                        </Card.Section>
                      </Card>
                    </Layout.Section>
                  </ResourceItem>
                )}
                sortOptions={[
                  { label: 'Newest update', value: 'DATE_MODIFIED_DESC' },
                  { label: 'Oldest update', value: 'DATE_MODIFIED_ASC' },
                ]}
              />
            </Layout.Section> */}
            {/* <Stack> */}
            <Layout.Section oneThird>
              <Card title="Danny O'Brien">
                <Card.Section>
                  <h2>
                    <TextStyle>Filecoin Foundation</TextStyle>
                  </h2>
                </Card.Section>
                <Card.Section title='Summary'>
                  <p>View a summary of your online store’s performance.</p>
                </Card.Section>

                <Card.Section title='Reports'>
                  <p>View a summary of your online store’s performance.</p>
                </Card.Section>
              </Card>
            </Layout.Section>
            {/* </Stack> */}
          </Layout>
        </Page>
      </Frame>
    </>
  );
};

export default App;
