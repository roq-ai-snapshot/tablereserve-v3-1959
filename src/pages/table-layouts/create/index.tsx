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
import { createTableLayout } from 'apiSdk/table-layouts';
import { Error } from 'components/error';
import { tableLayoutValidationSchema } from 'validationSchema/table-layouts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getUsers } from 'apiSdk/users';
import { UserInterface } from 'interfaces/user';
import { getWaiters } from 'apiSdk/waiters';
import { WaiterInterface } from 'interfaces/waiter';
import { getRestaurants } from 'apiSdk/restaurants';
import { TableLayoutInterface } from 'interfaces/table-layout';

function TableLayoutCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TableLayoutInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTableLayout(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TableLayoutInterface>({
    initialValues: {
      table_number: 0,
      seating_capacity: 0,
      restaurant_id: (router.query.restaurant_id as string) ?? null,
      reservation: [],
      waiter_assignment: [],
    },
    validationSchema: tableLayoutValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Table Layout
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="table_number" mb="4" isInvalid={!!formik.errors?.table_number}>
            <FormLabel>Table Number</FormLabel>
            <NumberInput
              name="table_number"
              value={formik.values?.table_number}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('table_number', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.table_number && <FormErrorMessage>{formik.errors?.table_number}</FormErrorMessage>}
          </FormControl>
          <FormControl id="seating_capacity" mb="4" isInvalid={!!formik.errors?.seating_capacity}>
            <FormLabel>Seating Capacity</FormLabel>
            <NumberInput
              name="seating_capacity"
              value={formik.values?.seating_capacity}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('seating_capacity', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.seating_capacity && <FormErrorMessage>{formik.errors?.seating_capacity}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<RestaurantInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Select Restaurant'}
            placeholder={'Select Restaurant'}
            fetcher={getRestaurants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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
  entity: 'table_layout',
  operation: AccessOperationEnum.CREATE,
})(TableLayoutCreatePage);
