import { Anchor, Container, Paper, Text, Title } from '@mantine/core';
import { LoginForm } from '../components/LoginForm';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };
  return (
    <Container>
      <Paper>
        <Title>Đăng nhập</Title>
        <Text> Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</Text>
        <LoginForm onSuccess={handleLoginSuccess} />{' '}
        <Text>Chưa có tài khoản ? </Text>
        <Anchor component={Link} to="/register">
          Đăng ký ngay
        </Anchor>
      </Paper>
    </Container>
  );
}
