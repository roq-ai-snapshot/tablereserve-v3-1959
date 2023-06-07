import { WaiterInterface } from 'interfaces/waiter';
import { TableLayoutInterface } from 'interfaces/table-layout';

export interface WaiterAssignmentInterface {
  id?: string;
  waiter_id: string;
  table_layout_id: string;

  waiter?: WaiterInterface;
  table_layout?: TableLayoutInterface;
  _count?: {};
}
