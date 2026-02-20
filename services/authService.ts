"use client";

import { authClient } from "@/utils/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuthService = () => {
  const queryClient = useQueryClient();

  const getSession = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data } = await authClient.getSession()
      return data;
    },
    retry: false,
  });

  const signInWithGoogle = useMutation({
    mutationFn: async () => {
      const { data } = (await authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
      }))

      return data;
    },
  });

  const signOut = useMutation({
    mutationFn: async () => await authClient.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(["auth-session"], null);
    },
  });

  return {
    getSession,
    signInWithGoogle,
    signOut,
  };
};
