import {RoomInCinemaProps} from './room';

export interface CinemaForBookingProps {
  cinemaId: number;
  name: string;
  rooms: RoomInCinemaProps[];
}

export interface CinemaInCityProps {
  cinemaId: number;
  name: string;
  address: string;
  hotline: string;
  city: string;
}

export interface CityData {
  cinemas: CinemaInCityProps[];
  city: string;
  count: number;
}
