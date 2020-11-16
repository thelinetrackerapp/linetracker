import React from 'react';
import { View, Image, Text } from 'react-native';

import styles from './styles';
import Value from '../Value';

const Comp = ({ user, friends, blockedFriends }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profilePicWrapper}>
        <Image style={styles.profilePic} source={{ uri: user.profilePic }} />
        <Text style={styles.name}>{user.name}</Text>
      </View>
      <View style={styles.values}>
        <Value value={friends.length} title="好友數" />
        <Value value={blockedFriends.length} title="封鎖數" />
      </View>
    </View>
  );
};

export default Comp;
