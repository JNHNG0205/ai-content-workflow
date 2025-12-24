import { prisma } from "../config/prisma";
import { Status } from "../generated/prisma";

export async function getPendingReviews() {
    const result = await prisma.content.findMany({
        where: {
            status: Status.SUBMITTED,
        },
        orderBy: {
            createdAt: "desc",
        }
    });
    return result;
}

export async function approveContent(contentId: string, reviewerId: string) {
    const result = await prisma.content.update({
        where: {
            id: contentId,
            status: Status.SUBMITTED, // Only approve content that is submitted
            authorId: {
                not: reviewerId,
            },
        },
        data: {
            status: Status.APPROVED,
            reviewerId,
        }
    });

    return result;
}

export async function rejectContent(contentId: string, reviewerId: string) {
    const result = await prisma.content.update({
        where: {
            id: contentId,
            status: Status.SUBMITTED, // Only reject content that is submitted
            authorId: {
                not: reviewerId,
            },
        },
        data: {
            status: Status.REJECTED,
            reviewerId,
        }
    });
    
    return result;
}
