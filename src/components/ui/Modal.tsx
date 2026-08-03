import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

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

const FOCUSABLE =
	'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

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
	const panelRef = useRef<HTMLDivElement | null>(null)

	// Fecha no Escape
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

	// Focus trap: primeiro elemento ao abrir; Tab cicla dentro do painel
	useEffect(() => {
		if (!isOpen) return

		const panel = panelRef.current
		if (!panel) return

		const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
		focusables[0]?.focus()

		const handleTab = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return
			const list = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
			if (list.length === 0) return
			const first = list[0]
			const last = list[list.length - 1]
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault()
				last.focus()
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault()
				first.focus()
			}
		}

		panel.addEventListener('keydown', handleTab)

		return () => panel.removeEventListener('keydown', handleTab)
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className="modal modal-open z-50">
			<div
				ref={panelRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? 'modal-title' : undefined}
				className={`modal-box bg-surface border border-outline rounded-xl p-6 shadow-2xl relative ${maxWidthClasses[maxWidth]} ${className}`}
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="btn btn-sm btn-circle absolute right-4 top-4 border-none bg-transparent hover:bg-bright text-muted hover:text-main transition-colors duration-200 cursor-pointer"
					aria-label="Fechar Modal"
				>
					<X size={18} />
				</button>

				{/* Cabeçalho (Opcional) */}
				{title && (
					<div className="flex items-center gap-2 mb-4">
						{icon}
						<h3
							id="modal-title"
							className="text-lg font-bold text-main font-sans"
						>
							{title}
						</h3>
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
