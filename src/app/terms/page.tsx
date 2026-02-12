import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl border border-unfocused-border-color rounded-geist bg-background p-geist">
        <h1 className="text-2xl font-geist font-semibold text-foreground">
          Termos de Uso
        </h1>
        <p className="mt-2 text-subtitle text-sm">
          Ultima atualizacao: 11/02/2026
        </p>

        <div className="mt-6 space-y-4 text-sm leading-7 text-foreground">
          <p>
            Ao usar o Quizzio Mania, voce concorda em utilizar a plataforma de
            forma legal, sem violar direitos de terceiros e sem tentar burlar
            regras tecnicas de seguranca.
          </p>
          <p>
            Voce e responsavel pelo conteudo dos videos gerados e publicados em
            contas conectadas. Nao publique conteudo ilegal, enganoso ou que
            infrinja direitos autorais.
          </p>
          <p>
            Podemos atualizar estes termos quando necessario. O uso continuo da
            plataforma apos mudancas significa que voce concorda com a versao
            mais recente.
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
