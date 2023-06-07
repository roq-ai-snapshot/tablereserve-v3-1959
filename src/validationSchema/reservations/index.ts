import * as yup from 'yup';

export const reservationValidationSchema = yup.object().shape({
  reservation_date: yup.date().required(),
  reservation_time: yup.date().required(),
  special_requests: yup.string(),
  customer_id: yup.string().nullable().required(),
  table_layout_id: yup.string().nullable().required(),
});
