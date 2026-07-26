import { useState, useEffect } from 'react'
import { Keyboard, RotateCcw } from 'lucide-react'
import { useShortcutsStore } from '../../store/useShortcutsStore'
import Modal from '../ui/Modal'

interface ShortcutModalProps {
	isOpen: boolean
	onClose: () => void
}

const ShortcutsModal = ({ isOpen, onClose }: ShortcutModalProps) => {
	const { searchShortcut, setSearchShortcut, resetShortcuts } =
		useShortcutsStore()
	const [isListening, setIsListening] = useState(false)

	useEffect(() => {
		if (!isListening) return

		const handleKeyDown = (e: KeyboardEvent) => {
			e.preventDefault()

			if (e.key === 'Escape') {
				setIsListening(false)
				return
			}

			if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return

			setSearchShortcut({
				key: e.key.toLowerCase(),
				ctrlKey: e.ctrlKey || e.metaKey,
			})

			setIsListening(false)
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isListening, setSearchShortcut])

	if (!isOpen) return null
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Atalhos de Teclado"
			icon={<Keyboard className="text-primary-variant" size={20} />}
		>
			<div className="flex flex-col gap-6 text-left">
				{/* Lista de atalhos */}
				<div className="flex flex-col gap-4">
					{/* Atalho 1: busca rápida */}
					<div className="flex items-center justify-between p-3 rounded-lg bg-base border border-outline">
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-semibold text-main">
								Busca Rápida
							</span>
							<span className="text-xs text-muted">
								Abre o modal de pesquisa de perfil
							</span>
						</div>
						<button
							type="button"
							onClick={() => setIsListening(true)}
							className={`btn btn-xs ${
								isListening
									? 'btn-warning animate-pulse'
									: 'btn-outline border-outline text-main'
							} cursor-pointer`}
						>
							{isListening ? (
								'Pressione a tecla...'
							) : (
								<div className="flex items-center gap-1 font-mono">
									{searchShortcut.ctrlKey && (
										<span className="text-xs">Ctrl +</span>
									)}
									<span className="uppercase text-xs">
										{searchShortcut.key}
									</span>
								</div>
							)}
						</button>
					</div>
					{/* Atalho 2: fechar modais (fixo) */}
					<div className="flex items-center justify-between p-3 rounded-lg bg-base border border-outline opacity-75">
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-semibold text-main">
								Fechar Modais
							</span>
							<span className="text-xs text-muted">
								Cancela ações ou fecha modais
							</span>
						</div>
						<kbd className="kbd kbd-sm bg-bright border border-outline-variant text-main text-xs font-mono">
							Esc
						</kbd>
					</div>
				</div>
				{/* Footer: Restaura padrões */}
				<div className="flex justify-between items-center border-t border-outline pt-4">
					<button
						type="button"
						onClick={resetShortcuts}
						className="btn btn-ghost btn-xs text-muted hover:text-main flex items-center gap-1 cursor-pointer"
					>
						<RotateCcw size={12} />
						Restaurar Padrão
					</button>
					<button
						type="button"
						onClick={onClose}
						className="btn btn-primary btn-sm cursor-pointer"
					>
						Concluído
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default ShortcutsModal
