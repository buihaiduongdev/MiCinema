interface MovieCardProps {
	title: string;
	rating: number;
	thumbnailUrl?: string;
	thumbnailAlt?: string;
	onClick?: () => void;
}

export default function MovieCard({
	title,
	rating,
	thumbnailUrl,
	thumbnailAlt = 'Movie thumbnail',
	onClick,
}: MovieCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full text-left bg-slate-800 rounded-lg overflow-hidden hover:scale-105 transition-all cursor-pointer group"
		>
			<div className="aspect-video relative bg-gradient-to-br from-yellow-500 to-yellow-600">
				{thumbnailUrl ? (
					<img
						src={thumbnailUrl}
						alt={thumbnailAlt}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<span className="text-white text-3xl font-bold">▶</span>
					</div>
				)}

				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
					<span className="text-white text-4xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
						▶
					</span>
				</div>
			</div>

			<div className="p-3">
				<h3 className="text-white font-semibold text-sm truncate">{title}</h3>
				<p className="text-gray-400 text-xs">⭐ {rating.toFixed(1)}</p>
			</div>
		</button>
	);
}
