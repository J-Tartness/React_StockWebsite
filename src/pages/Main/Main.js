import React ,{ useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {useNavigate} from 'react-router-dom'
import { Button, Layout, Menu, List, Card, Col, Row, Statistic, Divider, Table, Tag } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './Main.scss'
import {http ,useInterval} from '../../utils';

const { Header, Sider, Content } = Layout;

const items1 = ['Main', 'Personal Infomation'].map((key) => ({
  key,
  label: `${key}`,
}));

const columns = [
  {
    title: 'UserId',
    dataIndex: 'userId',
    key: 'userId',
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
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status }) => {
      if(status==='BuySuccess'){    
        <Tag color='red'>
          BUY
        </Tag>
      }
      else if(status==='SaleSuccess'){     
        <Tag color='green'>
          SALE
        </Tag>
      }
      else{
        <Tag color='default'>
          UNDONE
        </Tag>
      }
    },
  },
];

const Main = (props) => {
  const navigate = useNavigate();

  const [stockDetail, setStockDetail] = useState({
    id: -1,
    stockId: 0,
    stockCode: 0,
    stockName: '',
    startPrice: 0,
    currPrice: 0,
    maxPrice: 0,
    minPrice: 0,
  })

  useInterval( async ()=>{
    if(!(stockDetail.stockId===-1)){
      let r1 = await http.get('/getStockDetail/'+stockDetail.stockId);
      setStockDetail({...r1.data});

      let r2 = await http.get('/getStockTradeList/'+stockDetail.stockId)
      let array = [];
      let n = 1;
      let v = 0;
      let t = 0;
      r2.data.map((item,index)=>{
        v += parseInt(item.quantity);
        t += parseInt(item.quantity)*parseFloat(item.price);
        array.push(Object.assign(item,{key:n}));
        n++;
      });
      setTransactions([...array]);
      setVolume(v);
      setTurnover(t);

      let now = +new Date();
      data.push([+now, r1.data.currPrice]);
      setData([...data])
      option.series[0].data = data;
      setOption({...option});
    }
  },stockDetail.stockId===-1?null:10000);

  async function getStockList(){
    const res = await http.get('/getStockList');
    setStocks([...res.data]);
  }

  async function getSuggestionStocks(){
    const res = await http.get('/getSuggestionStocks');
    setSuggestions([...res.data]);
  }

  async function getStockDetail(stockId){
    const request1 = await http.get('/getStockDetail/'+stockId);
    setStockDetail({...request1.data});

    const request2 = await http.get('/getStockTradeList/'+stockId)
    let array = [];
    let n = 1;
    let v = 0;
    let t = 0;
    request2.data.map((item,index)=>{
      v += parseInt(item.quantity);
      t += parseInt(item.quantity)*parseFloat(item.price);
      array.push(Object.assign(item,{key:n}));
      n++;
    });
    setTransactions([...array]);
    setVolume(v);
    setTurnover(t);

    let base = +new Date();
    let oneMin = 60 * 1000;
    let tmp = [];
    for (let i = 1; i <= 180; i++) {
      tmp.push([+base,null]);
      base += oneMin;
    }
    setData(tmp);
    option.series[0].data = data;
    setOption({...option});
  }

  const [data, setData] = useState([]);

  const [volume, setVolume] = useState(0);

  const [turnover, setTurnover] = useState(0);

  const [stocks, setStocks] = useState([
  ]);

  const [suggestions, setSuggestions] = useState([]);

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

  const [transactions, setTransactions] = useState([]);

  const onClickMenu = (e) => {
    navigate('/profile');
  };

  useEffect(()=>{
    getStockList();
    getSuggestionStocks();
  },[])

  const getOption =()=>{
    return option;
  }

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

                        onClick = {(e)=>getStockDetail(item.stockId)}
                      >
                        <List.Item.Meta
                          title={item.stockName+' ('+item.stockCode+')'}
                        />
                      </Button>
                    </List.Item>
                  )}
                />

                <div>Suggestion Stocks</div>
                <List
                  itemLayout="horizontal"
                  dataSource={suggestions}
                  renderItem={item => (
                    <List.Item>
                      <Button type="text" block 
                        style={{
                          height: '100%',
                          textAlign: 'center'
                        }}

                        onClick = {(e)=>getStockDetail(item.stockId)}
                      >
                        <List.Item.Meta
                          title={item.stockName+' ('+item.stockCode+')'}
                        />
                        <Tag icon={parseFloat(item.profit)>=0?<ArrowUpOutlined></ArrowUpOutlined>:<ArrowDownOutlined></ArrowDownOutlined>} 
                          color={parseFloat(item.profit)>=0?'red':'green'}>
                            {parseFloat(item.profit)*100}%
                        </Tag>
                      </Button>
                    </List.Item>
                  )}
                />
              </Sider>

              {stockDetail.id === -1?               
              <Content
                style={{
                  height: '100%',
                  padding: '0 24px',
                }}
              ></Content>:
              <Content
                style={{
                  height: '100%',
                  padding: '0 24px',
                }}
              >
                <Divider style={{fontSize: '22px'}} orientation="center">{stockDetail.stockName}</Divider>
                <div className="stockInfo-container">
                  <div className="site-statistic-demo-card">
                    <Row gutter={12} justify="space-evenly">
                      <Col span={4}>
                        <Card size='small'>
                          <Statistic
                            title="Current Price"
                            value={stockDetail.currPrice}
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
                            title="Start Price"
                            value={stockDetail.startPrice}
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
                            title="Max Price"
                            value={stockDetail.maxPrice}
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
                            title="Min Price"
                            value={stockDetail.minPrice}
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
                            title="Volume"
                            value={volume}
                            valueStyle={{
                              color: '#cf1322',
                            }}

                          />
                        </Card>
                      </Col>
                      <Col span={4}>
                        <Card size='small'>
                          <Statistic
                            title="Turnover"
                            value={turnover}
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
                      <ReactECharts style={{height: '555px'}} option={getOption()} />
                    </div>
                  </div>

                  <div>
                    <Divider orientation="center">Transactions</Divider>
                    <Table columns={columns} dataSource={transactions} />
                  </div>
                  
                </div>
              </Content>
              }
            </Layout>
          </Content>
      </Layout>
    </>
  );
}

export default () => <Main />;