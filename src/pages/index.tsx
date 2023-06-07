import { Button, Flex, Heading, Image, Text, Stack, useBreakpointValue } from '@chakra-ui/react';

import { signIn, signUp, requireNextAuth } from '@roq/nextjs';

import Head from 'next/head';
import { HelpBox } from 'components/help-box';

function HomePage() {
  return (
    <>
      <Head>
        <title>TableReserve v3</title>

        <meta
          name="description"
          content="Welcome to TableReserve v3: Revolutionizing the dining experience with seamless table bookings, personalized customer preferences, and optimized restaurant occupancy for unparalleled efficiency."
        />
      </Head>

      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack position="relative" spacing={6} w={'full'} maxW={'lg'}>
            <HelpBox />
            <Image src="/roq.svg" alt="Logo" w="150px" mb="8" />
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
              <Text as={'span'}>Explore the</Text>{' '}
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: useBreakpointValue({ base: '20%', md: '30%' }),
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'cyan.400',
                  zIndex: -1,
                }}
              >
                {`TableReserve v3`}
              </Text>
            </Heading>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
              {`Welcome to TableReserve v3: Revolutionizing the dining experience with seamless table bookings, personalized customer preferences, and optimized restaurant occupancy for unparalleled efficiency.`}
            </Text>
            <Text>Restaurant Owner</Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Button
                rounded={'full'}
                bg={'cyan.500'}
                color={'white'}
                _hover={{
                  bg: 'cyan.700',
                }}
                onClick={() => signUp('restaurant-owner')}
              >
                Register
              </Button>
              <Button rounded={'full'} onClick={() => signIn('restaurant-owner')}>
                Login
              </Button>
            </Stack>
            ,<Text>Customer</Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Button
                rounded={'full'}
                bg={'cyan.500'}
                color={'white'}
                _hover={{
                  bg: 'cyan.700',
                }}
                onClick={() => signUp('customer')}
              >
                Register
              </Button>
              <Button rounded={'full'} onClick={() => signIn('customer')}>
                Login
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image alt={'Login Image'} objectFit={'cover'} src={'/homebg.jpg'} />
        </Flex>
      </Stack>
    </>
  );
}

export default requireNextAuth({
  redirectIfAuthenticated: true,
  redirectTo: '/users',
})(HomePage);
