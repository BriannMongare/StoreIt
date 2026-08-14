"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type FormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: FormType }) => {

   // Initialize form options
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
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
              <Input placeholder="brianmongare" {...field} />
            </FormControl>
            </div>
            
          </FormItem>
        )}
      />)}
      <Button type="submit" className="form-submit-button ">
        Submit
      </Button>
    </form>
  </Form>
  {/* OTP Verification can be added here in the future, depending on the type of form (sign-in or sign-up) */}
  </>
  )
}

export default AuthForm