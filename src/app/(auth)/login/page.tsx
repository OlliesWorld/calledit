import { LoginForm } from '@/components/forms/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <Card className="w-full bg-surface2 border-white/10 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="text-center space-y-2 pt-8 pb-4">
        <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
        <CardDescription className="text-white/40 text-base">
          Sign in to check your picks
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8 px-8">
        <LoginForm />
      </CardContent>
    </Card>
  )
}
