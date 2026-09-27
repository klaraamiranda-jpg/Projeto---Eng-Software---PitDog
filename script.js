"use strict";

/* ---------- Dados ---------- */

// Endereço da API. Enquanto estiver vazio, o protótipo usa os dados locais abaixo.
// Com a API pronta, cada recurso é buscado em `${API_URL}/<recurso>` (usuarios, insumos, cardapio).
// O campo "foto" de itens e insumos recebe a URL da imagem; vazio = placeholder.
const API_URL = "";

const dadosLocais = {
  usuarios: [
    { id: 1, nome: "Ana", perfil: "Atendente" },
    { id: 2, nome: "Bruno", perfil: "Chapeiro" },
    { id: 3, nome: "Carla", perfil: "Supervisor" }
  ],
  insumos: [
    { id: 1, nome: "Pão de hot dog", unidade: "un", estoqueMinimo: 10, saldoEstoque: 40, custoUnitario: 0.8, foto: "" },
    { id: 2, nome: "Salsicha", unidade: "un", estoqueMinimo: 10, saldoEstoque: 50, custoUnitario: 1.2, foto: "" },
    { id: 3, nome: "Pão de hambúrguer", unidade: "un", estoqueMinimo: 10, saldoEstoque: 30, custoUnitario: 1, foto: "" },
    { id: 4, nome: "Hambúrguer", unidade: "un", estoqueMinimo: 10, saldoEstoque: 30, custoUnitario: 3.5, foto: "" },
    { id: 5, nome: "Queijo", unidade: "fatia", estoqueMinimo: 10, saldoEstoque: 14, custoUnitario: 0.9, foto: "" },
    { id: 6, nome: "Bacon", unidade: "fatia", estoqueMinimo: 10, saldoEstoque: 8, custoUnitario: 1.1, foto: "" },
    { id: 7, nome: "Batata palha", unidade: "g", estoqueMinimo: 200, saldoEstoque: 1500, custoUnitario: 0.03, foto: "" },
    { id: 8, nome: "Milho", unidade: "g", estoqueMinimo: 200, saldoEstoque: 1000, custoUnitario: 0.02, foto: "" },
    { id: 9, nome: "Refrigerante lata", unidade: "un", estoqueMinimo: 12, saldoEstoque: 24, custoUnitario: 3, foto: "" },
    { id: 10, nome: "Suco de laranja", unidade: "ml", estoqueMinimo: 1000, saldoEstoque: 900, custoUnitario: 0.01, foto: "" }
  ],
  cardapio: [
    {
      id: 1, nome: "Hot Dog Tradicional", descricao: "Pão macio, salsicha, milho e batata palha.", categoria: "lanche",
      preco: 14, ativo: true, foto: "",
      composicao: [{ insumoId: 1, quantidade: 1 }, { insumoId: 2, quantidade: 1 }, { insumoId: 8, quantidade: 30 }, { insumoId: 7, quantidade: 20 }],
      combo: [],
      adicionais: [{ id: 1, insumoId: 5, quantidade: 1, preco: 2.5 }, { id: 2, insumoId: 6, quantidade: 2, preco: 4 }]
    },
    {
      id: 2, nome: "Hot Dog Duplo", descricao: "Pão, duas salsichas, milho e batata palha.", categoria: "lanche",
      preco: 18, ativo: true, foto: "",
      composicao: [{ insumoId: 1, quantidade: 1 }, { insumoId: 2, quantidade: 2 }, { insumoId: 8, quantidade: 30 }, { insumoId: 7, quantidade: 20 }],
      combo: [],
      adicionais: [{ id: 3, insumoId: 5, quantidade: 1, preco: 2.5 }]
    },
    {
      id: 3, nome: "X-Burger", descricao: "Pão, hambúrguer e queijo.", categoria: "lanche",
      preco: 20, ativo: true, foto: "",
      composicao: [{ insumoId: 3, quantidade: 1 }, { insumoId: 4, quantidade: 1 }, { insumoId: 5, quantidade: 1 }],
      combo: [],
      adicionais: [{ id: 4, insumoId: 6, quantidade: 2, preco: 4 }, { id: 5, insumoId: 5, quantidade: 1, preco: 2.5 }]
    },
    {
      id: 4, nome: "X-Bacon", descricao: "Pão, hambúrguer, queijo e bacon.", categoria: "lanche",
      preco: 24, ativo: true, foto: "",
      composicao: [{ insumoId: 3, quantidade: 1 }, { insumoId: 4, quantidade: 1 }, { insumoId: 5, quantidade: 1 }, { insumoId: 6, quantidade: 2 }],
      combo: [],
      adicionais: [{ id: 6, insumoId: 5, quantidade: 1, preco: 2.5 }]
    },
    {
      id: 5, nome: "Refrigerante", descricao: "Lata 350 ml.", categoria: "bebida",
      preco: 6, ativo: true, foto: "",
      composicao: [{ insumoId: 9, quantidade: 1 }], combo: [], adicionais: []
    },
    {
      id: 6, nome: "Suco de Laranja", descricao: "Copo 300 ml.", categoria: "bebida",
      preco: 8, ativo: true, foto: "",
      composicao: [{ insumoId: 10, quantidade: 300 }], combo: [], adicionais: []
    },
    {
      id: 7, nome: "Combo Hot Dog", descricao: "Hot Dog Tradicional e Refrigerante.", categoria: "combo",
      preco: 18, ativo: true, foto: "",
      composicao: [], combo: [{ itemId: 1, quantidade: 1 }, { itemId: 5, quantidade: 1 }], adicionais: []
    }
  ]
};

async function buscarDados(recurso) {
  if (!API_URL) return structuredClone(dadosLocais[recurso]);
  const resposta = await fetch(`${API_URL}/${recurso}`);
  if (!resposta.ok) throw new Error(`Falha ao buscar ${recurso}`);
  return resposta.json();
}

/* ---------- Estado ---------- */

const estado = {
  usuario: null,
  tela: "entrar",
  mensagem: null,
  usuarios: [],
  insumos: [],
  cardapio: [],
  pedidos: [],
  parciais: {},
  perdas: [],
  movimentacoes: [],
  divergencias: [],
  solicitacoes: [],
  avisos: [],
  caixa: { status: "Fechado", pagamentos: [] },
  fechamentos: [],
  rascunho: { conta: "", linhas: [] },
  produto: null,
  contaSelecionada: "",
  pendenteEncontrada: null,
  solicitacaoAtendida: null,
  itemEditado: null,
  insumoEditado: null,
  consulta: { nome: "", categoria: "", situacao: "" }
};

const menus = {
  Atendente: [["pedido", "Novo pedido"], ["pagamento", "Pagamento"], ["cancelamento", "Cancelar pedido"]],
  Chapeiro: [["fila", "Fila de produção"], ["perda", "Registrar perda"], ["reabastecimento", "Reabastecimento"]],
  Supervisor: [["cardapio", "Cardápio"], ["estoque", "Estoque"], ["caixa", "Caixa"]]
};

const modalidades = ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "PIX"];
const motivosPerda = ["Vencimento", "Baixa qualidade", "Erro de preparo"];
const cancelaveis = ["Aguardando Preparo", "Em Preparo", "Pronto para Entrega"];

/* ---------- Utilitários ---------- */

