import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  MonitorPlay,
  MousePointerClick,
  Play,
  Sparkles,
  Youtube,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Youtube,
    title: "Integracao OAuth",
    desc: "Conecte YouTube e TikTok em segundos com autenticacao segura via OAuth 2.0.",
  },
  {
    icon: Sparkles,
    title: "Quiz com IA",
    desc: "Gere videos de quiz automaticamente escolhendo nicho e referencia.",
  },
  {
    icon: Zap,
    title: "Renderizacao rapida",
    desc: "Motor de renderizacao em nuvem que transforma seu quiz em video pronto para publicar.",
  },
  {
    icon: MousePointerClick,
    title: "Publicacao 1-click",
    desc: "Publique simultaneamente no YouTube e TikTok com um unico clique.",
  },
];

const steps = [
  { num: "01", title: "Conecte", desc: "Integre YouTube e TikTok via OAuth" },
  { num: "02", title: "Configure", desc: "Escolha nicho, referencia e quantidade de perguntas" },
  { num: "03", title: "Gere", desc: "IA cria titulo, hashtags, categorias e descricao" },
  { num: "04", title: "Publique", desc: "Renderize e publique com um clique" },
];

function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(25_95%_53%/0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(25_95%_53%/0.05),transparent_50%)]" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden scroll-smooth bg-background text-foreground">
      <GridBackground />

      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20">
              Q
            </div>
            <span className="text-lg font-bold tracking-tight">Quizzio</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">
                Comecar gratis
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        <div className="relative z-10 max-w-3xl space-y-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3" />
              Automacao de videos com IA
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Crie e publique{" "}
            <span className="relative">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                videos de quiz
              </span>
              <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-linear-to-r from-primary to-accent opacity-50" />
            </span>{" "}
            em minutos
          </h1>

          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Conecte YouTube e TikTok, configure seu nicho, gere conteudo com IA e publique tudo em um so lugar, com
            um unico clique.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="shadow-lg shadow-primary/25">
              <Link href="/login">
                <Play className="mr-2 size-4" />
                Comecar agora
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#como-funciona">
                Como funciona
                <ChevronDown className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-muted-foreground">
            <div className="flex items-center gap-2 text-sm">
              <Youtube className="size-5 text-destructive" />
              YouTube
            </div>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2 text-sm">
              <MonitorPlay className="size-5 text-primary" />
              TikTok
            </div>
          </div>
        </div>

        <div className="absolute left-1/4 top-1/4 size-72 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 size-56 rounded-full bg-primary/10 blur-[80px]" />
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-28">
        <div className="mb-16 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-primary">Recursos</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Tudo que voce precisa para viralizar</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card"
            >
              <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/5 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="relative mx-auto max-w-5xl px-6 py-28">
        <div className="mb-16 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-primary">Passo a passo</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Como funciona</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.num} className="relative text-center">
              <span className="mb-4 block text-5xl font-black text-primary/15">{step.num}</span>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 py-28">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-card p-12 text-center sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(25_95%_53%/0.12),transparent_60%)]" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pronto para automatizar?</h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              Comece a criar videos de quiz e publique no YouTube e TikTok em minutos.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button size="lg" asChild className="shadow-lg shadow-primary/25">
                <Link href="/login">
                  Criar conta gratis
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-primary" />
                  Sem cartao de credito
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-primary" />
                  Setup em 2 minutos
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-primary" />
                  Suporte incluso
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              Q
            </div>
            <span className="text-sm font-semibold">Quizzio</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Termos
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacidade
            </Link>
          </div>
          <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Quizzio. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
