import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getWaiterAssignmentById, updateWaiterAssignmentById } from 'apiSdk/waiter-assignments';
import { Error } from 'components/error';
import { waiterAssignmentValidationSchema } from 'validationSchema/waiter-assignments';
import { WaiterAssignmentInterface } from 'interfaces/waiter-assignment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { WaiterInterface } from 'interfaces/waiter';
import { TableLayoutInterface } from 'interfaces/table-layout';
import { getWaiters } from 'apiSdk/waiters';
import { getTableLayouts } from 'apiSdk/table-layouts';

function WaiterAssignmentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WaiterAssignmentInterface>(
    () => (id ? `/waiter-assignments/${id}` : null),
    () => getWaiterAssignmentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: WaiterAssignmentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateWaiterAssignmentById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<WaiterAssignmentInterface>({
    initialValues: data,
    validationSchema: waiterAssignmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Waiter Assignment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<WaiterInterface>
              formik={formik}
              name={'waiter_id'}
              label={'Select Waiter'}
              placeholder={'Select Waiter'}
              fetcher={getWaiters}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.user_id}
                </option>
              )}
            />
            <AsyncSelect<TableLayoutInterface>
              formik={formik}
              name={'table_layout_id'}
              label={'Select Table Layout'}
              placeholder={'Select Table Layout'}
              fetcher={getTableLayouts}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.restaurant_id}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'waiter_assignment',
  operation: AccessOperationEnum.UPDATE,
})(WaiterAssignmentEditPage);
