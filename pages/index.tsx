import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import _ from 'lodash';
import { Body, Button, Caption, makeStyles } from '@fluentui/react-components';
import {
  Card,
  CardHeader,
  CardFooter,
} from '@fluentui/react-components/unstable';

const useStyles = makeStyles({
  spacer: {
    paddingTop: '10px',
    paddingBottom: '10px',
  },
});

const App: NextPage = () => {
  const styles = useStyles();
  return (
    <>
      <Head>
        <title>Filecoin Plus - Leaderboard</title>
        <meta name='description' content='Filecoin Plus - Leaderboard App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Button>Hello world!</Button>
      <Button appearance='primary'>Get started</Button>
      <div className={styles.spacer}></div>
      <div>
        <Card appearance='filled'>
          <CardHeader
            // image={<img src={'./logo.png'} alt='Notary avatar' />}
            header={
              <Body>
                <b>Notary name</b>
              </Body>
            }
            description={<Caption>Filecoin Foundation</Caption>}
          />
        </Card>
      </div>
    </>
  );
};

export default App;
