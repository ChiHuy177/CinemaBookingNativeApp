import {RoomTypeInRoomProps} from './roomType';
import {ShowingTimeInRoomProps} from './showingTime';

export interface RoomInCinemaProps {
  roomId: number;
  name: string;
  roomType: RoomTypeInRoomProps;
  showingTimes: ShowingTimeInRoomProps[];
}
