import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';
import { searchPost } from '@/lib/appwrite/api';


type SeachResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
}

const SearchResults = ({ isSearchFetching, searchedPosts }: SeachResultsProps) => {

  if(isSearchFetching) return <Loader />

  if(searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchedPosts.documents}/>
    )
  }

  return (
    <div className='flex justify-center m-auto p-7 text-light-4'>
      No Result Found
    </div>
  )
}

export default SearchResults
