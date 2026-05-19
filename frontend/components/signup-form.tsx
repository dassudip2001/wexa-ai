"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Plus, Trash2, Building2, Users, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  organization_name: z.string().min(1, "Organization name is required"),
  invites: z.array(z.object({
    email: z.string().email("Invalid email address").or(z.literal(''))
  })).optional(),
});

type SignupSchema = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const { register, control, handleSubmit, trigger, formState: { errors } } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      organization_name: "",
      invites: [{ email: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invites",
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupSchema) => {
      // Filter out empty invites before submitting
      const payload = {
        ...data,
        invites: data.invites?.filter(inv => inv.email.trim() !== "") || []
      };
      
      const response = await api.post('/signup/', payload);
      return response.data;
    },
    onSuccess: (payload) => {
      toast.success("Account created successfully!");
      const { setTokens } = useAuthStore.getState();
      
      if (payload.access) {
        setTokens(payload.access, payload.refresh);
        document.cookie = `access_token=${payload.access}; path=/; max-age=86400; SameSite=Lax`;
      }
      if (payload.refresh) {
        document.cookie = `refresh_token=${payload.refresh}; path=/; max-age=604800; SameSite=Lax`;
      }
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      toast.error(error.response?.data?.detail || "Signup failed. Please try again.");
    }
  });

  const onSubmit = (data: SignupSchema) => {
    signupMutation.mutate(data);
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ["username", "email", "password"];
    } else if (step === 2) {
      fieldsToValidate = ["organization_name"];
    }

    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-lg mx-auto w-full", className)} {...props}>
      <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm dark:bg-zinc-950/50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("h-2 flex-1 rounded-full", step >= 1 ? "bg-primary" : "bg-muted")} />
            <div className={cn("h-2 flex-1 rounded-full", step >= 2 ? "bg-primary" : "bg-muted")} />
            <div className={cn("h-2 flex-1 rounded-full", step >= 3 ? "bg-primary" : "bg-muted")} />
          </div>
          
          {step === 1 && (
            <>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <User className="h-5 w-5 text-primary" />
                Create Account
              </CardTitle>
              <CardDescription>
                Enter your details to get started.
              </CardDescription>
            </>
          )}
          {step === 2 && (
            <>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Building2 className="h-5 w-5 text-primary" />
                Setup Organization
              </CardTitle>
              <CardDescription>
                Create your workspace for your team.
              </CardDescription>
            </>
          )}
          {step === 3 && (
            <>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-5 w-5 text-primary" />
                Invite Team (Optional)
              </CardTitle>
              <CardDescription>
                Invite others to join your organization.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* STEP 1: Account Details */}
            {step === 1 && (
              <FieldGroup className="animate-in fade-in slide-in-from-right-4 duration-300">
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 font-medium mt-1">{errors.username.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 font-medium mt-1">{errors.email.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 font-medium mt-1">{errors.password.message}</p>
                  )}
                </Field>
                
                <Button type="button" onClick={nextStep} className="w-full mt-4 group">
                  Continue to Organization
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>

                <FieldDescription className="text-center mt-4">
                  Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
                </FieldDescription>
              </FieldGroup>
            )}

            {/* STEP 2: Organization */}
            {step === 2 && (
              <FieldGroup className="animate-in fade-in slide-in-from-right-4 duration-300">
                <Field>
                  <FieldLabel htmlFor="organization_name">Organization Name</FieldLabel>
                  <Input
                    id="organization_name"
                    type="text"
                    placeholder="e.g. Acme Corp"
                    {...register("organization_name")}
                    autoFocus
                  />
                  {errors.organization_name && (
                    <p className="text-sm text-red-500 font-medium mt-1">{errors.organization_name.message}</p>
                  )}
                </Field>

                <div className="flex gap-3 mt-4">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="flex-1 group">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </FieldGroup>
            )}

            {/* STEP 3: Invites */}
            {step === 3 && (
              <FieldGroup className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Field key={field.id}>
                      <FieldLabel htmlFor={`invites.${index}.email`} className={index !== 0 ? "sr-only" : ""}>
                        Team Member Email
                      </FieldLabel>
                      <div className="flex gap-2">
                        <Input
                          id={`invites.${index}.email`}
                          placeholder="colleague@example.com"
                          {...register(`invites.${index}.email`)}
                          className="flex-1"
                        />
                        {fields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      {errors.invites?.[index]?.email && (
                        <p className="text-sm text-red-500 font-medium mt-1">{errors.invites[index]?.email?.message}</p>
                      )}
                    </Field>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => append({ email: "" })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Member
                  </Button>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 shadow-md hover:shadow-lg transition-shadow" 
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? "Creating Account..." : "Complete Setup"}
                  </Button>
                </div>
              </FieldGroup>
            )}

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
