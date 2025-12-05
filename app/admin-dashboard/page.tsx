"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface Subscription {
  id: number;
  user_id: number;
  name: string;
  email: string; // added email
  phone: string;
  plan: string;
  price: number;
  status: string;
  subscribed_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Check admin login
  useEffect(() => {
    const adminEmail = sessionStorage.getItem("admin_email");
    if (!adminEmail) {
      router.replace("/admin"); // redirect to login if not logged in
    } else {
      fetchSubscriptions();
    }
  }, [router]);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscription/admin");
      const data = await res.json();
      if (data.success) setSubscriptions(data.subscriptions);
    } catch (err) {
      console.error("Admin fetch subscriptions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/subscription/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchSubscriptions();
        alert("Subscription approved!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Admin approve error:", err);
      alert("Error approving subscription");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return <Loader2 className="animate-spin w-8 h-8 mx-auto mt-20" />;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Subscription Management</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th> {/* added email column */}
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Subscribed At</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-t">
                <td className="px-4 py-2">{sub.name}</td>
                <td className="px-4 py-2">{sub.email}</td>
                <td className="px-4 py-2">{sub.phone}</td>
                <td className="px-4 py-2 font-semibold text-primary">{sub.plan}</td>
                <td className="px-4 py-2">₱{sub.price}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                      sub.status === "active"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {sub.status === "pending" ? (
                    <Button
                      size="sm"
                      className="bg-primary text-white"
                      disabled={processingId === sub.id}
                      onClick={() => handleApprove(sub.id)}
                    >
                      {processingId === sub.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1 inline-block" />
                      )}
                      Approve
                    </Button>
                  ) : (
                    <span className="text-green-500 font-medium">Approved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
