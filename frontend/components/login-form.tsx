"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/store/authStore"
import { useUserStore } from "@/store/userStore"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginSchema = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  
  const loginMutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await api.post('/login/', data);
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success("Login successful!");
      
      const { setTokens } = useAuthStore.getState();
      const { setUser } = useUserStore.getState();

      if (data.access) {
        setTokens(data.access, data.refresh);
        document.cookie = `access_token=${data.access}; path=/; max-age=86400; SameSite=Lax`;
      }
      if (data.refresh) {
        document.cookie = `refresh_token=${data.refresh}; path=/; max-age=604800; SameSite=Lax`;
      }

      // Populate user details directly if returned from login, or fetch from get-user
      if (data.id && data.email) {
        setUser({ id: data.id, email: data.email, first_name: data.first_name, last_name: data.last_name });
      } else {
        try {
          const userRes = await api.get('/get-user');
          setUser(userRes.data);
        } catch (e) {
          console.error("Failed to fetch user details", e);
        }
      }

      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      toast.error(error.response?.data?.detail || "Login failed. Please check your credentials.");
    }
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
