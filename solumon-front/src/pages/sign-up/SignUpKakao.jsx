import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from '../../style/theme';
import Button from '../../components/Button';

function SignUpKakao() {
  const [userData, setUserData] = useState('name');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('test@kakao.com');

  const handleSignUpButton = () => {};

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <PageTitle>카카오 회원가입</PageTitle>
        <Line></Line>
        <SignInForm name="sign-in-kakao" method="post">
          <StyledInput
            type="text"
            placeholder="닉네임"
            onChange={(e) => setNickname(e.target.value)}
          ></StyledInput>
          <StyledInput
            style={{ marginBottom: '10px' }}
            type="email"
            value={email}
            disabled
          ></StyledInput>
          {userData === nickname ? (
            <CheckMessage>이미 사용중인 닉네임입니다.</CheckMessage>
          ) : (
            ''
          )}
          <Button
            type="submit"
            name={'회원가입'}
            onClick={handleSignUpButton}
            fontSize={'14px'}
            padding={'13px'}
          />
        </SignInForm>
        <Line></Line>
      </Wrapper>
    </ThemeProvider>
  );
}

export default SignUpKakao;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 120px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.dark_purple};
  margin-bottom: 40px;
`;

const Line = styled.hr`
  height: 1px;
  width: 70%;
  background-color: ${({ theme }) => theme.light_purple};
`;

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
`;

const StyledInput = styled.input`
  width: 300px;
  color: ${({ theme }) => theme.dark_purple};
  background-color: ${({ theme }) => theme.light_purple};
  padding: 10px;
  border: none;
  outline: none;
`;

const CheckMessage = styled.p`
  font-size: 14px;
  color: red;
  margin-bottom: 10px;
`;
