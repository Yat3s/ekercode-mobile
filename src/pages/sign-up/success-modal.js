import React from 'react';
import { Modal } from 'antd-mobile';
import styled from 'styled-components';

const Body = styled.div`
  height: 100px;
  overflow: auto;
`;

export default function SuccessModal({ onClose, ...props }) {
  const handleWrapTouchStart = React.useCallback(e => {
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }

    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  });

  return (
    <Modal
      transparent
      maskClosable={false}
      title="申请成功"
      footer={[
        {
          text: '确定',
          onPress: () => {
            if (onClose) {
              onClose();
            }
          },
        },
      ]}
      wrapProps={{ onTouchStart: handleWrapTouchStart }}
      {...props}
    >
      <Body>
        您的免费试听申请已经成功提交，我们的课程顾问会及时跟您联系安排试听，请保持手机畅通。
      </Body>
    </Modal>
  );
}

function closest(el, selector) {
  const matchesSelector =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
