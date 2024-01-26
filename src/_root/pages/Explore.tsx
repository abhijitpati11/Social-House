import GridPostList from "@/components/shared/GridPostList";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { useInView } from 'react-intersection-observer';

const Explore = () => {

  // infinite scroll 
  const { ref, inView } = useInView();
 
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState('');
  const shouldShowSearchResults = searchValue !== '';

  // serchvalue will be updated after every key stroke, and on calling our api on every kep press it will put load on server and api might crash hence we will use the method of debouncing where we call it after certain miliseconds to decrease the load.

  const debouncedValue = useDebounce(searchValue, 750);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);

  useEffect(() => {
    if(inView && !searchValue) fetchNextPage();
  }, [inView, searchValue]) 

  if(!posts) {
     return <div className="flex-center w-full h-full">
      <Loader2 />
    </div>
  }

  const shouldShowPosts = !shouldShowSearchResults && posts?.pages.every((item) => item?.documents.length === 0);

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-3 items-center'>
          <p className="text-2xl"><IoIosSearch /></p>
          <Input 
            type="text"
            placeholder="Search captions..."
            className="explore-search bg-dark-3"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/*  */}
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h2 className="body-bold md:h3-bold">Popular Today</h2>
        
        {/* All Button - to show all data */}
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <p><IoFilter /></p>
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults 
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of Posts</p>
        ) : posts?.pages.map((item, index) => (
          <GridPostList key={`page-${index}`} posts={item?.documents} />
        ))}
      </div>

      {/* infinite scroll */}
      <div ref={ref} className="mt-10">
        <Loader />
      </div>

    </div>
  )
}

export default Explore
