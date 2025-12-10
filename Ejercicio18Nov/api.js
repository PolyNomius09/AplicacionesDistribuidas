
    const btn = document.getElementById('fetchBtn');
    const urlInput = document.getElementById('apiUrl');
    const loader = document.getElementById('loader');
    const errDiv = document.getElementById('error');
    const result = document.getElementById('result');

    async function fetchJson(url){
      errDiv.textContent = '';
      result.innerHTML = '';
      loader.style.display = 'inline';
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        const data = await res.json();
        renderData(data);
      } catch (e) {
        errDiv.textContent = 'Error: ' + e.message + (e.name === 'TypeError' ? ' (posible problema CORS o URL inválida)' : '');
      } finally {
        loader.style.display = 'none';
      }
    }

    function renderData(data){
      if (!data) { result.textContent = 'No hay datos'; return; }
      if (!Array.isArray(data)) {
        result.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        return;
      }
      const keys = Object.keys(data[0] ?? {});
      if (keys.length === 0) {
        result.textContent = 'Array vacío o elementos no son objetos';
        return;
      }
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      keys.forEach(k => { const th = document.createElement('th'); th.textContent = k; headerRow.appendChild(th); });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      data.slice(0,50).forEach(item => {
        const tr = document.createElement('tr');
        keys.forEach(k => {
          const td = document.createElement('td');
          let v = item[k];
          if (typeof v === 'object') v = JSON.stringify(v);
          td.textContent = v ?? '';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      result.appendChild(table);
    }

    btn.addEventListener('click', () => fetchJson(urlInput.value));
    // Para cargar al abrir, descomenta la línea siguiente:
    // fetchJson(urlInput.value);