"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthService } from "@/services/authService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  const authService = useAuthService();
  const router = useRouter();
  const session = authService.getSession.data;
  const isAuthenticated = Boolean(session?.user?.id);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    authService.signInWithGoogle.mutate(undefined, {
      onSuccess: (result) => {
        if (!result?.redirect) {
          router.replace("/dashboard");
        }
      },
    });
  };

  const loginErrorMessage =
    authService.signInWithGoogle.error instanceof Error
      ? authService.signInWithGoogle.error.message
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm card-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            Q
          </div>
          <CardTitle className="text-2xl">Quizzio</CardTitle>
          <CardDescription>Publicação automatizada de vídeos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated ? (
            <Button className="w-full" size="lg" onClick={() => router.push("/dashboard")}>
              Ir para Dashboard
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={handleLogin}
              disabled={authService.signInWithGoogle.isPending}
            >
              Continuar com Google
            </Button>
          )}
          {loginErrorMessage ? (
            <p className="text-center text-xs text-destructive">{loginErrorMessage}</p>
          ) : null}
          <p className="text-center text-xs text-muted-foreground">
            Ao continuar, voce concorda com os{" "}
            <Link href="/terms" className="text-primary underline underline-offset-2 hover:text-primary/80">
              Termos de Uso
            </Link>{' '}
            e a{" "}
            <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
              Politica de Privacidade
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
