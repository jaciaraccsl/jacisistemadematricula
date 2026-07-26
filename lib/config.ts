// Marca do cliente, lida do "cartãozinho" (variáveis de ambiente).
// O código é o mesmo pra todos; só isto muda por cliente.
export const cliente = {
  nome: process.env.NEXT_PUBLIC_CLIENTE_NOME ?? "Instituição Exemplo",
  cor: process.env.NEXT_PUBLIC_CLIENTE_COR ?? "#4f46e5",
};
