/**
 * Centralized TestID registry.
 * - Prevents duplicates (TypeScript catches reuse)
 * - Single source of truth for Maestro flows
 * - Agent reads this to understand available selectors
 */

export const TestIds = {
  // Auth
  login: {
    screen: "login-screen-container",
    emailInput: "login-email-input",
    passwordInput: "login-password-input",
    submitButton: "login-submit-button",
    emailError: "login-email-error-text",
    passwordError: "login-password-error-text",
    forgotPassword: "login-forgot-password-link",
    signupLink: "login-signup-link",
  },

  signup: {
    screen: "signup-screen-container",
    emailInput: "signup-email-input",
    passwordInput: "signup-password-input",
    submitButton: "signup-submit-button",
  },

  // Home
  home: {
    screen: "home-screen-container",
    welcomeText: "home-welcome-text",
    settingsButton: "home-settings-button",
  },

  // Explore
  explore: {
    screen: "explore-screen-container",
    searchInput: "explore-search-input",
  },

  // Profile
  profile: {
    screen: "profile-screen-container",
    avatar: "profile-avatar-image",
    editButton: "profile-edit-button",
    logoutButton: "profile-logout-button",
  },

  // Navigation
  tabBar: {
    homeButton: "tab-bar-home-button",
    exploreButton: "tab-bar-explore-button",
    profileButton: "tab-bar-profile-button",
    chatButton: "tab-bar-chat-button",
    todoButton: "tab-bar-todo-button",
  },

  // Chat
  chat: {
    screen: "chat-screen-container",
    roomList: "chat-room-list",
    roomItem: (id: string) => `chat-room-${id}` as const,
    messageInput: "chat-message-input",
    sendButton: "chat-send-button",
  },

  // Todo
  todo: {
    screen: "todo-screen-container",
    list: "todo-list",
    addButton: "todo-add-button",
    item: (id: string) => `todo-item-${id}` as const,
    filterAll: "todo-filter-all",
    filterActive: "todo-filter-active",
    filterDone: "todo-filter-done",
  },

  // Paywall
  paywall: {
    screen: "paywall-screen-container",
    subscribeButton: "paywall-subscribe-button",
    closeButton: "paywall-close-button",
  },
} as const;
