import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// converting database time format to understandable date format
export function timeAgo(dateString: string): string {
  const currentDate: Date = new Date();
  const pastDate: Date = new Date(dateString);

  const timeDifference: number = currentDate.getTime() - pastDate.getTime();
  const seconds: number = Math.floor(timeDifference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
}

// check if liked
export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};