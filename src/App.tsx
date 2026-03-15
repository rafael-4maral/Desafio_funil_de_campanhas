import { useState } from "react";
import type { Node } from "reactflow";
import type { DadosNo } from "./store/funil";
import { useFunil } from "./store/funil";

import PainelLateral from "./components/sidebar";
import PainelMetricas from "./components/painelMetricas";
import CanvasFunil from "./components/controleFunil";

export default function App() {
  const {
    nos,
    arestas,
    aoMudarNos,
    aoMudarArestas,
    aoConectar,
    adicionarNo,
    atualizarNo,
    removerNo,
    limparTudo,
  } = useFunil();

  const [noSelecionado, setNoSelecionado] = useState<Node<DadosNo> | null>(null);
  const [painelAberto, setPainelAberto] = useState(false);

  function handleRemoverNo(id: string) {
    removerNo(id);
    setNoSelecionado(null);
  }

  function handleLimparTudo() {
    limparTudo();
    setNoSelecionado(null);
  }

  return (
    // Layout principal
   <div className="flex flex-col w-screen bg-gray-100 overflow-hidden" style={{ height: '100dvh' }}>

     <div className="flex flex-1 overflow-hidden relative">

        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-xl"
          onClick={() => setPainelAberto(!painelAberto)}
        >
          {painelAberto ? "✕" : "☰"}
        </button>

        {/* Painel lateral */}
        <div className={`
          fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity duration-200
          ${painelAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
          onClick={() => setPainelAberto(false)}
        />
        <div className={`
          fixed left-0 top-0 h-full z-50 transition-transform duration-300 md:relative md:translate-x-0
          ${painelAberto ? "translate-x-0" : "-translate-x-full"}
        `}>
          <PainelLateral
            aoAdicionar={(tipo) => { adicionarNo(tipo); setPainelAberto(false); }}
            aoAtualizar={atualizarNo}
            aoRemover={handleRemoverNo}
            aoLimpar={handleLimparTudo}
            noSelecionado={noSelecionado}
          />
        </div>

        <CanvasFunil
          nos={nos}
          arestas={arestas}
          aoMudarNos={aoMudarNos}
          aoMudarArestas={aoMudarArestas}
          aoConectar={aoConectar}
          aoSelecionarNo={setNoSelecionado}
        />
      </div>

      <PainelMetricas nos={nos} />
    </div>
  );
}