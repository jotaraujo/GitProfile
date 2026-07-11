import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { Compass, Lock, AlertTriangle, AlertCircle } from 'lucide-react'

// Página de Erro (ErrorPage): Renderizada em caso de rotas inválidas ou erros críticos na aplicação
const ErrorPage = () => {
	const error = useRouteError()
	let title = 'Ocorreu um erro'
	let message = 'Algo deu errado...'
	let Icon: React.ComponentType<{ className?: string; size: number }> = Compass

	//Verificando se é um erro de Resposta do Roteador (ex: 404 Not Found,
	// 401 Unauthorized)
	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			title = 'Página não encontrada'
			message = 'A página que você procura não existe.'
			Icon = Compass
		} else if (error.status === 500) {
			title = 'Erro do servidor'
			message = 'Ocorreu um erro no servidor. Tente novamente mais tarde.'
			Icon = AlertTriangle
		} else if (error.status === 401) {
			title = 'Não autorizado'
			message = 'Você não tem permissão para acessar esta página.'
			Icon = Lock
		} else if (error.status === 403) {
			title = 'Acesso negado'
			message = 'Você não tem permissão para acessar esta página.'
			Icon = Lock
		} else {
			title = `${error.status} - ${error.statusText}`
			message = `${error.data}`
			Icon = AlertCircle
		}
		//Verificando se é um erro padrão do JavaScript (ex: erros de tempos de execução
		// ou de sintaxe)
	} else if (error instanceof Error) {
		title = error.name
		message = error.message
	}

	//Caso o erro seja de um tipo desconhecido
	return (
		<div className="min-h-screen flex items-center justify-center bg-base text-main p-6">
			<div className="bg-surface border border-outline rounded-lg p-8 max-w-md w-full text-center flex flex-col items-center gap-6">
				<Icon className="text-error" size={48} />
				<h1 className="text-main font-sans font-bold text-2xl tracking-tight">
					{title}
				</h1>
				<p className="text-muted font-sans text-sm leading-relaxed">
					{message}
				</p>
				<Link
					to="/"
					className="btn btn-outline border-outline text-main hover:border-primary-variant hover:text-primary-variant transition-all duration-200 motion-safe:hover:scale-[1.01] w-full mt-2"
				>
					Voltar para Página Inicial
				</Link>
			</div>
		</div>
	)
}

export default ErrorPage
