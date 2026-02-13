"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Github } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { LoginInput, loginSchema } from "./models"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  })

  const isSubmitting = form.formState?.isSubmitting

  const loginUser: SubmitHandler<LoginInput> = async (payload) => {
    const { email, password } = payload
    const res = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
      rememberMe: false,
    })

    if (res?.error) {
      toast.error(res.error.message)
      return
    }

    toast.success("Login successful!")
  }

  return (
    <form
      onSubmit={form.handleSubmit(loginUser)}
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Link
                  href="/"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && (
              <span className="mr-2">
                <Spinner />
              </span>
            )}
            Login
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center gap-2 mb-2"
          >
            <Github />
            Login with GitHub
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
