"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl card-blur">
        <CardHeader>
          <Button variant="ghost" size="sm" className="w-fit mb-2" asChild>
            <Link href="/login"><ArrowLeft className="mr-2 size-4" />Voltar</Link>
          </Button>
          <CardTitle className="text-2xl">Termos de Uso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p><strong className="text-foreground">1. Termos</strong><br />
            Ao acessar ao site Quizzio, concorda em cumprir estes termos de serviço, todas as leis
            e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis
            locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar
            ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de
            direitos autorais e marcas comerciais aplicáveis.</p>
          <p><strong className="text-foreground">2. Uso de Licença</strong><br />
            É concedida permissão para baixar temporariamente uma cópia dos materiais (informações
            ou software) no site Quizzio, apenas para visualização transitória pessoal e não
            comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob
            esta licença, você não pode: modificar ou copiar os materiais; usar os materiais para
            qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);
            tentar descompilar ou fazer engenharia reversa de qualquer software contido no site
            Quizzio; remover quaisquer direitos autorais ou outras notações de propriedade dos
            materiais; ou transferir os materiais para outra pessoa ou &quot;espelhar&quot; os materiais em
            qualquer outro servidor. Esta licença será automaticamente rescindida se você violar
            alguma dessas restrições e poderá ser rescindida por Quizzio a qualquer momento. Ao
            encerrar a visualização desses materiais ou após o término desta licença, você deve
            apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou
            impresso.</p>
          <p><strong className="text-foreground">3. Isenção de Responsabilidade</strong><br />
            Os materiais no site da Quizzio são fornecidos &quot;como estão&quot;. Quizzio não oferece
            garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras
            garantias, incluindo, sem limitação, garantias implícitas ou condições de
            comercialização, adequação a um fim específico ou não violação de propriedade
            intelectual ou outra violação de direitos. Além disso, o Quizzio não garante ou faz
            qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade
            do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em
            sites vinculados a este site.</p>
          <p><strong className="text-foreground">4. Limitações</strong><br />
            Em nenhum caso o Quizzio ou seus fornecedores serão responsáveis por quaisquer danos
            (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos
            negócios) decorrentes do uso ou da incapacidade de usar os materiais em Quizzio, mesmo
            que Quizzio ou um representante autorizado da Quizzio tenha sido notificado oralmente ou
            por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem
            limitações em garantias implícitas, ou limitações de responsabilidade por danos
            consequentes ou incidentais, essas limitações podem não se aplicar a você.</p>
          <p><strong className="text-foreground">5. Precisão dos Materiais</strong><br />
            Os materiais exibidos no site da Quizzio podem incluir erros técnicos, tipográficos ou
            fotográficos. Quizzio não garante que qualquer material em seu site seja preciso,
            completo ou atual. Quizzio pode fazer alterações nos materiais contidos em seu site a
            qualquer momento, sem aviso prévio. No entanto, Quizzio não se compromete a atualizar os
            materiais.</p>
          <p><strong className="text-foreground">6. Links</strong><br />
            O Quizzio não analisou todos os sites vinculados ao seu site e não é responsável pelo
            conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por
            Quizzio do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>
          <p><strong className="text-foreground">7. Modificações</strong><br />
            O Quizzio pode revisar estes termos de serviço do site a qualquer momento, sem aviso
            prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos
            de serviço.</p>
          <p><strong className="text-foreground">8. Lei Aplicável</strong><br />
            Estes termos e condições são regidos e interpretados de acordo com as leis do Quizzio e
            você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou
            localidade.</p>
        </CardContent>
      </Card>
    </div>
  );
}
