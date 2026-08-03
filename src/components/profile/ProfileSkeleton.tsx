const ProfileSkeleton = () => {
	return (
		<main className="bg-base grid grid-cols-1 lg:grid-cols-[400px_1fr_1fr] lg:grid-rows-[auto_1fr] lg:h-[calc(100svh-64px)] lg:overflow-hidden">
			{/* Barra lateral esquerda - Skeleton do perfil */}
			<div className="bg-base lg:col-start-1 lg:row-span-2 lg:border-r border-outline flex flex-col items-center p-6 w-full gap-4">
				<div className="skeleton w-32 h-32 rounded-md" />
				<div className="skeleton h-6 w-48 mt-4" />
				<div className="skeleton h-4 w-32" />
				<div className="skeleton h-4 w-full mt-2" />
				<div className="skeleton h-4 w-3/4" />
				<div className="skeleton h-6 w-full rounded-md mt-4" />
				<div className="flex gap-3 border-b-2 border-outline mb-4 py-4 w-full justify-center">
					<div className="skeleton h-4 w-12" />
					<span className="text-sm px-3">•</span>
					<div className="skeleton h-4 w-12" />
				</div>
				<div className="flex gap-3 py-2 w-full justify-center">
					<div className="skeleton h-4 w-16" />
					<span className="text-sm px-3">|</span>
					<div className="skeleton h-4 w-16" />
				</div>
				<div className="skeleton h-6 w-full rounded-md" />
			</div>
			{/* Cabeçalho de Métricas */}
			<div className="lg:col-start-2 lg:col-span-2 lg:row-start-1 border-b border-t border-outline lg:border-t-0 py-6 px-8 flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-around">
				<div className="skeleton h-24 w-full lg:w-96 bg-surface border border-outline p-5 rounded-lg" />
				<div className="skeleton h-24 w-full lg:w-96 bg-surface border border-outline rounded-lg p-5" />
			</div>
			{/* Grade de Repositórios */}
			<div className="lg:col-start-2 lg:col-span-2 lg:row-start-2 grid grid-cols-1 lg:grid-cols-3 p-8 gap-8 overflow-y-auto no-scrollbar">
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className="bg-surface border border-outline rounded-lg p-5 flex flex-col gap-3"
					>
						<div className="skeleton h-5 w-32" />
						<div className="skeleton h-4 w-full" />
						<div className="skeleton h-4 w-2/3" />
						<div className="flex gap-4 mt-2">
							<div className="skeleton h-3 w-12" />
							<div className="skeleton h-3 w-12" />
						</div>
					</div>
				))}
			</div>
		</main>
	)
}

export default ProfileSkeleton
