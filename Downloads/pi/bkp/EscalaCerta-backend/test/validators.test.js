// Testes unitários dos validadores (caixa-preta: classes de equivalência + valor limite)
// Não precisa de banco nem de servidor, roda em milissegundos.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  dataValida,
  exigirData,
  exigirId,
  exigirTexto,
  textoOpcional,
  exigirEmail,
  fmtBR,
} from "../src/utils/validators.js";

// Função auxiliar: confere se a função lançou erro 400
function deveDar400(fn) {
  assert.throws(fn, (erro) => erro.status === 400);
}

// ---------- dataValida / exigirData ----------
test("CT-DAT-01: data válida é aceita", () => {
  assert.equal(dataValida("2026-09-10"), true);
});

test("CT-DAT-02: data inexistente é rejeitada (31/02 e mês 13)", () => {
  assert.equal(dataValida("2026-02-31"), false);
  assert.equal(dataValida("2026-13-01"), false);
});

test("CT-DAT-03: 29/02 só vale em ano bissexto (valor limite)", () => {
  assert.equal(dataValida("2028-02-29"), true); // 2028 é bissexto
  assert.equal(dataValida("2026-02-29"), false); // 2026 não é
});

test("CT-DAT-04: formato errado ou tipo errado é rejeitado", () => {
  assert.equal(dataValida("10/09/2026"), false);
  assert.equal(dataValida(""), false);
  assert.equal(dataValida(null), false);
  assert.equal(dataValida(20260910), false);
});

test("CT-DAT-05: exigirData lança 400 quando inválida", () => {
  deveDar400(() => exigirData("2026-02-31"));
  assert.equal(exigirData("2026-09-10"), "2026-09-10");
});

// ---------- exigirId ----------
test("CT-ID-01: aceita número inteiro positivo e texto numérico", () => {
  assert.equal(exigirId(1, "id"), 1); // menor valor válido (limite)
  assert.equal(exigirId("5", "id"), 5);
});

test("CT-ID-02: rejeita zero, negativo, decimal, texto e nulo", () => {
  deveDar400(() => exigirId(0, "id")); // logo abaixo do limite
  deveDar400(() => exigirId(-1, "id"));
  deveDar400(() => exigirId(1.5, "id"));
  deveDar400(() => exigirId("abc", "id"));
  deveDar400(() => exigirId(null, "id"));
});

// ---------- exigirTexto (padrão: mínimo 1, máximo 100) ----------
test("CT-TXT-01: tamanho mínimo e máximo (valores limite)", () => {
  assert.equal(exigirTexto("a", "nome"), "a"); // 1 caractere: ok
  assert.equal(exigirTexto("x".repeat(100), "nome").length, 100); // 100: ok
  deveDar400(() => exigirTexto("", "nome")); // 0: erro
  deveDar400(() => exigirTexto("x".repeat(101), "nome")); // 101: erro
});

test("CT-TXT-02: espaços nas pontas são removidos e só espaços é rejeitado", () => {
  assert.equal(exigirTexto("  Ana  ", "nome"), "Ana");
  deveDar400(() => exigirTexto("   ", "nome"));
});

test("CT-TXT-03: valor que não é texto é rejeitado", () => {
  deveDar400(() => exigirTexto(123, "nome"));
  deveDar400(() => exigirTexto(undefined, "nome"));
});

// ---------- textoOpcional (máximo padrão: 255) ----------
test("CT-OPC-01: ausente ou vazio vira null", () => {
  assert.equal(textoOpcional(undefined, "motivo"), null);
  assert.equal(textoOpcional(null, "motivo"), null);
  assert.equal(textoOpcional("", "motivo"), null);
});

test("CT-OPC-02: limite de 255 caracteres", () => {
  assert.equal(textoOpcional("x".repeat(255), "motivo").length, 255); // ok
  deveDar400(() => textoOpcional("x".repeat(256), "motivo")); // erro
});

test("CT-OPC-03: valor que não é texto é rejeitado", () => {
  deveDar400(() => textoOpcional(42, "motivo"));
});

// ---------- exigirEmail ----------
test("CT-EML-01: e-mail válido vira minúsculo", () => {
  assert.equal(exigirEmail("ANA@Teste.com"), "ana@teste.com");
});

test("CT-EML-02: e-mails inválidos são rejeitados", () => {
  deveDar400(() => exigirEmail("sem-arroba"));
  deveDar400(() => exigirEmail("a@b")); // sem ponto no domínio
  deveDar400(() => exigirEmail("ana @teste.com")); // espaço no meio
  deveDar400(() => exigirEmail(null));
});

// ---------- fmtBR ----------
test("CT-FMT-01: converte AAAA-MM-DD para DD/MM/AAAA", () => {
  assert.equal(fmtBR("2026-09-10"), "10/09/2026");
});