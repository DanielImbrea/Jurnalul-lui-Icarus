import { prisma, withDbFallback } from "@/lib/db";

export type CommunityPostStatus =
  | "PENDING"
  | "APPROVED"
  | "HIDDEN"
  | "REJECTED";

export interface CommunityPostPublic {
  id: string;
  name: string;
  content: string;
  email?: string | null;
  isAuthorReply: boolean;
  createdAt: Date;
  replies: CommunityPostPublic[];
}

type CommunityPostItemRow = {
  id: string;
  name: string;
  content: string;
  email: string | null;
  emailApproved: boolean;
  isAuthorReply: boolean;
  createdAt: Date;
};

type CommunityPostRow = CommunityPostItemRow & {
  replies: CommunityPostItemRow[];
};

function publicEmail(post: { email: string | null; emailApproved: boolean }) {
  return post.emailApproved && post.email ? post.email : null;
}

function mapPost(post: CommunityPostRow): CommunityPostPublic {
  const email = publicEmail(post);

  return {
    id: post.id,
    name: post.name,
    content: post.content,
    ...(email ? { email } : {}),
    isAuthorReply: post.isAuthorReply,
    createdAt: post.createdAt,
    replies: post.replies.map((reply) => {
      const replyEmail = publicEmail(reply);

      return {
        id: reply.id,
        name: reply.name,
        content: reply.content,
        ...(replyEmail ? { email: replyEmail } : {}),
        isAuthorReply: reply.isAuthorReply,
        createdAt: reply.createdAt,
        replies: []
      };
    })
  };
}

export async function getApprovedCommunityThreads(limit = 40) {
  return withDbFallback(async () => {
    const posts = await prisma.communityPost.findMany({
      where: {
        parentId: null,
        status: "APPROVED"
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        content: true,
        email: true,
        emailApproved: true,
        isAuthorReply: true,
        createdAt: true,
        replies: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            name: true,
            content: true,
            email: true,
            emailApproved: true,
            isAuthorReply: true,
            createdAt: true
          }
        }
      }
    });

    return posts.map(mapPost);
  }, []);
}

export async function countPendingCommunityPosts() {
  return withDbFallback(
    () => prisma.communityPost.count({ where: { status: "PENDING" } }),
    0
  );
}

export async function getAdminCommunityPosts(status?: CommunityPostStatus) {
  return withDbFallback(
    () =>
      prisma.communityPost.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          parent: {
            select: { id: true, name: true, content: true }
          }
        }
      }),
    []
  );
}
