export type ErrorType =
  | "configuration"
  | "access_denied"
  | "verification"
  | "oauth_signin"
  | "oauth_callback"
  | "oauth_create_account"
  | "email_create_account"
  | "callback"
  | "oauth_account_not_linked"
  | "email_signin"
  | "credentials_signin"
  | "session_required"
  | "default";

export const errorMap: Record<
  ErrorType,
  { title: string; message: string; action?: string }
> = {
  configuration: {
    title: "Configuration Error",
    message:
      "There was a problem with the authentication configuration. Please contact support.",
  },
  access_denied: {
    title: "Access Denied",
    message: "You do not have permission to access this resource.",
  },
  verification: {
    title: "Verification Failed",
    message: "The verification link has expired or is invalid.",
    action: "Try signing in again",
  },
  oauth_signin: {
    title: "OAuth Sign-in Error",
    message: "There was a problem starting the OAuth sign-in process.",
    action: "Try again",
  },
  oauth_callback: {
    title: "Authentication Cancelled",
    message: "The authentication process was cancelled or failed.",
    action: "Try signing in again",
  },
  oauth_create_account: {
    title: "Account Creation Failed",
    message: "Unable to create your account. Please try again.",
    action: "Try again",
  },
  email_create_account: {
    title: "Email Account Creation Failed",
    message: "Unable to create your email account. Please try again.",
    action: "Try again",
  },
  callback: {
    title: "Callback Error",
    message: "There was a problem with the authentication callback.",
    action: "Try again",
  },
  oauth_account_not_linked: {
    title: "Account Not Linked",
    message:
      "This account is not linked to your existing account. Please sign in with the correct provider.",
    action: "Sign in with correct provider",
  },
  email_signin: {
    title: "Email Sign-in Error",
    message: "There was a problem with email sign-in.",
    action: "Try again",
  },
  credentials_signin: {
    title: "Credentials Error",
    message: "Invalid credentials. Please check your username and password.",
    action: "Try again",
  },
  session_required: {
    title: "Session Required",
    message: "You must be signed in to access this page.",
    action: "Sign in",
  },
  default: {
    title: "Authentication Error",
    message: "An unexpected error occurred during authentication.",
    action: "Try again",
  },
};
