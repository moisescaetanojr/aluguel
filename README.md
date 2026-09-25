# Aluguel Fácil — MVP

Este projeto é um protótipo frontend de um app de aluguel residencial.

## Rodar
Abra `index.html` em um navegador moderno.
Para a geolocalização funcionar de forma consistente, prefira rodar por um servidor local:

```bash
python -m http.server 8000
```

Depois abra http://localhost:8000

## O que já existe
- Busca por cidade/bairro/endereço (no MVP, pesquisa nos dados de demonstração)
- Filtro de preço máximo
- Filtro de qualidade
- Casa/apartamento
- Número de quartos
- Distância máxima
- Ordenação por melhor anúncio, preço, qualidade ou distância
- Geolocalização do navegador
- Índice de valor que combina preço, qualidade, distância e verificação
- Layout responsivo para desktop e celular

## Próxima etapa para virar produto real
1. Backend/API de imóveis.
2. Banco PostgreSQL + PostGIS para buscas geográficas.
3. Geocodificação de endereços.
4. Cadastro/login de usuários e anunciantes.
5. Sistema de favoritos e alertas de queda de preço.
6. Verificação de identidade/anúncio e prevenção de fraude.
7. Fotos armazenadas em serviço de mídia.
8. Contato via chat/WhatsApp/e-mail.
9. Histórico de preço e detecção de anúncios duplicados.
10. Ranking de valor mais sofisticado, sem favorecer anúncios só porque pagam para aparecer.
