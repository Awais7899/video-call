import Sound from 'react-native-sound';
import {AppState} from 'react-native';

module.exports = {
  playSilentAudio: () => {
    Sound.setCategory('Playback');
    const silentSound = new Sound(
      'silent_audio.aac',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        silentSound.setNumberOfLoops(-1);
        AppState.addEventListener('change', _handleAppStateChange.bind(this));
        function _handleAppStateChange(state) {
          if (state === 'background') {
            silentSound.stop();
            silentSound.play();
          }
        }
      },
    );
  },
};
