import { SignupForm } from '@/components/forms/signup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Force dynamic rendering - auth pages require Clerk at runtime
export const dynamic = 'force-dynamic'

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md border-stone-200 shadow-xl shadow-stone-200/50 rounded-3xl overflow-hidden">
      <CardHeader className="text-center space-y-2 pt-8 pb-4">
        <CardTitle className="text-2xl font-bold text-stone-900">Join the community</CardTitle>
        <CardDescription className="text-stone-500 text-base">
          Create your account and start building today
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8 px-8">
        <SignupForm />
      </CardContent>
    </Card>
  )
}
