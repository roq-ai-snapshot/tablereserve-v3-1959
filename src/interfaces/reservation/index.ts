import { UserInterface } from 'interfaces/user';
import { TableLayoutInterface } from 'interfaces/table-layout';

export interface ReservationInterface {
  id?: string;
  customer_id: string;
  table_layout_id: string;
  reservation_date: Date;
  reservation_time: Date;
  special_requests?: string;

  user?: UserInterface;
  table_layout?: TableLayoutInterface;
  _count?: {};
}
