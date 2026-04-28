import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/shared/auth/auth-context";
import { getPostLoginPath } from "@/shared/config/auth-routing";

export function LoginPage() {
  const { authReady, isAuthenticated, signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fromPath = location.state?.from?.pathname || "/";

  if (authReady && isAuthenticated) {
    return <Navigate replace to={getPostLoginPath(user, fromPath)} />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const loggedInUser = await signIn(formValues);
      navigate(getPostLoginPath(loggedInUser, fromPath), { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#24344f_0%,#141d2d_48%,#101826_100%)] px-4 py-4 text-[var(--app-text)] lg:px-8 lg:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1180px] items-center justify-center lg:min-h-[calc(100vh-3rem)]">
        <section className="relative w-full max-w-[560px] overflow-hidden rounded-[32px] border border-[rgba(108,129,164,0.28)] bg-[rgba(14,22,36,0.9)] shadow-[0_32px_100px_rgba(0,0,0,0.38)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,163,15,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(55,88,138,0.18),transparent_34%)]" />
          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="mb-10 text-center">
              <div className="text-[28px] font-black uppercase tracking-[0.2em] text-[var(--app-primary)] sm:text-[34px]">Factory ERP</div>
              <div className="mt-8 text-[38px] font-semibold tracking-[-0.03em] text-[var(--app-text)]">Sign In</div>
              <div className="mt-3 text-[15px] leading-7 text-[var(--app-text-muted)]">Use your assigned company account to continue.</div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {errorMessage ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[13px] text-[#f7c8cf]">{errorMessage}</div> : null}

              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-[var(--app-text)]">Email</span>
                <input
                  className="h-14 w-full rounded-[18px] border border-[rgba(133,151,181,0.18)] bg-[rgba(235,242,255,0.92)] px-5 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#7b8798] focus:border-[var(--app-primary)] focus:bg-white"
                  name="email"
                  onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Enter email address"
                  type="email"
                  value={formValues.email}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-[var(--app-text)]">Password</span>
                <input
                  className="h-14 w-full rounded-[18px] border border-[rgba(133,151,181,0.18)] bg-[rgba(235,242,255,0.92)] px-5 text-[15px] text-[#0f172a] outline-none transition placeholder:text-[#7b8798] focus:border-[var(--app-primary)] focus:bg-white"
                  name="password"
                  onChange={(event) => setFormValues((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Enter password"
                  type="password"
                  value={formValues.password}
                />
              </label>

              <button
                className="inline-flex h-14 w-full items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,var(--app-primary),#ffb327)] text-[16px] font-semibold text-[#172136] shadow-[0_18px_36px_rgba(245,163,15,0.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || !authReady}
                type="submit"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
