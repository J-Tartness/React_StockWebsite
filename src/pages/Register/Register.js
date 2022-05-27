import React from 'react';
import { Alert, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ParticlesBg from 'particles-bg'
import {useNavigate} from 'react-router-dom'
import './Register.scss'
import {http} from '../../utils';

const Register = () => {
    const navigate = useNavigate();

    async function onFinish (values){
        const res = await http.post('/register/'+values.username+'/'+values.password);

        if(res.result==='Success'){
            navigate('/');
        }
        else{
            <Alert message="Username is already used!" type="error" />
        }
    };

    return (
        <>
            <ParticlesBg type="cobweb" bg={true}></ParticlesBg>
            <div className="formContainer">
                <div className="title">Stock Market</div>
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

                    <Form.Item
                        name="check_password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Password again!',
                            
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                
                              return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                          }),
                        ]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Retype your password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default () => <Register />;