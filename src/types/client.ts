import {RankProps} from './rank';

export interface EditClientProfileProps {
  clientId: number;
  name: string;
  email: string;
  phoneNumber: string;
  doB: Date;
  city: string;
  address: string;
  genre: boolean;
  avatarObject: {
    uri: string;
    type: string;
    fileName: string;
  } | null;
}

export interface ClientProfileProps {
  clientId: number;
  name: string;
  email: string;
  phoneNumber: string;
  doB: Date;
  city: string;
  address: string;
  genre: boolean;
  loyalPoints: number;
  rank: RankProps;
  avatar: string;
}

export interface ChangePasswordProfileProps {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ClientInReviewProps {
  name: string;
  avatar: string;
}
