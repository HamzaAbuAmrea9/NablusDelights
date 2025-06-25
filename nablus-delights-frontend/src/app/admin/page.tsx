// File: src/app/admin/page.tsx
import ProtectedRoute from "@/components/ProtectedRoute";

import AdminDashboard from "../../components/AdminDashboard";

export default function AdminPage() {
  return (
    // Wrap the entire page content with ProtectedRoute
    <ProtectedRoute allowedRoles={['Admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}