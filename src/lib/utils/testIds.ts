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

  // Home
  home: {
    screen: 'home-screen-container',
    welcomeText: 'home-welcome-text',
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
  },

  // Navigation
  tabBar: {
    homeButton: 'tab-bar-home-button',
    exploreButton: 'tab-bar-explore-button',
    settingsButton: 'tab-bar-settings-button',
  },
} as const;
