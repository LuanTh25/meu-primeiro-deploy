export const dynamic = "force-dynamic"; // calcula a resposta a cada requisição

export async function GET() {
  // log que aparece na aba Logs da Vercel (passo 11)
  console.log("API /hello chamada em", new Date().toISOString());

  return Response.json({
    mensagem: "Olá! Esta resposta veio da minha API 🚀",
    horario: new Date().toISOString(),
  });
}