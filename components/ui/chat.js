import {useState, useContext, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import VideoContext from '../../store/VideoContext';

export const ChatView = () => {
  const [sendMsg, setSendMsg] = useState('');

  const scrollViewRef = useRef();
  const {
    socketRef,
    sendMsg: sendMsgFunc,
    chat,
    setChat,
    setIsShown,
    isShown,
    chatRef,
  } = useContext(VideoContext);

  useEffect(() => {
    socketRef.current.off('msgRcv');
    socketRef.current.on(
      'msgRcv',
      ({replaceIndex, msg: value, sender, file, fileUrl, fileType}) => {
        let msg = {};
        msg.msg = value;
        msg.file = file;
        msg.fileUrl = fileUrl;
        msg.fileType = fileType;
        msg.type = 'rcv';
        msg.sender = sender;
        msg.timestamp = Date.now();
        if (replaceIndex >= 0) {
          chatRef.current[replaceIndex] = msg;
        } else {
          chatRef.current = [...chatRef.current, msg];
        }
        console.log('value', value);
        setChat(chatRef.current);
        setIsShown(true);
      },
    );
  }, [chat]);

  const MsgSubmit = value => {
    if (value !== null && value !== '') sendMsgFunc(value);
    setSendMsg('');
  };

  const getImageDimensionsForURL = imageUrl => {
    if (!imageDimensions[imageUrl]) {
      Image.getSize(imageUrl, (width, height) => {
        setImageDimensions(prevDimensions => ({
          ...prevDimensions,
          [imageUrl]: {width, height},
        }));
      });
    }
  };


  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={isShown}>
        <View style={styles.Viewboder}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 12,
                borderBottomColor: '#BBB',
                borderBottomWidth: 1,
              }}>
              <Text
                style={{
                  color: '#202124',
                  fontSize: 14,
                }}>
                Help So Easy Chat
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setIsShown(!isShown);
                  }}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={'#000'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={{marginHorizontal: 12}}>
            <Text style={{color: '#000'}}>
              Images will be automatically saved.
            </Text>
          </View> */}
          </View>

          <View
            style={{
              width: '100%',
              height: Platform.OS === 'android' ? '81%' : '90%',
              position: 'absolute',

              bottom: '3%',
            }}>
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({animated: true})
              }>
              <View style={styles.msgFlex}>
                {chat.map((msg, index) => {
                  if (msg.file && msg.fileType === 'image') {
                    getImageDimensionsForURL(msg.fileUrl);
                  }
                  return (
                    <View
                      key={index}
                      style={[
                        styles.msgContainer,
                        msg.type === 'sent' ? styles.msgSent : styles.msgRcv,
                      ]}>
                      {msg.file ? (
                        // <Pressable
                        //   onPress={() => {
                        //     Linking.openURL(msg.fileUrl);
                        //   }}>
                        <View>
                          {msg.fileType === 'image' ? (
                            <>
                              <Image
                                resizeMode="cover"
                                source={{uri: msg.fileUrl}}
                                style={{
                                  width:
                                    imageDimensions[msg.fileUrl]?.width >= 200
                                      ? wp('60%')
                                      : imageDimensions[msg.fileUrl]?.width,
                                  height:
                                    imageDimensions[msg.fileUrl]?.height >= 200
                                      ? hp('70%')
                                      : imageDimensions[msg.fileUrl]?.height,
                                  borderRadius: 4,
                                }}
                              />
                            </>
                          ) : (
                            <Text
                              style={
                                msg.type === 'sent'
                                  ? styles.msgSentText
                                  : styles.msgRcvText
                              }>
                              {msg.msg}
                            </Text>
                          )}
                        </View>
                      ) : (
                        // </Pressable>
                        <Text
                          style={
                            msg.type === 'sent'
                              ? styles.msgSentText
                              : styles.msgRcvText
                          }>
                          {msg.msg}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={180}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                  paddingVertical: Platform.OS === 'ios' ? 8 : 0,
                  marginHorizontal: 4,
                  borderRadius: 12,
                  borderColor: '#bbb',
                  borderWidth: 1,
                  width: '98%',
                  backgroundColor: '#fff',
                }}>
                <TextInput
                  placeholder="Send a message to everyone"
                  onChangeText={e => setSendMsg(e)}
                  value={sendMsg}
                  color={'#000'}
                  width="80%"
                />
                <View
                  style={{
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      MsgSubmit(sendMsg);
                    }}>
                    <FontAwesome name="send" size={22} color={'#000'} />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'relative',
  },
  Viewboder: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'space-between',
    top: Platform.OS === 'android' ? '23%' : '14%',
    width: '100%',
    height: Platform.OS === 'android' ? '72%' : '82%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  msgFlex: {
    alignItems: 'flex-start',
    marginVertical: '4%',
  },
  msgContainer: {
    borderRadius: 14,
    letterSpacing: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 6,
    marginTop: 12,
    shadowColor: 'rgba(0, 0, 0, 0.19)',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  msgSent: {
    backgroundColor: '#44D62C',
    alignSelf: 'flex-end',
    maxWidth: '100%',
    borderBottomRightRadius: 0,
  },
  msgRcv: {
    backgroundColor: '#f2f3f6',
    maxWidth: '100%',
    borderBottomLeftRadius: 0,
  },
  msgSentText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'left',
  },
  msgRcvText: {
    fontSize: 16,
    color: '#323643',
    textAlign: 'left',
  },
});
