# Plano de Testes — EscalaCerta (API)

## 1. Escopo e objetivos
- **Dentro do escopo:** login, cadastro de colaboradores, escalas (plantões), trocas, folgas e validações de entrada.
- **Fora do escopo:** interface (front-end) e desempenho.

## 2. Estratégia
| Nível | Técnica | Ferramenta | Arquivo |
|---|---|---|---|
| Unitário | Caixa-preta (classes de equivalência + valor limite) | `node:test` | `test/validators.test.js` |
| Integração / API | Fluxos completos (ponta a ponta) | `node:test` + `fetch` | `test/api.test.js` |
| Regressão | Reteste completo a cada push (CI) | GitHub Actions | `.github/workflows/testes.yml` |

## 3. Critérios
- **Entrada:** `npm install` feito e `JWT_SECRET` definido.
- **Saída:** 100% dos testes passando e nenhum bug de severidade alta em aberto.

## 4. Riscos
- Banco SQLite em memória nos testes: não detecta problemas de arquivo em disco.
- Dependência `better-sqlite3` precisa compilar na máquina/CI.

## 5. Ambiente e ferramentas
VS Code, Node.js 22, `npm test`, extensão **Node.js Test Runner** (opcional), GitHub Actions.

---

## 6. Casos de teste (resumo)
| ID | Título | Pré-condição | Resultado esperado |
|---|---|---|---|
| CT-DAT-01 | Data válida | — | `dataValida("2026-09-10")` = true |
| CT-DAT-02 | Data inexistente | — | 31/02 e mês 13 rejeitados |
| CT-DAT-03 | 29/02 (limite) | — | Só aceita em ano bissexto |
| CT-ID-01/02 | ID válido e inválido | — | 1 e "5" aceitos; 0, -1, 1.5, "abc" → erro 400 |
| CT-TXT-01 | Tamanho do texto (limite) | — | 1 e 100 aceitos; 0 e 101 → erro 400 |
| CT-OPC-02 | Texto opcional (limite) | — | 255 aceito; 256 → erro 400 |
| CT-EML-01/02 | E-mail | — | Válido vira minúsculo; inválido → erro 400 |
| API-01 | Login | Usuário cadastrado | 200 com token; senha errada → 401 |
| API-02 | Rotas protegidas | — | Sem token → 401 |
| API-03 | Cadastro de colaborador | Token de gestor | Gestor 201; colaborador 403; e-mail repetido 409 |
| API-04 | Conflito de escala | Plantão existente | Mesmo dia/turno → 409 |
| API-05 | Folga | Colaborador logado | 201 PENDENTE; duplicada → 409; data inválida → 400 |
| API-06 | Troca de plantão | Dois colaboradores | Aprovada reatribui; recusada não altera; conflito → 409 |

## 7. Matriz de rastreabilidade
| Requisito | Casos de teste | Cobertura |
|---|---|---|
| RF-01 Autenticar usuário | API-01, API-02 | ✔ |
| RF-02 Cadastrar colaborador (só gestor) | API-03, CT-EML-01/02, CT-TXT-01 | ✔ |
| RF-03 Criar plantão sem conflito | API-04, CT-DAT-01 a 05 | ✔ |
| RF-04 Solicitar e aprovar troca | API-06, CT-ID-01/02 | ✔ |
| RF-05 Solicitar folga | API-05, CT-OPC-02 | ✔ |
| RF-06 Notificações | API-05, API-06 (parcial) | ⚠ Parcial |

## 8. Como rodar no VS Code
1. Abrir a pasta `EscalaCerta-backend` no VS Code.
2. Terminal (Ctrl + `): `npm install`
3. `npm test` → roda todos os testes.
4. `npm run test:cobertura` → testes + relatório de cobertura.
5. Teste só um arquivo: `node --test test/validators.test.js`