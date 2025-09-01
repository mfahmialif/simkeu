// import { useAbility } from "@casl/vue";
import { useRouter } from "vue-router";

// TODO: Get type from backend
// const ability = useAbility();
const userData = useCookie("userData");

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    // Remove "accessToken" from cookie
    useCookie("accessToken").value = null;

    // Remove "userData" from cookie
    userData.value = null;

    // Redirect to login page
    await router.push("/login");

    // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page

    // Remove "userAbilities" from cookie
    useCookie("userAbilityRules").value = null;

    // Reset ability to initial ability
    // ability.update([]);
  };

  return {
    logout,
  };
}
