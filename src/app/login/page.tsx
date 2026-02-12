"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Button } from "../../components/Button";
import { ErrorComp } from "../../components/Error";
import { authClient } from "../../lib/auth-client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGoogleSignIn = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
      });

      if (signInError) {
        throw new Error(signInError.message || "Falha ao iniciar login.");
      }

      if (!data?.redirect) {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel iniciar login com Google.",
      );
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-unfocused-border-color rounded-geist p-geist bg-background">
        <h1 className="text-2xl font-geist font-semibold text-foreground">
          Entrar
        </h1>
        <p className="mt-2 text-subtitle">
          Continue com sua conta Google para acessar o app.
        </p>

        <div className="mt-6">
          <Button onClick={onGoogleSignIn} disabled={loading} loading={loading}>
            Continuar com Google
          </Button>
        </div>

        <p className="mt-4 text-xs text-subtitle leading-5">
          Ao continuar, voce concorda com os{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Termos de Uso
          </Link>{" "}
          e com a{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Politica de Privacidade
          </Link>
          .
        </p>

        {error ? (
          <div className="mt-4">
            <ErrorComp message={error}></ErrorComp>
          </div>
        ) : null}
      </div>
    </main>
  );
}
