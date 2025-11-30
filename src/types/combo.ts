import {SeatSelectionParamProps} from './seat';

export interface ComboProps {
  comboId: number;
  name: string;
  imageURL: string;
  quantity: number;
  price: number;
}

export interface SelectedComboProps {
  combo: ComboProps;
  quantity: number;
}

export interface ComboParamProps {
  seatParam: SeatSelectionParamProps;
  selectedCombos: SelectedComboProps[];
  totalPriceCombos: number;
}

export interface ComboInTicketProps {
  comboId: number;
  quantity: number;
  name: string;
}

export interface UnAvailableCombosProps {
  comboId: number;
  name: string;
}
