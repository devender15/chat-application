import { SignIn } from "@clerk/nextjs";

import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login | socialhope",
}

export default function Page() {
    return     <>
    <div className="md:hidden">
      <Image
        src="/examples/authentication-light.png"
        width={1280}
        height={843}
        alt="Authentication"
        className="block dark:hidden"
      />
      <Image
        src="/assets/images/phone.jpg"
        width={1280}
        height={843}
        alt="Authentication"
        className="hidden dark:block"
      />
    </div>
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/sign-up"
        className="absolute right-4 top-4 md:right-8 md:top-8"
      >
        Register
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div className="absolute inset-0 bg-zinc-900 min-h-full">
          <Image
            src="/assets/images/c.jpg"
            width={1280}
            height={843}
            alt="Authentication"
            className="h-full hidden dark:block object-cover"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          socialhope
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;We can bring positive energy into our daily lives by smiling more, talking to strangers in line, replacing handshakes with hugs, and calling our friends just to tell them we love them.&rdquo;
            </p>
            <footer className="text-sm">Dan Gilbert</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center items-center space-y-4 sm:w-fit">
          <div className="flex flex-col space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to login
            </p>
          </div>
          <SignIn />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  </>
}