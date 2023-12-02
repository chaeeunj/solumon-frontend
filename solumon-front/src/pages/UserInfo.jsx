import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';
import styled, { ThemeProvider } from 'styled-components';
import theme from '../style/theme';

import Button from '../components/Button';

function UserInfo() {
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState([]);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  const interestsTopic = userInfo.interests
    ? userInfo.interests.join(', ')
    : '';

  const fetchData = async () => {
    try {
      //파이어베이스 스토어에서 'users'컬렉션을 쿼리설정해 , uid 필드가 result.user.uid 같은 문서 찾기
      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', user.uid),
      );
      //getDocs 를 사용하여 원하는 데이터 반환
      const userQueryData = await getDocs(userQuery);
      const userDoc = userQueryData.docs[0];

      if (user !== null) {
        setUserInfo({
          nickname: userDoc.data().nickName,
          email: user.email,
          interests: userDoc.data().interests,
        });
      }
    } catch (error) {
      console.log(`Something Wrong: ${error.message}`);
    }
  };

  const handleSaveButton = async (e) => {
    e.preventDefault();
    try {
      //파이어베이스 스토어에서 'users'컬렉션을 쿼리설정한 다음 uid 필드가 result.user.uid와(현재 유저의 uid와) 같은 문서 찾기
      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', user.uid),
      );

      const querySnapshot = await getDocs(userQuery);
      const userDoc = querySnapshot.docs[0];

      if (userDoc) {
        // users collection중 현재 로그인한 유저의 userDoc.id값과 일치한 문서를 찾아 업데이트함
        await updateDoc(doc(db, 'users', userDoc.id), {
          nickName: nickname,
          interests: userInfo.interests,
        });
      }
    } catch (error) {
      console.log(`Something Wrong: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <PageTitle>회원 정보</PageTitle>
        <Line></Line>
        <SignInForm name="sign-up-general">
          <InputWrapper>
            <StyledInputLabel htmlFor="nickname">닉네임</StyledInputLabel>
            <StyledInput
              name="nickname"
              type="text"
              onChange={(e) => setNickname(e.target.value)}
              defaultValue={userInfo.nickname}
            ></StyledInput>
          </InputWrapper>

          <InputWrapper>
            <StyledInputLabel htmlFor="email">이메일</StyledInputLabel>
            <StyledInput
              name="email"
              type="email"
              value={userInfo.email}
              disabled
            ></StyledInput>
          </InputWrapper>

          <InputWrapper>
            <StyledInputLabel htmlFor="password">
              현재 비밀번호
            </StyledInputLabel>
            <StyledInput
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            ></StyledInput>
          </InputWrapper>

          <InputWrapper>
            <StyledInputLabel htmlFor="new-password">
              새 비밀번호
            </StyledInputLabel>
            <StyledInput
              name="new-password"
              type="password"
              placeholder="8~20자리"
              onChange={(e) => setNewPassword(e.target.value)}
            ></StyledInput>
          </InputWrapper>
          <InfoText>
            📢 비밀번호 입력 시 영문 대문자 또는 소문자, 숫자,
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp; 특수문자 3가지를 모두 사용해야 합니다.
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(특수문자는 @ # $ % ^ & + = ! 만 사용
            가능)
          </InfoText>

          <InputWrapper>
            <StyledInputLabel htmlFor="new-password-check">
              새 비밀번호 확인
            </StyledInputLabel>
            <StyledInput
              name="new-password-check"
              type="password"
              onChange={(e) => setCheckPassword(e.target.value)}
            ></StyledInput>
          </InputWrapper>

          <InputWrapper>
            <StyledInputLabel htmlFor="interests-topic">
              관심주제
            </StyledInputLabel>
            <StyledLink to={'/user/interests'} style={{ marginBottom: '10px' }}>
              {interestsTopic}
            </StyledLink>
          </InputWrapper>

          {newPassword === checkPassword ? (
            ''
          ) : (
            <CheckMessage>비밀번호가 일치하지 않습니다.</CheckMessage>
          )}

          <Button
            type="submit"
            value="save-user-info"
            name={'저장'}
            onClick={handleSaveButton}
            fontSize={'16px'}
            padding={'10px 13px'}
          />
        </SignInForm>
        <Line></Line>
      </Wrapper>
    </ThemeProvider>
  );
}

export default UserInfo;

const Wrapper = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.dark_purple};
  margin-bottom: 30px;
`;

const Line = styled.hr`
  height: 1px;
  width: 70%;
  background-color: ${({ theme }) => theme.light_purple};
`;

const SignInForm = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInputLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.dark_purple};
  width: 108px;
  text-align: right;
  margin-right: 15px;
`;

const StyledInput = styled.input`
  width: 330px;
  color: ${({ theme }) => theme.dark_purple};
  background-color: ${({ theme }) => theme.light_purple};
  padding: 10px;
  border: none;
  outline: none;

  &::placeholder {
    color: #3c3c3c;
  }
`;

const StyledLink = styled(Link)`
  width: 330px;
  height: 16px;
  color: ${({ theme }) => theme.dark_purple};
  background-color: ${({ theme }) => theme.light_purple};
  padding: 10px;
  text-decoration: none;
  font-size: 14px;
  border: none;
`;

const InfoText = styled.p`
  width: 310px;
  color: ${({ theme }) => theme.dark_purple};
  background-color: ${({ theme }) => theme.linen};
  font-size: 13px;
  line-height: 1.2rem;
  margin: 10px 0;
  margin-left: 125px;
  padding: 12px 15px;
  border-radius: 10px;
`;

const CheckMessage = styled.p`
  font-size: 14px;
  color: red;
  margin-bottom: 10px;
`;
