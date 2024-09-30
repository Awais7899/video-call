import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext} from '../store/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from 'react-native';
import {width, height, totalSize} from 'react-native-dimension';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BASE_URL} from '@env';

export function Signupscreen({navigation}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticationError, setAuthenticationError] = useState('');
  const {authenticate, fetchUserData} = useContext(AuthContext);

  const inputHandler = (inputType, enteredValue) => {
    switch (inputType) {
      case 'email':
        setEmail(enteredValue);
        break;
      case 'firstName':
        setFirstName(enteredValue);
        break;
      case 'lastName':
        setLastName(enteredValue);
        break;
      case 'password':
        setPassword(enteredValue);
        break;
    }
  };

  function signUp() {
    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    apiCall
      .post('/auth/sign-up', data)
      .then(data => {
        if (data.success) {
          authenticate(data.data.accessToken);
          fetchUserData(data.data.user);
        } else {
          setAuthenticationError(data.message);
        }
      })
      .catch(e => {
        console.warn('error', e);
      });
  }

  return (
    <ScrollView>
      <View style={styles.textWrapper}>
        <ImageBackground
          source={require('../assets/Path03.png')}
          style={styles.backgroundImage}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: Platform.OS == 'android' ? 25 : 55,
              marginLeft: Platform.OS == 'android' ? 10 : 20,
            }}>
            <TouchableOpacity style={{marginLeft: 10}}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={23}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: totalSize(4),
                  fontWeight: '600',
                  marginLeft: 10,
                  letterSpacing: 2,
                }}>
                Sign up
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            marginTop: 20,
          }}>
          <View style={{width: width(90)}}>
            <View style={styles.labelContainer}>
              <Text
                style={{
                  fontSize: totalSize(1.7),
                  fontWeight: '500',
                  letterSpacing: 1,
                  color: '#4A4A4A',
                }}>
                Email address
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Please enter email"
                onChangeText={inputHandler.bind(this, 'email')}
                value={email}
                style={{
                  paddingHorizontal: 26,
                  fontSize: totalSize(1.8),
                  color: '#202020',
                }}
                placeholderTextColor={'#D9D9D9'}
              />
              <MaterialCommunityIcons
                style={styles.icon1}
                name="lead-pencil"
                size={20}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            marginTop: 20,
          }}>
          <View style={{width: width(90)}}>
            <View style={styles.labelContainer}>
              <Text
                style={{
                  fontSize: totalSize(1.7),
                  fontWeight: '500',
                  letterSpacing: 1,
                  color: '#4A4A4A',
                }}>
                First Name
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Please enter first name"
                onChangeText={inputHandler.bind(this, 'firstName')}
                value={firstName}
                style={{
                  paddingHorizontal: 26,
                  fontSize: totalSize(1.8),
                  color: '#202020',
                }}
                placeholderTextColor="#D9D9D9"
              />
              <MaterialCommunityIcons
                style={styles.icon}
                name="eye-off"
                size={20}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            marginTop: 16,
          }}>
          <View style={{width: width(90)}}>
            <View style={styles.labelContainer}>
              <Text
                style={{
                  fontSize: totalSize(1.7),
                  fontWeight: '500',
                  letterSpacing: 1,
                  color: '#4A4A4A',
                }}>
                Last Name
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Please enter full name"
                onChangeText={inputHandler.bind(this, 'lastName')}
                value={lastName}
                style={{
                  paddingHorizontal: 26,
                  fontSize: totalSize(1.8),
                  color: '#202020',
                }}
                placeholderTextColor="#D9D9D9"
              />
              <MaterialCommunityIcons
                style={styles.icon}
                name="eye-off"
                size={20}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            marginTop: 16,
          }}>
          <View style={{width: width(90)}}>
            <View style={styles.labelContainer}>
              <Text
                style={{
                  fontSize: totalSize(1.7),
                  fontWeight: '500',
                  letterSpacing: 1,
                  color: '#4A4A4A',
                }}>
                Password
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="********"
                maxLength={8}
                style={{
                  paddingHorizontal: 26,
                  fontSize: totalSize(1.8),
                  color: '#202020',
                }}
                placeholderTextColor={'#D9D9D9'}
                onChangeText={inputHandler.bind(this, 'password')}
                value={password}
              />
              <MaterialCommunityIcons
                style={styles.icon}
                name="eye-off"
                size={20}
              />
            </View>
          </View>
        </View>
        {authenticationError && (
          <View style={{paddingHorizontal: 18, marginVertical: 6}}>
            <Text style={{color: 'red', fontSize: 12}}>
              {authenticationError}
            </Text>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            margin: 40,
          }}>
          <TouchableOpacity
            onPress={() => {
              signUp();
            }}>
            <LinearGradient
              style={{
                paddingVertical: 12,
                paddingHorizontal: 80,
                borderRadius: 30,
              }}
              colors={['#96959A', '#96959A']}>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'center',
                  fontSize: totalSize(2.4),
                  letterSpacing: 1.5,
                }}>
                Sign up
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            textAlign: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: totalSize(1.7),
              color: '#202020',
              textAlign: 'center',
            }}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}>
            <Text
              style={{
                fontSize: totalSize(1.7),
                color: '#0FE90D',
                marginLeft: 10,
              }}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textWrapper: {
    flex: 1,
    height: height(100),
    width: width(100),
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    width: width(100),
    height: height(34),
    marginVertical: -11,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
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
    padding: Platform.OS == 'ios' ? 16 : 2,
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
});
