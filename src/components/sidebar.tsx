import { useState } from "react";
import type { Node } from "reactflow";
import type { DadosNo, TipoEtapa } from "../store/funil";
import { TIPOS_ETAPA } from "../store/funil";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PropsPainelLateral {
  aoAdicionar: (tipo: TipoEtapa) => void;
  aoAtualizar: (id: string, dados: Partial<DadosNo>) => void;
  aoRemover: (id: string) => void;
  aoLimpar: () => void;
  noSelecionado: Node<DadosNo> | null;
}

export default function PainelLateral({
  aoAdicionar,
  aoAtualizar,
  aoRemover,
  aoLimpar,
  noSelecionado,
}: PropsPainelLateral) {

  const [nomeEditado, setNomeEditado] = useState("");
  const [editando, setEditando] = useState(false);

  function iniciarEdicao() {
    if (!noSelecionado) return;
    setNomeEditado(noSelecionado.data.label);
    setEditando(true);
  }

  function salvarEdicao() {
    if (!noSelecionado) return;
    aoAtualizar(noSelecionado.id, { label: nomeEditado });
    setEditando(false);
  }

  return (
    <div className="w-72 md:w-64 h-full bg-white border-r border-gray-200 flex flex-col p-4 gap-4 overflow-y-auto">

      {/* Título do painel */}
      <div>
        <h2 className="text-base font-bold text-gray-800">🎯 Funil de Campanhas</h2>
        <p className="text-xs text-gray-400 mt-1">Clique em uma etapa para adicionar</p>
      </div>

      <Separator />

      {/* Seção de adicionar etapas */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Adicionar etapa
        </p>
        <div className="flex flex-col gap-2">
          {(Object.entries(TIPOS_ETAPA) as [TipoEtapa, typeof TIPOS_ETAPA[TipoEtapa]][]).map(
            ([tipo, config]) => (
              <Button
                key={tipo}
                variant="outline"
                className="justify-start gap-2 text-sm"
                onClick={() => aoAdicionar(tipo)}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.cor }}
                />
                {config.icone} {config.label}
              </Button>
            )
          )}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Etapa selecionada
        </p>

        {noSelecionado ? (
          <div className="flex flex-col gap-3">

            <div
              className="rounded-lg p-3 text-sm"
              style={{
                backgroundColor: `${TIPOS_ETAPA[noSelecionado.data.tipo].cor}15`,
                borderLeft: `3px solid ${TIPOS_ETAPA[noSelecionado.data.tipo].cor}`,
              }}
            >
              <p className="text-xs text-gray-400">Tipo</p>
              <p className="font-semibold text-gray-700">
                {TIPOS_ETAPA[noSelecionado.data.tipo].icone}{" "}
                {TIPOS_ETAPA[noSelecionado.data.tipo].label}
              </p>
              <p className="text-xs text-gray-400 mt-2">Nome atual</p>
              <p className="font-semibold text-gray-700">{noSelecionado.data.label}</p>
            </div>

            {/* Input de edição de nome */}
            {editando ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="nomeEtapa" className="text-xs">Novo nome</Label>
                <Input
                  id="nomeEtapa"
                  value={nomeEditado}
                  onChange={(e) => setNomeEditado(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && salvarEdicao()}
                  placeholder="Nome da etapa"
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={salvarEdicao}>
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditando(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={iniciarEdicao}>
                  ✏️ Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => aoRemover(noSelecionado.id)}
                >
                  🗑️ Remover
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            Clique em uma etapa no canvas para editar ou remover.
          </p>
        )}
      </div>

      {/* Botão de limpar tudo */}
      <div className="mt-auto">
        <Separator className="mb-4" />
        <Button
          variant="outline"
          className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 text-sm"
          onClick={aoLimpar}
        >
          🧹 Limpar tudo
        </Button>
      </div>
    </div>
  );
}