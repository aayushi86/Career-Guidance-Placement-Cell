import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-600">
            Sign in to continue to your career dashboard.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <Input
                type="email"
                placeholder="you@domain.com"
                className="pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <Input
                type="password"
                placeholder="••••••••"
                className="pl-11"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Login;

