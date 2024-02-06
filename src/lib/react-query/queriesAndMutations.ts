import {
 useQuery,
 useMutation,
 useQueryClient,
 QueryClient,
 QueryClientProvider,
 useInfiniteQuery,
} from '@tanstack/react-query';


import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePost, getPostById, getRecentPosts, getUserById, getUsers, likePost, savePost, searchPost, signInAccount, signOutAccount, updatePost, updateUser } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types';
import { CreatePost } from '@/_root/pages';
import { QUERY_KEYS } from './queryKeys';

// ceating user account in db
export const useCreateUserAccount = () => {
 return useMutation({
  mutationFn: (user: INewUser) => createUserAccount(user)
 })
}

// signin existing users
export const useSignInAccount = () => {
 return useMutation({
  mutationFn: (user: { email: string; password: string }) => signInAccount(user)
 })
}

// signout users
export const useSignOutAccount = () => {
 return useMutation({
  mutationFn: signOutAccount
 })
}

// creating posts of users
export const useCreatePost = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: (post: INewPost) => createPost(post),

  // using this by react query when we try to fetch the recent post it will not fetch from the cache rather it will fetch from the server
  onSuccess: () => {
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
   })
  }

 })
};

// traverse through the db and get all posts
export const useGetRecentPosts = () => {
 return useQuery({
  queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
  queryFn: getRecentPosts,
 })
}


// like post mutation
export const useLikePost = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: ({ postId, likesArray }: {postId: string; likesArray: string[]; }) => likePost(postId, likesArray),
  
  // this will allow to see the updated data values in all the possible pages of the application
  onSuccess: (data) => {
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID]
   })
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
   })
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_POSTS]
   })
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER]
   })
  }
 })
}

// save post mutation
export const useSavePost = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: ({ postId, userId }: {postId: string; userId: string; }) => savePost(postId, userId),
  
  // this will allow to see the updated data values in all the possible pages of the application
  onSuccess: (data) => {
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
   })
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_POSTS]
   })
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER]
   })
  }
 })
}

// delete save post mutation
export const useDeleteSavedPost = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: ( savedRecordId: string ) => deleteSavedPost(savedRecordId),
  
  // this will allow to see the updated data values in all the possible pages of the application
  onSuccess: (data) => {
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
   })
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_POSTS]
   })
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER]
   })
  }
 })
}

// 
export const useGetCurrentUser = () => {
 return useQuery({
  queryKey: [QUERY_KEYS.GET_CURRENT_USER],
  queryFn: getCurrentUser,
 })
}


// get post form data from db to edit the post
export const useGetPostById = (postId: string) => {
 return useQuery({
  queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
  queryFn: () => getPostById(postId),
  enabled: !!postId
 })
}

//update post mutation
export const useUpdatePost = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: (post: IUpdatePost) => updatePost(post),
  onSuccess: (data) => {
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
   })
  } 
 })
}

// delete post mutation
export const useDeletePost = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: ({ postId, imageId}: { postId: string, imageId: string}) => deletePost(postId, imageId),
  onSuccess: (data) => {
   queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
   })
  } 
 })
}

//get post for explore query
export const useGetPosts = () => {
 return useInfiniteQuery({
  queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
  queryFn: getInfinitePost,
  getNextPageParam: (lastPage) => {
   if(lastPage && lastPage.documents.length === 0) return null;

   const lastId = lastPage?.documents[lastPage?.documents.length-1].$id;

   return lastId;
  }
 })
}

// get search query
export const useSearchPosts = (searchTerm: string) => {
 return useQuery({
  queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm], 
  queryFn: () => searchPost(searchTerm),
  enabled: !!searchTerm

 })

}

export const useGetUsers = (limit?: number) => {
 return useQuery({
   queryKey: [QUERY_KEYS.GET_USERS],
   queryFn: () => getUsers(limit),
 });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    }
  })
}