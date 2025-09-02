// toastConfig.js
import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 13,
        color: 'green',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red' }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 13,
        color: 'red',
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#3B82F6' }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: '#1E40AF',
      }}
      text2Style={{
        fontSize: 13,
        color: '#1E40AF',
      }}
    />
  ),
  warning: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#F59E0B' }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: '#92400E',
      }}
      text2Style={{
        fontSize: 13,
        color: '#92400E',
      }}
    />
  ),
};

export default toastConfig;



