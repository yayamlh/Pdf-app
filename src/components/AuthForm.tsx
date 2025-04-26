import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  isLogin: boolean;
  onSuccess: () => void;
}

interface FormData {
  email: string;
  password: string;
  fullName?: string;
}

const AuthForm = ({ isLogin, onSuccess }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("Account created successfully!");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
          <Input
            {...register("fullName")}
            placeholder="Full Name"
            type="text"
            disabled={isLoading}
            className="h-11"
          />
        </div>
      )}
      <div className="space-y-2">
        <Input
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          placeholder="Email"
          type="email"
          disabled={isLoading}
          className="h-11"
        />
        {errors.email && (
          <p className="text-sm text-red-500 px-1">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Input
          {...register("password", { 
            required: "Password is required", 
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
          placeholder="Password"
          type="password"
          disabled={isLoading}
          className="h-11"
        />
        {errors.password && (
          <p className="text-sm text-red-500 px-1">{errors.password.message}</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full h-11 bg-purple hover:bg-purple-dark transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          isLogin ? "Sign In" : "Create Account"
        )}
      </Button>
    </form>
  );
};

export default AuthForm;