import { requirePageRole } from '../../lib/clerk-rbac'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePageRole('admin')

  return (
    <div>
      {children}
    </div>
  );
}