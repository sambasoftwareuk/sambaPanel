import { ClerkProvider, SignedOut, SignInButton, SignIn, UserButton, SignedIn } from '@clerk/nextjs'

const page = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>

    <ClerkProvider>
        <SignedOut>
            <SignIn routing="hash"/>
        </SignedOut>
        <SignedIn>
            <UserButton/>
        </SignedIn>
    </ClerkProvider>
    </div>
  )
}

export default page