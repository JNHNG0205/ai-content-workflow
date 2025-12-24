import { prisma } from "../config/prisma";
import { Status } from "../generated/prisma";

export async function createDraft(title: string, body: string, authorId: string) {
    const result = await prisma.content.create({
        data: {
            title, 
            body,
            status: Status.DRAFT,
            authorId,
        }
    });
    return result;
}

export async function getMyDrafts(authorId: string) {
    const result = await prisma.content.findMany({
        where: {
            authorId,
            status: Status.DRAFT,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
}

export async function getContentById(contentId: string, authorId: string) {
    const result = await prisma.content.findFirst({
        where: {
            id: contentId,
            authorId, // Ensure user can only access their own content
        },
    });
    return result;
}

export async function submitDraft(contentId: string, authorId: string)  {
    const result = await prisma.content.update({
        where: {
            id: contentId,
            authorId, 
            status: Status.DRAFT, // Only submit content that is in DRAFT status
        },
        data: {
            status: Status.SUBMITTED,
        }
    });
    
    return result;
} 

export async function getSubmittedContent(authorId: string) {
    const result = await prisma.content.findMany({
        where: {
            authorId,
            status: Status.SUBMITTED,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
}

export async function getRejectedContent(authorId: string) {
    const result = await prisma.content.findMany({
        where: {
            authorId,
            status: Status.REJECTED,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
}

export async function getApprovedContent(authorId: string) {
    const result = await prisma.content.findMany({
        where: {
            authorId,
            status: Status.APPROVED,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
}

export async function editRejectedContent(contentId: string, authorId: string) {
    const result = await prisma.content.update({
        where: {
            id: contentId,
            authorId,
            status: Status.REJECTED, // Only edit content that is in REJECTED status
        },
        data: {
            status: Status.DRAFT, // Change status back to DRAFT for editing
        }
    });
    return result;
}

export async function updateContent(contentId: string, authorId: string, title: string, body: string) {
    const result = await prisma.content.update({
        where: {
            id: contentId,
            authorId,
            status: Status.DRAFT, // Only update content that is in DRAFT status
        },
        data: {
            title,
            body,
        }
    });
    return result;
}
