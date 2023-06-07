import * as yup from 'yup';

export const waiterAssignmentValidationSchema = yup.object().shape({
  waiter_id: yup.string().nullable().required(),
  table_layout_id: yup.string().nullable().required(),
});