let ultimoId = 100;
const novoId = () => ++ultimoId;
const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const centavos = (v) => Math.round(v * 100);
const agora = () => new Date().toLocaleString("pt-BR");
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const insumo = (id) => estado.insumos.find((i) => i.id === id);
const item = (id) => estado.cardapio.find((i) => i.id === id);
const disponivel = (ins) => ins.saldoEstoque - ins.comprometido;
const total = (linhas) => linhas.reduce((s, l) => s + l.precoUnitario * l.quantidade, 0);
const nomeUsuario = () => estado.usuario.nome;

function avisar(perfil, texto) {
  estado.avisos.push({ perfil, texto, data: agora() });
}

const icones = { mais: "M12 5v14M5 12h14", menos: "M5 12h14", voltar: "M15 18l-6-6 6-6" };
const icone = (nome) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="${icones[nome]}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const foto = (obj) =>
  obj.foto ? `<img src="${esc(obj.foto)}" alt="${esc(obj.nome)}">` : `<span class="fotoPlaceholder" aria-hidden="true"></span>`;

const campo = (rotulo, nome, controle) =>
  `<label class="campo"><span>${rotulo}</span>${controle}<small class="erroCampo" data-erro="${nome}" aria-live="polite"></small></label>`;

const opcoesInsumo = (selecionado) =>
  estado.insumos.map((i) => `<option value="${i.id}" ${i.id === selecionado ? "selected" : ""}>${esc(i.nome)} — saldo: ${i.saldoEstoque} ${esc(i.unidade)}</option>`).join("");

function erroCampo(form, nome, texto) {
  const controle = form.elements[nome];
  if (controle && controle.setAttribute) {
    controle.setAttribute("aria-invalid", "true");
    controle.focus();
  }
  form.querySelector(`[data-erro="${nome}"]`).textContent = texto;
  return false;
}

function limparErros(form) {
  form.querySelectorAll("[data-erro]").forEach((s) => (s.textContent = ""));
  form.querySelectorAll("[aria-invalid]").forEach((c) => c.removeAttribute("aria-invalid"));
}

/* ---------- Regras de estoque (RN01, RN02) ---------- */

function somarConsumo(mapa, itemId, quantidade, adicionais = [], removidos = []) {
  const it = item(itemId);
  it.composicao.forEach((c) => {
    if (!removidos.includes(c.insumoId)) mapa[c.insumoId] = (mapa[c.insumoId] || 0) + c.quantidade * quantidade;
  });
  it.combo.forEach((c) => somarConsumo(mapa, c.itemId, c.quantidade * quantidade));
  it.adicionais.filter((a) => adicionais.includes(a.id)).forEach((a) => {
    mapa[a.insumoId] = (mapa[a.insumoId] || 0) + a.quantidade * quantidade;
  });
  return mapa;
}

function consumoDe(linhas) {
  const mapa = {};
  linhas.forEach((l) => somarConsumo(mapa, l.itemId, l.quantidade, l.adicionais, l.removidos));
  return mapa;
}

function cabeNoEstoque(linhas) {
  const mapa = consumoDe(linhas);
  return Object.keys(mapa).every((id) => mapa[id] <= disponivel(insumo(Number(id))));
}

const usaInsumoCritico = (it) =>
  Object.keys(somarConsumo({}, it.id, 1)).some((id) => insumo(Number(id)).situacao === "Crítico");

/* ---------- Rascunho do pedido ---------- */

function novaLinha(itemId, adicionais, removidos, quantidade) {
  const it = item(itemId);
  const extras = it.adicionais.filter((a) => adicionais.includes(a.id));
  const observacao = [
    ...removidos.map((id) => "sem " + insumo(id).nome),
    ...extras.map((a) => "com " + insumo(a.insumoId).nome)
  ].join(", ");
  return {
    itemId, nome: it.nome, quantidade, adicionais, removidos, observacao,
    precoUnitario: it.preco + extras.reduce((s, a) => s + a.preco, 0)
  };
}

const chave = (l) => `${l.itemId}|${[...l.adicionais].sort()}|${[...l.removidos].sort()}`;
const linhaIgual = (l) => estado.rascunho.linhas.find((x) => chave(x) === chave(l));

function alterarQuantidade(linha, delta) {
  if (!estado.rascunho.linhas.includes(linha)) estado.rascunho.linhas.push(linha);
  linha.quantidade += delta;
  if (delta > 0 && !cabeNoEstoque(estado.rascunho.linhas)) {
    linha.quantidade -= delta;
    estado.mensagem = { tipo: "erro", texto: `${linha.nome}: item indisponível para a quantidade informada.` };
  }
  estado.rascunho.linhas = estado.rascunho.linhas.filter((l) => l.quantidade > 0);
}

/* ---------- Telas ---------- */

function telaEntrar() {
  return `<section class="cartao entrar">
    <h1 class="tituloPagina">Pit Dog</h1>
    <p class="texto2">Identifique-se para continuar.</p>
    <form data-form="entrar">
      ${campo("Usuário", "usuarioId", `<select name="usuarioId">${estado.usuarios.map((u) => `<option value="${u.id}">${esc(u.nome)} — ${u.perfil}</option>`).join("")}</select>`)}
      <button class="botaoPrimario">Entrar</button>
    </form>
  </section>`;
}

function cardProduto(it) {
  const padrao = linhaIgual(novaLinha(it.id, [], [], 0));
  const qtd = padrao ? padrao.quantidade : 0;
  const indisponivel = !cabeNoEstoque([...estado.rascunho.linhas, novaLinha(it.id, [], [], 1)]);
  return `<article class="cardProduto${qtd ? " selecionado" : ""}${indisponivel ? " indisponivel" : ""}">
    <div class="cardImagem">
      <button class="cardFoto" data-acao="abrirProduto" data-id="${it.id}" aria-label="Abrir ${esc(it.nome)}">${foto(it)}</button>
      <div class="controleQtd">
        <button class="botaoCircular" data-acao="menos" data-id="${it.id}" aria-label="Remover um ${esc(it.nome)}" ${qtd ? "" : "disabled"}>${icone("menos")}</button>
        <span aria-label="Quantidade">${qtd}</span>
        <button class="botaoCircular" data-acao="mais" data-id="${it.id}" aria-label="Adicionar um ${esc(it.nome)}" ${indisponivel ? "disabled" : ""}>${icone("mais")}</button>
      </div>
    </div>
    <div class="cardLinha"><h2 class="nomeCard">${esc(it.nome)}</h2><strong class="preco">${moeda(it.preco)}</strong></div>
    ${indisponivel ? `<p class="selo">Indisponível</p>` : ""}
    ${usaInsumoCritico(it) ? `<p class="selo seloAlerta">Insumo crítico</p>` : ""}
  </article>`;
}

function telaPedido() {
  const linhas = estado.rascunho.linhas;
  const qtd = linhas.reduce((s, l) => s + l.quantidade, 0);
  return `<h1 class="tituloHero">Registrar pedido</h1>
    <form data-form="conta" id="formConta">
      ${campo("Número da mesa ou identificação do cliente", "conta", `<input name="conta" value="${esc(estado.rascunho.conta)}" autocomplete="off">`)}
    </form>
    <div class="gradeProdutos">${estado.cardapio.filter((i) => i.ativo).map(cardProduto).join("")}</div>
    <div class="barraInferior">
      <span>${qtd} ${qtd === 1 ? "item" : "itens"} · <strong>${moeda(total(linhas))}</strong></span>
      <button class="botaoBarra" form="formConta" ${qtd ? "" : "disabled"}>Ver resumo</button>
    </div>`;
}

