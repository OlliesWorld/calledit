import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-red-600 dark:text-red-400">
            Authentication Error
          </CardTitle>
          <CardDescription>
            There was a problem signing you in. This could be due to:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Invalid authentication code</li>
            <li>• Expired authentication session</li>
            <li>• Configuration issues</li>
          </ul>

          <div className="pt-4 space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">
                Try signing in again
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                Go home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}