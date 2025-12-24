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