import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	icon?: React.ReactNode
	children: React.ReactNode
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const maxWidthClasses = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
}

const Modal = ({
	isOpen,
	onClose,
	title,
	icon,
	children,
	maxWidth = 'md',
}: ModalProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div className="modal modal-open z-50">
			<div
				className={`modal-box bg-surface border border-outline rounded-xl p-6 shadow-2xl relative ${maxWidthClasses[maxWidth]}`}
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
