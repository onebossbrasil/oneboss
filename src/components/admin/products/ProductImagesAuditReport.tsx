
import { useProducts } from "@/contexts/ProductContext";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ImageOff, CheckCircle2, Search } from "lucide-react";

// Utilitário para detectar URL válida
function isValidImageUrl(url: string) {
  return (
    typeof url === "string" &&
    url.trim() !== "" &&
    !url.trim().toLowerCase().endsWith(".svg") &&
    /^https:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(url.trim())
  );
}

export default function ProductImagesAuditReport() {
  const { products, isLoading, error } = useProducts();
  const [query, setQuery] = useState("");

  // Auditoria em memória
  const {
    noImage,
    invalidOrEmptyImages,
    withGoodImages,
    totalWithIssues,
    totalWithoutIssues,
  } = useMemo(() => {
    if (!Array.isArray(products)) {
      return {
        noImage: [],
        invalidOrEmptyImages: [],
        withGoodImages: [],
        totalWithIssues: 0,
        totalWithoutIssues: 0,
      };
    }
    // Produtos sem nenhuma imagem
    const noImage = products.filter((p) => !Array.isArray(p.images) || p.images.length === 0);

    // Produtos que têm imagens, mas todas são URLs inválidas
    const invalidOrEmptyImages = products.filter((p) =>
      Array.isArray(p.images) &&
      p.images.length > 0 &&
      !p.images.some((img) => isValidImageUrl(img.url))
    );

    // Produtos com pelo menos 1 imagem válida
    const withGoodImages = products.filter((p) =>
      Array.isArray(p.images) && p.images.some((img) => isValidImageUrl(img.url))
    );

    return {
      noImage,
      invalidOrEmptyImages,
      withGoodImages,
      totalWithIssues: noImage.length + invalidOrEmptyImages.length,
      totalWithoutIssues: withGoodImages.length,
    };
  }, [products]);

  // Filtro de busca simples pelo nome ou ID
  const filterProducts = (list: typeof products) => {
    if (!query.trim()) return list;
    return list.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <ImageOff className="w-5 h-5 text-orange-500" /> Auditoria de Imagens dos Produtos
        </h2>
        <div className="flex gap-2 items-end mb-4">
          <div>
            <label htmlFor="search" className="text-xs font-medium text-muted-foreground mb-1 block">Busca rápida</label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="border rounded px-2 py-1 pr-8 text-sm"
                placeholder="Nome ou ID do produto"
              />
              <Search className="absolute right-1 top-2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1 text-xs text-orange-800 font-semibold bg-orange-50 border border-orange-200 rounded px-2 py-1">
              Em risco: {totalWithIssues}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold bg-green-50 border border-green-200 rounded px-2 py-1">
              OK: {totalWithoutIssues}
            </span>
          </div>
        </div>
        {isLoading && <div className="text-muted-foreground py-6">Carregando produtos...</div>}
        {error && <div className="text-red-700 py-6">{String(error)}</div>}

        {/* Produtos SEM IMAGEM */}
        <AuditListBlock
          title="Produtos sem qualquer imagem cadastrada"
          icon={<AlertCircle className="w-4 h-4 text-orange-500" />}
          items={filterProducts(noImage)}
          emptyText="Todos os produtos têm pelo menos 1 imagem cadastrada."
        />

        {/* Produtos com imagens inválidas */}
        <AuditListBlock
          title="Produtos com imagens inválidas ou URLs quebradas"
          icon={<AlertCircle className="w-4 h-4 text-red-500" />}
          items={filterProducts(invalidOrEmptyImages)}
          showImages
          emptyText="Nenhum produto com imagem inválida."
        />

        {/* Produtos 100% OK */}
        <AuditListBlock
          title="Produtos com pelo menos 1 imagem válida"
          icon={<CheckCircle2 className="w-4 h-4 text-green-500" />}
          items={filterProducts(withGoodImages)}
          showImages
          emptyText="Nenhum produto tem imagem válida. (Auditoria crítica!)"
        />
      </CardContent>
    </Card>
  );
}

// Block component (poderia ser arquivo separado)
function AuditListBlock({ title, icon, items, showImages = false, emptyText = "Nenhum item encontrado." }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold mb-1 flex items-center gap-2">{icon} {title}</h3>
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground mb-2 pl-6">{emptyText}</div>
      ) : (
        <ul className="divide-y border rounded mb-1 bg-white/80">
          {items.map((p) => (
            <li key={p.id} className="p-2 flex gap-3 items-start">
              <span className="font-semibold text-xs">{p.name}</span>
              <span className="text-xs text-gray-500 ml-1">({p.id.slice(0,8)}…)</span>
              {showImages && Array.isArray(p.images) && (
                <div className="flex gap-2 ml-4 overflow-x-auto">
                  {p.images.length === 0 && <span className="text-xs text-red-400 ml-2">[Sem imagem]</span>}
                  {p.images.map((img, idx) => (
                    <a key={img.id || idx}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block border rounded ${img.url && img.url.startsWith("http") ? "" : "opacity-50"}`}
                      title={img.url}
                    >
                      <img
                        src={img.url || "/placeholder.svg"}
                        className="w-10 h-10 object-cover"
                        alt={`#${idx + 1}`}
                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.svg"; }}
                      />
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
