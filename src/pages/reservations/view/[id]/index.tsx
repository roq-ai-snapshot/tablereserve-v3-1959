import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getReservationById } from 'apiSdk/reservations';
import { Error } from 'components/error';
import { ReservationInterface } from 'interfaces/reservation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ReservationViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ReservationInterface>(
    () => (id ? `/reservations/${id}` : null),
    () =>
      getReservationById(id, {
        relations: ['user', 'table_layout'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Reservation Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Reservation Date:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.reservation_date as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Reservation Time:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.reservation_time as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Special Requests:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.special_requests}
            </Text>
            <br />
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                    {data?.user?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Table Layout:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/table-layouts/view/${data?.table_layout?.id}`}>
                    {data?.table_layout?.restaurant_id}
                  </Link>
                </Text>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'reservation',
  operation: AccessOperationEnum.READ,
})(ReservationViewPage);
