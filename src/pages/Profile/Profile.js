import React ,{ useState } from 'react';
import { Space, Tag, Form, Input, Badge,Descriptions ,Avatar ,Button, Layout, Menu, Card, Statistic, Divider, Table } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './Profile.scss'
import {useNavigate} from 'react-router-dom'
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
      title: 'Stock Name(Code)',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Order Price',
      dataIndex: 'orderPrice',
      key: 'orderPrice',
    },
    {
        title: 'Average Transaction Price',
        dataIndex: 'averagePrice',
        key: 'averagePrice',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, { type }) => (
          <Tag color={type==='Buy'?'red':'green'}>
            {type.toUpperCase()}
          </Tag>
      ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: "Action",
        key: "status",
        render:(_, {status}) => {
            if(status==='unComplete'||status==='partComplete'){
                return (
                <Space size="small">
                    <a>Cancellation</a>
                </Space>)
            }
        }
    }
];

const Profile = (props) => {
    const navigate = useNavigate();

    const [operations, setOperations] = useState([
        {
          key: 1,
          time: '15:00:00',
          stock: 600000,
          orderPrice: 12.00,
          averagePrice: 12.46,
          quantity: 200,
          type: 'Buy',
          status: 'unComplete',
        },
        {
            key: 2,
            time: '15:00:00',
            stock: 600000,
            orderPrice: 12.00,
            averagePrice: 12.46,
            quantity: 200,
            type: 'Buy',
            status: 'unComplete',
        },
        {
            key: 3,
            time: '15:00:00',
            stock: 600000,
            orderPrice: 12.00,
            averagePrice: 12.46,
            quantity: 200,
            type: 'Sell',
            status: 'Complete',
        },
    ]);

    const onClickMenu = (e) => {
        navigate('/main');
    };

    const onBuyFinish = (values) =>{
        operations.push({
            key: 4,
            time: '15:00:00',
            stock: 600000,
            orderPrice: 12.00,
            averagePrice: 12.46,
            quantity: 200,
            type: 'Buy',
            status: 'unComplete',
        })
        setOperations([...operations]);
    };

    const onSellFinish = (values) =>{

    };

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
                <Menu theme="dark" mode="horizontal" onClick={onClickMenu} defaultSelectedKeys={['Personal Infomation']} items={items1} />
                </Header>

                <Content>
                    <Layout
                        className="site-layout-background"
                    >
                        <Sider className="site-layout-background" width={400}>
                            <Avatar style={{ backgroundColor: '#87d068' }} size={75}>USER</Avatar>
                            <Descriptions title="User Info" layout="vertical" bordered>
                                <Descriptions.Item label="UserName" span={3}>Haoru Jiang</Descriptions.Item>
                                <Descriptions.Item label="Cash" span={3}>2502.3$</Descriptions.Item>
                                <Descriptions.Item label="Status" span={3}>
                                    <Badge status="processing" text="Online" />
                                </Descriptions.Item>
                            </Descriptions>
                            <Card size='small' style={{ marginTop: '10px' }}>
                                <Statistic
                                    title="Total Investment"
                                    value={10000}
                                    precision={2}
                                    valueStyle={{
                                    color: '#cf1322',
                                    }}
                                    suffix="$"
                                />
                            </Card>

                            <Card size='small' style={{ marginTop: '10px' }}>
                                <Statistic
                                    title="Total Assets"
                                    value={11000}
                                    precision={2}
                                    valueStyle={{
                                    color: '#3f8600',
                                    }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix="$"
                                />
                            </Card>

                            <Card size='small' style={{ marginTop: '10px' }}>
                                <Statistic
                                    title="Net Interest Rate"
                                    value={10}
                                    precision={2}
                                    valueStyle={{
                                    color: '#3f8600',
                                    }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix="%"
                                />
                            </Card>
                        </Sider>

                        <Content                 
                            style={{
                                height: '100%',
                                padding: '0 24px',
                                display: 'flex',
                        }}>
                            <div className="operations-container">
                                <Divider style={{fontSize: '22px'}} orientation="center">Operations List</Divider>
                                <Table columns={columns} dataSource={operations} />
                            </div>

                            <div className="buy-sell-container">
                                <div>
                                    <Divider orientation="left">Buy Stock</Divider>
                                </div>
                                
                                <Form
                                    name="buy-stock"
                                    className="login-form"
                                    onFinish={onBuyFinish}
                                >
                                    <Form.Item
                                        label = "Stock Code"
                                        name="stockCode"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input stock code!',
                                        },
                                        ]}
                                    >
                                        <Input placeholder="Stock Code" />
                                    </Form.Item>
                                    <Form.Item
                                        label = "Quantity"
                                        name="quantity"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input quantity!',
                                        },
                                        ]}
                                    >
                                        <Input
                                        placeholder="Quantity"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label = "Commission Price"
                                        name="price"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input commission price!',
                                        },
                                        ]}
                                    >
                                        <Input
                                        placeholder="Commission Price"
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                        Buy
                                        </Button>
                                    </Form.Item>
                                </Form>

                                <div>
                                    <Divider orientation="left">Sell Stock</Divider>
                                </div>
                                <Form
                                    name="sell-stock"
                                    className="login-form"
                                    onFinish={onSellFinish}
                                >
                                    <Form.Item
                                        label = "Stock Code"
                                        name="stockCode"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input stock code!',
                                        },
                                        ]}
                                    >
                                        <Input placeholder="Stock Code" />
                                    </Form.Item>
                                    <Form.Item
                                        label = "Quantity"
                                        name="quantity"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input quantity!',
                                        },
                                        ]}
                                    >
                                        <Input
                                        placeholder="Quantity"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label = "Commission Price"
                                        name="price"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input commission price!',
                                        },
                                        ]}
                                    >
                                        <Input
                                        placeholder="Commission Price"
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                        Sell
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        </>
    );
}

export default () => <Profile />;