import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	onEscape?: () => void
	title?: string
	icon?: React.ReactNode
	children: React.ReactNode
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'
	className?: string
}

const maxWidthClasses = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	'4xl': 'max-w-4xl',
}

const Modal = ({
	isOpen,
	onClose,
	onEscape,
	title,
	icon,
	children,
	maxWidth = 'md',
	className = '',
}: ModalProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onEscape ? onEscape() : onClose()
			}
		}

		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose, onEscape])

	if (!isOpen) return null

	return (
		<div className="modal modal-open z-50">
			<div
				className={`modal-box bg-surface border border-outline rounded-xl p-6 shadow-2xl relative ${maxWidthClasses[maxWidth]} ${className}`}
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="btn btn-sm btn-circle absolute right-4 top-4 border-none bg-transparent hover:bg-bright text-muted hover:text-main cursor-pointer"
					aria-label="Fechar Modal"
				>
					<X size={18} />
				</button>

				{/* Cabeçalho (Opcional) */}
				{title && (
					<div className="flex items-center gap-2 mb-4">
						{icon}
						<h3 className="text-lg font-bold text-main font-sans">{title}</h3>
					</div>
				)}

				{/* Conteúdo do Modal */}
				{children}
			</div>

			{/* Backdrop com Blur */}
			<div
				className="modal-backdrop bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>
		</div>
	)
}

export default Modal
