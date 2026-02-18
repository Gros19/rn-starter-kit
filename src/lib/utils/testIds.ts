/**
 * Centralized TestID registry.
 * - Prevents duplicates (TypeScript catches reuse)
 * - Single source of truth for Maestro flows
 */

export const TestIds = {
  // Auth
  login: {
    screen: 'login-screen-container',
    emailInput: 'login-email-input',
    passwordInput: 'login-password-input',
    submitButton: 'login-submit-button',
    forgotPassword: 'login-forgot-password-link',
    signupLink: 'login-signup-link',
  },

  signup: {
    screen: 'signup-screen-container',
    emailInput: 'signup-email-input',
    passwordInput: 'signup-password-input',
    submitButton: 'signup-submit-button',
  },

  // Onboarding
  onboarding: {
    screen: 'onboarding-screen-container',
    nextButton: 'onboarding-next-button',
    skipButton: 'onboarding-skip-button',
  },

  // Home
  home: {
    screen: 'home-screen-container',
    welcomeText: 'home-welcome-text',
    todoCard: 'home-todo-card',
    uploadCard: 'home-upload-card',
    notificationCard: 'home-notification-card',
    boardCard: 'home-board-card',
    chatCard: 'home-chat-card',
    galleryCard: 'home-gallery-card',
    feedCard: 'home-feed-card',
  },

  // Explore
  explore: {
    screen: 'explore-screen-container',
  },

  // Settings
  settings: {
    screen: 'settings-screen-container',
    logoutButton: 'settings-logout-button',
    darkModeSwitch: 'settings-dark-mode-switch',
    subscriptionCard: 'settings-subscription-card',
    notificationLink: 'settings-notification-link',
  },

  // Todo
  todo: {
    screen: 'todo-screen-container',
    addButton: 'todo-add-button',
    searchInput: 'todo-search-input',
    item: (id: string) => `todo-item-${id}`,
    statusToggle: (id: string) => `todo-status-toggle-${id}`,
    deleteButton: (id: string) => `todo-delete-button-${id}`,
  },

  // Upload
  upload: {
    screen: 'upload-screen-container',
    addButton: 'upload-add-button',
    item: (id: string) => `upload-item-${id}`,
    retryButton: (id: string) => `upload-retry-button-${id}`,
    sourceCamera: 'upload-source-camera',
    sourceGallery: 'upload-source-gallery',
    sourceDocument: 'upload-source-document',
  },

  // Notification
  notification: {
    screen: 'notification-settings-container',
    permissionButton: 'notification-permission-button',
    testButton: 'notification-test-button',
  },

  // Board
  board: {
    screen: 'board-screen-container',
    addButton: 'board-add-button',
    item: (id: string) => `board-item-${id}`,
  },

  // Chat
  chat: {
    roomList: 'chat-room-list-container',
    room: (id: string) => `chat-room-${id}`,
    messageInput: 'chat-message-input',
    sendButton: 'chat-send-button',
  },

  // Gallery
  gallery: {
    screen: 'gallery-screen-container',
    item: (id: string) => `gallery-item-${id}`,
  },

  // Feed
  feed: {
    screen: 'feed-screen-container',
    item: (id: string) => `feed-item-${id}`,
  },

  // Features
  features: {
    backButton: 'features-back-button',
  },

  // Navigation
  tabBar: {
    homeButton: 'tab-bar-home-button',
    exploreButton: 'tab-bar-explore-button',
    settingsButton: 'tab-bar-settings-button',
  },
} as const;
