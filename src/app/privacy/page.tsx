import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl border border-unfocused-border-color rounded-geist bg-background p-geist">
        <h1 className="text-2xl font-geist font-semibold text-foreground">
          Politica de Privacidade
        </h1>
        <p className="mt-2 text-subtitle text-sm">
          Ultima atualizacao: 11/02/2026
        </p>

        <div className="mt-6 space-y-4 text-sm leading-7 text-foreground">
          <p>
            Coletamos apenas os dados necessarios para autenticar usuarios,
            manter sessao e operar as integracoes disponiveis na plataforma.
          </p>
          <p>
            Dados de autenticacao e integracao sao usados somente para permitir
            acesso ao sistema e funcionamento das funcionalidades conectadas.
          </p>
          <p>
            Nao vendemos dados pessoais. Podemos atualizar esta politica quando
            houver mudancas legais ou tecnicas relevantes.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/login"
            className="text-sm text-subtitle hover:text-foreground underline underline-offset-2"
          >
            Voltar para login
          </Link>
        </div>
      </div>
    </main>
  );
}
