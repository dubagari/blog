import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          fetch("/api/admin/stats", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("/api/admin/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!statsRes.ok) {
          throw new Error("Failed to load admin stats");
        }
        if (!usersRes.ok) {
          throw new Error("Failed to load users");
        }

        const statsData = await statsRes.json();
        const usersData = await usersRes.json();

        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message || "Unable to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, token]);

  const handleRoleUpdate = async (userId, role) => {
    if (!window.confirm(`Set user role to ${role}?`)) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      const updatedUser = await response.json();
      setUsers((current) =>
        current.map((u) => (u._id === userId ? { ...u, role } : u)),
      );
      setError(null);
    } catch (err) {
      setError(err.message || "Unable to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((current) => current.filter((u) => u._id !== userId));
      setError(null);
    } catch (err) {
      setError(err.message || "Unable to delete user");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Admin access required</h1>
          <p className="text-gray-600 mb-6">
            You must be logged in as an admin to view this page.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Forbidden</h1>
          <p className="text-gray-600 mb-6">
            Admin dashboard is only available to administrators.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage users and review site statistics from one place.
            </p>
          </div>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
          >
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-300 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Total Users
            </p>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {loading ? "..." : (stats?.userCount ?? 0)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Total Posts
            </p>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {loading ? "..." : (stats?.postCount ?? 0)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Total Comments
            </p>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {loading ? "..." : (stats?.commentCount ?? 0)}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Users</h2>
            <p className="text-sm text-gray-500">
              Admins can promote or remove users from here.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading users…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {u._id !== user._id && (
                          <>
                            <button
                              onClick={() =>
                                handleRoleUpdate(
                                  u._id,
                                  u.role === "admin" ? "user" : "admin",
                                )
                              }
                              className="rounded bg-yellow-100 px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-200"
                            >
                              {u.role === "admin" ? "Demote" : "Promote"}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="rounded bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {u._id === user._id && (
                          <span className="text-xs text-gray-400">
                            Current admin
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
