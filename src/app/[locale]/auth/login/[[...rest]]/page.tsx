import { SignedIn, SignIn, SignedOut } from "@clerk/nextjs";

export default function SigninPage() {
	return (
		<>
			<SignedOut>
				<div className="flex h-screen w-full items-center justify-center bg-accent">
					<SignIn />
				</div>
			</SignedOut>
		</>
	);
}