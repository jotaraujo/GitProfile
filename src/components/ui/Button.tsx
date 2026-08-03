interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'outline' | 'ghost'
	size?: 'xs' | 'sm' | 'md' | 'lg'
	isLoading?: boolean
	icon?: React.ReactNode
	fullWidth?: boolean
	children: React.ReactNode
}

const variantClasses = {
	primary: 'btn-primary',
	outline: 'btn-outline border-outline hover:bg-bright hover:text-main',
	ghost: 'btn-ghost text-muted hover:text-main',
}

const sizeClasses = {
	xs: 'btn-xs',
	sm: 'btn-sm',
	md: 'btn-md',
	lg: 'btn-lg',
}

const Button = ({
	variant = 'primary',
	size = 'md',
	isLoading = false,
	icon,
	fullWidth = false,
	children,
	className = '',
	disabled,
	...rest
}: ButtonProps) => {
	return (
		<button
			type="button"
			disabled={disabled || isLoading}
			className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${
				fullWidth ? 'w-full' : ''
			} transition-colors duration-200 active:scale-[0.98] ${className}`}
			{...rest}
		>
			{isLoading ? (
				<span className="loading loading-spinner loading-xs" />
			) : (
				<>
					{icon}
					{children}
				</>
			)}
		</button>
	)
}

export default Button
