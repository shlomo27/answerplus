import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "shlomo2708@gmail.com";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email || session.user.email.toLowerCase() !== ADMIN_EMAIL) {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      onboarded: true,
      accounts: { select: { provider: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalQuestions = await prisma.question.count();
  const totalComments = await prisma.comment.count();

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">{users.length}</div>
          <div className="text-sm text-indigo-500 mt-1">Users</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{totalQuestions}</div>
          <div className="text-sm text-green-500 mt-1">Questions</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{totalComments}</div>
          <div className="text-sm text-orange-500 mt-1">Comments</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Registered Users ({users.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {users.map((user) => {
            const provider = user.accounts[0]?.provider ?? "email";
            const providerLabel =
              provider === "google" ? "🔵 Google" :
              provider === "credentials" ? "📧 Email" : provider;
            return (
              <div key={user.id} className="flex items-center gap-4 px-5 py-3">
                {user.image ? (
                  <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate">{user.name ?? "—"}</div>
                  <div className="text-xs text-gray-400 truncate">{user.email}</div>
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">{providerLabel}</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </div>
                {!user.onboarded && (
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                    not onboarded
                  </span>
                )}
              </div>
            );
          })}
          {users.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">No users yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
