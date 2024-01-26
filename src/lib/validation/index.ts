import * as z from "zod";


export const SignupValidation = z.object({
 name: z.string().min(2, {message: 'Name is too short'}), 
 username: z.string().min(2, {message: 'Username cannot be empty'}),
 email: z.string().email(),
 password: z.string().min(8, {message: 'Password must be of atleast 8 characters'})
});


export const SigninValidation = z.object({
 email: z.string().email(),
 password: z.string().min(8, {message: 'Password must be of atleast 8 characters'})
});


export const PostValidation = z.object({
 caption: z.string().min(5).max(1000),
 file: z.custom<File[]>(),
 location: z.string().min(0).max(120),
 tags: z.string(),
})