import {useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoContext from '../../store/VideoContext';

export const VideoCallBottom = ({bluetooth, wiredPlugin , earPiece , onPress}) => {
    
  const {
    callAccepted,
    leaveCall,
    myVdoStatus,
    myMicStatus,
    updateMic,
    calling,
    declineCall,
    stopCountDown,
    updateVideo,
    setIsShown,
    isShown,
  } = useContext(VideoContext);

  const audioRouteIcon = () => {
    if (bluetooth) {
      return <MaterialCommunityIcons name="bluetooth" size={24} color="#000" />;
    } else if (wiredPlugin) {
      return (
        <MaterialCommunityIcons name="headphones" size={24} color="#000" />
      );
    } else {
      return <MaterialIcons size={24} name="volume-up" color="#000" />;
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        padding: 12,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 999,
        width: '100%',
      }}>
      <TouchableOpacity
        onPress={() => {
          updateMic();
        }}>
        <View
          style={{
            height: 39,
            width: 39,
            borderRadius: 39,
            backgroundColor: '#bbbbbb',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {myMicStatus ? (
            <MaterialIcons size={24} name="mic" color="#000" />
          ) : (
            <MaterialIcons size={24} name="mic-off" color="#000" />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={bluetooth && wiredPlugin ? true : false}>
        <View
          style={{
            height: 39,
            width: 39,
            borderRadius: 39,
            backgroundColor: earPiece ? '#555555' : '#bbbbbb',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {audioRouteIcon()}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          stopCountDown();
          if (calling && !callAccepted) {
            declineCall();
          } else {
            leaveCall();
          }
        }}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 30,
            backgroundColor: '#FB0707',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons name="phone-hangup" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          updateVideo();
        }}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 30,
            backgroundColor: '#bbbbbb',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {myVdoStatus ? (
            <MaterialCommunityIcons name="video" size={24} color="#000" />
          ) : (
            <MaterialCommunityIcons name="video-off" size={24} color="#000" />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setIsShown(!isShown);
        }}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 30,
            backgroundColor: '#bbbbbb',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: isShown ? 1 : 0.5,
          }}>
          <MaterialCommunityIcons
            name="chat-processing-outline"
            size={24}
            color="#000"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

{
  /* <TouchableOpacity
    onPress={() => {
      uploadImage();
    }}>
    <View>
      <Image
        source={require('../assets/pin7.png')}
        resizeMode="contain"
        style={{opacity: 0.5}}
      />
    </View>
  </TouchableOpacity> */
}
