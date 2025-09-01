import { useRouter } from "vue-router";

const userData = useCookie("userData");

export function checkRole(roles) {
  const router = useRouter();
  const userRole = userData.value?.role.name;
  const check = roles.includes(userRole);

  if (!check) {
    // redirect
    router.push({ name: "not-authorized" });
  }
}
