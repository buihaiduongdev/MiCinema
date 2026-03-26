/**
 * CitySelector — Modal chọn tỉnh/thành phố (chi nhánh rạp)
 *
 * Hiển thị: grid các thành phố với icon
 * Click: chọn thành phố → lọc phim theo chi nhánh
 * "Toàn quốc" = bỏ lọc
 */

import { Modal } from '@mantine/core';

// Icon placeholder cho các thành phố (dùng emoji thay thế)
const CITY_ICONS: Record<string, string> = {
  'Toàn quốc': '🇻🇳',
  'TP Hồ Chí Minh': '🏙️',
  'Hà Nội': '⛩️',
  'Đà Nẵng': '🌊',
  'An Giang': '🗺️',
  'Bà Rịa - Vũng Tàu': '🏖️',
  'Bến Tre': '🌴',
  'Cà Mau': '🦐',
  'Đắk Lắk': '🐘',
  'Hải Phòng': '⚓',
  'Khánh Hòa': '🏝️',
  'Nghệ An': '🌸',
  'Tây Ninh': '🚀',
  'Thừa Thiên Huế': '🏯',
};

interface CitySelectorProps {
  opened: boolean;
  onClose: () => void;
  cities: string[];
  selectedCity: string | null;
  onSelectCity: (city: string | null) => void;
}

export default function CitySelector({
  opened,
  onClose,
  cities,
  selectedCity,
  onSelectCity,
}: CitySelectorProps) {
  const allCities = ['Toàn quốc', ...cities];

  const handleSelect = (city: string) => {
    if (city === 'Toàn quốc') {
      onSelectCity(null);
    } else {
      onSelectCity(city);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Tỉnh / Thành phố"
      size="lg"
      centered
      styles={{
        title: {
          fontSize: '1.25rem',
          fontWeight: 700,
        },
      }}
    >
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 py-4">
        {allCities.map((city) => {
          const isSelected =
            (city === 'Toàn quốc' && !selectedCity) || city === selectedCity;

          return (
            <button
              key={city}
              onClick={() => handleSelect(city)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-blue-50 ${
                isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : ''
              }`}
            >
              {/* City Icon Circle */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  isSelected
                    ? 'bg-orange-500 text-white'
                    : 'bg-blue-700 text-white'
                } transition-colors duration-200`}
              >
                {CITY_ICONS[city] || '📍'}
              </div>

              {/* City Name */}
              <span
                className={`text-xs font-medium text-center leading-tight ${
                  isSelected ? 'text-orange-600 font-bold' : 'text-gray-700'
                }`}
              >
                {city}
              </span>

              {/* Selected Checkmark */}
              {isSelected && (
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center -mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
