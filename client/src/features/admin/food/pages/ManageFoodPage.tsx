import { useMemo, useState } from 'react';
import { Button, Modal, Select, Badge, Tabs } from '@mantine/core';
import { Plus, Home, ChevronRight, Pencil, EyeOff } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { PRODUCT_CATEGORY } from '@shared/constants/food-constants';
import {
  useAdminProducts,
  useAdminFoodOrders,
  useDeactivateProduct,
  useShowtimesForFoodSelect,
  FOOD_ORDER_STATUS_LABELS,
  type AdminProductRow,
} from '../hooks/useFoodCRUD';
import { ProductForm } from '../components/ProductForm';
import { EditRetailProductModal } from '../components/EditRetailProductModal';
import { ComboForm } from '../components/ComboForm';
import { EditComboModal } from '../components/EditComboModal';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

const CATEGORY_LABELS: Record<string, string> = {
  [PRODUCT_CATEGORY.POPCORN]: 'Bắp / Đồ ăn nhẹ',
  [PRODUCT_CATEGORY.DRINK]: 'Nước uống',
  [PRODUCT_CATEGORY.COMBO]: 'Combo',
  [PRODUCT_CATEGORY.OTHER]: 'Khác',
};

const filterCategoryOptions = [
  { value: '', label: 'Tất cả danh mục' },
  { value: PRODUCT_CATEGORY.POPCORN, label: CATEGORY_LABELS.POPCORN },
  { value: PRODUCT_CATEGORY.DRINK, label: CATEGORY_LABELS.DRINK },
  { value: PRODUCT_CATEGORY.OTHER, label: CATEGORY_LABELS.OTHER },
];

function formatPrice(v: number) {
  return new Intl.NumberFormat('vi-VN').format(v) + ' đ';
}

