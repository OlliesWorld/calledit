import { SignupForm } from '@/components/forms/signup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md bg-surface2 border-white/10 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="text-center space-y-2 pt-8 pb-4">
        <CardTitle className="text-2xl font-bold text-white">Join the community</CardTitle>
        <CardDescription className="text-white/40 text-base">
          Create your account and start building today
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8 px-8">
        <SignupForm />
      </CardContent>
    </Card>
  )
}
