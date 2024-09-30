import React, {useContext, useEffect, useState} from 'react';
const VideoState = React.lazy(() => import('../store/VideoState'));
import {View, StyleSheet, Modal, Text, Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../store/AuthProvider';
import {apiCall} from '../api';
import {Users, VideoCall} from '.';

export function Home() {
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [title, setTitle] = useState('Loading...');
  const [description, setDescription] = useState('Loading...');

  const {userdata} = useContext(AuthContext);

  async function allPermissionsAreEnabled() {
    let micPerm, camPerm, notiPerm;
    if (Platform.OS === 'android') {
      try {
        const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
        if (cameraPermission === 'granted') {
          camPerm = true;
        } else {
          camPerm = false;
        }
      } catch (error) {
        camPerm = false;
        console.log('Camera Permission error:', error);
      }
      try {
        const micPermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (micPermission === 'granted') {
          micPerm = true;
        } else {
          micPerm = false;
        }
      } catch (error) {
        micPerm = false;
        console.log('Microphone Permission error:', error);
      }
      try {
        if (parseInt(Platform.constants['Release']) >= 13) {
          await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(result => {
            if (result === 'granted') {
              notiPerm = true;
            } else {
              notiPerm = false;
            }
          });

          await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT).then(result => {
            if (result === 'granted') {
              notiPerm = true;
            } else {
              notiPerm = false;
            }
          });
        } else {
          notiPerm = true;
        }
      } catch (error) {
        notiPerm = false;
      }
    } else if (Platform.OS === 'ios') {
      try {
        const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
        if (cameraPermission === 'granted') {
          camPerm = true;
        } else {
          camPerm = false;
        }
      } catch (error) {
        camPerm = false;
        console.log('Camera Permission error:', error);
      }
      try {
        const micPermission = await request(PERMISSIONS.IOS.MICROPHONE);
        if (micPermission === 'granted') {
          micPerm = true;
        } else {
          micPerm = false;
        }
      } catch (error) {
        micPerm = false;
        console.log('Microphone Permission error:', error);
      }
    }
    return micPerm && camPerm && notiPerm ? true : false;
  }

  async function checkingValidations() {
    const permissionsEnabled = await allPermissionsAreEnabled();
    if (permissionsEnabled) {
      setPermissionsChecked(permissionsEnabled);
    } else {
      setTitle('Permissions required');

      if (Platform.OS == 'android') {
        setDescription(
          'All permissions are required e.g microphone, camera and storage. To enable the required permissions restart the Help So Easy app.',
        );
      } else if (Platform.OS === 'ios') {
        setDescription(
          'All permissions are required e.g microphone, camera. To enable the required permissions go to settings.',
        );
      }
    }
  }

  const saveTokenToServer = async fcm_token => {
    const data = {
      user_id: userdata.id,
      fcm_token: fcm_token,
      time_stamp: new Date(),
    };
    let token = await AsyncStorage.getItem('authToken');
    apiCall
      .post('/fcm-token/token', data, {
        Authorization: `Bearer ${token}`,
      })
      .then(data => {
        if (data.success) AsyncStorage.setItem('fcm_token', fcm_token);
      })
      .catch(e => {
        console.warn('error', e);
      });
  };

  async function getToken() {
    const storedFcmToken = await AsyncStorage.getItem('fcm_token');
    if (storedFcmToken == null) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        saveTokenToServer(fcmToken);
      } else {
        console.log('Failed to get FCM token');
      }
    }
  }
  useEffect(() => {
    checkingValidations();
  }, []);

  useEffect(() => {
    if (Object.keys(userdata).length > 0) {
      getToken();
    }
    return messaging().onTokenRefresh(token => saveTokenToServer(token));
  }, [userdata]);

  return (
    <>
      {permissionsChecked ? (
        <VideoState>
          <View style={styles.app}>
            <VideoCall />
            <Users />
          </View>
        </VideoState>
      ) : (
        <Modal
          animationType="fade"
          transparent={true}
          visible={true}
          style={styles.app}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  fontWeight: '700',
                  padding: 12,
                  color: '#000',
                }}>
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  width: wp('80%'),
                  textAlign: 'center',
                  lineHeight: 18,
                  marginVertical: 20,
                  color: '#000000',
                }}>
                {description}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  app: {
    width: wp('100%'),
    height: hp('100%'),
    flex: 1,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
    width: wp('90%'),
  },
});
