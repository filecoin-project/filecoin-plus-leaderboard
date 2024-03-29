import { Card, Row, Col, Divider, Statistic } from 'antd';

export const GeneralStatsCard = (props: any) => {
  return (
    <div className='GeneralStatsCard'>
      <Divider plain>General</Divider>
      <Row gutter={8} justify='space-around'>
        <Col flex='auto'>
          <Card size='small'>
            <Statistic
              title='Clients'
              value={props.clients}
              valueStyle={{ fontSize: '1rem' }}
            />
          </Card>
        </Col>
        <Col flex='auto'>
          <Card size='small'>
            <Statistic
              title='Average TTD'
              value='-'
              valueStyle={{ fontSize: '1rem' }}
              // prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
