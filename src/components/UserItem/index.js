import React from 'react';
import { View, Text, Image } from 'react-native';

import styles from './styles';

const Comp = ({ name, imageUrl }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.profilePic} source={{ uri: imageUrl }} />
      <Text>{name}</Text>
    </View>
  );
};

export default Comp;
