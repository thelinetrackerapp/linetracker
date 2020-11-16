import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

const Comp = ({ value, title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Comp;
