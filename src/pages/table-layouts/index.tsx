import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getTableLayouts, deleteTableLayoutById } from 'apiSdk/table-layouts';
import { TableLayoutInterface } from 'interfaces/table-layout';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function TableLayoutListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<TableLayoutInterface[]>(
    () => '/table-layouts',
    () =>
      getTableLayouts({
        relations: ['restaurant', 'reservation.count', 'waiter_assignment.count'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteTableLayoutById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Table Layout
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('table_layout', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/table-layouts/create`}>
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
                  <Th>table_number</Th>
                  <Th>seating_capacity</Th>
                  {hasAccess('restaurant', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>restaurant</Th>}
                  {hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>reservation</Th>
                  )}
                  {hasAccess('waiter_assignment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>waiter_assignment</Th>
                  )}
                  {hasAccess('table_layout', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && <Th>Edit</Th>}
                  {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('table_layout', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && <Th>Delete</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.table_number}</Td>
                    <Td>{record.seating_capacity}</Td>
                    {hasAccess('restaurant', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/restaurants/view/${record.restaurant?.id}`}>
                          {record.restaurant?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('reservation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.reservation}</Td>
                    )}
                    {hasAccess('waiter_assignment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.waiter_assignment}</Td>
                    )}
                    {hasAccess('table_layout', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/table-layouts/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('table_layout', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/table-layouts/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('table_layout', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'table_layout',
  operation: AccessOperationEnum.READ,
})(TableLayoutListPage);
