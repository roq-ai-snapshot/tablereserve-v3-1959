import { WaiterAssignmentInterface } from 'interfaces/waiter-assignment';
import { UserInterface } from 'interfaces/user';
import { RestaurantInterface } from 'interfaces/restaurant';

export interface WaiterInterface {
  id?: string;
  user_id: string;
  restaurant_id: string;
  waiter_assignment?: WaiterAssignmentInterface[];
  user?: UserInterface;
  restaurant?: RestaurantInterface;
  _count?: {
    waiter_assignment?: number;
  };
}
