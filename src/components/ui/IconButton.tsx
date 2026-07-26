interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: React.ReactNode
	badge?: number | boolean
	size?: 'sm' | 'md'
	tooltip?: string
}

const sizeClasses = {
	sm: 'btn-sm',
	md: 'btn-md',
}

const IconButton = ({
	icon,
	badge,
	size = 'sm',
	tooltip,
	className = '',
	...rest
}: IconButtonProps) => {
	const hasBadge = typeof badge === 'number' ? badge > 0 : badge

	return (
		<button
			type="button"
			title={tooltip}
			className={`btn btn-ghost btn-circle ${sizeClasses[size]} text-main relative hover:bg-bright cursor-pointer ${className}`}
			{...rest}
		>
			{icon}
			{hasBadge && (
				<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface" />
			)}
		</button>
	)
}

export default IconButton
