import { Alert ,Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.scss'
import ParticlesBg from 'particles-bg'
import {useNavigate} from 'react-router-dom'
import {http} from '../../utils';

const Login = () => {
    const navigate = useNavigate();

    async function onFinish (values) {
        const res = await http.post('/login/'+values.username+'/'+values.password);
        if(res.data.result==="Success"){
            window.sessionStorage.setItem("userId", res.data.userId);
            navigate('/main');
        }
        else{
            <Alert message="Username or password wrong!" type="error" />
        }
    };

    const toRegister = () => {
        navigate('/register');
    }

    return (
        <>
            <ParticlesBg type="cobweb" bg={true}></ParticlesBg>
            <div className="formContainer">
                <div className="login-title">Stock Market</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                        ]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                        </Button>
                        Or <a href="" onClick={toRegister}>register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default () => <Login />;