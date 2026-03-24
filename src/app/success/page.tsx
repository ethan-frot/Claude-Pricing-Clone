import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#2d2b27] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#1a3a2a]">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#4ade80"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-[#f5f4ef]">
          Subscription confirmed
        </h1>
        <p className="mb-8 text-[#a8a59e]">
          Your plan is now active. You can manage your subscription at any time from the dashboard.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="block w-full rounded-xl bg-[#f5f4ef] px-4 py-3.5 text-center text-[15px] font-medium text-[#2d2b27] transition-colors hover:bg-[#e5e4df]"
          >
            Go to dashboard
          </Link>
          <Link
            href="/pricing"
            className="block w-full rounded-xl border border-[#555350] px-4 py-3.5 text-center text-[15px] font-medium text-[#f5f4ef] transition-colors hover:bg-[#3d3b37]"
          >
            View plans
          </Link>
        </div>
      </div>
    </div>
  );
}
