import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getReservations, deleteReservationById } from 'apiSdk/reservations';
import { ReservationInterface } from 'interfaces/reservation';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ReservationListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ReservationInterface[]>(
    () => '/reservations',
    () =>
      getReservations({
        relations: ['user', 'table_layout'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteReservationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Reservation
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('reservation', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/reservations/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>reservation_date</Th>
                  <Th>reservation_time</Th>
                  <Th>special_requests</Th>
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>user</Th>}
                  {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>table_layout</Th>
                  )}

                  {hasAccess('reservation', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('reservation', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.reservation_date as unknown as string}</Td>
                    <Td>{record.reservation_time as unknown as string}</Td>
                    <Td>{record.special_requests}</Td>
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user?.id}`}>
                          {record.user?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/table-layouts/view/${record.table_layout?.id}`}>
                          {record.table_layout?.restaurant_id}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('reservation', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/reservations/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/reservations/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('reservation', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'reservation',
  operation: AccessOperationEnum.READ,
})(ReservationListPage);
