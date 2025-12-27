import { SignupForm } from "../../components/auth/SignupForm";
import billiImage from "../../assets/billi.jpg";

function Signup() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950">
      {/* Left side - Form */}
      <div className="flex h-full w-1/2 items-center justify-center p-8 overflow-y-auto">
        <SignupForm />
      </div>
      
      {/* Right side - Image */}
      <div className="h-full w-1/2">
        <img 
          src={billiImage} 
          alt="ClipConnect" 
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Signup;
