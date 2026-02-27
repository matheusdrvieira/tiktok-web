"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Login() {
  const authService = useAuthService();
  const router = useRouter();
  const session = authService.getSession.data;
  const isAuthenticated = Boolean(session?.user?.id);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/studio");
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    authService.signInWithGoogle.mutate(undefined, {
      onSuccess: (result) => {
        if (!result?.redirect) {
          router.replace("/studio");
        }
      },
    });
  };

  const loginErrorMessage =
    authService.signInWithGoogle.error instanceof Error
      ? authService.signInWithGoogle.error.message
      : null;

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[50%] items-center justify-center overflow-hidden bg-secondary/30 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(25_95%_53%/0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(25_95%_53%/0.06),transparent_50%)]" />

        <div className="relative z-10 max-w-md space-y-8 px-8">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
            Q
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">Quizzio</h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Publicação automatizada de vídeos para suas plataformas favoritas.
              Gerencie TikTok e YouTube em um só lugar.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            <span>
              Geração de conteúdo com IA · Publicação multi-plataforma · Analytics em
              tempo real
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center p-6 lg:w-[50%]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(25_95%_53%/0.06),transparent_60%)] lg:hidden" />

        <div className="relative z-10 w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center lg:hidden">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
              Q
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Quizzio</h1>
            <p className="text-sm text-muted-foreground">
              Publicação automatizada de vídeos
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1 text-center">
              <h2 className="text-lg font-bold">Bem-vindo de volta</h2>
              <p className="text-sm text-muted-foreground">
                Entre para gerenciar suas publicações
              </p>
            </div>

            {isAuthenticated ? (
              <Button className="w-full" size="lg" onClick={() => router.push("/studio")}>
                Ir para Estúdio
              </Button>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handleLogin}
                disabled={authService.signInWithGoogle.isPending}
              >
                <svg className="mr-2 size-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {authService.signInWithGoogle.isPending
                  ? "Conectando..."
                  : "Continuar com Google"}
              </Button>
            )}

          {loginErrorMessage ? (
            <p className="text-center text-xs text-destructive">{loginErrorMessage}</p>
          ) : null}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  plataforma segura
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              <span>TikTok · YouTube</span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Ao continuar, você concorda com os{" "}
            <Link href="/terms" className="text-primary underline underline-offset-2 hover:text-primary/80">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
