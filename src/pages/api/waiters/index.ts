import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { waiterValidationSchema } from 'validationSchema/waiters';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getWaiters();
    case 'POST':
      return createWaiter();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWaiters() {
    const data = await prisma.waiter
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'waiter'));
    return res.status(200).json(data);
  }

  async function createWaiter() {
    await waiterValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.waiter_assignment?.length > 0) {
      const create_waiter_assignment = body.waiter_assignment;
      body.waiter_assignment = {
        create: create_waiter_assignment,
      };
    } else {
      delete body.waiter_assignment;
    }
    const data = await prisma.waiter.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
