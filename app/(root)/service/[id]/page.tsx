import { client } from "@/sanity/lib/client";
import { auth } from "@/auth";
import {
  PLAYLIST_BY_SLUG_QUERY,
  SERVICE_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { UpdateButton, DeleteButton } from "@/components/MutationButtons";
// import { Blocks } from "lucide-react";
// import { PackageMinus } from "lucide-react";

import ServiceCard, { ServiceTypeCard } from "@/components/ServiceCard";

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const [post, playlist] = await Promise.all([
    client.fetch(SERVICE_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks" }),
  ]);

  const editorPosts = playlist?.select || [];
  console.log("PLAYLIST QUERY RESULT:", playlist);
  console.log("EDITOR POSTS", editorPosts);

  if (!post) return notFound();

  const authorEmail = post.author?.email;
  console.log("SESSION:", session);
  console.log("AUTHOR EMAIL:", authorEmail);

  const isAuthor = authorEmail === session?.user?.email;
  console.log("IS AUTHOR:", isAuthor);
  const createdUserName = post.author?.email?.split("@")[0];
  const username = `@${createdUserName}`;

  const parsedContent = post?.pitch || "";

  return (
    <>
      <section className="sticky blue_container bg-swirl-pattern">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <span className="relative">
          <Image
            src={post.image as string}
            alt="service image"
            width={1000}
            height={1000}
            className="mx-auto max-w-[55rem] rounded-xl shadow-md shadow-neutral-700 border border-neutral-400"
          />
          {isAuthor && (
            <span className="absolute bottom-6 right-52 z-1 bg-black/90 px-4 py-1.5 rounded-full flex gap-4 items-center">
              <UpdateButton service={post} />
              <DeleteButton service={post} />
            </span>
          )}
        </span>

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full w-16 h-16 object-cover drop-shadow-lg"
              />

              <div className="leading-5">
                <p className="text-xl font-semibold">{post.author.name}</p>
                <p className="text-small">{username}</p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="text-black max-w-4xl font-work-sans"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}

          <hr className="divider" />

          {editorPosts?.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <p className="text-30-semibold">Editor Picks</p>

              <ul className="mt-7 card_grid-sm">
                {editorPosts.map((post: ServiceTypeCard, i: number) => (
                  <ServiceCard key={i} post={post} service={post} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
