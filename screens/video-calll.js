import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  Platform,
  PanResponder,
  Animated,
  Pressable,
} from 'react-native';
import {useState, useContext, useRef, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import VideoContext from '../store/VideoContext';
import {width, totalSize} from 'react-native-dimension';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RTCView} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import HeadphoneDetection from 'react-native-headphone-detection';
import KeepAwake from 'react-native-keep-awake';
import {ChatView, VideoCallBottom} from '../components/ui';

export function VideoCall() {
  const {
    socketRef,
    call,
    callAccepted,
    userVideo,
    stream,
    name,
    callEnded,
    me,
    leaveCall,
    answerCall,
    myVdoStatus,
    myMicStatus,
    updateMic,
    calling,
    userVdoStatus,
    otherUserName,
    userName,
    setCallDecline,
    declineCall,
    setMaxDuration,
    callDecline,
    mySocketIdRef,
    setMaxCallTime,
    maxDurationRef,
    maxCallTimeRef,
    pricePerMinute,
    callDeclineTimeoutRef,
    otherUser,
    callTime,
    amount,
    stopCountDown,
    countDown,
    userMicStatus,
    updateVideo,
    callStatus,
    otherUserScreenShareStatus,
    setIsShown,
    isShown,
    stopRingtone,
    activeStream,
    userVideoRef,
    setTriggeredCameraViewByButton,
    triggeredCameraViewByButton,
    setCd,
    cd,
    setMyVdoStatus,
    myVideoStatusRef,
    setMyMicStatus,
    myMicStatusRef,
    myVideoInitialStatusRef,
    myMicInitialStatusRef,

    panRef,
  } = useContext(VideoContext);
  const [speaker, setSpeaker] = useState(false);
  const [bluetooth, setBluetooth] = useState(false);
  const [wiredPlugin, setWiredPlugin] = useState(false);
  const [earPiece, setEarPiece] = useState(false);
  const [myVideoView, setMyVideoView] = useState();
  const [userVideoView, setUserVideoView] = useState();

  // Made the my own video component draggable.

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: panRef.x, dy: panRef.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        panRef.extractOffset();
      },
    }),
  ).current;

  // CountDown event listner for the countdowns

  useEffect(() => {
    if (me && otherUser) {
      countDown.off('change');
      countDown.on('change', val => {
        setCd(val);
        if (val === '0:00') {
          leaveCall();
          stopCountDown();
        }
      });
    }
  }, [me, otherUser]);

  // CHnaged the audio route on the basis of connected device.
  useEffect(() => {
    if (userVideo) {
      KeepAwake.activate();
      HeadphoneDetection.isAudioDeviceConnected().then(async e => {
        if (e.audioJack) {
          InCallManager.setSpeakerphoneOn(false);
          InCallManager.stop();
          InCallManager.chooseAudioRoute('WIRED_HEADSET');
          InCallManager.start();
          setSpeaker(false);
          setBluetooth(false);
          setEarPiece(false);
          setWiredPlugin(true);
        } else if (e.bluetooth) {
          InCallManager.setSpeakerphoneOn(false);
          InCallManager.stop();
          InCallManager.chooseAudioRoute('BLUETOOTH');
          InCallManager.start();
          setSpeaker(false);
          setWiredPlugin(false);
          setEarPiece(false);
          setBluetooth(true);
        } else {
          InCallManager.setSpeakerphoneOn(true);
          InCallManager.stopRingback();
          InCallManager.stopRingtone();
          InCallManager.chooseAudioRoute('SPEAKER_PHONE');
          InCallManager.start({media: 'video'});
          setWiredPlugin(false);
          setBluetooth(false);
          setEarPiece(false);
          setSpeaker(true);
        }
      });
    }
  }, [userVideo]);

  // Eventlistener for the audio route change during call.
  useEffect(() => {
    HeadphoneDetection.addListener(e => {
      if (e.audioJack) {
        InCallManager.setSpeakerphoneOn(false);
        InCallManager.stop();
        InCallManager.chooseAudioRoute('WIRED_HEADSET');
        InCallManager.start();
        setSpeaker(false);
        setBluetooth(false);
        setEarPiece(false);
        setWiredPlugin(true);
      } else if (e.bluetooth) {
        InCallManager.setSpeakerphoneOn(false);
        InCallManager.stop();
        InCallManager.chooseAudioRoute('BLUETOOTH');
        InCallManager.start();
        setSpeaker(false);
        setWiredPlugin(false);
        setEarPiece(false);
        setBluetooth(true);
      } else {
        InCallManager.setSpeakerphoneOn(true);
        InCallManager.stopRingback();
        InCallManager.stopRingtone();
        InCallManager.chooseAudioRoute('SPEAKER_PHONE');
        InCallManager.start({media: 'video'});
        setWiredPlugin(false);
        setBluetooth(false);
        setEarPiece(false);
        setSpeaker(true);
      }
    });
  }, []);

  useEffect(() => {
    if (stream) {
      if (stream.getVideoTracks().length > 0) {
        setMyVdoStatus(true);
        myVideoInitialStatusRef.current = true;
        myVideoStatusRef.current = true;
      }
      if (stream.getAudioTracks().length > 0) {
        setMyMicStatus(true);
        myMicInitialStatusRef.current = true;
        myMicStatusRef.current = true;
      }
    }
  }, [stream]);

  const handleSwitchingCamera = async () => {
    if (stream) {
      const videoTrack = await stream.getVideoTracks()[0];
      videoTrack._switchCamera();
    }
  };

  const handleUpdateSpeaker = () => {
    if (speaker) {
      InCallManager.setSpeakerphoneOn(false);
      InCallManager.stop();
      InCallManager.chooseAudioRoute('EARPIECE');
      InCallManager.start();
      setBluetooth(false);
      setSpeaker(false);
      setWiredPlugin(false);
      setEarPiece(true);
    } else {
      InCallManager.setSpeakerphoneOn(true);
      InCallManager.stopRingback();
      InCallManager.stopRingtone();
      InCallManager.chooseAudioRoute('SPEAKER_PHONE');
      InCallManager.start({media: 'video'});
      setWiredPlugin(false);
      setBluetooth(false);
      setEarPiece(false);
      setSpeaker(true);
    }
  };

  useEffect(() => {
    if (activeStream.current) {
      setMyVideoView({
        viewStatus: 'myVideo',
        stream: activeStream.current.toURL(),
      });
    }
  }, [activeStream.current]);

  useEffect(() => {
    if (userVideo) {
      setUserVideoView({
        viewStatus: 'userVideo',
        stream: userVideo.toURL(),
      });
    }
  }, [userVideo]);

  let cdisplay =
    calling ||
    callAccepted ||
    (call.isReceivingCall && !callAccepted && !callDecline)
      ? {textAlign: 'center'}
      : {display: 'none', textAlign: 'center'};

  let d1 =
    calling || (call.isReceivingCall && !callAccepted && !callDecline)
      ? 'flex'
      : 'none';

  return (
    <>
      <View style={[styles.textWrapper, {display: d1}]}>
        <View>
          <ScrollView>
            <ImageBackground
              source={require('../assets/IMG82.png')}
              style={styles.backgroundImage1}>
              <View style={styles.callingScreen}>
                {calling ? (
                  <View>
                    <View style={styles.contentContainer}>
                      <View style={styles.callerNameContainer}>
                        <Text style={styles.callerTextDesign}>
                          {calling
                            ? `Helper: ${otherUserName}`
                            : `Buyer: ${call.name}`}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}>
                      <View style={styles.callerNameContainer}>
                        <Text style={styles.callerTextDesign}>
                          Alex Hales Alex Hales
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}>
                      <View
                        style={{
                          borderColor: '#FFFFFF',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          borderRadius: 6,
                          padding: 6,
                          marginVertical: 8,
                          width: wp('80%'),
                        }}>
                        <Text style={styles.callerTextDesign}>
                          New York Travel aaaaaaaaaaaaaa
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}>
                      <View
                        style={{
                          borderColor: '#FFFFFF',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          borderRadius: 6,
                          padding: 6,
                        }}>
                        <Text style={styles.callerTextDesign}>
                          USD {pricePerMinute.toFixed(2)}/min
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  ''
                )}
              </View>

              {!calling ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginTop: 10,
                    }}>
                    <View>
                      <Image source={require('../assets/IMGD1.png')} />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: '#0FE90D',
                        width: width(85),
                        backgroundColor: '#FFFFFF',
                        borderRadius: 15,
                        marginVertical: 14,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignContent: 'center',
                          marginTop: 4,
                        }}>
                        <Text
                          style={{
                            fontWeight: '800',
                            color: '#02B100',
                            fontSize: totalSize(3),
                            fontWeight: '800',
                          }}>
                          Incoming call
                        </Text>
                      </View>
                      <View
                        style={{
                          borderBottomColor: '#0FE90D',
                          borderBottomWidth: 2,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignContent: 'center',
                            marginTop: 4,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: width(65),
                              backgroundColor: 'rgba(197,251,197,100)',
                              justifyContent: 'center',
                              borderRadius: 4,
                              padding: 4,
                            }}>
                            <Text
                              style={{
                                fontWeight: '500',
                                color: '#4A4A4A',
                                fontSize: totalSize(1.8),
                              }}>
                              {calling
                                ? `Helper: ${otherUserName}`
                                : `Buyer: ${call.name}`}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignContent: 'center',
                            marginVertical: 8,
                          }}>
                          <Text
                            style={{
                              color: '#2965BA',
                              fontSize: totalSize(1.9),
                              fontWeight: '800',
                              letterSpacing: 1,
                            }}>
                            John dee on thirty lettersedss
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          borderBottomColor: '#0FE90D',
                          borderBottomWidth: 2,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignContent: 'center',
                            marginTop: 8,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: width(65),
                              backgroundColor: 'rgba(197,251,197,100)',
                              borderRadius: 4,
                              justifyContent: 'center',
                              padding: 4,
                            }}>
                            <Text
                              style={{
                                fontWeight: '500',
                                color: '#4A4A4A',
                                fontSize: totalSize(1.8),
                              }}>
                              Requesting service:
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignContent: 'center',
                            marginVertical: 6,
                          }}>
                          <Text
                            style={{
                              color: '#2965BA',
                              fontSize: totalSize(1.9),
                              fontWeight: '800',
                              letterSpacing: 1,
                            }}>
                            New York travel is required this
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignContent: 'center',
                          marginTop: 8,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: width(65),
                            backgroundColor: 'rgba(197,251,197,100)',
                            borderRadius: 4,
                            padding: 4,
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontWeight: '500',
                              color: '#4A4A4A',
                              fontSize: totalSize(1.8),
                            }}>
                            USD {pricePerMinute.toFixed(2)}/min
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignContent: 'center',
                          marginTop: 4,
                        }}>
                        <Text
                          style={{
                            color: '#2965BA',
                            fontSize: totalSize(1.6),
                            fontWeight: '800',
                            letterSpacing: 1,
                          }}>
                          Call can last up to {call.maxCallTime}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginVertical: 15,
                          marginTop: 8,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontWeight: '400',
                              color: '#4A4A4A',
                              fontSize: totalSize(1.6),
                              paddingHorizontal: 2,
                            }}>
                            Payment receive method:
                          </Text>
                          <Text
                            style={{
                              fontWeight: '500',
                              color: '#4A4A4A',
                              fontSize: totalSize(1.6),
                            }}>
                            Bank account555
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                ''
              )}

              {!calling ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginVertical: 20,
                    }}>
                    <Image
                      source={require('../assets/IMG78.png')}
                      resizeMode="contain"
                      style={{width: 120, height: 120}}
                    />
                  </View>
                </>
              ) : (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignContent: 'center',
                      marginTop: 20,
                    }}>
                    <Image
                      source={require('../assets/IMG75.png')}
                      style={{width: 120, height: 120}}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontSize: hp('2%'),
                      letterSpacing: 1,
                      fontWeight: '500',
                      marginTop: 12,
                    }}>
                    Dialing on helper side
                  </Text>
                </View>
              )}
            </ImageBackground>
          </ScrollView>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#8BF88A',
            backgroundColor: 'rgba(0,69,0,100)',
            paddingVertical: 8,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          {calling ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  updateMic();
                }}>
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: 'white',
                    padding: 6,
                  }}>
                  {myMicStatus ? (
                    <MaterialCommunityIcons
                      name="microphone"
                      size={24}
                      color="#000"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="microphone-off"
                      size={24}
                      color="#000"
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  declineCall();
                }}>
                <View style={{borderRadius: 30, backgroundColor: '#FB0707'}}>
                  <Image
                    source={require('../assets/callend2.png')}
                    style={{width: 40, height: 40}}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setTriggeredCameraViewByButton(!triggeredCameraViewByButton);
                  updateVideo();
                }}>
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: 'white',
                    padding: 6,
                  }}>
                  {myVdoStatus ? (
                    <MaterialCommunityIcons
                      name="video"
                      size={24}
                      color="#000"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="video-off"
                      size={24}
                      color="#000"
                    />
                  )}
                </View>
              </TouchableOpacity>
            </>
          ) : (
            ''
          )}
          {!calling ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  declineCall();
                }}>
                <Image
                  source={require('../assets/callend2.png')}
                  style={{width: 40, height: 40}}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setTriggeredCameraViewByButton(!triggeredCameraViewByButton);
                  updateVideo();
                }}>
                {myVdoStatus ? (
                  <View>
                    <Image
                      source={require('../assets/camera-on.png')}
                      style={{width: 40, height: 40}}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View>
                    <Image
                      source={require('../assets/vedio22.png')}
                      style={{width: 40, height: 40}}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  updateMic();
                }}>
                {myMicStatus ? (
                  <View>
                    <Image
                      source={require('../assets/micvoice.png')}
                      style={{width: 40, height: 40}}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View>
                    <Image
                      source={require('../assets/mic-voice-off.png')}
                      style={{width: 40, height: 40}}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  clearTimeout(callDeclineTimeoutRef.current);
                  socketRef.current.emit('busy', {
                    id: mySocketIdRef.current,
                  });
                  answerCall();
                  setCallDecline(true);
                  setMaxCallTime(call.maxCallTime);
                  setMaxDuration(call.maxDuration);
                  maxCallTimeRef.current = call.maxCallTime;
                  maxDurationRef.current = call.maxDuration;
                  stopRingtone();
                }}>
                <View>
                  <Image
                    source={require('../assets/callstart.png')}
                    style={{width: 40, height: 40}}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </>
          ) : (
            ''
          )}
        </View>
      </View>

      <View
        style={[
          {
            position: 'absolute',
            top: Platform.OS === 'ios' ? '8%' : '5%',
            left: '7%',
            zIndex: 99999999,
          },
          cdisplay,
        ]}>
        <TouchableOpacity
          onPress={() => {
            handleSwitchingCamera();
          }}>
          <Image
            source={require('../assets/cameraRollWithBorder.png')}
            resizeMode="contain"
            style={{width: 35, height: 35}}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.videoMe, cdisplay]}>
        {myVdoStatus && stream ? (
          <>
            <Animated.View
              style={{
                transform: [{translateX: panRef.x}, {translateY: panRef.y}],
              }}
              {...panResponder.panHandlers}>
              <Pressable
                disabled={!userVideo ? true : false}
                onPress={() => {
                  setMyVideoView(prev => {
                    if (prev.viewStatus === 'myVideo') {
                      return {
                        viewStatus: 'userVideo',
                        stream: userVideo.toURL(),
                      };
                    } else {
                      return {
                        viewStatus: 'myVideo',
                        stream: activeStream.current.toURL(),
                      };
                    }
                  });
                  setUserVideoView(prev => {
                    if (prev.viewStatus === 'userVideo') {
                      return {
                        viewStatus: 'myVideo',
                        stream: activeStream.current.toURL(),
                      };
                    } else {
                      return {
                        viewStatus: 'userVideo',
                        stream: userVideo.toURL(),
                      };
                    }
                  });
                }}>
                <View style={styles.videoContainer}>
                  <RTCView
                    mirror={false}
                    streamURL={myVideoView?.stream}
                    objectFit="cover"
                    zOrder={1}
                    borderRadius={12}
                    style={styles.rtcView}
                  />
                </View>
              </Pressable>
            </Animated.View>
          </>
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <Text style={styles.textAvatar}> {name}</Text>
            </View>
          </>
        )}
      </View>

      {(calling || (callAccepted && !callEnded && userVideoRef)) && (
        <>
          <View style={styles.textWrapper2}>
            <View
              style={{
                position: 'absolute',
                top: 20,
                left: 80,
                zIndex: 9999999,
              }}>
              <View
                style={{
                  paddingTop: Platform.OS === 'ios' ? '11%' : 0,
                }}>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: '#44D62C',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 5,
                    width: width(65),
                    padding: 0.8,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: 14,
                      letterSpacing: 1,
                      fontWeight: 500,
                    }}>
                    Talk time {callTime}. Estimate including tax and fees: USD $
                    {amount.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 5,
                    padding: 2,
                    width: width(42),
                    marginVertical: -0.1,
                    borderColor: '#44D62C',
                    borderWidth: 0.5,
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontSize: 14,
                      letterSpacing: 1,
                    }}>
                    {call.name && call.name !== name
                      ? `Buyer: ${call.name}`
                      : `Helper: ${otherUserName}`}
                  </Text>
                </View>
              </View>
              {!userMicStatus && (
                <FontAwesome
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    right: -30,
                    paddingVertical: 12,
                  }}
                  name="microphone-slash"
                  size={24}
                  color="white"
                />
              )}
            </View>

            <ChatView />
            {cd !== '' && cd !== '0:00' ? (
              <View
                style={{
                  position: 'absolute',
                  top: '15%',
                  right: '8%',
                  zIndex: 999,
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#00b500', fontSize: 24}}>{cd}</Text>
              </View>
            ) : (
              ''
            )}
          </View>

          <View style={styles.videoYou}>
            {(userVdoStatus || otherUserScreenShareStatus) && userVideo ? (
              <>
                <View style={styles.videoContainer1}>
                  <RTCView
                    mirror={false}
                    streamURL={userVideoView?.stream}
                    zOrder={0}
                    objectFit={'cover'}
                    borderRadius={100}
                    style={styles.rtcView}
                  />
                </View>
              </>
            ) : (
              <View style={[styles.avatarContainer2]}>
                <Text style={styles.textAvatar}>{userName || call.name}</Text>
              </View>
            )}
          </View>

          {callStatus !== '' && (
            <View
              style={{
                position: 'absolute',
                top: '60%',
                zIndex: 99999999,
                padding: 5,
                backgroundColor: 'rgba(0,0,0,0.5)',
                flexDirection: 'row',
                justifyContent: 'center',
                width: wp('100%'),
              }}>
              <Text style={{color: '#00b500', fontSize: totalSize(2)}}>
                {callStatus}
              </Text>
            </View>
          )}
        </>
      )}

      {calling ||
        (callAccepted && !callEnded && userVideoRef && (
          <VideoCallBottom
            earPiece={earPiece}
            bluetooth={bluetooth}
            wiredPlugin={wiredPlugin}
            onPress={handleUpdateSpeaker}
          />
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  textWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'rgba(32,33,36)',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: Platform.OS === 'ios' ? '10%' : 0,
  },
  callerNameContainer: {
    borderWidth: 0.3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 2,
    padding: 4,
    marginVertical: 4,
  },
  callerTextDesign: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: hp('1.8%'),
    letterSpacing: 1,
  },

  textWrapper2: {
    flex: 1,
    position: 'relative',
  },
  callingScreen: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  backgroundImage1: {
    height: hp('100%'), // 70% of height device screen
    width: wp('100%'),
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    borderColor: '#fff',
    backgroundColor: '#000000',
  },
  videoContainer1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  rtcView: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    backgroundColor: '#44d62c',
    height: 100,
    width: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  textAvatar: {
    color: '#fff',
  },
  videoMe: {
    position: 'absolute',
    zIndex: 1,
    right: '3%',
    bottom: '12%',
    width: wp('25%'),
    height: hp('20%'),
  },
  videoYou: {
    backgroundColor: '#000000',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: -1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: 100,
    borderRadius: 100,
    backgroundColor: '#44D62C',
  },
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
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
