export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // pega o ?nome=... da URL
  const { searchParams } = new URL(request.url);
  const nome = searchParams.get("nome") || "visitante";

  return Response.json({
    mensagem: `Olá, ${nome}! Bem-vindo(a) à nuvem ☁️`,
  });
}