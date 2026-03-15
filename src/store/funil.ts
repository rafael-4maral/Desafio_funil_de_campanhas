import { useState, useCallback } from "react";

import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import type {
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from "reactflow";

const CHAVE_STORAGE = "dados_funil";

export type TipoEtapa =
  | "anuncio"
  | "landing"
  | "formulario"
  | "checkout"
  | "obrigado"

export interface ConfigEtapa {
  label: string;
  cor: string;
  icone: string;
  visitasBase: number;
  taxaConv: number;
}

export interface DadosNo {
  label: string;
  tipo: TipoEtapa;
  visitas: number;
  conversoes: number;
}

export const TIPOS_ETAPA: Record<TipoEtapa, ConfigEtapa> = {
  anuncio:    { label: "Anúncio",      cor: "#6366f1", icone: "📢", visitasBase: 10000, taxaConv: 0.35 },
  landing:    { label: "Landing Page", cor: "#0ea5e9", icone: "🌐", visitasBase: 3500,  taxaConv: 0.45 },
  formulario: { label: "Formulário",   cor: "#f59e0b", icone: "📋", visitasBase: 1575,  taxaConv: 0.60 },
  checkout:   { label: "Checkout",     cor: "#10b981", icone: "🛒", visitasBase: 945,   taxaConv: 0.70 },
  obrigado:   { label: "Obrigado",     cor: "#ec4899", icone: "🎉", visitasBase: 661,   taxaConv: 1.00 },
};

const nosIniciais: Node<DadosNo>[] = [
  { id: "1", type: "noFunil", position: { x: 100, y: 200 }, data: { label: "Anúncio Google", tipo: "anuncio",    visitas: 10000, conversoes: 3500 } },
  { id: "2", type: "noFunil", position: { x: 380, y: 200 }, data: { label: "Landing Page",   tipo: "landing",    visitas: 3500,  conversoes: 1575 } },
  { id: "3", type: "noFunil", position: { x: 660, y: 200 }, data: { label: "Formulário",     tipo: "formulario", visitas: 1575,  conversoes: 945  } },
  { id: "4", type: "noFunil", position: { x: 940, y: 200 }, data: { label: "Checkout",       tipo: "checkout",   visitas: 945,   conversoes: 661  } },
];

const arestasIniciais: Edge[] = [
  { id: "a1-2", source: "1", target: "2", animated: true },
  { id: "a2-3", source: "2", target: "3", animated: true },
  { id: "a3-4", source: "3", target: "4", animated: true },
];

function carregarDoStorage(): { nos: Node<DadosNo>[]; arestas: Edge[] } {
  try {
    const raw = localStorage.getItem(CHAVE_STORAGE);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { nos: nosIniciais, arestas: arestasIniciais };
}

function salvarNoStorage(nos: Node<DadosNo>[], arestas: Edge[]): void {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify({ nos, arestas }));
  } catch (_) {}
}

export function useFunil() {
  const inicial = carregarDoStorage();
  const [nos, setNos] = useState<Node<DadosNo>[]>(inicial.nos);
  const [arestas, setArestas] = useState<Edge[]>(inicial.arestas);

  const aoMudarNos = useCallback((changes: NodeChange[]) => {
    setNos((prev) => {
      const atualizado = applyNodeChanges(changes, prev) as Node<DadosNo>[];
      salvarNoStorage(atualizado, arestas);
      return atualizado;
    });
  }, [arestas]);

  const aoMudarArestas = useCallback((changes: EdgeChange[]) => {
    setArestas((prev) => {
      const atualizado = applyEdgeChanges(changes, prev);
      salvarNoStorage(nos, atualizado);
      return atualizado;
    });
  }, [nos]);

  const aoConectar = useCallback((conexao: Connection) => {
    setArestas((prev) => {
      const atualizado = addEdge({ ...conexao, animated: true }, prev);
      salvarNoStorage(nos, atualizado);
      return atualizado;
    });
  }, [nos]);

  const adicionarNo = useCallback((tipo: TipoEtapa) => {
    const config = TIPOS_ETAPA[tipo];
    const id = `no_${Date.now()}`;
    const novoNo: Node<DadosNo> = {
      id,
      type: "noFunil",
      position: { x: 150 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: {
        label: config.label,
        tipo,
        visitas: config.visitasBase,
        conversoes: Math.round(config.visitasBase * config.taxaConv),
      },
    };
    setNos((prev) => {
      const atualizado = [...prev, novoNo];
      salvarNoStorage(atualizado, arestas);
      return atualizado;
    });
  }, [arestas]);

  const atualizarNo = useCallback((id: string, novosDados: Partial<DadosNo>) => {
    setNos((prev) => {
      const atualizado = prev.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...novosDados } } : n
      );
      salvarNoStorage(atualizado, arestas);
      return atualizado;
    });
  }, [arestas]);

  const removerNo = useCallback((id: string) => {
    setNos((prev) => {
      const nosFiltrados = prev.filter((n) => n.id !== id);
      const arestasFiltradas = arestas.filter(
        (a) => a.source !== id && a.target !== id
      );
      salvarNoStorage(nosFiltrados, arestasFiltradas);
      return nosFiltrados;
    });
    setArestas((prev) =>
      prev.filter((a) => a.source !== id && a.target !== id)
    );
  }, [arestas]);

  const limparTudo = useCallback(() => {
    setNos([]);
    setArestas([]);
    salvarNoStorage([], []);
  }, []);

  return {
    nos,
    arestas,
    aoMudarNos,
    aoMudarArestas,
    aoConectar,
    adicionarNo,
    atualizarNo,
    removerNo,
    limparTudo,
  };
}