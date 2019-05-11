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

import Trial from '@/models/trial';
import useForm from '@/hooks/useForm';

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

const InputItemVerifyCode = styled(InputItem)`
  flex: 1;
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
  mobile: {
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
        <InputItem type="phone" {...getFieldProps('mobile')}>
          手机号
        </InputItem>

        <VerifyCodeContainer>
          <InputItemVerifyCode
            type="tel"
            maxLength={6}
            {...getFieldProps('verifyCode')}
          >
            验证码
          </InputItemVerifyCode>

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
    // antd 处理过的手机输入是带有空字符的
    const mobile = state.mobile.value.replace(/\s/g, '');
    const verifyCode = state.verifyCode.value;

    setLoading(true);

    let ip;
    try {
      const response = await fetch('https://ipapi.co/json');
      const data = await response.json();
      ip = data.ip;
    } catch (error) {
      console.error(error);
    }

    try {
      await AV.Cloud.verifySmsCode(verifyCode, mobile);
    } catch (error) {
      console.error(error);
      Toast.fail(`验证短信验证码失败：${error.rawMessage}`);
      setLoading(false);
      return;
    }

    const trial = new Trial();
    trial.set('mobile', mobile);
    trial.set('ip', ip);
    trial.set('kidAge', age);

    try {
      await trial.save();
    } catch (error) {
      console.error(error);
      Toast.fail(`申请试用失败：${error.rawMessage}，请重试~`);
      return;
    } finally {
      setLoading(false);
    }

    setSuccessModalVisible(true);
  }

  async function handleSendVerifyCode() {
    const errors = validate(['mobile']);
    if (errors) {
      console.log(errors);
      Toast.fail(`请先填写手机号码`);
      return;
    }

    try {
      await AV.Cloud.requestSmsCode(state.mobile.value);
      Toast.success(`发送手机验证码成功，请注意查收`);
    } catch (error) {
      console.error(error);
      Toast.fail(`发送验证码失败：${error.rawMessage}`);
      return;
    }
  }
}
