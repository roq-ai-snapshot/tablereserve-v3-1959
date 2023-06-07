import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getWaiterAssignments, deleteWaiterAssignmentById } from 'apiSdk/waiter-assignments';
import { WaiterAssignmentInterface } from 'interfaces/waiter-assignment';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function WaiterAssignmentListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<WaiterAssignmentInterface[]>(
    () => '/waiter-assignments',
    () =>
      getWaiterAssignments({
        relations: ['waiter', 'table_layout'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWaiterAssignmentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Waiter Assignment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('waiter_assignment', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/waiter-assignments/create`}>
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
                  {hasAccess('waiter', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>waiter</Th>}
                  {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>table_layout</Th>
                  )}

                  {hasAccess('waiter_assignment', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('waiter_assignment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('waiter_assignment', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    {hasAccess('waiter', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/waiters/view/${record.waiter?.id}`}>
                          {record.waiter?.user_id}
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

                    {hasAccess('waiter_assignment', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/waiter-assignments/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('waiter_assignment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/waiter-assignments/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('waiter_assignment', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'waiter_assignment',
  operation: AccessOperationEnum.READ,
})(WaiterAssignmentListPage);
