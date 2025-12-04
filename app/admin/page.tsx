"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface Subscription {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  plan: string;
  price: number;
  status: string;
  subscribed_at: string;
}

export default function AdminPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

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

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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
        fetchSubscriptions();
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
    return <Loader2 className="animate-spin w-8 h-8 mx-auto my-20" />;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Price</th>
              <th>Status</th>
              <th>Subscribed At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-t">
                <td>{sub.name}</td>
                <td>{sub.phone}</td>
                <td className="font-semibold text-primary">{sub.plan}</td>
                <td>₱{sub.price}</td>
                <td>
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
                <td>{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                <td>
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
