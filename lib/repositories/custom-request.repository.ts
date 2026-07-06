import prisma from '../prisma';
import { CustomRequestStatus } from '@prisma/client';

export interface CreateCustomRequestData {
  userId?: string;
  name: string;
  email: string;
  details: string;
  imageUrls?: string[];
}

export async function createCustomRequest(data: CreateCustomRequestData) {
  return prisma.customRequest.create({
    data: {
      userId: data.userId,
      name: data.name,
      email: data.email,
      details: data.details,
      imageUrls: data.imageUrls ?? [],
      status: CustomRequestStatus.SUBMITTED,
    },
  });
}

export async function getCustomRequests(status?: CustomRequestStatus) {
  return prisma.customRequest.findMany({
    where: {
      deletedAt: null,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateCustomRequestStatus(id: string, status: CustomRequestStatus) {
  return prisma.customRequest.update({
    where: { id },
    data: { status },
  });
}
