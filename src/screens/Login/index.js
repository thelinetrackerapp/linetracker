import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './styles';
import { useUserContext } from '../../hooks/useUser';
import createTimeout from '../../functions/createTimeout';

// prettier-ignore
const LOGIN_URL = 'https://access.line.me/oauth2/v2.1/login?loginState=bC1oEFLkp2ikF7p4tFX8po&loginChannelId=1376922440&returnUri=%2Foauth2%2Fv2.1%2Fauthorize%2Fconsent%3Fscope%3Dprofile%2Bfriends%2Bmessage.write%2Badd_own_official_accounts%26response_type%3Dcode%26state%3DwKLlSJzanV%26redirect_uri%3Dhttps%253A%252F%252Fstore.line.me%252FloginResult%253Ffid%253D2f%26client_id%3D1376922440';

const Comp = ({ navigation }) => {
  const { checkAuthentication } = useUserContext();
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: LOGIN_URL }}
        onLoadStart={onLoadStart({ navigation, checkAuthentication })}
        sharedCookiesEnabled
        cacheMode="LOAD_NO_CACHE"
      />
    </SafeAreaView>
  );
};

export default Comp;

function onLoadStart({ navigation, checkAuthentication }) {
  return async (e) => {
    const { url } = e.nativeEvent;
    const isAuthenticated =
      url.startsWith('https://store.line.me/loginResult') && url.indexOf('&ssoReturnUri=') >= 0;
    if (isAuthenticated) {
      await checkAuthentication();
      navigation.pop();
    }
  };
}
