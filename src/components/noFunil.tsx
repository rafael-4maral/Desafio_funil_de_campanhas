import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { DadosNo } from "../store/funil";
import { TIPOS_ETAPA } from "../store/funil";

type PropsNoFunil = NodeProps<DadosNo>;

function NoFunil({ data, selected }: PropsNoFunil) {

  const config = TIPOS_ETAPA[data.tipo];

  const taxaConversao =
    data.visitas > 0
      ? ((data.conversoes / data.visitas) * 100).toFixed(1)
      : "0";

  return (
    // Container principal do card.
    <div
      style={{
        borderColor: selected ? config.cor : "transparent",
        borderWidth: 2,
        minWidth: 240,
        borderStyle: "solid",
        borderRadius: 12,
        boxShadow: selected
          ? `0 0 0 3px ${config.cor}33`
          : "0 2px 8px rgba(0,0,0,0.15)",
      }}
      className="bg-white rounded-xl w-52 cursor-pointer transition-all"
    >

      {/* Cabeçalho com o ícone e o tipo da etapa */}
      <div
        style={{ backgroundColor: config.cor }}
        className="flex items-center gap-2 px-3 py-2 rounded-t-xl"
      >
        <span className="text-lg">{config.icone}</span>
        <span className="text-white text-xs font-semibold uppercase tracking-wide">
          {config.label}
        </span>
      </div>

      {/* Nome personalizado da etapo */}
      <div className="px-3 pt-2 pb-1">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {data.label}
        </p>
      </div>

      {/* Métricas */}
      <div className="flex justify-between px-3 pb-3 mt-1 gap-1 w-full overflow-hidden">

        {/* Bloco de visitas */}
        <div className="min-w-0 flex-1 bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">Visitas</p>
          <p className="text-sm font-bold text-gray-700 ">
            {data.visitas.toLocaleString("pt-BR")}
          </p>
        </div>

        {/* Bloco de conversões */}
        <div className="min-w-0 flex-[1.4] bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400">Conversões</p>
          <p className="text-sm font-bold text-gray-700 truncate">
            {data.conversoes.toLocaleString("pt-BR")}
          </p>
        </div>

        {/* Bloco de taxa de conversão, com cor de fundo baseada no tipo da etapa */}
        <div
          style={{ backgroundColor: `${config.cor}18` }}
          className="min-w-0 flex-[1.4] rounded-lg p-2 text-center"
        >
          <p className="text-xs text-gray-400">Taxa</p>
          <p className="text-sm font-bold truncate" style={{ color: config.cor }}>
            {taxaConversao}%
          </p>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: config.cor,
          width: 14,
          height: 14,
          border: "2px solid white",
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: config.cor,
          width: 14,
          height: 14,
          border: "2px solid white",
        }}
      />
    </div>
  );
}

export default memo(NoFunil);