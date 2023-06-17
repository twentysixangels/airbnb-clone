import { SafeUser } from '@/app/types';
import { useRouter } from 'next/navigation';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useCallback, useMemo, MouseEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface IUserFavorite {
	listingId: string;
	currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUserFavorite) => {
	const router = useRouter();
	const loginModal = useLoginModal();

	const hasFavorited = useMemo(() => {
		const list = currentUser?.favoriteIds || [];

		return list.includes(listingId);
	}, [listingId, currentUser]);

	const toggleFavorite = useCallback(
		async (e: MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();

			if (!currentUser) {
				return loginModal.onOpen();
			}

			try {
				let request;

				if (hasFavorited) {
					request = () => axios.delete(`/api/favorites/${listingId}`);
				} else {
					request = () => axios.post(`/api/favorites/${listingId}`);
				}

				await request();
				router.refresh();
				toast.success('Success');
			} catch (error: any) {
				toast.error('Something went wrong');
			}
		},
		[currentUser, hasFavorited, listingId, loginModal, router]
	);

	return {
		hasFavorited,
		toggleFavorite,
	};
};

export default useFavorite;