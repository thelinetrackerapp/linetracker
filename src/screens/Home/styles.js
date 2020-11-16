import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingTop: 50,
  },
  middle: {
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#00B900',
    borderRadius: 2,
    margin: 20,
  },
  progress: {
    alignSelf: 'center',
    marginTop: 20,
  },
  progressText: {
    fontSize: 22,
  },
  loadingText: {
    alignSelf: 'center',
    marginTop: 20,
  },
  list: {
    marginTop: 30,
    marginBottom: 100,
  },
  listTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  btnCheckList: {
    marginRight: -10,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export default styles;
