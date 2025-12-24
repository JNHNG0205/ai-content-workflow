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

export async function reviewContent(contentId: string, reviewerId: string) {
    const result = await prisma.content.update({
        where: {
            id: contentId,
            status: Status.SUBMITTED, // Only review content that is submitted
        },
        data: {
            reviewerId,
        }
    });
    return result;
}

export async function approveContent(contentId: string, reviewerId: string) {
    const result = await prisma.content.update({
        where: {
            id: contentId,
            status: Status.SUBMITTED, // Only approve content that is submitted
            reviewerId: {
                not: null, // Content must have a reviewer
            },
            authorId: {
                not: reviewerId,
            },
        },
        data: {
            status: Status.APPROVED,
        }
    });

    return result;
}

export async function rejectContent(contentId: string, reviewerId: string, comment?: string) {
    const result = await prisma.content.update({
        where: {
            id: contentId,
            status: Status.SUBMITTED, // Only reject content that is submitted
            reviewerId: {
                not: null, // Content must have a reviewer
            },
            authorId: {
                not: reviewerId, // Reviewer cannot reject their own content
            },
        },
        data: {
            status: Status.REJECTED,
            reviewerId, // Set the reviewer who rejected it
            rejectionComment: comment || null,
        }
    });
    
    return result;
}

export async function getReviewedContent(reviewerId: string) {
    const result = await prisma.content.findMany({
        where: {
            reviewerId,
        },
        orderBy: {
            createdAt: "desc",
        }
    });
    return result;
}
