import type { Node } from "reactflow";
import type { DadosNo } from "../store/funil";
import { TIPOS_ETAPA } from "../store/funil";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PropsPainelMetricas {
  nos: Node<DadosNo>[];
}

export default function PainelMetricas({ nos }: PropsPainelMetricas) {

  const totalVisitas = nos.reduce((acc, n) => acc + n.data.visitas, 0);

  const totalConversoes = nos.reduce((acc, n) => acc + n.data.conversoes, 0);

  const taxaGeral =
    totalVisitas > 0
      ? ((totalConversoes / totalVisitas) * 100).toFixed(1)
      : "0";

  const contagemPorTipo = nos.reduce<Record<string, number>>((acc, n) => {
    acc[n.data.tipo] = (acc[n.data.tipo] || 0) + 1;
    return acc;
  }, {});

  return (

    <div className="w-full bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-4 overflow-x-auto">

      {/* Título da seção */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0">
        📊 Métricas do Funil
      </p>

      <Separator orientation="vertical" className="h-8" />

      {/* Card de total de visitas */}
      <Card className="border-0 shadow-none bg-gray-50 px-4 py-2 rounded-lg flex-shrink-0">
        <CardContent className="p-0 text-center">
          <p className="text-xs text-gray-400">Total de Visitas</p>
          <p className="text-base font-bold text-gray-800">
            {totalVisitas.toLocaleString("pt-BR")}
          </p>
        </CardContent>
      </Card>

      {/* Card de total de conversões */}
      <Card className="border-0 shadow-none bg-gray-50 px-4 py-2 rounded-lg flex-shrink-0">
        <CardContent className="p-0 text-center">
          <p className="text-xs text-gray-400">Total de Conversões</p>
          <p className="text-base font-bold text-gray-800">
            {totalConversoes.toLocaleString("pt-BR")}
          </p>
        </CardContent>
      </Card>

      {/* Card de taxa geral de conversão */}
      <Card className="border-0 shadow-none bg-green-50 px-4 py-2 rounded-lg flex-shrink-0">
        <CardContent className="p-0 text-center">
          <p className="text-xs text-gray-400">Taxa Geral</p>
          <p className="text-base font-bold text-green-600">{taxaGeral}%</p>
        </CardContent>
      </Card>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-3 overflow-x-auto">
        {Object.entries(contagemPorTipo).map(([tipo, quantidade]) => {
          const config = TIPOS_ETAPA[tipo as keyof typeof TIPOS_ETAPA];
          return (
            <div key={tipo} className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.cor }}
              />
              <span className="text-xs text-gray-600">
                {config.icone} {config.label}
                <span className="ml-1 font-semibold text-gray-800">
                  ×{quantidade}
                </span>
              </span>
            </div>
          );
        })}

        {nos.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            Nenhuma etapa no funil ainda.
          </p>
        )}
      </div>
    </div>
  );
}