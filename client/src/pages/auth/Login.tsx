import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth.service";
import { AuthCard } from "../../components/auth/AuthCard";
import { BackgroundGradientAnimation } from "../../components/ui/background-gradient-animation";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "CREATOR" as "CREATOR" | "CLIPPER",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.loginRequest({
        email: formData.email,
        password: formData.password,
      });

      login(response.token, response.user);

      if (response.user.role === "CREATOR") {
        navigate("/creator/dashboard");
      } else {
        navigate("/clipper/dashboard");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center px-4">
        <AuthCard
          isLoading={loading}
          email={formData.email}
          setEmail={(email) => setFormData({ ...formData, email })}
          password={formData.password}
          setPassword={(password) => setFormData({ ...formData, password })}
          role={formData.role}
          setRole={(role) => setFormData({ ...formData, role })}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onSocialLogin={(provider) => console.log(`Login with ${provider}`)}
          onForgotPassword={() => console.log("Forgot password")}
        />
      </div>
    </BackgroundGradientAnimation>
  );
}

export default Login;
