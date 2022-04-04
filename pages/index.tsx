import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
// import styles from '../styles/Home.module.css'
import {
  Card,
  Avatar,
  Button,
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Divider,
  Space,
  Statistic,
} from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Meta } = Card;
const { Header, Content, Footer } = Layout;

const App: NextPage = () => {
  const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  return (
    <div>
      <Layout className="layout">
          <Menu mode='horizontal' theme='light'>
        <Header>
          <Image
            width={34}
            height={34}
            // layout="fill"
            src="/logo.png"
            alt="Filecoin Plus logo"
            style={{maxWidth: '34px', maxHeight: '34px'}}
          />
          <div className="logo" />
        </Header>
        </Menu>

        <Content style={{ padding: '50px 50px' }}>
          <div className="site-card-wrapper">
            <Row gutter={16}>
              <Col span={8}>
                <Card bordered={false}>
                  <Meta
                    avatar={
                      <Avatar src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
                    }
                    title="Notary Name"
                    description="Organization"
                  />
                  <Divider plain>General</Divider>
                  <Divider plain>DataCap</Divider>
                  <Row>

                    <Col span={12}>
                      <Statistic
                        title="Active Users"
                        value={112893}
                        valueStyle={{ fontSize: '1rem' }}
                      />
                      </Col>
                      <Col span={12}>
                      <Card size="small">
                        <Statistic
                          title="Average TTD"
                          value="120 days"
                          valueStyle={{ color: '#3f8600', fontSize: '1rem' }}
                          // prefix={<ArrowUpOutlined />}
                        />
                      </Card>
                    </Col>

                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>

        <Space direction="vertical" style={{ display: 'flex', flexGrow: 1 }}>
          <div></div>
        </Space>
        <Footer style={{ textAlign: 'center' }}>
          &copy; Filecoin Foundation
          <Divider type="vertical" />
          <a href="#">Terms</a>
          <Divider type="vertical" />
          <a href="#">Privacy</a>
          <Divider type="vertical" />
          <a href="#">Status</a>
          <Divider type="vertical" />
          <a href="#">Docs</a>
          <Divider type="vertical" />
          <a href="#">About</a>
        </Footer>
      </Layout>
    </div>
  );
};

export default App;
