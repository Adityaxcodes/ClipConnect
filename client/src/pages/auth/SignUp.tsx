import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import { AuthCard } from "../../components/auth/AuthCard";
import { BackgroundGradientAnimation } from "../../components/ui/background-gradient-animation";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CREATOR" as "CREATOR" | "CLIPPER",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      login(response.token, response.user);

      if (response.user.role === "CREATOR") {
        navigate("/creator/dashboard");
      } else {
        navigate("/clipper/dashboard");
      }
    } catch (err: any) {
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
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
          firstName={formData.firstName}
          setFirstName={(firstName) => setFormData({ ...formData, firstName })}
          lastName={formData.lastName}
          setLastName={(lastName) => setFormData({ ...formData, lastName })}
          role={formData.role}
          setRole={(role) => setFormData({ ...formData, role })}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onSocialLogin={(provider) => console.log(`Signup with ${provider}`)}
          onForgotPassword={() => console.log("Forgot password")}
        />
      </div>
    </BackgroundGradientAnimation>
  );
}

export default Signup;
