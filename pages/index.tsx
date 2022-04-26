import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { Layout, Row, Typography, Divider, Input, Select, Statistic, Card, Col, Space } from 'antd';
import getVerifiersMock from '../mocks/getVerifiersMock';
import _ from 'lodash';
import { loadVerifiers } from '../lib/fetch-verifiers';
import { loadVerifiersMoreInfo } from '../lib/fetch-verifiers-more-info';
import { getAddressKeyFromId } from '../lib/getAddressKeyFromId';
import { getAddressIdFromKey } from '../lib/getAddressIdFromKey';
import { formatData } from '../utils/formats';
import { getAverageTtd } from '../utils/general';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import { LayoutHeader, LayoutFooter, NotaryCard, NotaryTable } from '../components';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export const getStaticProps: GetStaticProps = async () => {
  // const verifiers = await loadVerifiers();
  // const notariesData = verifiers.data;
  const notariesData = getVerifiersMock.data;
  const orderVerifiers = (verifiers) => _.orderBy(notariesData, ['verifiedClientsCount', 'initialAllowance'], ['desc', 'desc']);
  let notaries = orderVerifiers(notariesData);

  notaries = await Promise.all(
    notaries.map(async (notary) => {
      const newInfo = await loadVerifiersMoreInfo(notary.addressId);

      const removeInvalidTimestamps = (verifier: any) =>
        verifier
          ?.filter((v: any) => !!v.createMessageTimestamp && !!v.issueCreateTimestamp)
          .filter((v: any) => v.createMessageTimestamp > v.issueCreateTimestamp)
          .filter((v: any) => v.addressId != notary.addressId);

      const secondsToDatacapForEveryClient = removeInvalidTimestamps(newInfo.data).map((v: any) => {
        return v.createMessageTimestamp - v.issueCreateTimestamp;
      });

      const addressId = notary.addressId || (notary.address && (await getAddressIdFromKey(notary.address)));
      const addressKey = notary.address || (notary.addressId && (await getAddressKeyFromId(notary.addressId)));

      return {
        ...notary,
        addressId,
        addressKey,
        ttdAverages: getAverageTtd(secondsToDatacapForEveryClient),
      };
    }),
  );

  return {
    props: {
      notaries,
    },
  };
};

const App: NextPage = (pageProps: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log('pageProps ->', pageProps);

  return (
    <div className='App'>
      <Layout className='layout'>
        <LayoutHeader />

        <Content style={{ padding: '45px 45px' }}>
          {/* <Space><div style={{margin: '20px'}}></div></Space> */}
          <Title>All notaries</Title>
          <Divider
            style={{
              background: 'linear-gradient(145deg,#c65aff,#248dff)',
              height: '6px',
              // minWidth: '24px',
              // width: '24px'
            }}
          />

          <NotaryTable props={formatData(pageProps)} />

          {/* Notary Cards */}
          {/* <Row
            className='notary-cards'
            gutter={16}
            style={{ rowGap: '20px' }}
            // justify='center'
          >
            {pageProps.notaries
              .filter((v: Notary) => !!v.name)
              .map((notary: Notary, index: any) => (
                // console.log(notary)
                // console.log(bytesToSize(notary.initialAllowance)),
                // console.log(/^https?/i.test(notary.auditTrail)),
                <NotaryCard
                  key={index}
                  name={notary.name}
                  organization='Organization'
                  addressId={notary.addressId}
                  clients={notary.verifiedClientsCount}
                  datacapAvailable={prettyBytes(Number(notary.allowance), {
                    binary: true,
                  })}
                  // datacapAllocated={bytesToSize(Number((Number(notary.initialAllowance)-Number(notary.allowance))))}
                  datacapAllocated={prettyBytes(
                    Number(notary.initialAllowance) - notary.allowance,
                    { binary: true }
                  )}
                  url={/^https?/i.test(notary.auditTrail) && notary.auditTrail}
                />
              ))}
          </Row> */}
        </Content>

        <LayoutFooter />
      </Layout>
    </div>
  );
};

export default App;
