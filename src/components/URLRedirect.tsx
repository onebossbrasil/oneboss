import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Componente para redirecionar URLs antigas com UUIDs para URLs amigáveis com slugs
 */
const URLRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);

    // Redirecionar query parameters de categoria para slug
    if (currentPath === "/loja" && searchParams.has("category")) {
      const categoryParam = searchParams.get("category");
      if (categoryParam) {
        // Se parece com um UUID, redireciona para a página de loja geral
        // (o useStoreFilters vai tentar resolver o ID)
        console.log(`[URLRedirect] Parâmetro de categoria detectado: ${categoryParam}`);
        // Por enquanto, mantém a funcionalidade existente
        // Futuras melhorias podem incluir lookup de slug baseado no ID
      }
    }

    // Logs para debug
    console.log(`[URLRedirect] Path atual: ${currentPath}`);
    console.log(`[URLRedirect] Search params:`, Object.fromEntries(searchParams));
  }, [location, navigate]);

  return null; // Este componente não renderiza nada
};

export default URLRedirect;