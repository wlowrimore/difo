import { client } from "@/sanity/lib/client";
import { auth } from "@/auth";
import {
  PLAYLIST_BY_SLUG_QUERY,
  SERVICE_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

import ServiceContent from "@/components/ServiceContent";

export const experimental_ppr = true;

const page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const id = params?.id;
  const session = await auth();

  const [post, playlist] = await Promise.all([
    client.fetch(SERVICE_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" }),
  ]);

  console.log("Full post data:", JSON.stringify(post, null, 2));

  const editorPosts = playlist?.select || [];
  console.log("PLAYLIST QUERY RESULT:", playlist);
  console.log("EDITOR POSTS", editorPosts);

  if (!post) return notFound();

  console.log("POST IN SERVICE PAGE:", post);

  const authorEmail = post.author?.email;
  const currentUserEmail = session?.user?.email || null;
  const isAuthor = Boolean(
    currentUserEmail && authorEmail && currentUserEmail === authorEmail
  );

  const createdUserName = post.author?.email?.split("@")[0];

  return (
    <>
      <ServiceContent
        post={post}
        contact={post?.author?.contact || ""}
        isAuthor={isAuthor}
        currentUserEmail={currentUserEmail}
        editorPosts={editorPosts}
      />
    </>
  );
};

export default page;
