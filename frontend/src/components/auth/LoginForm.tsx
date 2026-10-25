import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { useNavigate } from "react-router";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PasswordField from "@/components/ui/PasswordField";
import TextField from "@/components/ui/TextField";
import { hasBuiltDashboard, getHomePathForRole } from "@/lib/roles";
import { useAuth } from "@/hooks/useAuth";
import { isValidEmail } from "@/lib/validators";

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";
const UNAVAILABLE_DASHBOARD_MESSAGE = "The dashboard for your role is not available yet.";

/**
 * Collects credentials and signs in through the authentication context.
 *
 * @returns The login form.
 */
function LoginForm(): ReactElement {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMessage(null);

    if (!email.trim() || !password || !isValidEmail(email)) {
      setMessage(INVALID_CREDENTIALS_MESSAGE);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(email, password);

      if (response.status === "error" || !response.data) {
        setMessage(response.message);
        return;
      }

      if (!hasBuiltDashboard(response.data.role)) {
        setMessage(UNAVAILABLE_DASHBOARD_MESSAGE);
        return;
      }

      navigate(getHomePathForRole(response.data.role), { replace: true });
    } catch {
      setMessage("Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
      <TextField
        autoComplete="username"
        id="email"
        label="Email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter email"
        type="email"
        value={email}
      />
      <PasswordField
        autoComplete="current-password"
        id="password"
        label="Password"
        name="password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter Password"
        value={password}
      />
      {message && <Alert>{message}</Alert>}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}

export default LoginForm;
