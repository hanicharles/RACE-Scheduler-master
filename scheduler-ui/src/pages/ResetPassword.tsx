import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css'; // Reuse Login styles

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            message.error("Invalid or missing token.");
            navigate('/login');
        }
    }, [token, navigate]);

    const onFinish = async (values: any) => {
        if (values.new_password !== values.confirm_password) {
            message.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            await axios.post('http://localhost:8000/users/reset-password', {
                token: token,
                new_password: values.new_password,
                confirm_password: values.confirm_password
            });
            message.success('Password reset successful. Please login.');
            navigate('/login');
        } catch (err) {
            message.error('Failed to reset password. Token may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card" bordered={false}>
                <h2 className="login-title">Reset Password</h2>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label={<span className="form-label">New Password</span>}
                        name="new_password"
                        rules={[{ required: true, message: 'Please enter new password' }]}
                    >
                        <Input.Password placeholder="Enter new password" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="form-label">Confirm Password</span>}
                        name="confirm_password"
                        rules={[{ required: true, message: 'Please confirm new password' }]}
                    >
                        <Input.Password placeholder="Confirm new password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;
