
/**
 * Converte string brasileira de moeda em float.
 * Exemplo: "R$ 1.650.000,00" => 1650000
 */
export function brlStringToFloat(value: string): number {
  if (!value) return 0;
  return parseFloat(
    value
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(/\./g, '') // remove pontos de milhar
      .replace(',', '.')  // troca decimal
      .trim()
  );
}
