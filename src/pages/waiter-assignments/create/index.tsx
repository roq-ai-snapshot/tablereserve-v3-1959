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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createWaiterAssignment } from 'apiSdk/waiter-assignments';
import { Error } from 'components/error';
import { waiterAssignmentValidationSchema } from 'validationSchema/waiter-assignments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { WaiterInterface } from 'interfaces/waiter';
import { TableLayoutInterface } from 'interfaces/table-layout';
import { getWaiters } from 'apiSdk/waiters';
import { getTableLayouts } from 'apiSdk/table-layouts';
import { WaiterAssignmentInterface } from 'interfaces/waiter-assignment';

function WaiterAssignmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WaiterAssignmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWaiterAssignment(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WaiterAssignmentInterface>({
    initialValues: {
      waiter_id: (router.query.waiter_id as string) ?? null,
      table_layout_id: (router.query.table_layout_id as string) ?? null,
    },
    validationSchema: waiterAssignmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Waiter Assignment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'waiter_assignment',
  operation: AccessOperationEnum.CREATE,
})(WaiterAssignmentCreatePage);