function telaProduto() {
  const p = estado.produto;
  const it = item(p.id);
  const linha = novaLinha(p.id, p.adicionais, p.removidos, p.quantidade);
  const adicionais = it.adicionais.filter((a) => disponivel(insumo(a.insumoId)) >= a.quantidade);
  const personalizacao = it.categoria === "combo"
    ? `<h2 class="tituloSecao">Itens do combo</h2>
       <ul class="itens">${it.combo.map((c) => `<li>${c.quantidade}× ${esc(item(c.itemId).nome)}</li>`).join("")}</ul>`
    : `<h2 class="tituloSecao">Ingredientes</h2>
       <p class="legenda">Toque em um ingrediente para removê-lo.</p>
       <ul class="listaIngredientes">${it.composicao.map((c) => {
         const ins = insumo(c.insumoId);
         const removido = p.removidos.includes(ins.id);
         return `<li><button class="ingrediente${removido ? " removido" : ""}" data-acao="alternarRemocao" data-id="${ins.id}" aria-pressed="${removido}">
           ${foto(ins)}<span>${esc(ins.nome)}</span><small>${removido ? "Removido" : "Incluído"}</small></button></li>`;
       }).join("")}</ul>
       ${adicionais.length ? `<h2 class="tituloSecao">Adicionais</h2>
       <ul class="listaAdicionais">${adicionais.map((a) => {
         const marcado = p.adicionais.includes(a.id);
         return `<li><button class="adicional" data-acao="alternarAdicional" data-id="${a.id}" aria-pressed="${marcado}">${marcado ? "✓ " : ""}${esc(insumo(a.insumoId).nome)} + ${moeda(a.preco)}</button></li>`;
       }).join("")}</ul>` : ""}`;
  return `<button class="botaoCircular" data-acao="ir" data-tela="pedido" aria-label="Voltar ao cardápio">${icone("voltar")}</button>
    <div class="fotoDestaque">${foto(it)}</div>
    <div class="infoProduto"><h1 class="nomeProduto">${esc(it.nome)}</h1><strong class="preco">${moeda(linha.precoUnitario)}</strong></div>
    <p class="texto2">${esc(it.descricao)}</p>
    ${personalizacao}
    <div class="acaoFixa">
      <div class="controleQtd">
        <button class="botaoCircular" data-acao="produtoMenos" aria-label="Diminuir quantidade" ${p.quantidade > 1 ? "" : "disabled"}>${icone("menos")}</button>
        <span aria-label="Quantidade">${p.quantidade}</span>
        <button class="botaoCircular" data-acao="produtoMais" aria-label="Aumentar quantidade">${icone("mais")}</button>
      </div>
      <button class="botaoPrimario" data-acao="adicionarProduto">Adicionar · ${moeda(linha.precoUnitario * p.quantidade)}</button>
    </div>`;
}

function telaResumo() {
  const r = estado.rascunho;
  return `<h1 class="tituloPagina">Resumo do pedido</h1>
    <p>Mesa ou cliente: <strong>${esc(r.conta)}</strong></p>
    <ul class="lista">${r.linhas.map((l, i) => `<li class="cartao linhaResumo">
      <div><strong>${esc(l.nome)}</strong>${l.observacao ? `<small>${esc(l.observacao)}</small>` : ""}<span class="preco">${moeda(l.precoUnitario * l.quantidade)}</span></div>
      <div class="controleQtd">
        <button class="botaoCircular" data-acao="menosLinha" data-indice="${i}" aria-label="Diminuir ${esc(l.nome)}">${icone("menos")}</button>
        <span aria-label="Quantidade">${l.quantidade}</span>
        <button class="botaoCircular" data-acao="maisLinha" data-indice="${i}" aria-label="Aumentar ${esc(l.nome)}">${icone("mais")}</button>
      </div></li>`).join("")}</ul>
    <p class="total"><span>Total</span><span>${moeda(total(r.linhas))}</span></p>
    <div class="acoes">
      <button class="botaoPrimario" data-acao="confirmarPedido">Confirmar pedido</button>
      <button class="botaoSecundario" data-acao="ir" data-tela="pedido">Voltar ao cardápio</button>
      <button class="botaoTexto" data-acao="descartarPedido">Cancelar registro</button>
    </div>`;
}

const pedidosDaConta = (conta, filtro) => estado.pedidos.filter((p) => p.conta === conta && filtro(p));
const emAberto = (p) => !p.pago && p.status !== "Cancelado";
const contasCom = (filtro) => [...new Set(estado.pedidos.filter(filtro).map((p) => p.conta))];

