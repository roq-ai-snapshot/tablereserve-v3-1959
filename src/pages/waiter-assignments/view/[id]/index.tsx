import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getWaiterAssignmentById } from 'apiSdk/waiter-assignments';
import { Error } from 'components/error';
import { WaiterAssignmentInterface } from 'interfaces/waiter-assignment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function WaiterAssignmentViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WaiterAssignmentInterface>(
    () => (id ? `/waiter-assignments/${id}` : null),
    () =>
      getWaiterAssignmentById(id, {
        relations: ['waiter', 'table_layout'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Waiter Assignment Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {hasAccess('waiter', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Waiter:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/waiters/view/${data?.waiter?.id}`}>
                    {data?.waiter?.user_id}
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
  entity: 'waiter_assignment',
  operation: AccessOperationEnum.READ,
})(WaiterAssignmentViewPage);
