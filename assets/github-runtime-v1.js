(() => {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const u = new URL(input instanceof Request ? input.url : input, location.href);
    if (u.origin !== location.origin || u.pathname !== "/benchmark-radar-zh24" + '/data/radar.json') {
      return originalFetch(input, init);
    }
    u.pathname += '.gz';
    const response = await originalFetch(u, init);
    if (!response.ok) return response;
    return new Response(response.body.pipeThrough(new DecompressionStream('gzip')), {
      status: response.status, headers: {'Content-Type': 'application/json; charset=utf-8'}
    });
  };
})();
