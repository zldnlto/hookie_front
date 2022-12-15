import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import emailValidAxios from '../../../api/emailValidAxios';

import Title from '../../../components/Title';
import FormInput from '../../../components/FormInput';
import Button from '../../../components/common/Button';
import { LARGE_BUTTON } from '../../../constants/buttonStyle';
import { signUpEmail, signUpPassword } from '../../../atoms/auth';

import leftIcon from '../../../assets/icon/icon-arrow-left.png';

const SContainer = styled.div`
  padding: 3.4rem;
  height: 100vh;
`;

const FormContainer = styled.form`
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

function SignUp() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/welcome');
  };

  const [signUpEmailValue, setSignUpEmailValue] = useRecoilState(signUpEmail);
  const [signUpPasswordValue, setSignUpPasswordValue] =
    useRecoilState(signUpPassword);
  const [checkPwValue, setCheckPwValue] = useState('');

  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [checkPwValid, setCheckPwValid] = useState(false);

  const [emailWarningMsg, setEmailWarningMsg] = useState('');
  const [pwWarningMsg, setPwWarningMsg] = useState('');
  const [checkPwWarningMsg, setCheckPwWarningMsg] = useState('');

  const [buttonNotAllow, setButtonNotAllow] = useState(true);
  const [isUser, setIsUser] = useState(false);

  const handleEmailValue = (e) => {
    setSignUpEmailValue(e.target.value);
  };
  const handlePwValue = (e) => {
    setSignUpPasswordValue(e.target.value);
  };
  const handleCheckPwValue = (e) => {
    setCheckPwValue(e.target.value);
  };

  useEffect(() => {
    const EMAIL_REGEX =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const PW_REGEX = /^[a-zA-Z0-9]{6,16}$/;

    if (EMAIL_REGEX.test(signUpEmailValue)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
      setEmailWarningMsg('* 이메일 형식이 올바르지 않습니다.');
    }

    if (PW_REGEX.test(signUpPasswordValue)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
      setPwWarningMsg('* 대,소문자, 숫자를 포함하여 6~16자 입력해주세요.');
    }

    if (signUpPasswordValue === checkPwValue) {
      setCheckPwValid(true);
    } else {
      setCheckPwValid(false);
      setCheckPwWarningMsg('* 비밀번호가 일치하지 않습니다.');
    }
  }, [signUpEmailValue, signUpPasswordValue, checkPwValue]);

  useEffect(() => {
    if (emailValid && passwordValid && checkPwValid) {
      return setButtonNotAllow(false);
    }
    return setButtonNotAllow(true);
  }, [emailValid, passwordValid, checkPwValid]);

  const handleJoinClick = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const res = await emailValidAxios.post('/emailvalid', {
          user: {
            email: signUpEmailValue,
          },
        });

        if (res.data.message === '이미 가입된 이메일 주소 입니다.') {
          setIsUser(true);
          setEmailValid(false);
          setEmailWarningMsg('* 이미 가입된 이메일 주소입니다.');
        }

        if (res.data.message === '사용 가능한 이메일 입니다.') {
          navigate('/profile');
        }
      } catch (error) {
        console.log(error);
      }
    },
    [buttonNotAllow]
  );

  return (
    <SContainer>
      <Title leftIcon={leftIcon} handleButtonClick={handleButtonClick}>
        이메일로 회원가입
      </Title>
      <FormContainer>
        <FormInput
          id="email"
          label="이메일"
          inputProps={{
            type: 'email',
            placeholder: '이메일 주소를 입력해주세요.',
          }}
          handleSignUpState={handleEmailValue}
          signUpValid={emailValid}
          inputValue={signUpEmailValue}
          warningMsg={emailWarningMsg}
        />
        <FormInput
          id="password"
          label="비밀번호"
          inputProps={{
            type: 'password',
            placeholder: '비밀번호를 입력해주세요.',
            autoComplete: 'off',
          }}
          handleSignUpState={handlePwValue}
          signUpValid={passwordValid}
          inputValue={signUpPasswordValue}
          warningMsg={pwWarningMsg}
        />
        <FormInput
          id="confirmPassword"
          label="비밀번호 확인"
          inputProps={{
            type: 'password',
            placeholder: '비밀번호를 한번 더 입력해주세요.',
            autoComplete: 'off',
          }}
          handleSignUpState={handleCheckPwValue}
          signUpValid={checkPwValid}
          inputValue={checkPwValue}
          warningMsg={checkPwWarningMsg}
        />
        <Button
          text="회원가입"
          buttonStyle={LARGE_BUTTON}
          disabled={buttonNotAllow}
          onClick={handleJoinClick}
        />
      </FormContainer>
    </SContainer>
  );
}

export default SignUp;