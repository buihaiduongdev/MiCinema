import { useState } from 'react';
import { Button, TextInput, Select, Modal } from '@mantine/core';
import { Plus, Search, Home, ChevronRight } from 'lucide-react';
import { PersonForm, PersonTable, DeletePersonDialog } from '../components';
import { usePersons, type Person } from '../hooks';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { useDebounce } from '../../../../hooks/useDebounce';

export default function ManagePersonsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);

  const { data: personsResponse, isLoading } = usePersons({
    page,
    limit: 10,
    search: debouncedSearch,
    role: roleFilter as any,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // API trả về: { success, data: { data: [...], pagination: {...} }, message }
  const personsData = (personsResponse as any)?.data;
  const persons = personsData?.data || [];
  const total = personsData?.pagination?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  const handleEdit = (person: Person) => {
    setEditingPersonId(person._id);
    setOpenFormModal(true);
  };

  const handleDelete = (person: Person) => {
    setDeletingPerson(person);
  };

  const handleCloseFormModal = () => {
    setOpenFormModal(false);
    setEditingPersonId(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingPerson(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full min-w-0">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-8">
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
              Quản lý đạo diễn & diễn viên
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Danh sách người</span>
            </p>
          </div>

          <Button
            onClick={() => setOpenFormModal(true)}
            leftSection={<Plus size={18} />}
            styles={{
              root: {
                background: '#0066ff',
                color: '#f8f7ff',
                borderRadius: 14,
                paddingInline: 18,
                height: 44,
                fontWeight: 800,
                boxShadow: '0 12px 24px rgba(0,102,255,0.22)',
              },
            }}
          >
            Thêm mới
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-[#131b2e] p-6 rounded-xl mb-6">
          <div className="flex gap-4 flex-wrap">
            <TextInput
              placeholder="Tìm kiếm theo tên..."
              leftSection={<Search size={16} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.currentTarget.value)}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  minWidth: '300px',
                },
              }}
            />
            <Select
              placeholder="Vai trò"
              clearable
              data={[
                { value: 'DIRECTOR', label: 'Đạo diễn' },
                { value: 'ACTOR', label: 'Diễn viên' },
              ]}
              value={roleFilter}
              onChange={setRoleFilter}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  minWidth: '150px',
                },
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#131b2e] rounded-xl overflow-hidden">
          {persons.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#8c90a1]">Không tìm thấy kết quả nào</p>
            </div>
          ) : (
            <>
              <PersonTable
                persons={persons}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {totalPages > 1 && (
                <div className="p-4 flex justify-center border-t border-[#424656]/30">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          page === i + 1
                            ? 'bg-[#0066ff] text-white font-bold'
                            : 'bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        opened={openFormModal}
        onClose={handleCloseFormModal}
        title={editingPersonId ? 'Sửa thông tin' : 'Thêm mới'}
        size="lg"
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.25rem' },
        }}
      >
<<<<<<< HEAD
        <PersonForm personId={editingPersonId} onSuccess={handleCloseFormModal} />
=======
        <PersonForm
          personId={editingPersonId}
          onSuccess={handleCloseFormModal}
        />
>>>>>>> main
      </Modal>

      <DeletePersonDialog
        person={deletingPerson}
        opened={!!deletingPerson}
        onClose={handleCloseDeleteDialog}
      />
    </div>
  );
}
