<script setup>
import { ref, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";
import {
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  ArrowRightStartOnRectangleIcon,
  KeyIcon,
  UserPlusIcon,
  Bars3Icon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";
import NavbarItem from "./NavbarItem.vue";
import { useToast } from "vue-toastification";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const showMenu = ref(false);

const guestLinks = [
  { to: "/login", label: "LOGIN", icon: KeyIcon },
  { to: "/register", label: "REGISTER", icon: UserPlusIcon },
];

const authLinks = [
  { to: "/dashboard", label: "DASHBOARD", icon: ChartBarIcon },
  { to: "/dashboard/history", label: "HISTORY", icon: DocumentTextIcon },
  { to: "/dashboard/console", label: "CONSOLE", icon: ChatBubbleLeftIcon },
];

const isAuthenticated = computed(() => authStore.isAuthenticated);

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
  localStorage.clear();
  authStore.logout();
  showMenu.value = false;
  router.push("/");
  toast.success("You have successfully logged out.");
}

const logoutClass =
  "block px-3 py-2 text-red-600 hover:bg-red-100 hover:text-red-700 w-full text-left rounded-md transition cursor-pointer flex items-center gap-2";
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
                <NavbarItem
                  :to="link.to"
                  :icon="link.icon"
                  :label="link.label"
                  :is-mobile="true"
                />
              </li>
            </template>
            <template v-else>
              <li
                v-for="link in authLinks"
                :key="link.to"
                class="border-b border-gray-50 mb-2 last:mb-0"
              >
                <NavbarItem
                  :to="link.to"
                  :icon="link.icon"
                  :label="link.label"
                  :is-mobile="true"
                />
              </li>
              <li>
                <button
                  @click="
                    showLogoutConfirmation = true;
                    showMenu = false;
                  "
                  :class="logoutClass"
                >
                  <ArrowRightStartOnRectangleIcon
                    class="w-5 h-5 inline-block"
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
              <NavbarItem :to="link.to" :icon="link.icon" :label="link.label" />
            </li>
          </template>
          <template v-else>
            <li v-for="link in authLinks" :key="link.to">
              <NavbarItem :to="link.to" :icon="link.icon" :label="link.label" />
            </li>
            <li>
              <button
                @click="showLogoutConfirmation = true"
                :class="logoutClass"
              >
                <ArrowRightStartOnRectangleIcon class="w-5 h-5 inline-block" />
                <span class="hidden lg:inline">LOGOUT</span>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </div>
</template>
