import React, {useState, useEffect, useRef, useContext} from 'react';
import {Alert, Animated, AppState, Platform} from 'react-native';
import VideoContext from './VideoContext';
import {io} from 'socket.io-client';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timer from 'time-counter';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import InCallManager from 'react-native-incall-manager';
import KeepAwake from 'react-native-keep-awake';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import notifee from '@notifee/react-native';
import {SOCKET_URL} from '@env';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,r
} from 'react-native-webrtc';
import {AuthContext} from './AuthProvider';
import {notificationId} from '../services/IncomingCall';
export const socketConnection = io.connect(SOCKET_URL);

const servers = {
  iceServers: [
    {urls: 'stun:relay2.expressturn.com:443'},
    {urls: 'stun:relay3.expressturn.com:80'},
    {urls: 'stun:relay3.expressturn.com:443'},
    {urls: 'stun:relay4.expressturn.com:3478'},
    {urls: 'stun:relay5.expressturn.com:3478'},
    {urls: 'stun:relay6.expressturn.com:3478'},
    {urls: 'stun:relay7.expressturn.com:3478'},
    {urls: 'stun:relay8.expressturn.com:3478'},
    {
      urls: 'turn:relay2.expressturn.com:443',
      username: 'efV0SPHGZEV3L34KOK',
      credential: 'YR4N2REgZ4ovRNtc',
    },
    {
      urls: 'turn:relay3.expressturn.com:80',
      username: 'efV0SPHGZEV3L34KOK',
      credential: 'YR4N2REgZ4ovRNtc',
    },
    {
      urls: 'turn:relay3.expressturn.com:443',
      username: 'efV0SPHGZEV3L34KOK',
      credential: 'YR4N2REgZ4ovRNtc',
    },
    {
      urls: 'turn:relay4.expressturn.com:3478',
      username: 'efV0SPHGZEV3L34KOK',
      credential: 'YR4N2REgZ4ovRNtc',
    },
    {
      urls: 'turn:relay5.expressturn.com:3478',
      username: 'efV0SPHGZEV3L34KOK',
      credential: 'YR4N2REgZ4ovRNtc',
    },
    {
      urls: 'turn:relay6.expressturn.com:3478',
      username: 'efV0SPHGZEV3L34KOK',
      credential: 'YR4N2REgZ4ovRNtc',
    },
    {
      urls: 'turn:relay7.expressturn.com:3478',
      username: 'efV0SPHGZEV3L34KOK',
      credential: 'YR4N2REgZ4ovRNtc',
    },
    {
      urls: 'turn:relay8.expressturn.com:3478',
      username: 'efV0SPHGZEV3L34KOK',
      credential: 'YR4N2REgZ4ovRNtc',
    },
  ],
};

// const servers = {
//   iceServers: [
//     {urls: 'stun:relay2.expressturn.com:443'},
//     {urls: 'stun:relay3.expressturn.com:80'},
//     {urls: 'stun:relay3.expressturn.com:443'},
//     {urls: 'stun:relay4.expressturn.com:3478'},
//     {urls: 'stun:relay5.expressturn.com:3478'},
//     {urls: 'stun:relay6.expressturn.com:3478'},
//     {urls: 'stun:relay7.expressturn.com:3478'},
//     {urls: 'stun:relay8.expressturn.com:3478'},
//     {
//       urls: 'turn:relay2.expressturn.com:443',
//       username: 'efV0SPHGZEV3L34KOK',
//       credential: 'YR4N2REgZ4ovRNtc',
//     },
//     {
//       urls: 'turn:relay3.expressturn.com:80',
//       username: 'efV0SPHGZEV3L34KOK',
//       credential: 'YR4N2REgZ4ovRNtc',
//     },
//     {
//       urls: 'turn:relay3.expressturn.com:443',
//       username: 'efV0SPHGZEV3L34KOK',
//       credential: 'YR4N2REgZ4ovRNtc',
//     },
//     {
//       urls: 'turn:relay4.expressturn.com:3478',
//       username: 'efV0SPHGZEV3L34KOK',
//       credential: 'YR4N2REgZ4ovRNtc',
//     },
//     {
//       urls: 'turn:relay5.expressturn.com:3478',
//       username: 'efV0SPHGZEV3L34KOK',
//       credential: 'YR4N2REgZ4ovRNtc',
//     },
//     {
//       urls: 'turn:relay6.expressturn.com:3478',
//       username: 'efV0SPHGZEV3L34KOK',
//       credential: 'YR4N2REgZ4ovRNtc',
//     },
//     {
//       urls: 'turn:relay7.expressturn.com:3478',
//       username: 'efV0SPHGZEV3L34KOK',
//       credential: 'YR4N2REgZ4ovRNtc',
//     },
//     {
//       urls: 'turn:relay8.expressturn.com:3478',
//       username: 'efV0SPHGZEV3L34KOK',
//       credential: 'YR4N2REgZ4ovRNtc',
//     },
//   ],
// };

