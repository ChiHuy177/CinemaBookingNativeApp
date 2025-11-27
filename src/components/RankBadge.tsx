import {StyleSheet, Text, View} from 'react-native';
import {colors, getRankColor} from '../constants/colors';

export default function RankBadge({rankName}: {rankName: string}) {
  return (
    <View style={[style.rankBadge, {backgroundColor: getRankColor(rankName)}]}>
      <Text
        style={[
          style.rankText,
          {
            color: rankName === 'NONE' ? colors.dark : colors.black,
          },
        ]}>
        {rankName}
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  rankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 65,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  rankText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
