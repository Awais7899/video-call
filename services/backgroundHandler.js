import notifee, {EventType} from '@notifee/react-native';

export default notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  switch (type) {
    case EventType.ACTION_PRESS:
      if (pressAction.id === 'accept' || pressAction.id === 'open') {
        // Bring the app to the foreground when "Accept" or notification is pressed
        await notifee.cancelNotification(notification.id);
        // Add your logic to handle the call accept action here
      } else if (pressAction.id === 'reject') {
        // Handle the reject action
        await notifee.cancelNotification(notification.id);
        // Add any additional logic for rejection here
      }
      break;
    default:
      break;
  }
});