var countDown = new Timer({
  direction: 'down',
  startValue: '0:30', // one minute
});

const VideoState = ({children}) => {
  const {logout} = useContext(AuthContext);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callDecline, setCallDecline] = useState(true);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState('');
  const [name, setName] = useState();
  const [call, setCall] = useState({});
  const [chat, setChat] = useState([]);
  const [me, setMe] = useState('');
  const [myUuid, setMyUuid] = useState('');
  const [userName, setUserName] = useState('');
  const [otherUser, setOtherUser] = useState('');
  const [otherUserName, setOtherUserName] = useState('');
  const [otherUserUuid, setOtherUserUuid] = useState('');
  const [userVideo, setUserVideo] = useState(null);
  const [myVdoStatus, setMyVdoStatus] = useState(false);
  const [userVdoStatus, setUserVdoStatus] = useState();
  const [myMicStatus, setMyMicStatus] = useState(false);
  const [userMicStatus, setUserMicStatus] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [calling, setCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('');
  const [maxDuration, setMaxDuration] = useState('59:30');
  const [maxCallTime, setMaxCallTime] = useState('1 hour');
  const [pricePerMinute, setPricePerMinute] = useState(2);
  const [callDeclineAfterSeconds, setCallDeclineAfterSeconds] = useState(30);
  const [isShown, setIsShown] = useState(false);
  const [amount, setAmount] = useState(0);
  const [callTime, setCallTime] = useState('00:00');
  const [callConnected, setCallConnected] = useState(false);
  const [otherUserScreenShareStatus, setOtherUserScreenShareStatus] =
    useState(false);
  const [triggeredCameraViewByButton, setTriggeredCameraViewByButton] =
    useState(false);
  const [cd, setCd] = useState('');

  const [refreshing, setRefreshing] = useState(true);
  const socketRef = useRef(socketConnection);
  const connectionRef = useRef();
  const activeStream = useRef(null);
  const myVideoStatusRef = useRef(myVdoStatus);
  const myVideoInitialStatusRef = useRef(myVdoStatus);
  const myMicInitialStatusRef = useRef(myMicStatus);
  const myMicStatusRef = useRef(myMicStatus);
  const callStatusRef = useRef(callStatus);
  const myUuidRef = useRef(myUuid);
  const callRef = useRef(call);
  const maxDurationRef = useRef(maxDuration);
  const maxCallTimeRef = useRef(maxCallTime);
  const currentInterval = useRef('');
  const callDeclineTimeoutRef = useRef('');
  const setCallingTimeoutRef = useRef('');
  const inCallRef = useRef(false);
  const countUpTimer = useRef(null);
  const mySocketIdRef = useRef('');
  const otherUserUuidRef = useRef();
  const otherUserSocketIdRef = useRef();
  const connectionLostTimeoutRef = useRef(null);
  const receivingTuneRef = useRef();
  const callingTuneRef = useRef();
  const userVideoRef = useRef();
  const otherUserStatusRef = useRef(null);
  const callIdRef = useRef();
  const chatRef = useRef(chat);
  const myStatusRef = useRef('online');
  const otherPeerStream = useRef();

  const panRef = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    otherUserSocketIdRef.current = otherUser;
  }, [otherUser]);

  useEffect(() => {
    otherUserUuidRef.current = otherUserUuid;
  }, [otherUserUuid]);

  const storeData = async () => {
    if (await AsyncStorage.getItem('name')) {
      setName(await AsyncStorage.getItem('name'));
    }
  };

  useEffect(() => {
    assignName();
    storeData();

    // socketRef.current.on('logout', () => {
    //   // logout();
    // });

    socketRef.current.on('refreshOnlineUsers', () => {
      socketRef.current.emit('getMySocketId');
    });

    if (!socketRef.current.connected) {
      console.log('latest testing connecting socket');
      socketRef.current.disconnect();
      socketRef.current.connect();
    }

    socketRef.current.emit('getMySocketId');

    socketRef.current.on('me', id => {
      console.log('latest testing on me adding new user');
      setMe(id);
      newUser();
    });
    socketRef.current.on('disconnect', () => {
      console.log('latest testing disconnected');
      if (inCallRef.current) {
        setCallStatus(
          'Connection to the server is lost. Kindly check your internet connection',
        );
        connectionLostTimeoutRef.current = setTimeout(() => {
          leaveCall(false);
        }, 15000);
      }
    });

    socketRef.current.io.on('reconnection_attempt', () => {
      console.log('latest testing reconnection attempt');
    });

    socketRef.current.io.on('reconnect', () => {
      console.log('latest testing reconnected');
      socketRef.current.emit('getMySocketId');
      setCallStatus('');
      if (connectionLostTimeoutRef.current) {
        clearTimeout(connectionLostTimeoutRef.current);
        connectionLostTimeoutRef.current = null;
      }
    });

    socketRef.current.on('new_connect', data => {

      setOnlineUsers(data);
      if (otherUserUuidRef.current) {
        let otherUserIndex = data.findIndex(
          user => user.id === otherUserUuidRef.current,
        );
        if (
          otherUserIndex !== -1 &&
          data[otherUserIndex]['socketId'] != otherUserSocketIdRef.current
        ) {
          otherUserSocketIdRef.current = data[otherUserIndex]['socketId'];
          setOtherUser(otherUserSocketIdRef.current);
          setCallStatus('');
          callStatusRef.current = '';
          // if (connectionRef.current._pc.iceConnectionState != 'connected') {
          //   leaveCall();
          // }
        }
      }
      setRefreshing(false);
    });

    socketRef.current.on('updateUserMedia', data => {
      if (data.currentMediaStatus !== null || data.currentMediaStatus !== []) {
        switch (data.type) {
          case 'video':
            setUserVdoStatus(data.currentMediaStatus);
            break;
          case 'mic':
            setUserMicStatus(data.currentMediaStatus);
            break;
          case 'screenShare':
            setOtherUserScreenShareStatus(data.currentMediaStatus);
            break;
          default:
            setUserMicStatus(data.currentMediaStatus[0]);
            setUserVdoStatus(data.currentMediaStatus[1]);
            break;
        }
      }
    });

    let recevingAudioTune;

    recevingAudioTune = new Sound('teams.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      const loopCount = Math.ceil(30 / recevingAudioTune.getDuration()); // Calculate the number of loops required
      recevingAudioTune.setNumberOfLoops(loopCount);
      receivingTuneRef.current = recevingAudioTune;
    });

    socketRef.current.on(
      'callUser',
      ({
        fromUuid,
        from,
        name: callerName,
        maxDuration,
        maxCallTime,
        callId,
      }) => {
        socketRef.current.emit('busy', {
          id: mySocketIdRef.current,
        });
        receivingTuneRef.current.play();
        setCallStatus('');
        setCalling(false);
        let call = {
          isReceivingCall: true,
          fromUuid,
          from,
          name: callerName,
          maxDuration,
          maxCallTime,
        };
        callIdRef.current = callId;
        otherUserSocketIdRef.current = from;
        setCall(call);
        callRef.current = call;
        setCallDecline(false);
        callDeclineTimeoutRef.current = setTimeout(() => {
          declineCall();
        }, callDeclineAfterSeconds * 1000);
        setCd('');
      },
    );

    socketRef.current.on('otherUserLostConnection', () => {
      setCallStatus('Other user has lost their connection');
      callStatusRef.current = 'Other user has lost their connection';
    });

    socketRef.current.on('disconnectTheCall', () => {
      leaveCall();
    });

    return () => {
      console.log('testing disconnecting socket');
      callIdRef.current = null;
      // setStream(null);
      // activeStream.current.getTracks().forEach(track => track.stop());
      stopRingtone();
      myStatusRef.current = 'online';
      socketRef.current.off();
      socketRef.current.io.off();
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (me) {
      mySocketIdRef.current = me;
      socketRef.current.off('userStatus');
      socketRef.current.on('userStatus', ({id, status, callId}) => {
        console.log('1: on userStatus socket me: ', status);
        otherUserStatusRef.current = status;
        if (status === 'online') {
          callIdRef.current = callId;
          callUser(id);
        } else {
          setCallAccepted(false);
          setCallEnded(false);
          setCallDecline(false);
          setCallStatus('Busy on other call');

          setOtherUser('');
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
          setTimeout(() => {
            if (otherUserSocketIdRef.current) declineCall();
          }, 3000);
        }
      });

      socketRef.current.off('callEvent');
      socketRef.current.on('callEvent', ({data}) => {
        console.log('5: call Event socket', data.type);
        switch (data.type) {
          case 'accepted':
            setCallStatus('');
            setOtherUser(data.from);
            setOtherUserUuid(data.fromUuid);
            otherUserUuidRef.current = data.fromUuid;
            callHasBeenAcceptedFromReceiver();
            break;
          default:
            setCallStatus('');
            break;
        }
      });

      socketRef.current.off('endCall');
      socketRef.current.on('endCall', async ({data}) => {
        console.log('endCall data', data);
        if (data.cancel !== 1) {
          endingCall();
          stopCountDown();
        } else {
          clearTimeout(callDeclineTimeoutRef.current);
          socketRef.current.emit('online', {id: mySocketIdRef.current});
          if (notificationId) {
            await notifee.cancelNotification(notificationId);
          }

          if (data.canceledByReceiver) {
            setCallStatus('Call cannot be established');
            setCallingTimeoutRef.current = setTimeout(() => {
              setCallStatus('');
              setCalling(false);
            }, 3000);
          } else {
            setCalling(false);
          }
          setCallDecline(true);
          stopRingtone();
        }
      });
    }
  }, [me]);

  const startTimer = (startValue = 0) => {
    countUpTimer.current = new Timer({startValue: '0:0' + startValue});
    console.log('starttimer', countUpTimer.current);
    stopTimer();
    stopCountDown();
    setCallTime('');
    setAmount(0);
    let sec = startValue;
    countUpTimer.current.on('change', val => {
      setCallTime(val);
      sec++;
      let p = pricePerMinute / 60;
      setAmount(sec * p);

      if (
        val === maxDurationRef.current ||
        val === `0${maxDurationRef.current}`
      ) {
        countDown.start();
      }
    });
    countUpTimer.current.start();
  };

  const stopTimer = () => {
    console.log('stopping timer', countUpTimer.current);
    countUpTimer.current && countUpTimer.current.stop();
  };

  const stopCountDown = () => {
    countDown && countDown.stop();
  };

  const assignName = async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    let name = `${userData.firstName} ${userData.lastName}`;
    setName(name);
  };

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (inCallRef.current && nextAppState === 'background') {
          leaveCall();
          console.log('Went to background during videoCall');
        } else {
          console.log('Went to background before videoCall');

          if (
            (myVdoStatus &&
              nextAppState === 'background' &&
              !triggeredCameraViewByButton) ||
            (!myVdoStatus &&
              nextAppState === 'active' &&
              !triggeredCameraViewByButton)
          ) {
            updateVideo();
          }
        }
      },
    );

    return () => {
      appStateListener?.remove();
    };
  }, [myVdoStatus]);

  const newUser = async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    let id = userData.id;
    let name = `${userData.firstName} ${userData.lastName}`;
    setMyUuid(id);
    myUuidRef.current = id;
    let data = {
      name: name,
      id: id,
      cameraAvailable: activeStream.current?.video ? true : false,
    };

    if (myStatusRef.current) {
      data.status = myStatusRef.current;
    }

    if (callIdRef.current) {
      data.callId = callIdRef.current;
    }

    socketRef.current.emit('new_user', data, error => {});
  };

  const checkAudioVideoPermissions = async () => {
    await mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
        options: {muted: true},
      })
      .then(currentStream => {
        if (connectionRef.current) {
          // connectionRef.current?.removeStream(activeStream.current);
          if (activeStream.current.getAudioTracks().length > 0) {
            currentStream.getAudioTracks()[0].enabled =
              activeStream.current.getAudioTracks()[0].enabled;
          }
          // connectionRef.current.addStream(currentStream);
        }
        setStream(currentStream);
        activeStream.current = currentStream;
        if (currentStream.getVideoTracks().length > 0) {
          socketRef.current.emit(
            'cameraAvailable',
            {cameraAvailable: true},
            error => {
              console.log(error);
            },
          );
        }
      })
      .catch(err => {
        setStream();
        console.error(err.name + ':fdgfdg ' + err.message);
      });
  };

  useEffect(() => {
    let tune = new Sound('calling.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      const loopCount = Math.ceil(30 / tune.getDuration()); // Calculate the number of loops required
      tune.setNumberOfLoops(loopCount);
      callingTuneRef.current = tune;
    });
  }, []);

  
  const callHasBeenAcceptedFromReceiver = async () => {
    setCallStatus('Connecting...');
    stopRingtone();
    try {
      const peer1 = new RTCPeerConnection(servers);
      peer1.onicecandidate = event => {
        if (event.candidate) {
          socketRef.current.emit('signal', {
            to: otherUserSocketIdRef.current,
            from: 'peer1',
            signal: event.candidate,
          });
        }
      };

      peer1.onconnectionstatechange = event => {
        if (peer1.connectionState === 'connected') {
          console.log('peer1 connected at' + Date.now());
          socketRef.current.emit('buyerConnected', {
            callId: callIdRef.current,
          });
        }
      };

      peer1.ontrack = event => {
        otherPeerStream.current = event.streams[0];
      };

      activeStream.current.getTracks().forEach(track => {
        peer1.addTrack(track, activeStream.current);
      });

      socketRef.current.off('bothUsersConnected');

      socketRef.current.on('bothUsersConnected', signal => {
        userConnected(2);
      });

      socketRef.current.off('signal');

      socketRef.current.on('signal', async signal => {
        if (signal.type === 'answer') {
          await peer1.setRemoteDescription(new RTCSessionDescription(signal));
        } else if (signal.candidate) {
          await peer1.addIceCandidate(new RTCIceCandidate(signal));
        }
      });

      const offer = await peer1.createOffer();
      await peer1.setLocalDescription(offer);

      socketRef.current.emit('signal', {
        to: otherUserSocketIdRef.current,
        from: 'peer1',
        signal: peer1.localDescription,
      });

      connectionRef.current = peer1;

      console.log('3: caller Peer1', connectionRef.current);
    } catch (error) {
      console.error('Errrorrrrrrrrrrr', error);
    }
  };

  const userConnected = timerStartValue => {
    setUserVideo(otherPeerStream.current);
    userVideoRef.current = otherPeerStream;
    setCallStatus('');
    setCallConnected(true);
    stopTimer();
    startTimer(timerStartValue);
  };

  const callTo = async (sockedId = null, userId) => {
    socketRef.current.emit('checkUserStatus', {
      id: sockedId,
      callTo: userId,
      userId: myUuid,
      me: mySocketIdRef.current,
      name: name,
    });
  };

  const callUser = async id => {
    socketRef.current.emit('busy', {
      id: mySocketIdRef.current,
    });
    socketRef.current.emit('callUser', {
      userToCall: id,
      fromUuid: myUuidRef.current,
      from: mySocketIdRef.current,
      name: name,
      maxDuration: maxDurationRef.current,
      maxCallTime: maxCallTimeRef.current,
      callId: callIdRef.current,
    });
    setOtherUser(id);
    callingTuneRef.current.play();
    callDeclineTimeoutRef.current = setTimeout(() => {
      declineCall('Call cannot be established');
      stopRingtone();
    }, callDeclineAfterSeconds * 1000);
    myStatusRef.current = 'busy';
    socketRef.current.on('callAccepted', ({userName, from}) => {
      clearTimeout(callDeclineTimeoutRef.current);
      setCallAccepted(true);
      setUserName(userName);
      setCalling(false);
      socketRef.current.emit('updateMyMedia', {
        to: from,
        type: 'both',
        currentMediaStatus: [myMicStatusRef.current, myVideoStatusRef.current],
        triggeredBySocketId: mySocketIdRef.current,
        triggeredByUuid: myUuidRef.current,
      });
    });
  };

  const stopRingtone = () => {
    callingTuneRef.current.stop();
    receivingTuneRef.current.stop();
  };

  const answerCall = async () => {
    setCallTime('00:00');
    setAmount(0);
    setCallAccepted(true);
    setCallEnded(false);
    setOtherUser(call.from);
    setOtherUserUuid(call.fromUuid);
    otherUserUuidRef.current = call.fromUuid;
    setCallStatus('Connecting...');

    let data = {
      to: call.from,
      fromUuid: myUuidRef.current,
      from: mySocketIdRef.current,
      userName: name,
      md: call.maxDuration,
      type: 'both',
      myMediaStatus: [myMicStatusRef.current, myVideoStatusRef.current],
      callId: callIdRef.current,
    };

    console.log('receiver: ', data);
    socketRef.current.emit('answerCall', data);

    try {
      const peer2 = new RTCPeerConnection(servers);

      peer2.onicecandidate = event => {
        if (event.candidate) {
          socketRef.current.emit('signal', {
            to: call.from,
            from: 'peer2',
            signal: event.candidate,
          });
        }
      };

      peer2.onconnectionstatechange = event => {
        if (peer2.connectionState === 'connected') {
          console.log('peer2 connected at ' + Date.now());
          socketRef.current.emit('helperConnected', {
            callId: callIdRef.current,
          });
        }
      };

      peer2.ontrack = event => {
        otherPeerStream.current = event.streams[0];
      };

      activeStream.current.getTracks().forEach(track => {
        peer2.addTrack(track, activeStream.current);
      });

      socketRef.current.off('signal');

      socketRef.current.on('signal', async signal => {
        if (signal.type === 'offer') {
          await peer2.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await peer2.createAnswer();
          await peer2.setLocalDescription(answer);
          socketRef.current.emit('signal', {
            to: call.from,
            from: 'peer2',
            signal: peer2.localDescription,
          });
        } else if (signal.candidate) {
          await peer2.addIceCandidate(new RTCIceCandidate(signal));
        }
      });

      socketRef.current.off('bothUsersConnected');

      socketRef.current.on('bothUsersConnected', signal => {
        userConnected(0);
      });

      socketRef.current.emit('callEvent', {
        to: call.from,
        fromUuid: myUuidRef.current,
        from: mySocketIdRef.current,
        type: 'accepted',
      });

      console.log('event accepted');

      connectionRef.current = peer2;
    } catch (error) {
      console.warn('awnsr call', error);
    }
  };

  const updateVideo = () => {
    if (myVideoInitialStatusRef.current) {
      setMyVdoStatus(currentStatus => {
        if (otherUserSocketIdRef.current) {
          socketRef.current.emit('updateMyMedia', {
            callId: callIdRef.current,
            to: otherUserSocketIdRef.current,
            type: 'video',
            currentMediaStatus: !currentStatus,
            triggeredBySocketId: mySocketIdRef.current,
            triggeredByUuid: myUuidRef.current,
          });
        }
        if (activeStream.current?.getVideoTracks().length > 0) {
          activeStream.current.getVideoTracks()[0].enabled = !currentStatus;
        }
        myVideoStatusRef.current = !currentStatus;
        return !currentStatus;
      });
    } else {
      console.log("Can't access camera");
    }
  };

  const updateMic = () => {
    if (myMicInitialStatusRef.current) {
      setMyMicStatus(currentStatus => {
        socketRef.current.emit('updateMyMedia', {
          callId: callIdRef.current,
          to: otherUserSocketIdRef.current,
          type: 'mic',
          currentMediaStatus: !currentStatus,
          triggeredBySocketId: mySocketIdRef.current,
          triggeredByUuid: myUuidRef.current,
        });
        if (activeStream.current?.getAudioTracks().length > 0) {
          activeStream.current.getAudioTracks()[0].enabled = !currentStatus;
        }
        myMicStatusRef.current = !currentStatus;
        return !currentStatus;
      });
    } else {
      console.log("Can't access Microphone");
    }
  };

  const leaveCall = (sendSocketSignals = true) => {
    connectionRef.current.close();
    connectionRef.current = null;
    if (sendSocketSignals) {
      socketRef.current.emit('endCall', {
        callId: callIdRef.current,
        otherUserSocketId: otherUserSocketIdRef.current,
        myUuid: myUuidRef.current,
        otherUserUuid: otherUserUuidRef.current,
      });
      socketRef.current.emit('online', {id: mySocketIdRef.current});
    }
    otherUserSocketIdRef.current = null;
    otherUserUuidRef.current = null;
    setCallStatus('');
    setCallEnded(true);
    setCallDecline(true);
    setCallAccepted(false);
    setCallConnected(false);
    setIsShown(false);
    setChat([]);
    chatRef.current = [];
    setCd('');
    stopTimer();
    myStatusRef.current = 'online';
    clearInterval(currentInterval.current);
    inCallRef.current = false;
    callIdRef.current = null;
    setUserVideo(null);
    KeepAwake.deactivate();
    Sound.setCategory('Ambient');
    InCallManager.setSpeakerphoneOn(false);
    InCallManager.stopRingback();
    InCallManager.stopRingtone();
    InCallManager.stop({media: 'video'});
    panRef.setOffset({
      x: 0,
      y: 0,
    });
  };

  const endingCall = async () => {
    try {
      connectionRef.current?.close();
      connectionRef.current = null;
      socketRef.current.emit('online', {id: mySocketIdRef.current});
      otherUserSocketIdRef.current = null;
      otherUserUuidRef.current = null;
      setCallEnded(true);
      setCallDecline(true);
      setCallAccepted(false);
      setCallConnected(false);
      setChat([]);
      chatRef.current = [];
      setIsShown(false);
      setCd('');
      stopTimer();
      setCallStatus('');
      clearInterval(currentInterval.current);
      myStatusRef.current = 'online';
      inCallRef.current = false;
      callIdRef.current = null;
      Sound.setCategory('Ambient');
      InCallManager.setSpeakerphoneOn(false);
      InCallManager.stopRingback();
      InCallManager.stopRingtone();
      InCallManager.stop({media: 'video'});
      KeepAwake.deactivate();
      setUserVideo(null);
      panRef.setOffset({
        x: 0,
        y: 0,
      });
    } catch (error) {
      console.warn('error', errrprr);
    }
  };

  const declineCall = (callStatus = null) => {

    console.log(
      'decline call otherUserSocketIdRef.current',
      otherUserSocketIdRef.current,
    );

    if (
      otherUserStatusRef.current === 'online' ||
      callRef.current?.isReceivingCall
    ) {
      socketRef.current.emit('endCall', {
        callId: callIdRef.current,
        otherUserSocketId: otherUserSocketIdRef.current,
        cancel: 1,
        canceledByReceiver: callRef.current?.isReceivingCall,
      });
    }
    socketRef.current.emit('online', {id: mySocketIdRef.current});
    otherUserSocketIdRef.current = null;
    otherUserUuidRef.current = null;
    if (callStatus) {
      setCallStatus(callStatus);
      setCallingTimeoutRef.current = setTimeout(() => {
        setCallStatus('');
        setCalling(false);
      }, 3000);
    } else {
      stopRingtone();
      setCallStatus('');
      clearTimeout(setCallingTimeoutRef.current);
      setCalling(false);
    }
    clearTimeout(callDeclineTimeoutRef.current);
    setCallDecline(true);
    if (inCallRef.current) {
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
    }
    inCallRef.current = false;
    callIdRef.current = null;
    myStatusRef.current = 'online';
    stopTimer();
    
    panRef.setOffset({
      x: 0,
      y: 0,
    });
  };

  const sendMsg = (
    value,
    showFileSendingPreview = false,
    replaceIndex = -1,
    file = false,
    fileName = null,
    fileType = null,
  ) => {
    socketRef.current.emit('msgUser', {
      name,
      to: otherUserSocketIdRef.current,
      msg: file ? fileName : value,
      file,
      fileUrl: file ? value : '',
      fileType,
      // fileExt,
      sender: name,
      replaceIndex,
    });
    let msg = {};
    msg.msg = file ? fileName : value;
    msg.file = file;
    msg.fileUrl = value;
    msg.fileType = fileType;
    msg.type = 'sent';
    msg.timestamp = Date.now();
    msg.sender = name;
    console.log('chat', chatRef.current);
    if (replaceIndex >= 0) {
      chatRef.current[replaceIndex] = msg;
    } else {
      chatRef.current = [...chatRef.current, msg];
    }
    setChat(chatRef.current);
    if (showFileSendingPreview) {
      replaceIndex = chatRef.current.length - 1;
      setIsShown(true);
    }
    return replaceIndex;
  };
  return (
    <>
      <VideoContext.Provider
        value={{
          socketRef,
          call,
          callAccepted,
          callDecline,
          setCallDecline,
          userVideo,
          userVideoRef,
          myVideoInitialStatusRef,
          stream,
          name,
          setName,
          callEnded,
          setCallEnded,
          me,
          mySocketIdRef,
          callUser,
          leaveCall,
          answerCall,
          sendMsg,
          chat,
          setChat,
          setOtherUser,
          endingCall,
          userName,
          myVdoStatus,
          setMyVdoStatus,
          userVdoStatus,
          setUserVdoStatus,
          otherUserScreenShareStatus,
          updateVideo,
          myMicStatus,
          userMicStatus,
          updateMic,
          onlineUsers,
          calling,
          setCalling,
          declineCall,
          setCallStatus,
          callStatus,
          maxDuration,
          otherUserName,
          setOtherUserName,
          setMaxDuration,
          maxCallTime,
          setMaxCallTime,
          callTo,
          maxDurationRef,
          maxCallTimeRef,
          callRef,
          checkAudioVideoPermissions,
          setCall,
          pricePerMinute,
          isShown,
          callConnected,
          setIsShown,
          callTime,
          startTimer,
          stopCountDown,
          countDown,
          amount,
          otherUser,
          callDeclineTimeoutRef,
          setAmount,
          setCallTime,
          isShown,
          stopRingtone,
          activeStream,
          setTriggeredCameraViewByButton,
          triggeredCameraViewByButton,
          otherUserSocketIdRef,
          setCd,
          cd,
          myVideoStatusRef,
          setMyMicStatus,
          myMicStatusRef,
          myMicInitialStatusRef,
          setRefreshing,
          refreshing,
          chatRef,
          panRef,
        }}>
        {children}
      </VideoContext.Provider>
    </>
  );
};

export default VideoState;
