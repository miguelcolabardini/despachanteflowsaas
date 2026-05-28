const express = require('express');
const sinesp = require('sinesp-api');
const app = express();
const port = process.env.PORT || 3000;

app.get('/consulta', async (req, res) => {
  const placa = req.query.placa;

  if (!placa) {
    return res.json({ erro: 'Placa não informada' });
  }

  const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  try {
    const dados = await sinesp.search(placaLimpa);

    // Log para debug
    console.log('SINESP retornou:', JSON.stringify(dados));

    res.json({
      situacao:     dados.situation  || dados.situacao  || 'Regular',
      marca:        dados.brand      || dados.marca     || '-',
      modelo:       dados.model      || dados.modelo    || '-',
      ano:          dados.modelYear  || dados.ano       || '-',
      cor:          dados.color      || dados.cor       || '-',
      municipio:    dados.city       || dados.municipio || '-',
      uf:           dados.state      || dados.uf        || '-',
      chassi:       dados.chassis    || dados.chassi    || '-',
      restricoes:   'Nenhuma',
      status:       'verde',
      raw:          dados,
      consultadoEm: new Date().toLocaleString('pt-BR')
    });

  } catch (err) {
    console.log('ERRO SINESP:', err);
    res.json({ erro: err.message, stack: err.stack });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
