(function () {
  "use strict";

  var QR_ALT = "QR da carteirinha. Mostre ao atendente.";

  // Dados de exemplo. Troque pela resposta da API.
  // Para ver o selo de catador: index.html?perfil=catador
  var params = new URLSearchParams(location.search);
  var carteirinha = {
    nome: "Maria da Silva",
    perfil: params.get("perfil") === "catador" ? "catador" : "cidadao",
    numero: "BV-2026-004817",
    validaAte: "31/12/2026"
  };

  var PERFIS = {
    cidadao: {
      texto: "Cidadão",
      classe: "badge--cidadao",
      // Lucide: user
      icone: '<circle cx="12" cy="7" r="4"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>'
    },
    catador: {
      texto: "Catador",
      classe: "badge--catador",
      // Lucide: recycle
      icone:
        '<path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>' +
        '<path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>' +
        '<path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>' +
        '<path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/>' +
        '<path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>'
    }
  };

  // ---- Dados da carteirinha ----
  document.getElementById("holder-name").textContent = carteirinha.nome;
  document.getElementById("card-number").textContent = carteirinha.numero;
  document.getElementById("card-valid").textContent = carteirinha.validaAte;

  var perfil = PERFIS[carteirinha.perfil];
  var badge = document.getElementById("profile-badge");
  badge.classList.add(perfil.classe);
  badge.innerHTML =
    '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true">' + perfil.icone + "</svg>";
  // Texto visível curto; leitor de tela ouve "Perfil: Cidadão".
  var prefixo = document.createElement("span");
  prefixo.className = "visually-hidden";
  prefixo.textContent = "Perfil: ";
  badge.appendChild(prefixo);
  badge.appendChild(document.createTextNode(perfil.texto));

  // ---- QR: preto sobre branco (cores vêm do CSS via currentColor) ----
  var frame = document.getElementById("qr-frame");
  if (typeof window.qrcode === "function") {
    var qr = window.qrcode(0, "M");
    qr.addData(carteirinha.numero);
    qr.make();
    var n = qr.getModuleCount();
    var d = "";
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += "M" + c + " " + r + "h1v1h-1z";
      }
    }
    frame.innerHTML =
      '<svg role="img" viewBox="0 0 ' + n + " " + n + '" shape-rendering="crispEdges">' +
      "<title></title>" +
      '<path fill="currentColor" d="' + d + '"/></svg>';
    frame.querySelector("title").textContent = QR_ALT;
    frame.querySelector("svg").setAttribute("aria-label", QR_ALT);
  } else {
    frame.innerHTML = '<p class="qr__fallback"></p>';
    frame.firstChild.textContent =
      "Não foi possível mostrar o QR agora. Diga o número " + carteirinha.numero + " ao atendente.";
  }

  // ---- Tema claro e escuro ----
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function temaAtual() {
    return root.dataset.theme || (mq.matches ? "dark" : "light");
  }

  function atualizarBotao() {
    var escuro = temaAtual() === "dark";
    toggle.setAttribute("aria-label", escuro ? "Usar tema claro" : "Usar tema escuro");
    toggle.querySelector('[data-icon="moon"]').hidden = escuro;
    toggle.querySelector('[data-icon="sun"]').hidden = !escuro;
  }

  toggle.addEventListener("click", function () {
    var novo = temaAtual() === "dark" ? "light" : "dark";
    root.dataset.theme = novo;
    try { localStorage.setItem("tema", novo); } catch (e) {}
    atualizarBotao();
  });

  if (mq.addEventListener) mq.addEventListener("change", atualizarBotao);
  atualizarBotao();
})();
