import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useEffect, useState } from "react";


import { FcLike } from "react-icons/fc"; 
import { CiHeart } from "react-icons/ci";
import { BsSave2Fill } from "react-icons/bs";
import { BsSave2 } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa"
import { Loader } from "lucide-react";

type PostStatsProps = {
 post: Models.Document;
 userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {

  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setisSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSaved } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post?.$id === post?.$id);
  useEffect(() => {
   // setisSaved(savedPostRecord ? true : false); // same code but clean
   setisSaved(!!savedPostRecord);
  }, [currentUser])

  // handle like post
  const handleLikePost = (e: React.MouseEvent) => {
   e.stopPropagation();
   let newLikes = [...likes];

   if(newLikes.includes(userId)) {
    newLikes = newLikes.filter((id) => id !== userId)
   }else {
    newLikes.push(userId);
   }

   setLikes(newLikes);
   likePost({ postId: post?.$id, likesArray: newLikes })
  }

  // handle save post
  const handleSavePost = (e: React.MouseEvent) => {
   e.stopPropagation();

   // if already saved and cliked again then remove
   if(savedPostRecord) {
    setisSaved(false);
    deleteSavePost(savedPostRecord.$id);
    
   }else {
    savePost({ postId: post?.$id || '', userId});
    setisSaved(true);
   }
   
  }

  // handle comment - (soon to be implemented)
  const handleComment = () => {
   alert("This feature is under developement, soon you will be able to comment on the posts......Thank You")
  } 

  return (
    <div className="flex justify-between items-center z-20">
      
      {/* likes on post */}
      <div className="flex gap-2 mr-5 items-center">
       <div onClick={handleLikePost} className='text-3xl'>
        {checkIsLiked(likes, userId) ? <FcLike /> : <CiHeart />}
       </div>
       
       <p className="small-medium lg:first-letter:base-medium">{likes.length}</p>
      </div>

      {/* comment on posts (implement in the future) */}
      <div className="flex gap-2 mr-5 cursor-pointer text-2xl" onClick={handleComment}>
       <FaRegComment />
       <p className="small-medium lg:first-letter:base-medium"></p>
      </div>


      {/* save on posts */}
      <div className="flex gap-2">
       {isSavingPost || isDeletingSaved ? <Loader /> : <div className="cursor-pointer text-2xl" onClick={handleSavePost}>
         {isSaved ? <BsSave2Fill /> : <BsSave2 />}
       </div>}
      </div>
    </div>
  )
}

export default PostStats
