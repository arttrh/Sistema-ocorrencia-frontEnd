/**
 * Configuracao da API.
 *
 * A URL do back-end estava escrita a mao em tres arquivos diferentes
 * (auth.js, login.js e dashboard-ocorrencias.js), o que obrigava a editar todos
 * eles a cada troca de ambiente e deixava lugares fora de sincronia.
 *
 * A resolucao segue esta ordem, do mais especifico para o mais generico:
 *
 *   1. localStorage.apiBaseUrl  - ajuste pontual na maquina de quem desenvolve
 *   2. <meta name="api-base-url" content="..."> - definido no deploy
 *   3. mesma origem da pagina, quando ela nao e' servida de file:// ou :5500
 *   4. http://localhost:8080    - porta padrao do Spring Boot
 */
(function () {
  "use strict";

  const PADRAO = "http://localhost:8080";

  function semBarraFinal(url) {
    return String(url).replace(/\/+$/, "");
  }

  function resolverBaseUrl() {
    try {
      const salva = localStorage.getItem("apiBaseUrl");
      if (salva) return semBarraFinal(salva);
    } catch (e) {
      // localStorage pode estar bloqueado; seguimos para as proximas opcoes.
    }

    const meta = document.querySelector('meta[name="api-base-url"]');
    if (meta && meta.content) return semBarraFinal(meta.content);

    // Servido pelo Live Server (5500) ou por file://, o back esta em outra porta.
    const origem = window.location.origin;
    const ehServidorDeArquivos =
      !origem ||
      origem === "null" ||
      window.location.protocol === "file:" ||
      window.location.port === "5500";

    return ehServidorDeArquivos ? PADRAO : semBarraFinal(origem);
  }

  const baseUrl = resolverBaseUrl();

  window.API_CONFIG = {
    baseUrl: baseUrl,

    /** Monta a URL completa a partir de um caminho relativo da API. */
    url: function (caminho) {
      if (!caminho) return baseUrl;
      if (/^https?:\/\//i.test(caminho)) return caminho;
      return baseUrl + (caminho.startsWith("/") ? caminho : "/" + caminho);
    },
  };

  console.info("[config] API em", baseUrl);
})();
