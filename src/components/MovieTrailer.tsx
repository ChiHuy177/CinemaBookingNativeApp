import React, {useMemo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {Icon} from 'react-native-paper';
import YoutubePlayer from 'react-native-youtube-iframe';
import {getVideoId} from '../utils/functions';

const {width} = Dimensions.get('window');

const MovieTrailer = ({trailerURL}: {trailerURL: string}) => {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);

  const videoId = useMemo(() => {
    return getVideoId(trailerURL);
  }, [trailerURL]);

  const thumbnailURL = useMemo(() => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }, [videoId]);

  if (showPlayer) {
    return (
      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={200}
          videoId={videoId}
          play={true}
          onChangeState={(state: string) => {
            if (state === 'ended') {
              setShowPlayer(false);
            }
          }}
        />

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowPlayer(false)}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{uri: thumbnailURL}} style={styles.thumbnail} />

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => setShowPlayer(true)}>
        <Icon source="play-box" size={60} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '65%',
    left: '55%',
    transform: [{translateX: -55}, {translateY: -65}],
  },
  playText: {
    color: 'white',
    fontWeight: 'bold',
  },
  playerContainer: {
    width: width - 32,
    height: 220,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MovieTrailer;
