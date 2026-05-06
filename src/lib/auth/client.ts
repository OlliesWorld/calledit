/**
 * Clerk Auth Client Utilities
 *
 * With Clerk, authentication is handled through components and hooks:
 *
 * For sign-in:
 * - Use <SignInButton> or <SignIn /> components
 * - Or use the useSignIn() hook for custom flows
 *
 * For sign-up:
 * - Use <SignUpButton> or <SignUp /> components
 * - Or use the useSignUp() hook for custom flows
 *
 * For sign-out:
 * - Use the useClerk() hook: const { signOut } = useClerk()
 *
 * For OAuth (Google, etc.):
 * - Configure in Clerk Dashboard
 * - Use <SignInButton> with mode="modal" or redirect
 */

export { useClerk, useSignIn, useSignUp, useUser } from '@clerk/nextjs'
