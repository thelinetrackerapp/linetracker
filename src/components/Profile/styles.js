import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 20,
  },
  profilePicWrapper: {
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  values: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default styles;
