import React, { useState, useEffect } from 'react';
import { View, Button as RNButton, Alert, ScrollView, RefreshControl, Text } from 'react-native';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import { BlurView } from '@react-native-community/blur';
import * as RNIap from 'react-native-iap';

import styles from './styles';
import { useUserContext } from '../../hooks/useUser';
import Profile from '../../components/Profile';
import UserItem from '../../components/UserItem';

const productIds = [];

const Comp = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isBlockedFriendsVisible, setIsBlockedFriendsVisible] = useState(false);
  const [isStartBtnVisible, setIsStartBtnVisible] = useState(true);
  const {
    user,
    isAuthenticated,
    progress,
    friends,
    blockedFriends,
    logout,
    checkAuthentication,
    fetchProfileInfo,
    fetchFriends,
    fetchBlockedFriends,
  } = useUserContext();
  useEffect(() => {
    return navigation.addListener('focus', () => {
      checkAuthentication();
    });
  }, [navigation]);
  useEffect(() => {
    if (isAuthenticated) {
      navigation.setOptions({
        headerRight: () => <RNButton color="#fff" onPress={onLogout({ logout })} title="登出" />,
      });
    } else {
      navigation.setOptions({
        headerRight: null,
      });
    }
  }, [isAuthenticated]);
  useEffect(() => {
    RNIap.initConnection()
      .then(() => {
        return RNIap.getProducts(productIds);
      })
      .then(() => {
        return RNIap.getAvailablePurchases().then((purchases) => {
          for (const purchase of purchases) {
            onPurchase({ setIsBlockedFriendsVisible })(purchase);
          }
        });
      })
      .catch(console.log);
    const subscription = RNIap.purchaseUpdatedListener(
      onPurchase({ setIsBlockedFriendsVisible, shouldFinish: true }),
    );
    return () => {
      subscription.remove();
    };
  }, []);
  if (!user) {
    return (
      <View style={[styles.container, styles.middle]}>
        <Button
          buttonStyle={styles.btn}
          title="以 Line 身份登入"
          onPress={onLogin({ navigation })}
        />
      </View>
    );
  }
  const isFetching = progress.size < friends.length;
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh({ checkAuthentication, setRefreshing })}
          />
        }
      >
        <Profile user={user} friends={friends} blockedFriends={blockedFriends} />
        {isFetching && (
          <View style={styles.progress}>
            <Progress.Bar
              size={120}
              progress={progress.size / friends.length}
              showsText
              formatText={() => `${progress.size} / ${friends.length}`}
              textStyle={styles.progressText}
            />
            <Text style={styles.loadingText}>
              已分析 ( {`${progress.size} / ${friends.length}`} ) ...
            </Text>
          </View>
        )}
        {isStartBtnVisible && (
          <Button
            style={styles.btn}
            title="開始分析"
            onPress={onStart({
              fetchProfileInfo,
              fetchFriends,
              fetchBlockedFriends,
              setIsStartBtnVisible,
            })}
          />
        )}
        <View style={styles.list}>
          <View style={styles.listTitleWrapper}>
            <Text style={styles.listTitle}>
              封鎖清單 {blockedFriends.length > 0 ? `( ${blockedFriends.length} )` : ''}
            </Text>
            {!isBlockedFriendsVisible && (
              <Button
                type="clear"
                title="查看清單"
                style={styles.btnCheckList}
                onPress={onToggleBlockedFriendsVisible({
                  isBlockedFriendsVisible,
                  setIsBlockedFriendsVisible,
                })}
              />
            )}
          </View>
          <View style={styles.listContent}>
            {blockedFriends.map((item) => {
              return <UserItem key={item.midCrypted} {...item} />;
            })}
            {!isBlockedFriendsVisible && (
              <BlurView
                style={styles.absolute}
                blurType="light"
                blurAmount={3}
                reducedTransparencyFallbackColor="white"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Comp;

function onPurchase({ setIsBlockedFriendsVisible, shouldFinish }) {
  return (purchase) => {
    if (purchase.productId === productIds[0]) {
      setIsBlockedFriendsVisible(true);
      if (shouldFinish) {
        RNIap.finishTransaction(purchase, false);
      }
    }
  };
}

function onStart({ fetchProfileInfo, fetchFriends, fetchBlockedFriends, setIsStartBtnVisible }) {
  return async () => {
    setIsStartBtnVisible(false);
    await fetchProfileInfo();
    await fetchFriends().then(fetchBlockedFriends);
  };
}

function onToggleBlockedFriendsVisible({ isBlockedFriendsVisible, setIsBlockedFriendsVisible }) {
  return () => {
    if (isBlockedFriendsVisible) {
      return;
    }
    Alert.alert('購買查看清單功能', '您即將使用新台幣 100 元以查看完整的封鎖清單。', [
      {
        text: '確認',
        onPress: () => {
          RNIap.requestPurchase(productIds[0], false).catch(console.log);
        },
      },
      { text: '取消', onPress: () => {} },
    ]);
  };
}

function onRefresh({ checkAuthentication, setRefreshing }) {
  return async () => {
    setRefreshing(true);
    checkAuthentication();
    setRefreshing(false);
  };
}

function onLogin({ navigation }) {
  return () => {
    navigation.navigate('Login');
  };
}

function onLogout({ logout }) {
  return () => {
    Alert.alert('登出', '', [
      { text: '確認', onPress: () => logout() },
      { text: '取消', onPress: () => {} },
    ]);
  };
}
