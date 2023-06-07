import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getRestaurantById } from 'apiSdk/restaurants';
import { Error } from 'components/error';
import { RestaurantInterface } from 'interfaces/restaurant';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteTableLayoutById } from 'apiSdk/table-layouts';
import { deleteWaiterById, createWaiter } from 'apiSdk/waiters';

function RestaurantViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RestaurantInterface>(
    () => (id ? `/restaurants/${id}` : null),
    () =>
      getRestaurantById(id, {
        relations: ['user', 'table_layout', 'waiter'],
      }),
  );

  const table_layoutHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteTableLayoutById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [waiterUserId, setWaiterUserId] = useState(null);
  const waiterHandleCreate = async () => {
    setCreateError(null);
    try {
      await createWaiter({ restaurant_id: id, user_id: waiterUserId });
      setWaiterUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const waiterHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWaiterById(id);
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
        Restaurant Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.name}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Location:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.location}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Contact Information:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.contact_information}
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
                <Text fontSize="lg" fontWeight="bold">
                  Table Layouts:
                </Text>
                <NextLink passHref href={`/table-layouts/create?restaurant_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>table_number</Th>
                        <Th>seating_capacity</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.table_layout?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.table_number}</Td>
                          <Td>{record.seating_capacity}</Td>
                          <Td>
                            <NextLink passHref href={`/table-layouts/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/table-layouts/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => table_layoutHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            <>
              <Text fontSize="lg" fontWeight="bold">
                Waiters:
              </Text>
              <UserSelect name={'waiter_user'} value={waiterUserId} handleChange={setWaiterUserId} />
              <Button colorScheme="blue" mt="4" mr="4" onClick={waiterHandleCreate} isDisabled={!waiterUserId}>
                Create
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Email</Th>

                      <Th>View</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.waiter?.map((record) => (
                      <Tr key={record?.user?.id}>
                        <Td>{record?.user?.email}</Td>

                        <Td>
                          <NextLink href={`/users/view/${record?.user?.id}`} passHref>
                            <Button as="a">View</Button>
                          </NextLink>
                        </Td>
                        <Td>
                          <Button onClick={() => waiterHandleDelete(record.id)}>Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'restaurant',
  operation: AccessOperationEnum.READ,
})(RestaurantViewPage);
