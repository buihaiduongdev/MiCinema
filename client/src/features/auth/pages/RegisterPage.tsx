import { Anchor, Container, Paper, Text, Title } from '@mantine/core';
import { RegisterForm } from '../components/RegisterForm';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <Container>
      <Paper>
        <Title>Đăng ký</Title>
        <Text>Tham gia cùng chúng tôi để nhận những ưu đãi hấp dẫn.</Text>
        <RegisterForm />
        <Text> Đã có tài khoản? </Text>
        <Anchor component={Link} to="/login">
          Đăng nhập
        </Anchor>
      </Paper>
    </Container>
  );
}
