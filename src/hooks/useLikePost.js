import { useState } from 'react'
import useAuthStore from '../store/authStore';
import useShowToast from './useShowToast';
import { arrayRemove, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

const useLikePost = (post) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?.uid));
  const showToast = useShowToast();

  const handleLikePost = async () => {
    if (isUpdating) return;
    if (!authUser) {
      showToast('Error', 'You need to be logged in to like a post', 'error');
      return;
    }
    setIsUpdating(true);
    try {
      const postRef = doc(firestore, "posts", post.id);
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
      });
      setIsLiked(!isLiked);
      isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
    } catch (error) {
      showToast('Error', error.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };
  return { isUpdating, handleLikePost, likes, isLiked };
}
export default useLikePost