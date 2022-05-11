import { Col, Layout as LayoutAntd, Row, Space } from 'antd';

import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }) => (
  <LayoutAntd style={{ minHeight: '100vh' }}>
    <LayoutAntd.Header style={{ backgroundColor: '#fff' }}>
      <Header />
    </LayoutAntd.Header>
    <LayoutAntd>
      <Space>
        <div style={{ marginBottom: '30px', marginTop: '30px' }}></div>
      </Space>
      <LayoutAntd.Content>
        <Row justify='center'>
          <Col span={18}>{children}</Col>
        </Row>
      </LayoutAntd.Content>
    </LayoutAntd>
    <Space
      direction='vertical'
      style={{ display: 'flex', flexGrow: 1 }}
    >
      <div></div>
    </Space>
    <LayoutAntd.Footer style={{ textAlign: 'center' }}>
      <Footer />
    </LayoutAntd.Footer>
  </LayoutAntd>
);

export default Layout;