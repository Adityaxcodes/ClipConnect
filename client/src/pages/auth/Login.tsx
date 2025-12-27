import { LoginForm } from "../../components/auth/LoginForm";
import billiImage from "../../assets/billi.jpg";

function Login() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950">
      {/* Left side - Form */}
      <div className="flex h-full w-1/2 items-center justify-center p-8">
        <LoginForm />
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

export default Login;