function seletorConta(contas) {
  return campo("Mesa ou cliente", "conta", `<select name="conta" data-estado="contaSelecionada">
    <option value="">Selecione</option>
    ${contas.map((c) => `<option ${c === estado.contaSelecionada ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>`);
}

const listaItens = (p) =>
  `<ul class="itens">${p.itens.map((l) => `<li>${l.quantidade}× ${esc(l.nome)}${l.observacao ? `<small>${esc(l.observacao)}</small>` : ""}</li>`).join("")}</ul>`;

function telaPagamento() {
  let html = `<h1 class="tituloPagina">Registrar pagamento</h1>`;
  if (estado.caixa.status !== "Aberto") return html + `<p class="mensagem erro">Caixa fechado. Pagamentos só podem ser registrados com o caixa aberto.</p>`;
  const contas = contasCom(emAberto);
  if (!contas.length) return html + `<p class="texto2">Não há contas em aberto.</p>`;
  html += seletorConta(contas);
  const conta = estado.contaSelecionada;
  if (!conta) return html;
  const pedidos = pedidosDaConta(conta, emAberto);
  const valorTotal = pedidos.reduce((s, p) => s + p.total, 0);
  const pagos = (estado.parciais[conta] || []).reduce((s, p) => s + p.valor, 0);
  const restante = valorTotal - pagos;
  return html + `<h2 class="tituloSecao">Extrato</h2>
    ${pedidos.map((p) => `<div class="cartao"><h3>Pedido #${p.id} · ${p.dataHora}</h3>${listaItens(p)}<p>${moeda(p.total)}</p></div>`).join("")}
    <p class="total"><span>Total</span><span>${moeda(valorTotal)}</span></p>
    ${pagos ? `<p class="total"><span>Saldo restante</span><span>${moeda(restante)}</span></p>` : ""}
    <form data-form="pagamento">
      ${campo("Modalidade", "modalidade", `<select name="modalidade">${modalidades.map((m) => `<option>${m}</option>`).join("")}</select>`)}
      ${campo("Valor recebido (R$)", "valor", `<input name="valor" type="number" step="0.01" min="0" value="${restante.toFixed(2)}">`)}
      <label class="campoCheck"><input type="checkbox" name="parcial"> Pagamento parcial</label>
      <button class="botaoPrimario">Registrar pagamento</button>
    </form>`;
}

function telaCancelamento() {
  let html = `<h1 class="tituloPagina">Cancelar pedido</h1>`;
  const cancelavel = (p) => !p.pago && cancelaveis.includes(p.status);
  const contas = contasCom(cancelavel);
  if (!contas.length) return html + `<p class="texto2">Não há pedidos passíveis de cancelamento.</p>`;
  html += seletorConta(contas);
  if (!estado.contaSelecionada) return html;
  return html + `<form data-form="cancelamento">
    <fieldset><legend>Pedido</legend>
      ${pedidosDaConta(estado.contaSelecionada, cancelavel).map((p) => `<label class="campoCheck">
        <input type="radio" name="pedidoId" value="${p.id}"> Pedido #${p.id} · ${p.dataHora} · <span class="pilula">${p.status}</span></label>${listaItens(p)}`).join("")}
      <small class="erroCampo" data-erro="pedidoId" aria-live="polite"></small>
    </fieldset>
    ${campo("Motivo do cancelamento", "motivo", `<textarea name="motivo" rows="3"></textarea>`)}
    <button class="botaoPrimario">Cancelar pedido</button>
  </form>`;
}

function telaFila() {
  const aguardando = estado.pedidos.filter((p) => p.status === "Aguardando Preparo");
  const emPreparo = estado.pedidos.filter((p) => p.status === "Em Preparo");
  const card = (p, botao) => `<li class="cartao"><h3>Pedido #${p.id} · ${esc(p.conta)}</h3><p class="legenda">${p.dataHora}</p>${listaItens(p)}${botao}</li>`;
  return `<h1 class="tituloPagina">Fila de produção</h1>
    <h2 class="tituloSecao">Aguardando preparo</h2>
    ${aguardando.length
      ? `<ol class="lista">${aguardando.map((p, i) => card(p, i === 0 ? `<button class="botaoPrimario" data-acao="iniciarPreparo" data-id="${p.id}">Iniciar preparo</button>` : "")).join("")}</ol>`
      : `<p class="texto2">Não existem pedidos aguardando produção.</p>`}
    <h2 class="tituloSecao">Em preparo</h2>
    ${emPreparo.length
      ? `<ul class="lista">${emPreparo.map((p) => card(p, `<button class="botaoPrimario" data-acao="finalizarPreparo" data-id="${p.id}">Finalizar preparo</button>`)).join("")}</ul>`
      : `<p class="texto2">Nenhum pedido em preparo.</p>`}`;
}

function telaPerda() {
  return `<h1 class="tituloPagina">Registrar perda</h1>
    <form data-form="perda">
      ${campo("Insumo", "insumoId", `<select name="insumoId">${opcoesInsumo()}</select>`)}
      ${campo("Quantidade descartada", "quantidade", `<input name="quantidade" type="number" step="any" min="0">`)}
      ${campo("Motivo", "motivo", `<select name="motivo">${motivosPerda.map((m) => `<option>${m}</option>`).join("")}</select>`)}
      <button class="botaoPrimario">Registrar perda</button>
    </form>`;
}

function telaReabastecimento() {
  const pend = estado.pendenteEncontrada;
  if (pend) {
    const s = estado.solicitacoes.find((x) => x.id === pend.id);
    const ins = insumo(s.insumoId);
    return `<h1 class="tituloPagina">Solicitação já pendente</h1>
      <div class="cartao cartaoAzul">
        <p><strong>${esc(ins.nome)}</strong>: ${s.quantidade} ${esc(ins.unidade)}</p>
        <p class="legenda">Solicitada por ${esc(s.solicitante)} em ${s.data}${s.observacao ? ` · ${esc(s.observacao)}` : ""}</p>
      </div>
      <div class="acoes">
        <button class="botaoPrimario" data-acao="atualizarSolicitacao">Atualizar para ${pend.quantidade} ${esc(ins.unidade)}</button>
        <button class="botaoSecundario" data-acao="ir" data-tela="reabastecimento">Desistir</button>
      </div>`;
  }
  return `<h1 class="tituloPagina">Solicitar reabastecimento</h1>
    <form data-form="reabastecimento">
      ${campo("Insumo", "insumoId", `<select name="insumoId">${opcoesInsumo()}</select>`)}
      ${campo("Quantidade desejada", "quantidade", `<input name="quantidade" type="number" step="any" min="0">`)}
      ${campo("Observação (opcional)", "observacao", `<textarea name="observacao" rows="2"></textarea>`)}
      <button class="botaoPrimario">Enviar solicitação</button>
    </form>`;
}

function telaCardapio() {
  const c = estado.consulta;
  const itens = estado.cardapio.filter((i) =>
    i.nome.toLowerCase().includes(c.nome.toLowerCase()) &&
    (!c.categoria || i.categoria === c.categoria) &&
    (!c.situacao || (c.situacao === "ativo") === i.ativo));
  const opcao = (valor, texto, atual) => `<option value="${valor}" ${valor === atual ? "selected" : ""}>${texto}</option>`;
  return `<h1 class="tituloPagina">Cardápio</h1>
    <button class="botaoPrimario" data-acao="novoItem">Cadastrar novo item</button>
    <h2 class="tituloSecao">Consultar itens</h2>
    <form data-form="consulta">
      ${campo("Nome", "nome", `<input name="nome" value="${esc(c.nome)}">`)}
      ${campo("Categoria", "categoria", `<select name="categoria">${opcao("", "Todas", c.categoria)}${["lanche", "bebida", "combo"].map((x) => opcao(x, x, c.categoria)).join("")}</select>`)}
      ${campo("Situação", "situacao", `<select name="situacao">${opcao("", "Todas", c.situacao)}${opcao("ativo", "Ativo", c.situacao)}${opcao("inativo", "Inativo", c.situacao)}</select>`)}
      <button class="botaoSecundario">Consultar</button>
    </form>
    <ul class="lista acoes">${itens.map((i) => `<li class="cartao">
      <h3>${esc(i.nome)} · ${moeda(i.preco)}</h3>
      <p class="legenda">${i.categoria} · <span class="pilula">${i.ativo ? "Ativo" : "Inativo"}</span></p>
      <p class="legenda">Composição: ${i.categoria === "combo"
        ? i.combo.map((x) => `${x.quantidade}× ${esc(item(x.itemId).nome)}`).join(", ")
        : i.composicao.map((x) => `${esc(insumo(x.insumoId).nome)} (${x.quantidade} ${esc(insumo(x.insumoId).unidade)})`).join(", ")}</p>
      ${i.adicionais.length ? `<p class="legenda">Adicionais: ${i.adicionais.map((a) => `${esc(insumo(a.insumoId).nome)} ${moeda(a.preco)}`).join(", ")}</p>` : ""}
      <div class="acoes">
        <button class="botaoSecundario" data-acao="editarItem" data-id="${i.id}">Alterar</button>
        ${i.ativo ? `<button class="botaoTexto" data-acao="inativarItem" data-id="${i.id}">Inativar</button>` : ""}
      </div></li>`).join("") || `<li class="texto2">Nenhum item encontrado.</li>`}</ul>`;
}

function telaItemForm() {
  const it = estado.itemEditado ? item(estado.itemEditado) : null;
  const qtdComp = (id) => (it && it.composicao.find((c) => c.insumoId === id) || {}).quantidade || "";
  const qtdCombo = (id) => (it && it.combo.find((c) => c.itemId === id) || {}).quantidade || "";
  const adicional = (id) => (it && it.adicionais.find((a) => a.insumoId === id)) || {};
  const categoria = it ? it.categoria : "lanche";
  return `<h1 class="tituloPagina">${it ? "Alterar item" : "Novo item"}</h1>
    <form data-form="item">
      ${campo("Nome", "nome", `<input name="nome" value="${it ? esc(it.nome) : ""}">`)}
      ${campo("Descrição", "descricao", `<textarea name="descricao" rows="2">${it ? esc(it.descricao) : ""}</textarea>`)}
      ${campo("Categoria", "categoria", `<select name="categoria">${["lanche", "bebida", "combo"].map((c) => `<option ${c === categoria ? "selected" : ""}>${c}</option>`).join("")}</select>`)}
      ${campo("Preço de venda (R$)", "preco", `<input name="preco" type="number" step="0.01" min="0" value="${it ? it.preco : ""}">`)}
      <fieldset><legend>Composição por insumos (lanche ou bebida)</legend>
        ${estado.insumos.map((i) => `<label class="linhaGrade"><span>${esc(i.nome)} (${esc(i.unidade)})</span><input name="comp_${i.id}" type="number" step="any" min="0" value="${qtdComp(i.id)}"></label>`).join("")}
        <small class="erroCampo" data-erro="composicao" aria-live="polite"></small>
      </fieldset>
      <fieldset><legend>Itens do combo (somente combo)</legend>
        ${estado.cardapio.filter((i) => i.categoria !== "combo").map((i) => `<label class="linhaGrade"><span>${esc(i.nome)}</span><input name="combo_${i.id}" type="number" step="1" min="0" value="${qtdCombo(i.id)}"></label>`).join("")}
        <small class="erroCampo" data-erro="combo" aria-live="polite"></small>
      </fieldset>
      <fieldset><legend>Adicionais permitidos: quantidade e preço (R$)</legend>
        ${estado.insumos.map((i) => `<div class="linhaGrade tres"><span>${esc(i.nome)}</span>
          <input name="adQtd_${i.id}" type="number" step="any" min="0" aria-label="Quantidade de ${esc(i.nome)}" value="${adicional(i.id).quantidade || ""}">
          <input name="adPreco_${i.id}" type="number" step="0.01" min="0" aria-label="Preço de ${esc(i.nome)}" value="${adicional(i.id).preco || ""}"></div>`).join("")}
        <small class="erroCampo" data-erro="adicionais" aria-live="polite"></small>
      </fieldset>
      ${it ? `<label class="campoCheck"><input type="checkbox" name="ativo" ${it.ativo ? "checked" : ""}> Item ativo no cardápio</label>` : ""}
      <div class="acoes">
        <button class="botaoPrimario">Salvar</button>
        <button type="button" class="botaoSecundario" data-acao="ir" data-tela="cardapio">Voltar</button>
      </div>
    </form>`;
}

function telaEstoque() {
  const pendentes = estado.solicitacoes.filter((s) => s.status === "Pendente");
  const atendida = estado.solicitacoes.find((s) => s.id === estado.solicitacaoAtendida);
  const editado = estado.insumoEditado ? insumo(estado.insumoEditado) : null;
  return `<h1 class="tituloPagina">Estoque e suprimentos</h1>
    <ul class="lista">${estado.insumos.map((i) => `<li class="cartao">
      <h3>${esc(i.nome)} <span class="pilula${i.situacao === "Crítico" ? " critico" : ""}">${i.situacao}</span></h3>
      <p class="legenda">Unidade: ${esc(i.unidade)} · Saldo em estoque: ${i.saldoEstoque} · Saldo disponível: ${disponivel(i)} · Estoque mínimo: ${i.estoqueMinimo}</p>
      <button class="botaoTexto" data-acao="editarInsumo" data-id="${i.id}">Alterar</button></li>`).join("")}</ul>

    <h2 class="tituloSecao">Solicitações de reabastecimento pendentes</h2>
    ${pendentes.length ? `<ul class="lista">${pendentes.map((s) => `<li class="cartao cartaoAzul">
      <p><strong>${esc(insumo(s.insumoId).nome)}</strong>: ${s.quantidade} ${esc(insumo(s.insumoId).unidade)}</p>
      <p class="legenda">${esc(s.solicitante)} · ${s.data}${s.observacao ? ` · ${esc(s.observacao)}` : ""}</p>
      <button class="botaoSecundario" data-acao="atenderSolicitacao" data-id="${s.id}">Atender</button></li>`).join("")}</ul>`
      : `<p class="texto2">Nenhuma solicitação pendente.</p>`}

    <h2 class="tituloSecao">Registrar entrada</h2>
    ${atendida ? `<p class="mensagem sucesso">Atendendo solicitação de ${esc(insumo(atendida.insumoId).nome)}.</p>` : ""}
    <form data-form="entrada">
      ${campo("Insumo", "insumoId", `<select name="insumoId">${opcoesInsumo(atendida && atendida.insumoId)}</select>`)}
      ${campo("Quantidade de entrada", "quantidade", `<input name="quantidade" type="number" step="any" min="0" value="${atendida ? atendida.quantidade : ""}">`)}
      ${campo("Preço de custo unitário (R$)", "custo", `<input name="custo" type="number" step="0.01" min="0">`)}
      <button class="botaoPrimario">Registrar entrada</button>
    </form>

    <h2 class="tituloSecao">${editado ? `Alterar insumo: ${esc(editado.nome)}` : "Cadastrar novo insumo"}</h2>
    <form data-form="insumo">
      ${campo("Nome", "nome", `<input name="nome" value="${editado ? esc(editado.nome) : ""}">`)}
      ${campo("Estoque mínimo", "estoqueMinimo", `<input name="estoqueMinimo" type="number" step="any" min="0" value="${editado ? editado.estoqueMinimo : ""}">`)}
      ${editado ? "" : `
        ${campo("Unidade de medida", "unidade", `<input name="unidade">`)}
        ${campo("Saldo inicial (opcional)", "saldo", `<input name="saldo" type="number" step="any" min="0">`)}
        ${campo("Preço de custo unitário (R$)", "custo", `<input name="custo" type="number" step="0.01" min="0">`)}`}
      <div class="acoes">
        <button class="botaoPrimario">${editado ? "Salvar alterações" : "Cadastrar insumo"}</button>
        ${editado ? `<button type="button" class="botaoSecundario" data-acao="ir" data-tela="estoque">Cancelar alteração</button>` : ""}
      </div>
    </form>`;
}

function relatorioHtml(r) {
  return `<dl class="relatorio">
    <dt>Fundo de caixa inicial</dt><dd>${moeda(r.fundo)}</dd>
    ${modalidades.map((m) => `<dt>Recebido em ${m}</dt><dd>${moeda(r.porModalidade[m])}</dd>`).join("")}
    <dt>Pedidos finalizados</dt><dd>${r.finalizados}</dd>
    <dt>Pedidos cancelados</dt><dd>${r.cancelados}</dd>
    <dt>Valor das perdas</dt><dd>${moeda(r.perdas)}</dd>
    ${r.contado !== undefined ? `<dt>Dinheiro esperado</dt><dd>${moeda(r.esperado)}</dd><dt>Dinheiro contado</dt><dd>${moeda(r.contado)}</dd>
      <dt>Diferença</dt><dd>${moeda(r.contado - r.esperado)}</dd>${r.justificativa ? `<dt>Justificativa</dt><dd>${esc(r.justificativa)}</dd>` : ""}` : ""}
  </dl>`;
}

function relatorioDoDia() {
  const porModalidade = {};
  modalidades.forEach((m) => (porModalidade[m] = estado.caixa.pagamentos.filter((p) => p.modalidade === m).reduce((s, p) => s + p.valor, 0)));
  return {
    fundo: estado.caixa.fundo,
    porModalidade,
    finalizados: estado.pedidos.filter((p) => p.status === "Finalizado").length,
    cancelados: estado.pedidos.filter((p) => p.status === "Cancelado").length,
    perdas: estado.perdas.reduce((s, p) => s + p.quantidade * p.custo, 0),
    esperado: estado.caixa.fundo + porModalidade.Dinheiro
  };
}

function telaCaixa() {
  const c = estado.caixa;
  const ultimo = estado.fechamentos[estado.fechamentos.length - 1];
  if (c.status !== "Aberto") {
    return `<h1 class="tituloPagina">Abrir caixa</h1>
      <form data-form="abrirCaixa">
        ${campo("Fundo de caixa para troco (R$)", "fundo", `<input name="fundo" type="number" step="0.01" min="0">`)}
        <button class="botaoPrimario">Abrir caixa</button>
      </form>
      ${ultimo ? `<h2 class="tituloSecao">Último fechamento · ${ultimo.data}</h2>${relatorioHtml(ultimo)}` : ""}`;
  }
  let html = `<h1 class="tituloPagina">Caixa aberto</h1>
    <p class="cartao cartaoAzul">Aberto em ${c.abertura} por ${esc(c.responsavel)}. Fundo de caixa: ${moeda(c.fundo)}.</p>
    <h2 class="tituloSecao">Fechar caixa</h2>`;
  const abertas = contasCom(emAberto);
  if (abertas.length) {
    return html + `<p class="mensagem erro">Não é possível fechar o caixa. Contas em aberto:</p>
      <ul class="itens">${abertas.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`;
  }
  return html + relatorioHtml(relatorioDoDia()) + `<form data-form="fecharCaixa">
      ${campo("Dinheiro contado na gaveta (R$)", "contado", `<input name="contado" type="number" step="0.01" min="0">`)}
      ${campo("Justificativa (obrigatória em caso de divergência)", "justificativa", `<textarea name="justificativa" rows="2"></textarea>`)}
      <button class="botaoPrimario">Fechar caixa</button>
    </form>`;
}

const telas = {
  entrar: telaEntrar, pedido: telaPedido, produto: telaProduto, resumo: telaResumo,
  pagamento: telaPagamento, cancelamento: telaCancelamento,
  fila: telaFila, perda: telaPerda, reabastecimento: telaReabastecimento,
  cardapio: telaCardapio, itemForm: telaItemForm, estoque: telaEstoque, caixa: telaCaixa
};

function render() {
  const u = estado.usuario;
  document.getElementById("cabecalho").innerHTML = u
    ? `<span class="marca">Pit Dog</span>
       <span class="usuarioAtual">${esc(u.nome)} · ${u.perfil}</span>
       <button class="botaoTexto" data-acao="sair">Sair</button>
       <nav class="menu" aria-label="Operações">${menus[u.perfil].map(([tela, rotulo]) =>
         `<button data-acao="ir" data-tela="${tela}" ${estado.tela === tela ? 'aria-current="page"' : ""}>${rotulo}</button>`).join("")}</nav>`
    : "";
  const avisos = u ? estado.avisos.filter((a) => a.perfil === u.perfil).reverse() : [];
  const m = estado.mensagem;
  document.getElementById("conteudo").innerHTML =
    (m ? `<p class="mensagem ${m.tipo}" role="${m.tipo === "erro" ? "alert" : "status"}">${esc(m.texto)}</p>` : "") +
    (avisos.length ? `<details class="cardInfo"><summary>Avisos (${avisos.length})</summary><ul>${avisos.map((a) => `<li>${a.data} — ${esc(a.texto)}</li>`).join("")}</ul></details>` : "") +
    telas[estado.tela]();
}

/* ---------- Ações (cliques) ---------- */

const acoes = {
  sair() {
    estado.usuario = null;
    estado.rascunho = { conta: "", linhas: [] };
    estado.tela = "entrar";
  },
  ir(d) {
    estado.tela = d.tela;
    estado.contaSelecionada = "";
    estado.pendenteEncontrada = null;
    estado.solicitacaoAtendida = null;
    estado.insumoEditado = null;
  },
  mais(d) {
    alterarQuantidade(linhaIgual(novaLinha(Number(d.id), [], [], 0)) || novaLinha(Number(d.id), [], [], 0), 1);
  },
  menos(d) {
    const linha = linhaIgual(novaLinha(Number(d.id), [], [], 0));
    if (linha) alterarQuantidade(linha, -1);
  },
  maisLinha(d) {
    alterarQuantidade(estado.rascunho.linhas[d.indice], 1);
  },
  menosLinha(d) {
    alterarQuantidade(estado.rascunho.linhas[d.indice], -1);
    if (!estado.rascunho.linhas.length) estado.tela = "pedido";
  },
  abrirProduto(d) {
    estado.produto = { id: Number(d.id), adicionais: [], removidos: [], quantidade: 1 };
    estado.tela = "produto";
  },
  alternarRemocao(d) {
    const lista = estado.produto.removidos, id = Number(d.id);
    estado.produto.removidos = lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];
  },
  alternarAdicional(d) {
    const lista = estado.produto.adicionais, id = Number(d.id);
    estado.produto.adicionais = lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];
  },
  produtoMais() {
    estado.produto.quantidade++;
  },
  produtoMenos() {
    estado.produto.quantidade--;
  },
  adicionarProduto() {
    const p = estado.produto;
    const nova = novaLinha(p.id, p.adicionais, p.removidos, 0);
    alterarQuantidade(linhaIgual(nova) || nova, p.quantidade);
    if (!estado.mensagem) estado.tela = "pedido";
  },
  descartarPedido() {
    estado.rascunho = { conta: "", linhas: [] };
    estado.tela = "pedido";
    estado.mensagem = { tipo: "sucesso", texto: "Registro cancelado. Os itens selecionados foram descartados." };
  },
  confirmarPedido() {
    const r = estado.rascunho;
    if (!cabeNoEstoque(r.linhas)) {
      estado.mensagem = { tipo: "erro", texto: "Um ou mais itens estão indisponíveis para a quantidade informada. Ajuste o pedido." };
      return;
    }
    const consumo = consumoDe(r.linhas);
    Object.keys(consumo).forEach((id) => (insumo(Number(id)).comprometido += consumo[id]));
    estado.pedidos.push({
      id: novoId(), conta: r.conta, dataHora: agora(), status: "Aguardando Preparo",
      itens: r.linhas, consumo, total: total(r.linhas), pago: false, atendente: nomeUsuario()
    });
    estado.rascunho = { conta: "", linhas: [] };
    estado.tela = "pedido";
    estado.mensagem = { tipo: "sucesso", texto: "Pedido registrado com sucesso." };
  },
  iniciarPreparo(d) {
    const primeiro = estado.pedidos.find((p) => p.status === "Aguardando Preparo");
    if (primeiro && primeiro.id === Number(d.id)) primeiro.status = "Em Preparo";
  },
  finalizarPreparo(d) {
    const p = estado.pedidos.find((x) => x.id === Number(d.id));
    p.status = "Pronto para Entrega";
    Object.keys(p.consumo).forEach((id) => {
      const ins = insumo(Number(id)), q = p.consumo[id];
      ins.comprometido -= q;
      if (ins.saldoEstoque < q) {
        const faltante = q - ins.saldoEstoque;
        estado.divergencias.push({ insumoId: ins.id, faltante, data: agora(), pedidoId: p.id });
        avisar("Supervisor", `Divergência de estoque: ${ins.nome}, faltaram ${faltante} ${ins.unidade} (pedido #${p.id}).`);
        ins.saldoEstoque = 0;
      } else {
        ins.saldoEstoque -= q;
      }
      estado.movimentacoes.push({ tipo: "saída", insumoId: ins.id, quantidade: q, data: agora(), responsavel: nomeUsuario(), pedidoId: p.id });
    });
    avisar("Atendente", `Pedido #${p.id} pronto para entrega — ${p.conta}.`);
    estado.mensagem = { tipo: "sucesso", texto: `Pedido #${p.id} pronto para entrega.` };
  },
  atualizarSolicitacao() {
    const pend = estado.pendenteEncontrada;
    estado.solicitacoes.find((s) => s.id === pend.id).quantidade = pend.quantidade;
    estado.pendenteEncontrada = null;
    estado.mensagem = { tipo: "sucesso", texto: "Solicitação atualizada." };
  },
  novoItem() {
    estado.itemEditado = null;
    estado.tela = "itemForm";
  },
  editarItem(d) {
    estado.itemEditado = Number(d.id);
    estado.tela = "itemForm";
  },
  inativarItem(d) {
    item(Number(d.id)).ativo = false;
    estado.mensagem = { tipo: "sucesso", texto: "Item inativado." };
  },
  editarInsumo(d) {
    estado.insumoEditado = Number(d.id);
  },
  atenderSolicitacao(d) {
    estado.solicitacaoAtendida = Number(d.id);
  }
};

