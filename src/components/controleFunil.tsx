import ReactFlow, {
  Background,
  Controls,
  BackgroundVariant,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from "reactflow";
import type { DadosNo } from "../store/funil";
import { TIPOS_ETAPA } from "../store/funil";
import NoFunil from "./noFunil";

const tiposNos = { noFunil: NoFunil };

// Tipagem das props recebidas do App.tsx
interface PropsCanvasFunil {
  nos: Node<DadosNo>[];
  arestas: Edge[];
  aoMudarNos: OnNodesChange;
  aoMudarArestas: OnEdgesChange;
  aoConectar: OnConnect;
  aoSelecionarNo: (no: Node<DadosNo> | null) => void;
}

export default function CanvasFunil({
  nos,
  arestas,
  aoMudarNos,
  aoMudarArestas,
  aoConectar,
  aoSelecionarNo,
}: PropsCanvasFunil) {

  function aoClicarNo(_: React.MouseEvent, no: Node) {
    aoSelecionarNo(no as Node<DadosNo>);
  }

  function aoClicarFundo() {
    aoSelecionarNo(null);
  }

  return (
    <div className="flex-1 h-full style={{ minHeight: 0, touchAction: 'none' }}>">
      <ReactFlow
        nodes={nos}
        edges={arestas}
        onNodesChange={aoMudarNos}
        onEdgesChange={aoMudarArestas}
        onConnect={aoConectar}
        onNodeClick={aoClicarNo}
        onPaneClick={aoClicarFundo}
        nodeTypes={tiposNos}
        deleteKeyCode="Delete"
        edgesFocusable={true}
        panOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        fitView
        defaultEdgeOptions={{
  animated: true,
  style: { strokeWidth: 2, stroke: "#94a3b8" },
}}
      >
        {/* Grade de pontos no fundo */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e2e8f0"
        />

        {/* Controles de zoom */}
        <Controls showInteractive={false} />

      </ReactFlow>
    </div>
  );
}