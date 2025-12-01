"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface Subscription {
  id: number;
  email: string;
  plan: string;
  price: string;
  status: string;
  subscribedAt: string;
}

export default function AdminPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/get_subscriptions.php`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.subscriptions);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await fetch(`${API_BASE}/admin/approve_subscription.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSubscriptions();
        alert("Subscription approved successfully!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error approving subscription");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Email</th>
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
                <td className="px-4 py-2">{sub.email}</td>
                <td className="px-4 py-2 font-semibold text-primary">{sub.plan}</td>
                <td className="px-4 py-2">${sub.price}/mo</td>
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
                <td className="px-4 py-2">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {sub.status === "pending" && (
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
                  )}
                  {sub.status === "active" && <span className="text-green-500 font-medium">Approved</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
