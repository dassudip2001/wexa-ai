import { useUserStore } from "@/store/userStore";

export const usePermission = () => {
  const user = useUserStore((state) => state.user);

  const hasRole = (
    organizationId: string,
    roles: string[]
  ) => {
    if (!user?.organizations) return false;

    return user.organizations.some(
      (org) =>
        org.organization_id === organizationId &&
        roles.includes(org.role)
    );
  };

  return {
    hasRole,
  };
};