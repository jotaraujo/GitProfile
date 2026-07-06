// Página de Erro (ErrorPage): Renderizada em caso de rotas inválidas ou erros críticos na aplicação
const ErrorPage = () => {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-base text-main">
			{/* Placeholder para exibição de mensagens de erro amigáveis ao usuário */}
			<p>Página não encontrada ou ocorreu um erro inesperado.</p>
		</div>
	)
}

export default ErrorPage
