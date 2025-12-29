import { AddButton } from '@/components/admin/AddButton';

export default function AdminPage() {
  return (
    <>
      <AddButton />
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>
    </>
  );
}
