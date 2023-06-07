import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { tableLayoutValidationSchema } from 'validationSchema/table-layouts';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTableLayouts();
    case 'POST':
      return createTableLayout();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTableLayouts() {
    const data = await prisma.table_layout
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'table_layout'));
    return res.status(200).json(data);
  }

  async function createTableLayout() {
    await tableLayoutValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.reservation?.length > 0) {
      const create_reservation = body.reservation;
      body.reservation = {
        create: create_reservation,
      };
    } else {
      delete body.reservation;
    }
    if (body?.waiter_assignment?.length > 0) {
      const create_waiter_assignment = body.waiter_assignment;
      body.waiter_assignment = {
        create: create_waiter_assignment,
      };
    } else {
      delete body.waiter_assignment;
    }
    const data = await prisma.table_layout.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
