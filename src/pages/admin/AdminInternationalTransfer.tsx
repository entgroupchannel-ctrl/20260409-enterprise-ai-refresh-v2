import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, PlusCircle } from 'lucide-react';
import TransferRequestsList from '@/components/admin/TransferRequestsList';
import InternationalTransferForm from '@/components/admin/InternationalTransferForm';

export default function AdminInternationalTransfer() {
  const [tab, setTab] = useState('list');
  const [editId, setEditId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditId(id);
    setTab('form');
  };

  const handleSaved = () => {
    setEditId(null);
    setTab('list');
  };

  const handleNewRequest = () => {
    setEditId(null);
    setTab('form');
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6 admin-content-area">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">โอนเงินต่างประเทศ</h1>
            <p className="text-muted-foreground text-sm">International Transfer Requests</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="list" className="gap-1.5"><List className="h-4 w-4" />รายการคำขอ</TabsTrigger>
            <TabsTrigger value="form" className="gap-1.5" onClick={handleNewRequest}><PlusCircle className="h-4 w-4" />สร้างคำขอ</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <TransferRequestsList onEdit={handleEdit} />
          </TabsContent>
          <TabsContent value="form">
            <InternationalTransferForm editId={editId} onSaved={handleSaved} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
