import React from 'react';
import styled from 'styled-components';
import {
  List,
  InputItem,
  WingBlank,
  WhiteSpace,
  Button,
  Picker,
  Checkbox,
  Flex,
  Card,
  Toast,
} from 'antd-mobile';
import AV from 'leancloud-storage';

import useForm from '../../hooks/useForm';
import SuccessModal from './success-modal';

const { AgreeItem } = Checkbox;

const AGES = [
  ...Array.from({ length: 7 }).map((_, index) => {
    const age = 6 + index;
    return { value: age, label: `${age} 岁` };
  }),
  {
    value: '> 12',
    label: '12 岁以上',
  },
];

const Root = styled.div``;

const TitleContainer = styled.div`
  padding: 0 16px;
  margin: 27px 0 15px;
`;

const Title = styled.h1`
  color: rgba(0, 0, 0, 0.75);
  font-size: 21px;
  font-weight: 400;
  text-align: left;
`;

const VerifyCodeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const VerifyButton = styled(Button)`
  margin-left: 2em;
  margin-right: 15px;
  flex-shrink: 0;
`;

const Logo = styled.div``;

const Footer = styled(Card)`
  && {
    margin-top: 100px;
    bottom: 0;
    background-color: #108ee9;
  }
`;

const FooterBody = styled(Card.Body)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
  }
`;

const FooterTextContainer = styled.div``;

const FooterText = styled.div`
  line-height: 1.5;
`;

const FooterQrcodeContainer = styled.div`
  text-align: center;
  margin-left: 1em;
`;

const FooterQrcode = styled.img`
  width: 80px;
  height: 80px;
`;

const FooterQrcodeText = styled.div`
  font-size: 10px;
  font-size: 12px;
`;

const rules = {
  phone: {
    validate: v => {
      return typeof v === 'string' && /^\d{3}\s\d{4}\s\d{4}$/.test(v);
    },
  },
  verifyCode: {
    validate: v => {
      return typeof v === 'string' && /^\d{6}$/.test(v);
    },
  },
  ages: {
    default: [],
    validate: ([age]) => {
      return typeof age !== 'undefined';
    },
  },
};

console.log(AV);

export default function SignUp() {
  const [state, { getFieldProps, validate }] = useForm(rules);
  const [successModalVisible, setSuccessModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <Root>
      <WingBlank>
        <Title>免费试听</Title>
      </WingBlank>

      <WhiteSpace />

      <List>
        <InputItem type="phone" {...getFieldProps('phone')}>
          手机号
        </InputItem>

        <VerifyCodeContainer>
          <InputItem type="tel" maxLength={6} {...getFieldProps('verifyCode')}>
            验证码
          </InputItem>

          <VerifyButton
            inline={false}
            size="small"
            type="primary"
            onClick={handleSendVerifyCode}
          >
            发送验证码
          </VerifyButton>
        </VerifyCodeContainer>

        <Picker cols={1} data={AGES} {...getFieldProps('ages')}>
          <List.Item arrow="horizontal">请选择孩子年龄</List.Item>
        </Picker>
      </List>

      <WhiteSpace />

      <Flex>
        <Flex.Item>
          <AgreeItem data-seed="logId">
            我已阅读并同意《Ekercodee 用户注册协议》
          </AgreeItem>
        </Flex.Item>
      </Flex>

      <WhiteSpace />

      <WingBlank>
        <Button type="primary" loading={loading} onClick={handleSignUp}>
          免费试听
        </Button>
      </WingBlank>

      <WhiteSpace />

      <Footer>
        <FooterBody>
          <FooterTextContainer>
            <FooterText>编程改变孩子未来</FooterText>

            <FooterText>客服电话：xxx-xxx-xxxx</FooterText>

            <FooterText>联系邮箱：hello@ekercode.com</FooterText>
          </FooterTextContainer>

          <FooterQrcodeContainer>
            <FooterQrcode />
            <FooterQrcodeText>Ekercode 订阅号</FooterQrcodeText>
          </FooterQrcodeContainer>
        </FooterBody>
      </Footer>

      <SuccessModal
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
        }}
      />
    </Root>
  );

  async function handleSignUp() {
    const errors = validate();
    if (errors) {
      Toast.fail('表单输入有误，请重新输入');
      return;
    }

    const [age] = state.ages.value;
    const phone = state.phone.value;
    const verifyCode = state.verifyCode.value;

    setLoading(true);

    let ip;
    try {
      const response = await fetch('https://ipapi.co/json');
      const data = await response.json();
      console.log(data);

      ip = data.ip;
    } catch (error) {
      console.error(error);
    }

    try {
      await AV.User.signUpOrlogInWithMobilePhone(phone, verifyCode, {
        childrenAge: age,
        ip,
      });
    } catch (error) {
      console.error(error);
      Toast.fail(`注册失败：${error.rawMessage}`);
      return;
    } finally {
      setLoading(false);
    }

    setSuccessModalVisible(true);
  }

  async function handleSendVerifyCode() {
    const errors = validate(['phone']);
    if (errors) {
      Toast.fail(`请先填写手机号码`);
      return;
    }
    console.log(errors);

    try {
      await AV.Cloud.requestSmsCode(state.phone.value);
    } catch (error) {
      console.error(error);
      Toast.fail(`发送验证码失败：${error.rawMessage}`);
      return;
    }
  }
}
