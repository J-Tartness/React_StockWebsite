import React ,{ useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {useNavigate} from 'react-router-dom'
import { Button, Layout, Menu, List, Card, Col, Row, Statistic, Divider, Table, Tag } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './Main.scss'
import {http} from '../../utils';

const { Header, Sider, Content } = Layout;

const items1 = ['Main', 'Personal Infomation'].map((key) => ({
  key,
  label: `${key}`,
}));

const columns = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Type',
    key: 'type',
    dataIndex: 'type',
    render: (_, { type }) => (
        <Tag color={type==='Buy'?'red':'green'}>
          {type.toUpperCase()}
        </Tag>
    ),
  },
];

let base = +new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate(),
  12,
  0,
  0
);
let oneMin = 60 * 1000;

let data = [[base, 0]];

for (let i = 1; i <= 180; i++) {
  let now = new Date((base += oneMin));
  data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
}

const Main = (props) => {
  const navigate = useNavigate();

  async function getStockList(){

  }

  const [stocks, setStocks] = useState([
    {
      title: 'Tesla(204102)',
    },
    {
      title: 'Apple(411232)',
    },
    {
      title: 'Google(123682)',
    },
    {
      title: 'Amazon(547872)',
    }
  ]);

  const [option, setOption] = useState({
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: 'Time-sharing Chart of Stock Price'
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Price',
        type: 'line',
        symbol: 'none',
        data: data
      }
    ]
  });

  const [transactions, setTransactions] = useState([
    {
      key: '1',
      time: '15:00:00',
      price: 32,
      quantity: 102,
      type: 'Buy',
    },
    {
      key: '2',
      time: '15:00:00',
      price: 32,
      quantity: 102,
      type: 'Buy',
    },
    {
      key: '3',
      time: '15:00:00',
      price: 32,
      quantity: 102,
      type: 'Sell',
    },
  ]);

  const onClickMenu = (e) => {
    navigate('/profile');
  };

  useEffect(()=>{
    
  })

  return (
    <>
      <div className="title">
        Stock Market
      </div>

        <Layout             
          style={{
          height: '80%'
        }}>
          <Header className="header">
            <Menu theme="dark" mode="horizontal" onClick={onClickMenu} defaultSelectedKeys={['Main']} items={items1} />
          </Header>
          <Content>
            <Layout
              className="site-layout-background"
            >
              <Sider className="site-layout-background" width={200}>
                <div>Stock List</div>
                <List
                  itemLayout="horizontal"
                  dataSource={stocks}
                  renderItem={item => (
                    <List.Item>
                      <Button type="text" block 
                        style={{
                          height: '100%',
                          textAlign: 'center'
                        }}
                      >
                        <List.Item.Meta
                          title={item.title}
                        />
                      </Button>
                    </List.Item>
                  )}
                />

                <div>Suggestion Stock</div>

                <List
                  itemLayout="horizontal"
                  dataSource={stocks}
                  renderItem={item => (
                    <List.Item>
                      <Button type="text" block 
                        style={{
                          height: '100%',
                          textAlign: 'center'
                        }}
                      >
                        <List.Item.Meta
                          title={item.title}
                        />
                      </Button>
                    </List.Item>
                  )}
                />
              </Sider>
              <Content
                style={{
                  height: '100%',
                  padding: '0 24px',
                }}
              >
                <Divider style={{fontSize: '22px'}} orientation="center">Stock Name</Divider>
                <div className="stockInfo-container">
                  <div className="site-statistic-demo-card">
                    <Row gutter={12} justify="space-evenly">
                      <Col span={4}>
                        <Card size='small'>
                          <Statistic
                            title="价格"
                            value={11.28}
                            precision={2}
                            valueStyle={{
                              color: '#3f8600',
                            }}
                            prefix={<ArrowUpOutlined />}
                            suffix="$"
                          />
                        </Card>
                      </Col>
                      <Col span={4}>
                        <Card size='small'>
                          <Statistic
                            title="开盘价"
                            value={9.3}
                            precision={2}
                            valueStyle={{
                              color: '#cf1322',
                            }}
                            prefix={<ArrowDownOutlined />}
                            suffix="$"
                          />
                        </Card>
                      </Col>
                      <Col span={4}>
                        <Card size='small'>
                          <Statistic
                            title="最高价"
                            value={9.3}
                            precision={2}
                            valueStyle={{
                              color: '#cf1322',
                            }}
                            prefix={<ArrowDownOutlined />}
                            suffix="$"
                          />
                        </Card>
                      </Col>
                      <Col span={4}>
                        <Card size='small'>
                          <Statistic
                            title="最低价"
                            value={9.3}
                            precision={2}
                            valueStyle={{
                              color: '#cf1322',
                            }}
                            prefix={<ArrowDownOutlined />}
                            suffix="$"
                          />
                        </Card>
                      </Col>
                      <Col span={4}>
                        <Card size='small'>
                          <Statistic
                            title="成交量"
                            value={9.3}
                            precision={2}
                            valueStyle={{
                              color: '#cf1322',
                            }}

                          />
                        </Card>
                      </Col>
                      <Col span={4}>
                        <Card size='small'>
                          <Statistic
                            title="成交额"
                            value={9.3}
                            precision={2}
                            valueStyle={{
                              color: '#cf1322',
                            }}
                            suffix="$"
                          />
                        </Card>
                      </Col>
                    </Row>

                    <div className="graph-container">
                      <ReactECharts style={{height: '555px'}} option={option} />
                    </div>
                  </div>

                  <div>
                    <Divider orientation="center">Transactions</Divider>
                    <Table columns={columns} dataSource={transactions} />
                  </div>
                  
                </div>
              </Content>
            </Layout>
          </Content>
      </Layout>
    </>
  );
}

export default () => <Main />;