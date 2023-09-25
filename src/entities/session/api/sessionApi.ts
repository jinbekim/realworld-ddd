import { useQuery } from '@tanstack/vue-query';
import { useSessionStore, type User } from '../model/sessionModel';
import { userApi } from '@/shared/api';
import type { UserDto } from '@/shared/api/user';

export const sessionKeys = {
  session: {
    root: ['session'],
    currentUser: () => [...sessionKeys.session.root, 'currentUser'],
  },

  mutation: {
    login: () => [...sessionKeys.session.root, 'login'],
    register: () => [...sessionKeys.session.root, 'register'],
  },
} as const;

const toDomain = (dto: UserDto): User => {
  return {
    email: dto.email,
    token: dto.token,
    username: dto.username,
    bio: dto.bio,
    image: dto.image,
  };
};

export const useCurrentUser = () =>
  useQuery({
    queryKey: sessionKeys.session.currentUser(),
    queryFn: async () => {
      const response = await userApi.currentUser();
      const { addUser } = useSessionStore();

      const user = toDomain(response);
      addUser(user);

      return user;
    },
  });
