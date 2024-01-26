import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";


const SignUpForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext(); 
  const navigate = useNavigate();

  // mutation
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // this function will create a new user in the app auth
    const newUser = await createUserAccount(values);

    if(!newUser) {
      return toast({
        title: " Sign Up Failed Please Try Again ",
      })
    }
  
    const session = await signInAccount({
      email: values.email,
      password: values.password
    });
    if(!session) {
      return toast({
        title: " Sign In Failed Please Try Again ",
      })
    }

    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn) {
      form.reset();
      navigate('/');
    }else {
      return toast({
        title: " Sign up Failed Please Try Again ",
      })
    }


  }


  const [show, setShow] = useState(true);

  return (

    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="flex justify-center items-center gap-3">
          
        </div>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8 flex flex-col items-center gap-3" >
          <p>Welcome to Social House</p>
          <p>Log in to your account</p>
        </h2>
        <p className="text-light-4 small-medium md:base-regular mt-5">
          To use Social House enter your details
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Name" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a Username" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a valid e-mail" type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex items-center rounded-md shad-input">
                    <Input 
                      placeholder="Enter your password" 
                      type={show ? "password" : "text"} 
                      className="bg-dark-3 border-none" 
                      {...field} 
                    />
                    <p className="cursor-pointer p-4 text-[25px]" onClick={() => setShow(!show)}>
                      {
                        show ? <FaEyeSlash /> : <FaEye />
                      }
                      
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount ? (
              <div className="flex-center gap-2 ">
                <Loader /> Loading...
              </div>
            ) : "SignUp"}
          </Button>
          
          <p className="text-small-regular text-light-2 text-center mt-2"> 
              Already have an account?
              <Link to="/sign-in" className="text-primary-500 hover:underline hover:text-blue-500">Login</Link>
          </p>
          
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;
