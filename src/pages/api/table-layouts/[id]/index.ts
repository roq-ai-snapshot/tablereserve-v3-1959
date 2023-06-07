import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { tableLayoutValidationSchema } from 'validationSchema/table-layouts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.table_layout
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTableLayoutById();
    case 'PUT':
      return updateTableLayoutById();
    case 'DELETE':
      return deleteTableLayoutById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTableLayoutById() {
    const data = await prisma.table_layout.findFirst(convertQueryToPrismaUtil(req.query, 'table_layout'));
    return res.status(200).json(data);
  }

  async function updateTableLayoutById() {
    await tableLayoutValidationSchema.validate(req.body);
    const data = await prisma.table_layout.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteTableLayoutById() {
    const data = await prisma.table_layout.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
