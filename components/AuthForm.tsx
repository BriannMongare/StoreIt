"use client"

import Image from "next/image"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
// })

type FormType = "sign-in" | "sign-up";

const authFormSchema = (FormType) =>{
  return z.object({
    email: z.string().email(),
    fullName: FormType ==="sign-up" ? z.string().min(2).max(50) : z.string().optional(),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading,setIsLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState("")

const formSchema = authFormSchema(type);
   // Initialize form options
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })

    // Define submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values) // Send this to a Server Action or API route
  }

  return (
    <>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
      <h1 className="form-title">{type === "sign-in" ? "Sign In" : "Sign Up"}</h1>
      {type==="sign-up" && (<FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>

            <div className="shad-form-item">
            <FormLabel className="shad-form-label">Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" className="shad-input" {...field} />
            </FormControl>
            </div>
            <FormMessage className="shad-form-message"/>
          </FormItem>
        )}
      />)}

        <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>

            <div className="shad-form-item">
            <FormLabel className="shad-form-label">Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter your email" className="shad-input" {...field} />
            </FormControl>
            </div>
            <FormMessage className="shad-form-message"/>
          </FormItem>
        )}
      />

      <Button type="submit" disabled={isLoading} className="form-submit-button ">
        {type==="sign-in" ? "Sign In" : "Sign Up"}
        {isLoading && (<Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className=""/>)}
      </Button>

      {errorMessage && (
        <p className="error-message">*errorMessage</p>
      )}

      <div className="body-2 flex justify-center">
        <p className="text-light-100">
          {type==="sign-in" ? "Don't have an account?" : "Already have an account?"}
        </p>

        <Link href={type==="sign-in" ? "/signUp" : "/signIn"} className="ml-1 text-brand font-bold">{type==="sign-in" ? "Sign Up" : "Sign In"}</Link>
      </div>
    </form>
  </Form>
  {/* OTP Verification can be added here in the future, depending on the type of form (sign-in or sign-up) */}
  </>
  )
}

export default AuthForm;