import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { timeAgo } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import PostStats from "@/components/shared/PostStats";

const PostDetails = () => {
  const { id } = useParams();

  const { data: post, isPending } = useGetPostById(id || "");

  const { user } = useUserContext();

  // handle delete function
  function handleDeletePost() {}

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator_image"
            className="post_details-img"
          />

          <div className="post_details-info ">
            <div className="flex-between w-full">
              {/* THIS WILL TAKE TO THE CREATORS PROFILE */}
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex gap-2 items-center"
              >
                <img
                  src={post?.creator?.imageUrl}
                  alt="user"
                  className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {timeAgo(post?.$createdAt)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              {/* actions */}
              <div className="flex-center gap-2">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${
                    user.id !== post?.creator.$id && "hidden"
                  } hover:text-green-600`}
                >
                  <p className="text-2xl">
                    <FaEdit />
                  </p>
                </Link>

                <Button
                  onClick={handleDeletePost}
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                  variant="ghost"
                >
                  <p className="text-2xl text-red hover:text-white">
                    <RiDeleteBin5Line />
                  </p>
                </Button>
              </div>
            </div>

            {/* caption and tags */}
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
              <p>{post?.caption}</p>
            </div>

            {/*  */}
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
