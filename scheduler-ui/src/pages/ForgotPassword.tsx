import { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse Login styles

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            await axios.post('http://localhost:8000/users/forgot-password', { email: values.email });
            message.success('If an account exists, a reset link has been sent to your email.');
            navigate('/login');
        } catch (err) {
            message.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card" bordered={false}>
                <h2 className="login-title">Forgot Password</h2>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label={<span className="form-label">Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="Enter your registered email" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Send Reset Link
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                         <a href="/login" style={{ color: '#fff' }}>Back to Login</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
