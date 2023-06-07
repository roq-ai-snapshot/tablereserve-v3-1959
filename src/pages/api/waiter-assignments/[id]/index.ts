import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { waiterAssignmentValidationSchema } from 'validationSchema/waiter-assignments';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.waiter_assignment
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getWaiterAssignmentById();
    case 'PUT':
      return updateWaiterAssignmentById();
    case 'DELETE':
      return deleteWaiterAssignmentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWaiterAssignmentById() {
    const data = await prisma.waiter_assignment.findFirst(convertQueryToPrismaUtil(req.query, 'waiter_assignment'));
    return res.status(200).json(data);
  }

  async function updateWaiterAssignmentById() {
    await waiterAssignmentValidationSchema.validate(req.body);
    const data = await prisma.waiter_assignment.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteWaiterAssignmentById() {
    const data = await prisma.waiter_assignment.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
