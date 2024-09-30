import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';

let notificationId; // Variable to hold the notification ID




export default messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Ensure the socket is connected before handling the call

  const user = JSON.parse(remoteMessage?.data?.user);
  const callerName = `${user?.firstName} ${user?.lastName}`;
  const channelId = await notifee.createChannel({
    id: 'video_call',
    name: 'video call',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: false,
  });

  notificationId = await notifee.displayNotification({
    title: 'Incoming call',
    body: `Call is coming from  ${callerName}`,
    android: {
      channelId,
      category: AndroidCategory.CALL,
      visibility: AndroidVisibility.PUBLIC,
      timestamp: Date.now() + 30000,
      showChronometer: true,
      chronometerDirection: 'down',
      loopSound: true,
      showTimestamp: true,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
      },
      actions: [
        {
          title: 'Open Helpsoeasy',
          pressAction: {
            id: 'open',
            launchActivity: 'default',
          },
        },
      ],
    },
  });
});

export {notificationId}; // Export the notification ID
