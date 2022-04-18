import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import getVerifiersMock from '../mocks/getVerifiersMock';
import _ from 'lodash';
import moment from 'moment';
import { loadVerifiers } from '../lib/fetch-verifiers';
import { loadVerifiersMoreInfo } from '../lib/fetch-verifiers-more-info';
import { getAddressKeyById } from '../lib/getAddressKeyById';
import { getAddressIdByKey } from '../lib/getAddressIdByKey';
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

type Notary = {
  name: string;
  organization: string;
  address: string;
  addressId: string;
  verifiedClientsCount: number;
  allowance: number;
  initialAllowance: number;
  auditTrail: string;
};

const humanizeDate = (seconds: any) =>
  moment.duration(seconds, 'seconds').humanize();

export const getStaticProps: GetStaticProps = async () => {
  // const verifiers = await loadVerifiers();
  // const notariesData = verifiers.data;
  const notariesData = getVerifiersMock.data;

  let notaries = _.orderBy(
    notariesData,
    ['verifiedClientsCount', 'initialAllowance'],
    ['desc', 'desc']
  );

  const getAverageTtd = (secondsToDatacapList: any) => {
    if (_.isEmpty(secondsToDatacapList)) {
      return { averageTtdInSeconds: null, averageTtdInDuration: null };
    }

    const sumInSeconds = secondsToDatacapList.reduce(
      (previous: any, current: any) => previous + current
    );

    const averageTtdInSeconds = Number(
      sumInSeconds / secondsToDatacapList.length
    ).toFixed();
    const averageTtdInDuration = humanizeDate(averageTtdInSeconds);

    const datesHumanized = secondsToDatacapList.map((v: any) =>
      humanizeDate(v)
    );

    return {
      averageTtdInSeconds,
      averageTtdInDuration,
    };
  };

  const newNotariesArray = notaries.map(async (notary) => {
    const newInfo = await loadVerifiersMoreInfo(notary.addressId);

    const secondsToDatacapForEveryClient = newInfo.data
      ?.filter(
        (v: any) => !!v.createMessageTimestamp && !!v.issueCreateTimestamp
      )
      .filter((v: any) => v.createMessageTimestamp > v.issueCreateTimestamp)
      .filter((v: any) => v.addressId != notary.addressId)
      .map((v: any) => {
        // console.log(`notary.addressId: ${notary.addressId} | v.addressId: ${v.addressId} | different: ${v.addressId != notary.addressId}`);
        return v.createMessageTimestamp - v.issueCreateTimestamp;
      });

    const ttdAverages = getAverageTtd(secondsToDatacapForEveryClient);
    // console.log('ttdAverages ->', ttdAverages);

    const addressId =
      notary.addressId ||
      (notary.address && (await getAddressIdByKey(notary.address)));
    const addressKey =
      notary.address ||
      (notary.addressId && (await getAddressKeyById(notary.addressId)));

    return {
      ...notary,
      addressId,
      address: addressKey,
      ttdAverages,
    };
  });

  notaries = await Promise.all(newNotariesArray);

  return {
    props: {
      notaries,
    },
  };
};

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

const App: NextPage = (
  pageProps: InferGetStaticPropsType<typeof getStaticProps>
) => {
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
