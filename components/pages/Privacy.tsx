"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl card-blur">
        <CardHeader>
          <Button variant="ghost" size="sm" className="w-fit mb-2" asChild>
            <Link href="/login"><ArrowLeft className="mr-2 size-4" />Voltar</Link>
          </Button>
          <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <section className="space-y-2">
            <p>
              A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o
              <strong className="text-foreground"> Quizzio </strong>
              coleta, usa, armazena e protege as informações dos usuários ao utilizar nossa plataforma.
            </p>
            <p>Ao utilizar o Quizzio, você concorda com as práticas descritas nesta política.</p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">1. Informações que coletamos</strong></p>
            <p>Podemos coletar diferentes tipos de informações para fornecer e melhorar nossos serviços.</p>
            <p><strong className="text-foreground">Informações fornecidas pelo usuário</strong></p>
            <p>Quando você cria uma conta ou utiliza nossos serviços, podemos coletar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome</li>
              <li>Endereço de e-mail</li>
              <li>Foto de perfil</li>
              <li>Informações de autenticação</li>
              <li>Conteúdos criados dentro da plataforma</li>
            </ul>
            <p>
              Essas informações são usadas para identificar o usuário e fornecer acesso às funcionalidades
              da plataforma.
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">2. Autenticação com Google (OAuth)</strong></p>
            <p>
              O Quizzio permite que usuários se autentiquem utilizando suas contas Google por meio do
              protocolo <strong className="text-foreground">OAuth 2.0</strong>.
            </p>
            <p>
              Quando você utiliza o login com Google, podemos acessar algumas informações básicas da sua
              conta, incluindo:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome</li>
              <li>Endereço de e-mail</li>
              <li>Foto de perfil</li>
            </ul>
            <p>Essas informações são utilizadas exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Criar e gerenciar sua conta na plataforma</li>
              <li>Autenticar sua identidade</li>
              <li>Personalizar sua experiência no serviço</li>
            </ul>
            <p>
              Não acessamos, armazenamos ou utilizamos dados além daqueles necessários para autenticação e
              funcionamento do serviço.
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">3. Uso de APIs do Google</strong></p>
            <p>
              O Quizzio pode utilizar APIs do Google, incluindo APIs relacionadas ao
              <strong className="text-foreground"> YouTube</strong>, para permitir funcionalidades da plataforma.
            </p>
            <p>Quando autorizadas pelo usuário, essas APIs podem permitir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Autenticação do usuário</li>
              <li>Acesso a informações básicas do perfil</li>
              <li>Envio ou gerenciamento de conteúdo em nome do usuário</li>
            </ul>
            <p>
              O uso dessas APIs segue rigorosamente a
              <strong className="text-foreground"> Google API Services User Data Policy</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">4. Como usamos as informações</strong></p>
            <p>As informações coletadas são utilizadas para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fornecer e operar a plataforma</li>
              <li>Autenticar usuários</li>
              <li>Permitir integração com serviços de terceiros</li>
              <li>Melhorar a experiência do usuário</li>
              <li>Manter a segurança da plataforma</li>
              <li>Cumprir obrigações legais</li>
            </ul>
            <p>Não utilizamos dados do Google para fins de publicidade.</p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">5. Compartilhamento de informações</strong></p>
            <p>Não vendemos, alugamos ou comercializamos dados pessoais dos usuários.</p>
            <p>Podemos compartilhar informações apenas nas seguintes situações:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Quando necessário para fornecer funcionalidades do serviço</li>
              <li>Quando exigido por lei</li>
              <li>Para proteger direitos legais ou prevenir fraudes</li>
            </ul>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">6. Armazenamento e segurança dos dados</strong></p>
            <p>
              Os dados coletados são armazenados em servidores seguros e protegidos por medidas técnicas e
              organizacionais apropriadas.
            </p>
            <p>Adotamos práticas de segurança para proteger as informações contra:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acesso não autorizado</li>
              <li>Alteração</li>
              <li>Divulgação</li>
              <li>Destruição de dados</li>
            </ul>
            <p>Os dados são mantidos apenas pelo tempo necessário para fornecer o serviço.</p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">7. Retenção de dados</strong></p>
            <p>
              Mantemos as informações do usuário enquanto a conta estiver ativa ou enquanto forem necessárias
              para fornecer nossos serviços.
            </p>
            <p>Os usuários podem solicitar a exclusão de seus dados a qualquer momento.</p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">8. Exclusão de dados do usuário</strong></p>
            <p>Usuários podem solicitar a exclusão de seus dados pessoais armazenados pelo Quizzio.</p>
            <p>
              Para solicitar a exclusão de dados, entre em contato através do e-mail:
              <strong className="text-foreground"> contato@quizzio.com.br</strong>
            </p>
            <p>
              Após a solicitação, removeremos os dados pessoais associados à conta dentro de um prazo
              razoável, salvo quando houver obrigação legal de retenção.
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">Revogação de acesso</strong></p>
            <p>
              Os usuários também podem revogar o acesso do Quizzio à sua conta Google a qualquer momento
              através das configurações de segurança da conta Google:
            </p>
            <p>
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                https://myaccount.google.com/permissions
              </a>
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">9. Uso e transferência de dados das APIs do Google</strong></p>
            <p>
              O uso e transferência de informações recebidas das APIs do Google para qualquer outro aplicativo
              obedecerão à
              <strong className="text-foreground"> Google API Services User Data Policy</strong>, incluindo os
              requisitos de <strong className="text-foreground">Limited Use</strong>.
            </p>
            <p>As informações obtidas das APIs do Google:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>São utilizadas apenas para fornecer funcionalidades do aplicativo</li>
              <li>Não são usadas para publicidade</li>
              <li>Não são vendidas a terceiros</li>
            </ul>
            <p>
              As informações obtidas através das APIs do Google não são utilizadas para treinamento de modelos
              de inteligência artificial ou aprendizado de máquina.
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">10. Cookies e tecnologias similares</strong></p>
            <p>O Quizzio pode utilizar cookies e tecnologias similares para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Manter sessões autenticadas</li>
              <li>Melhorar o desempenho da plataforma</li>
              <li>Entender como os usuários utilizam o serviço</li>
            </ul>
            <p>
              Os usuários podem configurar seus navegadores para recusar cookies, embora algumas
              funcionalidades possam deixar de funcionar corretamente.
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">11. Links para sites de terceiros</strong></p>
            <p>
              Nosso serviço pode conter links para sites externos que não são operados pelo Quizzio.
            </p>
            <p>
              Não temos controle sobre o conteúdo ou práticas de privacidade desses sites e recomendamos que
              os usuários revisem suas respectivas políticas de privacidade.
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">12. Alterações nesta política</strong></p>
            <p>Podemos atualizar esta Política de Privacidade periodicamente.</p>
            <p>
              Quando alterações significativas forem realizadas, notificaremos os usuários através do site ou
              outros meios apropriados.
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">13. Contato</strong></p>
            <p>
              Se você tiver qualquer dúvida sobre esta Política de Privacidade ou sobre o tratamento de dados
              pessoais, entre em contato conosco:
            </p>
            <p>
              Email:
              <strong className="text-foreground"> contato@quizzio.com.br</strong>
            </p>
          </section>

          <section className="space-y-2">
            <p><strong className="text-foreground">Última atualização:</strong> 27 de fevereiro de 2026</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
