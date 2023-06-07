import * as yup from 'yup';
import { waiterAssignmentValidationSchema } from 'validationSchema/waiter-assignments';

export const waiterValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  restaurant_id: yup.string().nullable().required(),
  waiter_assignment: yup.array().of(waiterAssignmentValidationSchema),
});
