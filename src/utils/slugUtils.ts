/**
 * Utilitários para conversão de slugs e URLs amigáveis
 */

/**
 * Converte um texto para slug URL-friendly
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
};

/**
 * Converte um slug de volta para texto legível (apenas primeira letra maiúscula)
 */
export const slugToTitle = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Gera um slug único baseado no nome do produto
 */
export const createProductSlug = (name: string, id?: string): string => {
  const baseSlug = createSlug(name);
  // Adiciona os primeiros 8 caracteres do ID para garantir unicidade
  const shortId = id ? id.substring(0, 8) : '';
  return shortId ? `${baseSlug}-${shortId}` : baseSlug;
};

/**
 * Extrai o ID do produto de um slug gerado
 */
export const extractIdFromProductSlug = (slug: string): string | null => {
  // Pega os últimos 8 caracteres após o último hífen
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  if (lastPart && lastPart.length === 8) {
    return lastPart;
  }
  return null;
};