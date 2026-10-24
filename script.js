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
  botao.addEventListener('click', function () {
    function ok() { botao.textContent = 'Copiado'; setTimeout(function () { botao.textContent = 'Copiar'; }, 1600); }
    function selecionar() {
      var r = document.createRange(); r.selectNodeContents(email);
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    try { navigator.clipboard.writeText(email.textContent.trim()).then(ok, selecionar); } catch (e) { selecionar(); }
  });
})();