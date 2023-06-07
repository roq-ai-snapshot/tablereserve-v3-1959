import * as yup from 'yup';
import { reservationValidationSchema } from 'validationSchema/reservations';
import { waiterAssignmentValidationSchema } from 'validationSchema/waiter-assignments';

export const tableLayoutValidationSchema = yup.object().shape({
  table_number: yup.number().integer().required(),
  seating_capacity: yup.number().integer().required(),
  restaurant_id: yup.string().nullable().required(),
  reservation: yup.array().of(reservationValidationSchema),
  waiter_assignment: yup.array().of(waiterAssignmentValidationSchema),
});
