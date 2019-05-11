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
} from 'antd-mobile';

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

export default function SignUp() {
  const [phone, setPhone] = React.useState();
  const [verifyCode, setVerifyCode] = React.useState();
  const [ages, setAges] = React.useState([]);
  const [successModalVisible, setSuccessModalVisible] = React.useState(false);

  return (
    <Root>
      <WingBlank>
        <Title>免费试听</Title>
      </WingBlank>

      <WhiteSpace />

      <List>
        <InputItem
          type="phone"
          value={phone}
          onChange={v => {
            setPhone(v);
          }}
        >
          手机号
        </InputItem>

        <VerifyCodeContainer>
          <InputItem
            type="digit"
            value={verifyCode}
            onChange={v => {
              setVerifyCode(v);
            }}
          >
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

        <Picker
          cols={1}
          data={AGES}
          value={ages}
          onChange={v => {
            setAges(v);
          }}
        >
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
        <Button type="primary" onClick={handleSignUp}>
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

  function handleSignUp() {
    const [age] = ages;

    console.log({ phone, verifyCode, age });

    setSuccessModalVisible(true);
  }

  function handleSendVerifyCode() {}
}
