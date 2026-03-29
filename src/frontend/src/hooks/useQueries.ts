import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project } from "../backend.d";
import { useActor } from "./useActor";

export function useApprovedProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["approvedProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["pendingProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["myProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      category,
      price,
      contactLink,
    }: {
      name: string;
      description: string;
      category: string;
      price: number;
      contactLink: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).submitProject(
        name,
        description,
        category,
        price,
        contactLink,
      ) as Promise<bigint>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
  });
}

export function useApproveProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingProjects"] });
      queryClient.invalidateQueries({ queryKey: ["approvedProjects"] });
    },
  });
}

export function useRejectProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingProjects"] });
    },
  });
}

export function useUnlockContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).unlockContact(id) as Promise<string>;
    },
  });
}
