import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getTableLayoutById } from 'apiSdk/table-layouts';
import { Error } from 'components/error';
import { TableLayoutInterface } from 'interfaces/table-layout';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteReservationById } from 'apiSdk/reservations';
import { deleteWaiterAssignmentById } from 'apiSdk/waiter-assignments';

function TableLayoutViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TableLayoutInterface>(
    () => (id ? `/table-layouts/${id}` : null),
    () =>
      getTableLayoutById(id, {
        relations: ['restaurant', 'reservation', 'waiter_assignment'],
      }),
  );

  const reservationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteReservationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const waiter_assignmentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWaiterAssignmentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Table Layout Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Table Number:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.table_number}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Seating Capacity:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.seating_capacity}
            </Text>
            <br />
            {hasAccess('restaurant', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Restaurant:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/restaurants/view/${data?.restaurant?.id}`}>
                    {data?.restaurant?.name}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Reservations:
                </Text>
                <NextLink passHref href={`/reservations/create?table_layout_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>reservation_date</Th>
                        <Th>reservation_time</Th>
                        <Th>special_requests</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.reservation?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.reservation_date as unknown as string}</Td>
                          <Td>{record.reservation_time as unknown as string}</Td>
                          <Td>{record.special_requests}</Td>
                          <Td>
                            <NextLink passHref href={`/reservations/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/reservations/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => reservationHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('waiter_assignment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Waiter Assignments:
                </Text>
                <NextLink passHref href={`/waiter-assignments/create?table_layout_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.waiter_assignment?.map((record) => (
                        <Tr key={record.id}>
                          <Td>
                            <NextLink passHref href={`/waiter-assignments/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/waiter-assignments/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => waiter_assignmentHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
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
  entity: 'table_layout',
  operation: AccessOperationEnum.READ,
})(TableLayoutViewPage);