/* ---------- Formulários ---------- */

const formularios = {
  entrar(form, dados) {
    estado.usuario = estado.usuarios.find((u) => u.id === Number(dados.get("usuarioId")));
    estado.tela = menus[estado.usuario.perfil][0][0];
  },
  conta(form, dados) {
    const conta = dados.get("conta").trim();
    if (!conta) return erroCampo(form, "conta", "Informe o número da mesa ou a identificação do cliente.");
    estado.rascunho.conta = conta;
    estado.tela = "resumo";
  },
  pagamento(form, dados) {
    const conta = estado.contaSelecionada;
    const pedidos = pedidosDaConta(conta, emAberto);
    const parciais = estado.parciais[conta] || [];
    const restante = centavos(pedidos.reduce((s, p) => s + p.total, 0) - parciais.reduce((s, p) => s + p.valor, 0));
    const valor = centavos(Number(dados.get("valor")));
    const modalidade = dados.get("modalidade");
    if (!(valor > 0)) return erroCampo(form, "valor", "Informe um valor maior que zero.");
    if (valor < restante && !dados.get("parcial")) {
      return erroCampo(form, "valor", `Valor insuficiente: faltam ${moeda((restante - valor) / 100)}. Corrija o valor ou marque pagamento parcial.`);
    }
    const pago = Math.min(valor, restante);
    estado.parciais[conta] = [...parciais, { modalidade, valor: pago / 100 }];
    if (pago < restante) {
      estado.mensagem = { tipo: "sucesso", texto: `Pagamento parcial registrado. Saldo restante: ${moeda((restante - pago) / 100)}.` };
      return;
    }
    estado.parciais[conta].forEach((p) => estado.caixa.pagamentos.push({ ...p, conta, data: agora(), responsavel: nomeUsuario() }));
    delete estado.parciais[conta];
    pedidos.forEach((p) => {
      p.status = "Finalizado";
      p.pago = true;
    });
    const troco = modalidade === "Dinheiro" && valor > restante ? ` Troco: ${moeda((valor - restante) / 100)}.` : "";
    estado.contaSelecionada = "";
    estado.mensagem = { tipo: "sucesso", texto: `Pagamento registrado. Conta de ${conta} encerrada.${troco}` };
  },
  cancelamento(form, dados) {
    const p = estado.pedidos.find((x) => x.id === Number(dados.get("pedidoId")));
    const motivo = dados.get("motivo").trim();
    if (!p) return erroCampo(form, "pedidoId", "Selecione o pedido a ser cancelado.");
    if (!motivo) return erroCampo(form, "motivo", "Informe o motivo do cancelamento.");
    Object.keys(p.consumo).forEach((id) => {
      const ins = insumo(Number(id)), q = p.consumo[id];
      if (p.status !== "Pronto para Entrega") ins.comprometido -= q;
      if (p.status === "Em Preparo") ins.saldoEstoque -= q;
      if (p.status !== "Aguardando Preparo") {
        estado.perdas.push({ insumoId: ins.id, quantidade: q, motivo: "cancelamento", custo: ins.custoUnitario, data: agora(), responsavel: nomeUsuario() });
      }
    });
    p.status = "Cancelado";
    p.motivoCancelamento = motivo;
    avisar("Chapeiro", `Pedido #${p.id} (${p.conta}) cancelado: ${motivo}`);
    estado.contaSelecionada = "";
    estado.mensagem = { tipo: "sucesso", texto: `Pedido #${p.id} cancelado.` };
  },
  perda(form, dados) {
    const ins = insumo(Number(dados.get("insumoId")));
    const q = Number(dados.get("quantidade"));
    if (!(q > 0)) return erroCampo(form, "quantidade", "Informe uma quantidade maior que zero.");
    if (q > ins.saldoEstoque) return erroCampo(form, "quantidade", `Quantidade maior que o saldo atual (${ins.saldoEstoque} ${ins.unidade}).`);
    ins.saldoEstoque -= q;
    const registro = { insumoId: ins.id, quantidade: q, motivo: dados.get("motivo"), custo: ins.custoUnitario, data: agora(), responsavel: nomeUsuario() };
    estado.perdas.push(registro);
    estado.movimentacoes.push({ ...registro, tipo: "perda" });
    estado.mensagem = { tipo: "sucesso", texto: `Perda de ${q} ${ins.unidade} de ${ins.nome} registrada.` };
  },
  reabastecimento(form, dados) {
    const insumoId = Number(dados.get("insumoId"));
    const q = Number(dados.get("quantidade"));
    if (!(q > 0)) return erroCampo(form, "quantidade", "Informe uma quantidade maior que zero.");
    const pendente = estado.solicitacoes.find((s) => s.insumoId === insumoId && s.status === "Pendente");
    if (pendente) {
      estado.pendenteEncontrada = { id: pendente.id, quantidade: q };
      return;
    }
    estado.solicitacoes.push({
      id: novoId(), insumoId, quantidade: q, observacao: dados.get("observacao").trim(),
      status: "Pendente", data: agora(), solicitante: nomeUsuario()
    });
    avisar("Supervisor", `Reabastecimento solicitado: ${q} ${insumo(insumoId).unidade} de ${insumo(insumoId).nome}.`);
    estado.mensagem = { tipo: "sucesso", texto: "Solicitação registrada como pendente." };
  },
  consulta(form, dados) {
    estado.consulta = { nome: dados.get("nome").trim(), categoria: dados.get("categoria"), situacao: dados.get("situacao") };
  },
  item(form, dados) {
    const nome = dados.get("nome").trim();
    const descricao = dados.get("descricao").trim();
    const categoria = dados.get("categoria");
    const preco = Number(dados.get("preco"));
    const id = estado.itemEditado;
    if (!nome) return erroCampo(form, "nome", "Informe o nome.");
    if (estado.cardapio.some((i) => i.id !== id && i.nome.toLowerCase() === nome.toLowerCase())) {
      return erroCampo(form, "nome", "Já existe item com este nome.");
    }
    if (!descricao) return erroCampo(form, "descricao", "Informe a descrição.");
    if (!(preco > 0)) return erroCampo(form, "preco", "Informe um preço válido.");
    const composicao = estado.insumos
      .map((i) => ({ insumoId: i.id, quantidade: Number(dados.get("comp_" + i.id)) }))
      .filter((c) => c.quantidade > 0);
    const combo = estado.cardapio
      .filter((i) => i.categoria !== "combo")
      .map((i) => ({ itemId: i.id, quantidade: Number(dados.get("combo_" + i.id)) }))
      .filter((c) => c.quantidade > 0);
    if (categoria === "combo" && !combo.length) return erroCampo(form, "combo", "Informe os itens que integram o combo.");
    if (categoria !== "combo" && !composicao.length) return erroCampo(form, "composicao", "Informe os insumos da composição.");
    const anteriores = id ? item(id).adicionais : [];
    const adicionais = [];
    for (const i of estado.insumos) {
      const quantidade = Number(dados.get("adQtd_" + i.id));
      const precoAd = Number(dados.get("adPreco_" + i.id));
      if (!quantidade && !precoAd) continue;
      if (!(quantidade > 0) || !(precoAd > 0)) return erroCampo(form, "adicionais", `Adicional ${i.nome}: informe quantidade e preço.`);
      const existente = anteriores.find((a) => a.insumoId === i.id);
      adicionais.push({ id: existente ? existente.id : novoId(), insumoId: i.id, quantidade, preco: precoAd });
    }
    const valores = {
      nome, descricao, categoria, preco, adicionais,
      composicao: categoria === "combo" ? [] : composicao,
      combo: categoria === "combo" ? combo : []
    };
    if (id) Object.assign(item(id), valores, { ativo: Boolean(dados.get("ativo")) });
    else estado.cardapio.push({ id: novoId(), ativo: true, foto: "", ...valores });
    estado.tela = "cardapio";
    estado.mensagem = { tipo: "sucesso", texto: `Item "${nome}" salvo.` };
  },
  entrada(form, dados) {
    const ins = insumo(Number(dados.get("insumoId")));
    const q = Number(dados.get("quantidade"));
    const custo = Number(dados.get("custo"));
    if (!(q > 0)) return erroCampo(form, "quantidade", "A quantidade deve ser maior que zero.");
    if (!(custo > 0)) return erroCampo(form, "custo", "Informe um preço de custo válido.");
    ins.saldoEstoque += q;
    ins.custoUnitario = custo;
    estado.movimentacoes.push({ tipo: "entrada", insumoId: ins.id, quantidade: q, custo, data: agora(), responsavel: nomeUsuario() });
    const s = estado.solicitacoes.find((x) => x.id === estado.solicitacaoAtendida);
    if (s && s.insumoId === ins.id) s.status = "Atendida";
    estado.solicitacaoAtendida = null;
    estado.mensagem = { tipo: "sucesso", texto: `Entrada de ${q} ${ins.unidade} de ${ins.nome} registrada.` };
  },
  insumo(form, dados) {
    const nome = dados.get("nome").trim();
    const minimo = dados.get("estoqueMinimo");
    const editado = estado.insumoEditado;
    if (!nome) return erroCampo(form, "nome", "Informe o nome.");
    if (estado.insumos.some((i) => i.id !== editado && i.nome.toLowerCase() === nome.toLowerCase())) {
      return erroCampo(form, "nome", "Já existe insumo com este nome.");
    }
    if (minimo === "" || Number(minimo) < 0) return erroCampo(form, "estoqueMinimo", "Informe o estoque mínimo.");
    if (editado) {
      Object.assign(insumo(editado), { nome, estoqueMinimo: Number(minimo) });
      estado.insumoEditado = null;
      estado.mensagem = { tipo: "sucesso", texto: "Insumo alterado." };
      return;
    }
    const unidade = dados.get("unidade").trim();
    const saldo = Number(dados.get("saldo"));
    const custo = Number(dados.get("custo"));
    if (!unidade) return erroCampo(form, "unidade", "Informe a unidade de medida.");
    if (saldo < 0) return erroCampo(form, "saldo", "O saldo inicial não pode ser negativo.");
    if (saldo > 0 && !(custo > 0)) return erroCampo(form, "custo", "Informe o preço de custo do saldo inicial.");
    const id = novoId();
    estado.insumos.push({ id, nome, unidade, estoqueMinimo: Number(minimo), saldoEstoque: saldo, custoUnitario: custo, comprometido: 0, situacao: "Normal", foto: "" });
    if (saldo > 0) estado.movimentacoes.push({ tipo: "entrada", insumoId: id, quantidade: saldo, custo, data: agora(), responsavel: nomeUsuario() });
    estado.mensagem = { tipo: "sucesso", texto: `Insumo "${nome}" cadastrado.` };
  },
  abrirCaixa(form, dados) {
    const fundo = dados.get("fundo");
    if (fundo === "" || Number(fundo) < 0) return erroCampo(form, "fundo", "Informe o valor do fundo de caixa.");
    estado.caixa = { status: "Aberto", fundo: Number(fundo), abertura: agora(), responsavel: nomeUsuario(), pagamentos: [] };
    estado.mensagem = { tipo: "sucesso", texto: "Caixa aberto." };
  },
  fecharCaixa(form, dados) {
    const contado = dados.get("contado");
    const justificativa = dados.get("justificativa").trim();
    if (contado === "" || Number(contado) < 0) return erroCampo(form, "contado", "Informe o valor contado na gaveta.");
    const relatorio = relatorioDoDia();
    const diferenca = centavos(Number(contado)) - centavos(relatorio.esperado);
    if (diferenca && !justificativa) {
      return erroCampo(form, "justificativa", `${diferenca > 0 ? "Sobra" : "Falta"} de ${moeda(Math.abs(diferenca) / 100)}. A justificativa é obrigatória.`);
    }
    estado.fechamentos.push({ ...relatorio, contado: Number(contado), justificativa, data: agora(), responsavel: nomeUsuario() });
    estado.caixa = { status: "Fechado", pagamentos: [] };
    estado.mensagem = { tipo: "sucesso", texto: diferenca ? "Caixa fechado com registro de quebra de caixa." : "Caixa fechado." };
  }
};

