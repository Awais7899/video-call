import React, {useContext, useEffect, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Alert} from 'react-native';
import {width, totalSize} from 'react-native-dimension';
import {RadioButton} from 'react-native-paper';
import VideoContext from '../store/VideoContext';
import netInfo from '@react-native-community/netinfo';

import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../store/AuthProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native';

export function Users() {
  const {
    name,
    call,
    callAccepted,
    callEnded,
    mySocketIdRef,
    setOtherUser,
    onlineUsers,
    setCall,
    calling,
    setCalling,
    setCallEnded,
    maxDuration,
    setMaxDuration,
    setMaxCallTime,
    callTo,
    maxCallTimeRef,
    maxDurationRef,
    setOtherUserName,
    checkAudioVideoPermissions,
    setCallTime,
    setAmount,
    stream,
    otherUserSocketIdRef,
    callRef,
    socketRef,
    setCd,
    setRefreshing,
    refreshing,
  } = useContext(VideoContext);

  const {logout} = useContext(AuthContext);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    netInfo.fetch().then(state => {
      if (state.isConnected) {
        socketRef.current.emit('refreshOnlineUsers');
      } else {
        setRefreshing(false);
        Alert.alert(
          'Internet Connection!',
          'Please check your internet Connection.',
        );
      }
    });
  }, []);

  useEffect(() => {
    checkAudioVideoPermissions();
  }, []);

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      console.log('incoming call from', call.from);
      setOtherUser(call.from);
    }
  }, [call]);

  let display =
    (callAccepted && !callEnded) || calling
      ? {display: 'none'}
      : {justifyContent: 'space-between'};
  let d2 =
    (callAccepted && !callEnded) || calling
      ? {display: 'none'}
      : {display: 'flex'};

  const renderUser = user => {
    if (user.socketId !== mySocketIdRef.current) {
      console.log('user', user);
      return (
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 6,
            },
            display,
          ]}>
          <Text
            style={{
              fontSize: 14,
              color: '#656464',
              fontWeight: '500',
              marginLeft: 12,
            }}>
            {user.name}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (!stream) {
                Alert.alert(
                  'Permissions',
                  "You don't have system audio and video Permissions.",
                  [{text: 'OK'}],
                );
                return;
              }
              setOtherUserName(user.name);
              callTo(user.socketId, user.id);
              setCallEnded(false);
              setCalling(true);
              otherUserSocketIdRef.current = user.socketId;
              setCallTime('00:00');
              setAmount(0);
              let call = {
                isReceivingCall: false,
                fromUuid: '',
                from: '',
                name: '',
                signal: '',
                maxDuration: '',
                maxCallTime: '',
              };
              setCall(call);
              callRef.current = call;
              setCd('');
            }}>
            <LinearGradient
              style={{
                paddingVertical: 8,
                borderRadius: 30,
                flexDirection: 'row',
                justifyContent: 'space-around',
                zIndex: 1,
                width: 75,
              }}
              colors={['#048702', '#02b100']}>
              <AntDesign name="phone" size={16} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
      <LinearGradient
        style={[styles.optionsContainer, d2]}
        colors={['#02b100', '#048702']}>
        <View style={styles.viewContainer}>
          <Text style={styles.textContainer}>{name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            logout();
          }}>
          <View
            style={{
              margin: 8,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            <Text style={{padding: 8, color: '#000', textAlign: 'center'}}>
              LogOut
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginVertical: 16,
            backgroundColor: 'white',
            marginHorizontal: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 4,
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}>
            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="1 min"
                status={maxDuration === '0:30' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setMaxDuration('0:30');
                  setMaxCallTime('1 minute');
                  maxDurationRef.current = '0:30';
                  maxCallTimeRef.current = '1 minute';
                }}
                color="#02b100"
                uncheckedColor="#02b100"
              />
              <Text
                style={{
                  fontSize: totalSize(1.5),
                  marginTop: 9,
                  color: '#656464',
                  fontWeight: '500',
                }}>
                1 Minute
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="5 min"
                status={maxDuration === '4:30' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setMaxDuration('4:30');
                  setMaxCallTime('5 minutes');
                  maxDurationRef.current = '4:30';
                  maxCallTimeRef.current = '5 minutes';
                }}
                color="#02b100"
                uncheckedColor="#02b100"
              />
              <Text
                style={{
                  fontSize: totalSize(1.5),
                  marginTop: 9,
                  color: '#656464',
                  fontWeight: '500',
                }}>
                5 Minutes
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <RadioButton
                value="1 hour"
                status={maxDuration === '59:30' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setMaxDuration('59:30');
                  setMaxCallTime('1 hour');
                  maxDurationRef.current = '59:30';
                  maxCallTimeRef.current = '1 hour';
                }}
                color="#02b100"
                uncheckedColor="#02b100"
              />
              <Text
                style={{
                  fontSize: totalSize(1.5),
                  marginTop: 9,
                  color: '#656464',
                  fontWeight: '500',
                }}>
                1 Hour
              </Text>
            </View>
          </View>
          <View
            style={{
              marginVertical: 12,
            }}>
            <View
              style={{
                paddingHorizontal: 12,
              }}>
              <FlatList
                data={onlineUsers}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => renderUser(item, index)}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    margin: 12,
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textContainer: {
    fontSize: 18,
    color: '#000',
  },
  optionsContainer: {
    flex: 1,
  },
  labelContainer: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    marginStart: 10,
    zIndex: 1,
    shadowColor: '#FFFFFF',
    position: 'absolute',
    top: -8,
    left: 15,
    borderRadius: 30,
    paddingHorizontal: 4,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: '#9E9C9C',
    borderRadius: 10,
    padding: 2,
  },
  icon1: {
    position: 'absolute',
    right: 10,
    marginTop: 16,
    color: '#D9D9D9',
  },
  icon: {
    position: 'absolute',
    right: 10,
    marginTop: 16,
    color: '#9E9C9C',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    width: width(75),
    marginTop: 40,
    marginVertical: 180,
  },
});
