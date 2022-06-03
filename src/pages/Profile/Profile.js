import React ,{ useState,useEffect,useRef  } from 'react';
import { message, Modal, Tag, Form, Input, Badge,Descriptions ,Avatar ,Button, Layout, Menu, Card, Statistic, Divider, Table } from 'antd';
import { ClockCircleOutlined,SyncOutlined,CheckCircleOutlined,ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './Profile.scss'
import {useNavigate} from 'react-router-dom'
import {http ,useInterval} from '../../utils';

const { Header, Sider, Content } = Layout;

const items1 = ['Main', 'Personal Infomation'].map((key) => ({
    key,
    label: `${key}`,
}));

const columns = [
    {
      title: 'Deal Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Stock Id',
      dataIndex: 'stockId',
      key: 'stockId',
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
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => {
        if(status==='BuySuccess'){
          return (          <Tag icon={<CheckCircleOutlined />} color="red">
              BuySuccess
            </Tag>)
        }
        else if(status==='SaleSuccess'){
          return (          <Tag icon={<CheckCircleOutlined />} color="success">
              SellSuccess
            </Tag>)
        }
        else if(status==='Sale'||status==='SalePartSuccess'){
            return (          <Tag icon={<SyncOutlined spin />} color="processing">
                SELLING
              </Tag>)
        }
        else if(status==='Buy'||status==='BuyPartSuccess'){
            return (          <Tag icon={<SyncOutlined spin />} color="purple">
                BUYING
              </Tag>)
        }
      },
    }
];

const Profile = (props) => {
    const navigate = useNavigate();
    const amountInput = useRef(null);

    useEffect(()=>{
        getProfile();
        getOperations();
    },[]);

    useInterval(()=>{
        getProfile();
        getOperations();
    },5000);

    async function getProfile(){
        let id = window.sessionStorage.getItem("userId");  
        const res = await http.get('/getProfile/'+id);
        setUserProfile({...res.data});
    }

    async function getOperations(){
        let id = window.sessionStorage.getItem("userId"); 
        const res = await http.get('/getUserTradeList/'+id);
        setOperations([...res.data]);

        let a = 0;
        let p = 0;

        for(let i = 0;i<res.data.length;i++){
            if(res.data[i].status==='Buy'){
                a+=res.data[i].quantity * res.data[i].price;
                continue;
            }

            if(res.data[i].status==='BuySuccess'){
                let cur = await http.get('/getStockDetail/'+res.data[i].stockId);
                a+=res.data[i].quantity * res.data[i].price;
                //a+=res.data[i].quantity * res.data[i].price;
                p+=res.data[i].quantity * cur.data.currPrice;
                continue;
            }

            if(res.data[i].status==='SaleSuccess'){
                a-=res.data[i].quantity * res.data[i].price;
                //a+=res.data[i].quantity * res.data[i].price;
                p-=res.data[i].quantity * res.data[i].price;
                continue;
            }
        }
        setAssets(a);
        setProfit(p);
        setInterestRate((p==0?0:((p-a)/a)).toFixed(4));
    }

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    async function handleOk () {
        let id = window.sessionStorage.getItem("userId");  
        const res = await http.post('/add_cash/'+id+'/'+amountInput.current.input.value);
        userProfile.cash = parseInt(userProfile.cash)+parseInt(amountInput.current.input.value);
        setUserProfile({...userProfile});

        setConfirmLoading(true);
        setTimeout(() => {
          message.info('Recharge is successed!');
          setVisible(false);
          setConfirmLoading(false);
        }, 1000);
    };

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const [userProfile, setUserProfile] = useState({
        userId: '',
        username: '',
        password: '',
        cash: 0
    });

    const [operations, setOperations] = useState([]);

    const [profit, setProfit] = useState(0);
    const [assets, setAssets] = useState(0);
    const [interestRate, setInterestRate] = useState(0);

    const onClickMenu = (e) => {
        navigate('/main');
    };

    async function onBuyFinish (values){
        let id = window.sessionStorage.getItem('userId');
        const res = await http.post('/buyStock/'+id+'/'+values.stockId+'/'+values.quantity+'/'+values.price);

        let cash = userProfile.cash - (parseInt(values.quantity)*parseFloat(values.price));
        userProfile.cash = cash;
        setUserProfile({...userProfile});

        let num = operations.length + 1;
        let dId = 0;
        if(operations.length===0){
            dId = 1;
        }
        else{
            dId = operations[operations.length-1].id + 1;
        }
        operations.push({
            key: num,
            id: dId,
            stockId: values.stockId,
            price: values.price,
            quantity: values.quantity,
            status: 'Buy'
        })
        setOperations([...operations]);
    };

    async function onSellFinish (values) {
        let id = window.sessionStorage.getItem('userId');
        const res = await http.post('/saleStock/'+id+'/'+values.stockId+'/'+values.quantity+'/'+values.price);

        let num = operations.length + 1;
        let dId = 0;
        if(operations.length===0){
            dId = 1;
        }
        else{
            dId = operations[operations.length-1].id + 1;
        }
        operations.push({
            key: num,
            id: dId,
            stockId: values.stockId,
            price: values.price,
            quantity: values.quantity,
            status: 'Sale'
        })
        setOperations([...operations]);
    };

    return (
        <>
            <div className="title">
                Stock Market
            </div>
  
            <Layout             
                style={{
                height: '90%'
            }}>
                <Header className="header">
                <Menu theme="dark" mode="horizontal" onClick={onClickMenu} defaultSelectedKeys={['Personal Infomation']} items={items1} />
                </Header>

                <Content>
                    <Layout
                        className="site-layout-background"
                    >
                        <Sider className="site-layout-background" width={400}>
                            <Avatar style={{ backgroundColor: '#87d068' }} size={75}>{userProfile.username}</Avatar>
                            <Descriptions title="User Info" layout="vertical" bordered>
                                <Descriptions.Item label="UserName" span={3}>{userProfile.username}</Descriptions.Item>
                                <Descriptions.Item label="Cash" span={3} >
                                    <div>{userProfile.cash}$</div>
                                    <a href="#" onClick={showModal}>Recharge</a>
                                    <Modal
                                        title="Recharge"
                                        visible={visible}
                                        onOk={handleOk}
                                        confirmLoading={confirmLoading}
                                        onCancel={handleCancel}
                                    >
                                        <p>Recharge amount:</p><Input type='number' ref={amountInput} placeholder="Please input number"></Input>
                                    </Modal>
                                </Descriptions.Item>
                                <Descriptions.Item label="Status" span={3}>
                                    <Badge status="processing" text="Online" />
                                </Descriptions.Item>
                            </Descriptions>
                            <Card size='small' style={{ marginTop: '10px' }}>
                                <Statistic
                                    title="Total Assets"
                                    value={assets}
                                    precision={2}
                                    valueStyle={{
                                    color: '#cf1322',
                                    }}
                                    suffix="$"
                                />
                            </Card>

                            <Card size='small' style={{ marginTop: '10px' }}>
                                <Statistic
                                    title="Profit"
                                    value={profit}
                                    precision={2}
                                    valueStyle={{
                                        color: profit>=0?'#cf1322':'#3f8600',
                                    }}
                                    suffix="$"
                                />
                            </Card>

                            <Card size='small' style={{ marginTop: '10px' }}>
                                <Statistic
                                    title="Net Interest Rate"
                                    value={interestRate}
                                    precision={2}
                                    valueStyle={{
                                        color: profit>=0?'#cf1322':'#3f8600',
                                    }}
                                    prefix={profit>=0?<ArrowUpOutlined />:<ArrowDownOutlined />}
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
                                        label = "Stock Id"
                                        name="stockId"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input stock id!',
                                        },
                                        ]}
                                    >
                                        <Input placeholder="Stock Id" />
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
                                        label = "Stock Id"
                                        name="stockId"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input stock id!',
                                        },
                                        ]}
                                    >
                                        <Input placeholder="Stock Id" />
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