/* ---------- Alerta de estoque mínimo (CSU10, evento temporal) ---------- */

function verificarEstoqueMinimo() {
  let mudou = false;
  estado.insumos.forEach((i) => {
    const critico = i.saldoEstoque <= i.estoqueMinimo;
    if (critico && i.situacao !== "Crítico") {
      i.situacao = "Crítico";
      avisar("Supervisor", `Alerta de compra: ${i.nome} com saldo ${i.saldoEstoque} ${i.unidade} (mínimo ${i.estoqueMinimo}).`);
      mudou = true;
    } else if (!critico && i.situacao === "Crítico") {
      i.situacao = "Normal";
      mudou = true;
    }
  });
  // Não redesenha enquanto o usuário preenche um campo.
  if (mudou && estado.usuario && !document.activeElement.matches("input, select, textarea")) render();
}

/* ---------- Eventos ---------- */

document.addEventListener("click", (e) => {
  const alvo = e.target.closest("[data-acao]");
  if (!alvo) return;
  estado.mensagem = null;
  acoes[alvo.dataset.acao](alvo.dataset);
  render();
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  limparErros(form);
  estado.mensagem = null;
  if (formularios[form.dataset.form](form, new FormData(form)) !== false) render();
});

document.addEventListener("input", (e) => {
  if (e.target.name === "conta" && e.target.form && e.target.form.dataset.form === "conta") estado.rascunho.conta = e.target.value;
});

document.addEventListener("change", (e) => {
  const chaveEstado = e.target.dataset.estado;
  if (!chaveEstado) return;
  estado[chaveEstado] = e.target.value;
  estado.mensagem = null;
  render();
});

async function iniciar() {
  try {
    const [usuarios, insumos, cardapio] = await Promise.all(["usuarios", "insumos", "cardapio"].map(buscarDados));
    estado.usuarios = usuarios;
    estado.insumos = insumos.map((i) => ({ ...i, comprometido: 0, situacao: "Normal" }));
    estado.cardapio = cardapio;
    verificarEstoqueMinimo();
    render();
    setInterval(verificarEstoqueMinimo, 5000);
  } catch (erro) {
    document.getElementById("conteudo").innerHTML = `<p class="mensagem erro">Não foi possível carregar os dados.</p>`;
  }
}

iniciar();
