export function LoginForm() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#1d2d47]">Auth feature</h2>
        <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-[#607089]">
          Authentication UI and related state belong inside the feature itself.
        </p>
      </div>

      <form className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#394860]">
          Email
          <input
            className="h-9 w-full rounded-xl border border-[#b8c7d6] bg-white px-4 text-[13px] text-[#1d2d47] outline-none transition focus:border-[#2d88a5] focus:ring-3 focus:ring-[#dcebF3]"
            type="email"
            placeholder="manager@factory.com"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#394860]">
          Password
          <input
            className="h-9 w-full rounded-xl border border-[#b8c7d6] bg-white px-4 text-[13px] text-[#1d2d47] outline-none transition focus:border-[#2d88a5] focus:ring-3 focus:ring-[#dcebF3]"
            type="password"
            placeholder="Enter password"
          />
        </label>
        <button
          className="mt-1 h-10 rounded-xl bg-linear-to-r from-[#176f82] to-[#1e8d72] px-4 text-[15px] font-bold text-white transition hover:opacity-95"
          type="button"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
