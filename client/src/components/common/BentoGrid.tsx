interface BentoGridItemProps {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  colSpan?: number;
  rowSpan?: number;
  large?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  onClick: () => void;
}

interface BentoGridProps {
  title: string;
  items: BentoGridItemProps[];
}

export default function BentoGrid({ title, items }: BentoGridProps) {
  return (
    <section className="w-full">
      <div className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-white">
          {title}
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={item.onClick}
              className={`relative group rounded-2xl overflow-hidden cursor-pointer ${
                item.large ? 'md:col-span-2 md:row-span-2' : ''
              } ${item.colSpan ? `md:col-span-${item.colSpan}` : ''} ${
                item.rowSpan ? `md:row-span-${item.rowSpan}` : ''
              }`}
            >
              {/* Image */}
              <img
                alt={item.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  item.large ? 'group-hover:scale-105' : ''
                }`}
                src={item.imageUrl}
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 ${
                  item.large
                    ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent'
                    : 'bg-black/40 group-hover:bg-black/20'
                } transition-all flex flex-col ${
                  item.large
                    ? 'justify-end p-6 md:p-8'
                    : 'justify-center items-center'
                }`}
              >
                {item.large ? (
                  <>
                    {item.subtitle && (
                      <span className="text-yellow-500 font-bold text-sm mb-2">
                        {item.subtitle}
                      </span>
                    )}
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tighter text-white">
                      {item.title}
                    </h3>
                    {item.buttonText && (
                      <button
                        onClick={item.onButtonClick}
                        className="w-fit bg-yellow-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                      >
                        {item.buttonText}
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-white font-black text-xl tracking-tighter uppercase text-center px-4">
                    {item.title}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
