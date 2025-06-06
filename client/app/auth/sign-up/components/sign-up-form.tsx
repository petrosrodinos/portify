"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { IconBrandFacebook, IconBrandGithub } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "services/auth";
import { SignUpUser } from "interfaces/auth";
import { useAuthStore } from "stores/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { SignUpSchema, SignUpFormValues } from "validation-schemas/auth";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { CookieKeys } from "@/constants/cookies";
interface SignUpFormProps {
  className?: string;
  props?: any;
}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const searchParams = useSearchParams();
  const referral_code = searchParams.get("ref");
  const { login } = useAuthStore((state) => state);
  const router = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const {
    mutate,
    isPending,
    data: signUpData,
  } = useMutation({
    mutationFn: (data: SignUpUser) => signUp(data),
    onSuccess: (data) => {
      login(data);
      toast({
        title: "Register successful",
        description: "You have successfully registered in",
        duration: 1000,
      });
      router.push("/auth/create-user");
    },
    onError: (error) => {
      toast({
        title: "Could not sign up",
        description: error.message,
        duration: 3000,
      });
    },
  });

  function onSubmit(data: SignUpFormValues) {
    if (referral_code) {
      Cookies.set(CookieKeys.referral_code, referral_code);
    }
    mutate({ email: data.email, password: data.password });
  }

  useEffect(() => {
    if (signUpData) {
      router.prefetch("/auth/create-user");
    }
  }, [router, signUpData]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" disabled={isPending} loading={isPending}>
              Create Account
            </Button>

            {/* <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                <IconBrandGithub className="h-4 w-4" /> GitHub
              </Button>
              <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                <IconBrandFacebook className="h-4 w-4" /> Facebook
              </Button>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  );
}
