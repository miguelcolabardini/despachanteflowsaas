const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/consulta', async (req, res) => {
  const placa = req.query.placa;

  if (!placa) {
    return res.json({ erro: 'Placa não informada' });
  }

  const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  try {
    const { default: sinesp } = await import('sinesp-api');
    const dados = await sinesp.search(placaLimpa);

    res.json({
      situacao:     dados.situation     || 'Regular',
      marca:        dados.brand         || '-',
      modelo:       dados.model         || '-',
      ano:          dados.modelYear     || '-',
      cor:          dados.color         || '-',
      municipio:    dados.city          || '-',
      uf:           dados.state         || '-',
      chassi:       dados.chassis       || '-',
      restricoes:   'Nenhuma',
      status:       (dados.situation || '').toLowerCase().includes('restri') ? 'vermelho' : 'verde',
      consultadoEm: new Date().toLocaleString('pt-BR')
    });

  } catch (err) {
    res.json({ erro: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
