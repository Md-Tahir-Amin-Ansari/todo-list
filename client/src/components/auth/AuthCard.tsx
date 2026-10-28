import { useState } from "react";
import { Button } from "../tailgrids/core/button";
import { Label } from "../tailgrids/core/label";
import { Input } from "../tailgrids/core/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../tailgrids/core/card";
import { z } from "zod";
import { TextField } from "../tailgrids/core/text-field";
import { Link } from "../tailgrids/core/link";
import type { AuthCredentials } from '@/types';

interface AuthCardProps {
    onSubmit: (data: AuthCredentials) => void;
    errorMessage?: string;
    loading?: boolean;
}

const LoginSchema = z.object({
    name: z.string().min(3, "Name too short"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Must contain at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least 1 symbol")
});
const SignUpSchema = LoginSchema.extend({
    email: z.email("Invalid Email")

})

export default function AuthCard({ onSubmit, errorMessage, loading }: AuthCardProps) {

    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSignUp, setIsSignUp] = useState<boolean>(true)

    const handleSubmit = (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault();
        if (isSignUp) {
            const result = SignUpSchema.safeParse({
                name,
                email,
                password
            });
            if (!result.success) {
                setError(result.error.issues[0]?.message ?? "Invalid Input")
                return
            } else {
                setError('')
                onSubmit(result.data)
            }
        } else {
            const result = LoginSchema.safeParse({
                name,
                password
            });
            if (!result.success) {
                setError(result.error.issues[0]?.message ?? "Invalid Input")
                return
            } else {
                setError('')
                onSubmit(result.data)
            }
        }
    }

    return (
        <Card className="max-w-md w-full border border-base-200 shadow-sm">
            <CardHeader>
                <CardTitle>{isSignUp ? 'Create account' : "Welcome back"}</CardTitle>
                <CardDescription>{isSignUp ? "Start organising your day." : "Log in to see your tasks."}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="flex flex-col gap-4">
                    <TextField className="w-full">
                        <Label htmlFor="name" className="font-bold">Name</Label>
                        <Input
                            id="name"
                            type="name"
                            value={name}
                            placeholder="Your name"
                            className="w-full"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </TextField>
                    {isSignUp && (<TextField className="w-full">
                        <Label htmlFor="email" className="font-bold">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            placeholder="you@mail.com"
                            className="w-full"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </TextField>)}
                    <TextField className="w-full">
                        <Label htmlFor="password" className="font-bold">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            placeholder="At least 8 characters"
                            className="w-full"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </TextField>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <div className="min-h-[24px] pt-4 flex items-center justify-center">
                        {(error || errorMessage) && (
                            <p className="text-sm text-error-500 font-medium text-center">
                                {(error || errorMessage)}
                            </p>
                        )}
                    </div>
                    <Button type='submit' variant="primary" className='w-full my-3' pending={loading}>{isSignUp ? "Create account" : "Log in"}</Button>
                    <div className="flex items-center justify-center gap-1.5  text-text-100">
                        <span>{isSignUp ? "Have an account?" : "New here?"}</span>
                        <Link className="font-bold" variant="primary" type="button" onClick={() => setIsSignUp(!isSignUp)} href={""}>{isSignUp ? "Log in" : "Sign up"}</Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}