function PaginationBar(props: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  paginationPage?: number;
}) {
  const { page, totalPages, onPage, paginationPage } = props;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#424656]/40">
      <span className="text-sm text-[#8c90a1]">
        Trang {paginationPage ?? page} / {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          size="xs"
          variant="light"
          color="gray"
          disabled={page <= 1}
          onClick={() => onPage(Math.max(1, page - 1))}
          styles={{
            root: { backgroundColor: '#222a3d', color: '#dae2fd' },
          }}
        >
          Trước
        </Button>
        <Button
          size="xs"
          variant="light"
          color="gray"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          styles={{
            root: { backgroundColor: '#222a3d', color: '#dae2fd' },
          }}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}

export default function ManageFoodPage() {
  const [tab, setTab] = useState<string | null>('retail');

  const [retailPage, setRetailPage] = useState(1);
  const [retailCategory, setRetailCategory] = useState<string | null>('');
  const [addRetailOpen, setAddRetailOpen] = useState(false);
  const [editRetail, setEditRetail] = useState<AdminProductRow | null>(null);

  const [comboPage, setComboPage] = useState(1);
  const [addComboOpen, setAddComboOpen] = useState(false);
  const [editComboId, setEditComboId] = useState<string | null>(null);

  const [orderShowtimeId, setOrderShowtimeId] = useState<string | null>(null);
  const [orderPage, setOrderPage] = useState(1);

  const limit = 10;

  const retailQuery = useAdminProducts(
    {
      page: retailPage,
      limit,
      kind: 'retail',
      category: retailCategory || undefined,
    },
    { enabled: tab === 'retail' },
  );

  const comboQuery = useAdminProducts(
    { page: comboPage, limit, kind: 'combo' },
    { enabled: tab === 'combo' },
  );

  const retailOptionsQuery = useAdminProducts(
    { page: 1, limit: 150, kind: 'retail' },
    { enabled: tab === 'combo' || addComboOpen || !!editComboId },
  );

  const ordersQuery = useAdminFoodOrders(
    orderShowtimeId,
    orderPage,
    limit,
  );
  const showtimesSelect = useShowtimesForFoodSelect();

  const deactivateProduct = useDeactivateProduct();

  const retailOptions = useMemo(
    () =>
      (retailOptionsQuery.data?.data ?? []).map((p) => ({
        value: p._id,
        label: `${p.name} (${formatPrice(p.price)})`,
      })),
    [retailOptionsQuery.data?.data],
  );

  const showtimeSelectData = useMemo(
    () =>
      (showtimesSelect.data ?? []).map((s) => {
        const movie =
          typeof s.movieId === 'object' && s.movieId
            ? s.movieId.title
            : 'Phim';
        const room =
          typeof s.roomId === 'object' && s.roomId ? s.roomId.name : '';
        const t = new Date(s.startTime).toLocaleString('vi-VN');
        return {
          value: s._id,
          label: `${movie} · ${room} · ${t}`,
        };
      }),
    [showtimesSelect.data],
  );

  const confirmHide = async (p: AdminProductRow) => {
    if (
      !window.confirm(
        `Ẩn "${p.name}" khỏi menu? (Có thể bật lại khi sửa.)`,
      )
    ) {
      return;
    }
    try {
      await deactivateProduct.mutateAsync(p._id);
      notifications.show({
        color: 'green',
        title: 'Đã ẩn',
        message: 'Sản phẩm đã được ẩn.',
      });
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không ẩn được.',
      });
    }
  };

  const retailPayload = retailQuery.data;
  const comboPayload = comboQuery.data;
  const retailProducts = retailPayload?.data ?? [];
  const comboProducts = comboPayload?.data ?? [];
  const retailTotalPages = Math.max(1, retailPayload?.pagination?.totalPages ?? 1);
  const comboTotalPages = Math.max(1, comboPayload?.pagination?.totalPages ?? 1);

  const ordersPayload = ordersQuery.data;
  const orders = ordersPayload?.data ?? [];
  const orderTotalPages = Math.max(1, ordersPayload?.pagination?.totalPages ?? 1);

  const retailLoading = tab === 'retail' && retailQuery.isLoading;
  const comboLoading = tab === 'combo' && comboQuery.isLoading;
  const ordersLoading =
    tab === 'orders' && !!orderShowtimeId && ordersQuery.isLoading;

  if (retailLoading || comboLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full min-w-0">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-6">
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
              Quản lý đồ ăn &amp; nước uống
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Đồ ăn &amp; nước uống</span>
            </p>
          </div>
        </div>

        <Tabs
          value={tab}
          onChange={setTab}
          styles={{
            list: { borderColor: '#424656' },
            tab: { color: '#c2c6d8' },
          }}
        >
          <Tabs.List className="mb-6">
            <Tabs.Tab value="retail">Sản phẩm lẻ</Tabs.Tab>
            <Tabs.Tab value="combo">Combo</Tabs.Tab>
            <Tabs.Tab value="orders">Đơn theo suất</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="retail">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <Select
                placeholder="Lọc danh mục"
                data={filterCategoryOptions}
                value={retailCategory}
                onChange={(v) => {
                  setRetailCategory(v);
                  setRetailPage(1);
                }}
                styles={{
                  input: {
                    backgroundColor: '#060e20',
                    border: 'none',
                    color: '#dae2fd',
                    minWidth: 280,
                  },
                }}
              />
              <Button
                onClick={() => setAddRetailOpen(true)}
                leftSection={<Plus size={18} />}
                styles={{
                  root: {
                    background: '#0066ff',
                    color: '#f8f7ff',
                    borderRadius: 14,
                    paddingInline: 18,
                    height: 44,
                    fontWeight: 800,
                  },
                }}
              >
                Thêm sản phẩm
              </Button>
            </div>

            <div className="bg-[#131b2e] rounded-xl overflow-hidden">
              {retailProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-[#8c90a1]">Chưa có sản phẩm lẻ</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#424656]/40 text-[#8c90a1] text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 font-semibold">Ảnh</th>
                          <th className="px-4 py-3 font-semibold">Tên</th>
                          <th className="px-4 py-3 font-semibold">Danh mục</th>
                          <th className="px-4 py-3 font-semibold">Giá</th>
                          <th className="px-4 py-3 font-semibold">Trạng thái</th>
                          <th className="px-4 py-3 font-semibold text-right">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {retailProducts.map((p) => (
                          <tr
                            key={p._id}
                            className="border-b border-[#424656]/25 hover:bg-[#171f33]/80"
                          >
                            <td className="px-4 py-3 w-20">
                              <img
                                src={p.image}
                                alt=""
                                className="w-14 h-14 rounded-lg object-cover bg-[#060e20]"
                              />
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd] font-medium">
                              {p.name}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd]">
                              {CATEGORY_LABELS[p.category] ?? p.category}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd]">
                              {formatPrice(p.price)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                color={p.isActive ? 'blue' : 'gray'}
                                variant="light"
                              >
                                {p.isActive ? 'Đang bán' : 'Ẩn'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex flex-wrap justify-end gap-1.5">
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="gray"
                                  leftSection={<Pencil size={12} />}
                                  styles={{
                                    root: {
                                      backgroundColor: '#222a3d',
                                      color: '#dae2fd',
                                    },
                                  }}
                                  onClick={() => setEditRetail(p)}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="gray"
                                  leftSection={<EyeOff size={12} />}
                                  styles={{
                                    root: {
                                      backgroundColor: '#222a3d',
                                      color: '#dae2fd',
                                    },
                                  }}
                                  onClick={() => void confirmHide(p)}
                                  disabled={!p.isActive}
                                >
                                  Ẩn
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationBar
                    page={retailPage}
                    totalPages={retailTotalPages}
                    onPage={setRetailPage}
                    paginationPage={retailPayload?.pagination?.page}
                  />
                </>
              )}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="combo">
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setAddComboOpen(true)}
                leftSection={<Plus size={18} />}
                styles={{
                  root: {
                    background: '#0066ff',
                    color: '#f8f7ff',
                    borderRadius: 14,
                    paddingInline: 18,
                    height: 44,
                    fontWeight: 800,
                  },
                }}
              >
                Thêm combo
              </Button>
            </div>

            <div className="bg-[#131b2e] rounded-xl overflow-hidden">
              {comboProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-[#8c90a1]">Chưa có combo</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#424656]/40 text-[#8c90a1] text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 font-semibold">Ảnh</th>
                          <th className="px-4 py-3 font-semibold">Tên</th>
                          <th className="px-4 py-3 font-semibold">Giá</th>
                          <th className="px-4 py-3 font-semibold">Giảm %</th>
                          <th className="px-4 py-3 font-semibold">Dòng SP</th>
                          <th className="px-4 py-3 font-semibold">Trạng thái</th>
                          <th className="px-4 py-3 font-semibold text-right">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comboProducts.map((p) => (
                          <tr
                            key={p._id}
                            className="border-b border-[#424656]/25 hover:bg-[#171f33]/80"
                          >
                            <td className="px-4 py-3 w-20">
                              <img
                                src={p.image}
                                alt=""
                                className="w-14 h-14 rounded-lg object-cover bg-[#060e20]"
                              />
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd] font-medium">
                              {p.name}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd]">
                              {formatPrice(p.price)}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd]">
                              {p.discountPercent != null
                                ? `${p.discountPercent}%`
                                : '—'}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd]">
                              {p.comboItems?.length ?? 0}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                color={p.isActive ? 'blue' : 'gray'}
                                variant="light"
                              >
                                {p.isActive ? 'Đang bán' : 'Ẩn'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex flex-wrap justify-end gap-1.5">
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="gray"
                                  leftSection={<Pencil size={12} />}
                                  styles={{
                                    root: {
                                      backgroundColor: '#222a3d',
                                      color: '#dae2fd',
                                    },
                                  }}
                                  onClick={() => setEditComboId(p._id)}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="gray"
                                  leftSection={<EyeOff size={12} />}
                                  styles={{
                                    root: {
                                      backgroundColor: '#222a3d',
                                      color: '#dae2fd',
                                    },
                                  }}
                                  onClick={() => void confirmHide(p)}
                                  disabled={!p.isActive}
                                >
                                  Ẩn
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationBar
                    page={comboPage}
                    totalPages={comboTotalPages}
                    onPage={setComboPage}
                    paginationPage={comboPayload?.pagination?.page}
                  />
                </>
              )}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="orders">
            <div className="bg-[#131b2e] p-6 rounded-xl mb-6">
              <Select
                label="Chọn suất chiếu"
                placeholder="Chọn suất để xem đơn đồ ăn"
                searchable
                data={showtimeSelectData}
                value={orderShowtimeId}
                onChange={(v) => {
                  setOrderShowtimeId(v);
                  setOrderPage(1);
                }}
                styles={{
                  input: {
                    backgroundColor: '#060e20',
                    border: 'none',
                    color: '#dae2fd',
                  },
                }}
                labelProps={{ style: { color: '#c2c6d8' } }}
              />
            </div>

            {!orderShowtimeId ? (
              <p className="text-[#8c90a1] text-center py-12">
                Chọn một suất chiếu để xem danh sách đơn.
              </p>
            ) : ordersLoading ? (
              <LoadingSpinner />
            ) : orders.length === 0 ? (
              <p className="text-[#8c90a1] text-center py-12">
                Không có đơn đồ ăn cho suất này.
              </p>
            ) : (
              <div className="bg-[#131b2e] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#424656]/40 text-[#8c90a1] text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 font-semibold">Thời điểm</th>
                        <th className="px-4 py-3 font-semibold">Khách</th>
                        <th className="px-4 py-3 font-semibold">Món</th>
                        <th className="px-4 py-3 font-semibold">Tổng</th>
                        <th className="px-4 py-3 font-semibold">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => {
                        const u = o.userId;
                        const customer =
                          typeof u === 'object' && u
                            ? `${u.fullName} (${u.email})`
                            : '—';
                        const itemsSummary = o.items
                          .map(
                            (i) =>
                              `${i.productName} ×${i.quantity}`,
                          )
                          .join(', ');
                        return (
                          <tr
                            key={o._id}
                            className="border-b border-[#424656]/25 hover:bg-[#171f33]/80"
                          >
                            <td className="px-4 py-3 text-[#dae2fd] text-sm whitespace-nowrap">
                              {new Date(o.createdAt).toLocaleString('vi-VN')}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd] text-sm max-w-[200px]">
                              {customer}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd] text-sm max-w-md">
                              {itemsSummary}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd]">
                              {formatPrice(o.totalAmount)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge color="gray" variant="light">
                                {FOOD_ORDER_STATUS_LABELS[o.status] ?? o.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <PaginationBar
                  page={orderPage}
                  totalPages={orderTotalPages}
                  onPage={setOrderPage}
                  paginationPage={ordersPayload?.pagination?.page}
                />
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      </div>

      <Modal
        opened={addRetailOpen}
        onClose={() => setAddRetailOpen(false)}
        title="Thêm sản phẩm"
        size="md"
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.25rem' },
        }}
      >
        <ProductForm onSuccess={() => setAddRetailOpen(false)} />
      </Modal>

      <EditRetailProductModal
        product={editRetail}
        opened={!!editRetail}
        onClose={() => setEditRetail(null)}
      />

      <Modal
        opened={addComboOpen}
        onClose={() => setAddComboOpen(false)}
        title="Thêm combo"
        size="lg"
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.25rem' },
          body: { maxHeight: '80vh', overflowY: 'auto' },
        }}
      >
        <ComboForm
          retailOptions={retailOptions}
          onSuccess={() => setAddComboOpen(false)}
        />
      </Modal>

      <EditComboModal
        comboId={editComboId}
        opened={!!editComboId}
        onClose={() => setEditComboId(null)}
        retailOptions={retailOptions}
      />
    </div>
  );
}
