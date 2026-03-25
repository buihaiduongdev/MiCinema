import { useState } from 'react';
import { useFoodMenu } from '../hooks/useFoodMenu';
import { ProductCategory, type IProduct } from '@/types/product';

interface FoodMenuProps {
  selectedItems: Map<string, number>;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export function FoodMenu({ selectedItems, onQuantityChange }: FoodMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | undefined
  >();
  const { data: products, isLoading } = useFoodMenu({
    category: selectedCategory,
  });

  const categories = [
    { value: undefined, label: 'Tất cả' },
    { value: ProductCategory.FOOD, label: 'Đồ ăn' },
    { value: ProductCategory.DRINK, label: 'Nước uống' },
    { value: ProductCategory.COMBO, label: 'Combo' },
  ];

  const handleIncrease = (productId: string) => {
    const current = selectedItems.get(productId) || 0;
    onQuantityChange(productId, current + 1);
  };

  const handleDecrease = (productId: string) => {
    const current = selectedItems.get(productId) || 0;
    if (current > 0) {
      onQuantityChange(productId, current - 1);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
        Đang tải...
      </div>
    );
  }

  const navy = '#1e3a5f';
  const gold = '#c9a227';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
      }}>
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              border: selectedCategory === cat.value ? `2px solid ${gold}` : '1px solid #e5e7eb',
              background: selectedCategory === cat.value ? navy : '#ffffff',
              color: selectedCategory === cat.value ? '#ffffff' : '#374151',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedCategory === cat.value
                ? '0 2px 8px rgba(30, 58, 95, 0.2)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== cat.value) {
                e.currentTarget.style.background = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat.value) {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {products?.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            quantity={selectedItems.get(product._id) || 0}
            onIncrease={() => handleIncrease(product._id)}
            onDecrease={() => handleDecrease(product._id)}
          />
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: IProduct;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

function ProductCard({
  product,
  quantity,
  onIncrease,
  onDecrease,
}: ProductCardProps) {
  const navy = '#1e3a5f';
  const gold = '#c9a227';

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '16px',
      background: '#ffffff',
      borderRadius: '8px',
      border: quantity > 0 ? `2px solid ${gold}` : '1px solid #e5e7eb',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
      transition: 'all 0.2s',
    }}>
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '96px',
            height: '96px',
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        />
      ) : (
        <div style={{
          width: '96px',
          height: '96px',
          background: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
        }}>
          {product.category === 'FOOD' ? '🍿' : product.category === 'DRINK' ? '🥤' : '🎁'}
        </div>
      )}
      <div style={{ flex: 1 }}>
        <h4 style={{ fontWeight: '700', marginBottom: '4px', fontSize: '15px', color: navy }}>
          {product.name}
        </h4>
        {product.description && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
            {product.description}
          </p>
        )}
        <p style={{ color: gold, fontWeight: '800', fontSize: '16px', marginBottom: '12px' }}>
          {product.price.toLocaleString('vi-VN')}đ
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onDecrease}
            disabled={quantity === 0}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: quantity === 0 ? '#e5e7eb' : '#ef4444',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              cursor: quantity === 0 ? 'not-allowed' : 'pointer',
              opacity: quantity === 0 ? '0.5' : '1',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (quantity > 0) {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            −
          </button>
          <span style={{
            minWidth: '32px',
            textAlign: 'center',
            fontWeight: '700',
            fontSize: '16px',
            color: quantity > 0 ? navy : '#9ca3af',
          }}>
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: navy,
              border: 'none',
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(30, 58, 95, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 58, 95, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 58, 95, 0.25)';
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
