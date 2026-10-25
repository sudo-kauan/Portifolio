(function () {
  var tituloApresentacao = document.querySelector('.titulo-digitado');
  var movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (tituloApresentacao && !movimentoReduzido) {
    var caracteres = Array.from(tituloApresentacao.textContent);
    var indice = 0;
    tituloApresentacao.textContent = '';
    tituloApresentacao.classList.add('digitando');
    function atualizarTitulo() {
      tituloApresentacao.textContent = caracteres.slice(0, indice).join('');
    }
    function digitarProximoCaractere() {
      indice += 1;
      atualizarTitulo();
      if (indice < caracteres.length) {
        setTimeout(digitarProximoCaractere, 150);
      } else {
        setTimeout(apagarProximoCaractere, 1400);
      }
    }
    function apagarProximoCaractere() {
      indice -= 1;
      atualizarTitulo();
      if (indice > 0) {
        setTimeout(apagarProximoCaractere, 70);
      } else {
        setTimeout(digitarProximoCaractere, 400);
      }
    }
    setTimeout(digitarProximoCaractere, 400);
  }

  var botao = document.getElementById('botao-copiar');
  var email = document.getElementById('valor-email');
  if (botao && email) {
    var temporizadorMensagem;
    function mostrarMensagem(mensagem) {
      botao.textContent = mensagem;
      clearTimeout(temporizadorMensagem);
      temporizadorMensagem = setTimeout(function () {
        botao.textContent = 'Copiar';
      }, 1600);
    }
    function selecionarEmail() {
      var intervalo = document.createRange();
      intervalo.selectNodeContents(email);
      var selecao = window.getSelection();
      if (!selecao) {
        mostrarMensagem('Falha ao copiar');
        return;
      }
      selecao.removeAllRanges();
      selecao.addRange(intervalo);
      mostrarMensagem('Selecione e copie');
    }
    botao.addEventListener('click', function () {
      if (!navigator.clipboard || !window.isSecureContext) {
        selecionarEmail();
        return;
      }
      navigator.clipboard.writeText(email.textContent.trim()).then(function () {
        mostrarMensagem('Copiado');
      }, selecionarEmail);
    });
  }
})();

(function () {
  var intro = document.querySelector('.intro');
  if (!intro || getComputedStyle(intro).display === 'none') return;

  var PAUSA_MS = 500;
  var SILENCIO_MS = 250;
  var LIMITE_MS = 1500;
  var travadoAte = 0;
  var travadoDesde = 0;
  var sentido = 0;

  function fim() {
    return intro.offsetHeight / 2;
  }

  var armadoBaixo = window.scrollY < fim() - 2;
  var armadoCima = window.scrollY > fim() + 2;

  function travar(f, direcao, agora) {
    window.scrollTo({ top: f, behavior: 'instant' });
    travadoDesde = agora;
    travadoAte = agora + PAUSA_MS;
    sentido = direcao;
    armadoBaixo = false;
    armadoCima = false;
  }

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    var f = fim();
    var agora = Date.now();

    if (agora < travadoAte) {
      if ((sentido > 0 && y > f) || (sentido < 0 && y < f)) {
        window.scrollTo({ top: f, behavior: 'instant' });
      }
      return;
    }

    if (armadoBaixo && y > f + 2) {
      travar(f, 1, agora);
    } else if (armadoCima && y < f - 2) {
      travar(f, -1, agora);
    } else {
      if (y < f - 2) armadoBaixo = true;
      if (y > f + 2) armadoCima = true;
    }
  }, { passive: true });

  window.addEventListener('wheel', function (e) {
    var agora = Date.now();
    if (agora < travadoAte && e.deltaY * sentido > 0) {
      e.preventDefault();
      travadoAte = Math.max(travadoAte, Math.min(agora + SILENCIO_MS, travadoDesde + LIMITE_MS));
    }
  }, { passive: false });
})();
