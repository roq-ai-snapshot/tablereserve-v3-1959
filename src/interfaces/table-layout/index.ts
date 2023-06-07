import { ReservationInterface } from 'interfaces/reservation';
import { WaiterAssignmentInterface } from 'interfaces/waiter-assignment';
import { RestaurantInterface } from 'interfaces/restaurant';

export interface TableLayoutInterface {
  id?: string;
  restaurant_id: string;
  table_number: number;
  seating_capacity: number;
  reservation?: ReservationInterface[];
  waiter_assignment?: WaiterAssignmentInterface[];
  restaurant?: RestaurantInterface;
  _count?: {
    reservation?: number;
    waiter_assignment?: number;
  };
}
