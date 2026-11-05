export const dynamic = "force-dynamic";

export async function GET() {
  // lê a variável de ambiente (.env.local ou painel da Vercel)
  return Response.json({
    turma: process.env.NOME_TURMA ?? "variável não definida",
  });
}