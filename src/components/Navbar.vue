<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";
import {
  ChatBubbleLeftIcon,
  TrashIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  ArrowRightStartOnRectangleIcon,
  KeyIcon,
  UserPlusIcon,
  Bars3Icon,
} from "@heroicons/vue/24/outline";
import NavbarItem from "./NavbarItem.vue";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const showMenu = ref(false);

const guestLinks = [
  { to: "/login", label: "LOGIN", icon: KeyIcon },
  { to: "/register", label: "REGISTER", icon: UserPlusIcon },
];

const authLinks = [
  { to: "/dashboard/save", label: "ADD TRANSACTION", icon: PlusCircleIcon },
  { to: "/dashboard/erase", label: "DELETE", icon: TrashIcon },
  { to: "/dashboard/show", label: "HISTORY", icon: DocumentTextIcon },
  { to: "/dashboard/console", label: "CONSOLE", icon: ChatBubbleLeftIcon },
];

const classNames = {
  active: "text-blue-600 font-bold border-b-2 border-blue-600",
  inactive: "text-gray-700 hover:text-blue-600",
};

const currentRoute = computed(() => route.fullPath);

const isAuthenticated = computed(() => authStore.isAuthenticated);

function isActive(path) {
  return currentRoute.value === path ? classNames.active : classNames.inactive;
}

// Menu Click Outside Logic

import { onMounted, onBeforeUnmount } from "vue";
import LogoutConfirmation from "./LogoutConfirmation.vue";

function handleClickOutside(event) {
  const menu = document.getElementById("mobileMenu");
  if (showMenu.value && menu && !menu.contains(event.target)) {
    showMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

// Logout Confirmation Logic

const showLogoutConfirmation = ref(false);

function handleLogout() {
  authStore.logout();
  showMenu.value = false;
  router.push("/");
  toast.success("You have successfully logged out.");
}
</script>

<template>
  <div class="bg-white border-b border-gray-200 shadow-md">
    <LogoutConfirmation
      v-model="showLogoutConfirmation"
      @confirm="handleLogout"
      @cancel="showLogoutConfirmation = false"
    />
    <nav
      class="flex flex-wrap items-center justify-between px-6 py-2 md:py-4 mx-auto max-w-7xl w-full"
    >
      <div class="flex items-center space-x-4">
        <RouterLink
          class="text-2xl font-bold text-blue-600 tracking-wide"
          :to="isAuthenticated ? '/dashboard' : '/'"
        >
          HANIERICK
        </RouterLink>
      </div>
      <!-- Mobile Menu Button -->
      <div class="relative md:hidden" id="mobileMenu">
        <button
          class="md:hidden text-gray-700 focus:outline-none hover:bg-blue-50 hover:text-blue-700 p-2 rounded-md transition cursor-pointer"
          type="button"
          aria-label="Toggle navigation"
          @click="showMenu = !showMenu"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2"
        >
          <ul class="py-1">
            <template v-if="!isAuthenticated">
              <li
                v-for="link in guestLinks"
                :key="link.to"
                class="border-b border-gray-50 mb-2 last:mb-0"
              >
                <RouterLink
                  :to="link.to"
                  :class="`block px-4 py-2 ${isActive(
                    link.to
                  )} hover:bg-blue-50 hover:text-blue-700 transition rounded-md `"
                  @click="showMenu = false"
                >
                  <component
                    v-if="link.icon"
                    :is="link.icon"
                    class="w-5 h-5 inline-block mr-1"
                  />
                  {{ link.label }}
                </RouterLink>
              </li>
            </template>
            <template v-else>
              <li
                v-for="link in authLinks"
                :key="link.to"
                class="border-b border-gray-50 mb-2 last:mb-0"
              >
                <RouterLink
                  :to="link.to"
                  :class="`block px-4 py-2 ${isActive(
                    link.to
                  )} hover:bg-blue-50 hover:text-blue-700 transition rounded-md`"
                  @click="showMenu = false"
                >
                  <component
                    v-if="link.icon"
                    :is="link.icon"
                    class="w-5 h-5 inline-block mr-4"
                  />
                  {{ link.label }}
                </RouterLink>
              </li>
              <li>
                <button
                  @click="
                    showLogoutConfirmation = true;
                    showMenu = false;
                  "
                  class="block px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-700 w-full text-left rounded-md transition cursor-pointer"
                >
                  <ArrowRightStartOnRectangleIcon
                    class="w-5 h-5 inline-block mr-4"
                  />
                  LOGOUT
                </button>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <!-- Desktop Menu -->
      <div
        class="mt-3 md:mt-0 w-full md:flex md:items-center md:w-auto hidden"
        id="navbarSupportedContent"
      >
        <ul
          class="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0"
        >
          <template v-if="!isAuthenticated">
            <li v-for="link in guestLinks" :key="link.to">
              <NavbarItem
                :to="link.to"
                :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
                  link.to
                )}`"
              >
                {{ link.label }}
              </NavbarItem>
            </li>
          </template>
          <template v-else>
            <li v-for="link in authLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                :class="`block px-3 py-2 rounded-md font-medium transition ${isActive(
                  link.to
                )}`"
              >
                <component
                  v-if="link.icon"
                  :is="link.icon"
                  class="w-5 h-5 inline-block lg:hidden"
                />
                <span class="hidden lg:inline">{{ link.label }}</span>
              </RouterLink>
            </li>
            <li>
              <button
                @click="showLogoutConfirmation = true"
                class="block px-3 py-2 rounded-md font-medium transition text-red-600 hover:bg-red-100 hover:text-red-700 cursor-pointer"
              >
                <ArrowRightStartOnRectangleIcon
                  class="w-5 h-5 inline-block mr-1 lg:hidden"
                />
                <span class="hidden lg:inline">LOGOUT</span>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </div>
</template>
