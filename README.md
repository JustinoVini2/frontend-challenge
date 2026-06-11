# Frontend Challenge - GitHub User Search

Aplicacao Angular para buscar usuarios do GitHub, listar repositorios e visualizar detalhes de um repositorio.

## Objetivo do projeto

Este projeto implementa um fluxo simples e completo:

1. Buscar usuario GitHub por username.
2. Exibir dados do perfil e lista de repositorios.
3. Filtrar e ordenar repositorios.
4. Abrir tela de detalhe de um repositorio.

## Stack tecnica

- Angular 16
- Angular Material 16
- RxJS 7
- Jest (testes unitarios)
- SCSS

## Requisitos

- Node.js 18+ (recomendado LTS)
- npm 9+

## Como executar localmente

1. Instale dependencias:

```bash
npm install
```

2. Suba a aplicacao:

```bash
npm start
```

3. Abra no navegador:

```text
http://localhost:4200
```

## Scripts disponiveis

- `npm start`: inicia servidor de desenvolvimento (`ng serve`).
- `npm run build`: gera build de producao em `dist/frontend-challenge`.
- `npm run watch`: build em modo watch para desenvolvimento.
- `npm test`: executa testes unitarios com Jest.
- `npm run test:watch`: executa testes em modo observacao.
- `npm run test:coverage`: executa testes com relatorio de cobertura.
- `npm run test:ci`: execucao para CI (com cobertura e workers limitados).

## Estrutura de pastas

```text
src/
	app/
		app-routing.module.ts
		app.module.ts
		core/
			github.service.ts
		features/
			search/
			results/
			repo-detail/
		models/
			github-user.model.ts
			github-repo.model.ts
		shared/
			repo-card/
```

## Rotas da aplicacao

- `/`: tela de busca de usuario.
- `/user/:username`: tela de resultados (perfil + repositorios).
- `/user/:username/repo/:repo`: detalhe de repositorio.

## Arquitetura resumida

- `core`: servicos e responsabilidades globais.
- `features`: paginas principais e fluxo da aplicacao.
- `shared`: componentes reutilizaveis.
- `models`: contratos de dados tipados da API GitHub.

## Integracao com API do GitHub

Base URL utilizada:

```text
https://api.github.com
```

Chamadas principais:

- `GET /users/{username}`
- `GET /users/{username}/repos?per_page=100&sort=updated`
- `GET /repos/{owner}/{repo}`

## Comportamentos importantes

- Busca valida username antes de navegar.
- Tratamento de erros para usuario nao encontrado (404) e erro generico.
- Componentes usam `ChangeDetectionStrategy.OnPush`.
- Listas usam `trackBy` para melhor performance.

## Testes

O projeto usa Jest como runner de testes unitarios.

Para rodar todos os testes:

```bash
npm test
```

Para cobertura:

```bash
npm run test:coverage
```

## Validacao rapida antes de abrir PR

Execute localmente:

```bash
npm run build
npm test
```

Se ambos passarem, o basico de compilacao e regressao unitarias esta validado.

## Troubleshooting

- Erro de dependencia: remova `node_modules` e rode `npm install` novamente.
- Porta `4200` ocupada: rode `npm start -- --port 4300`.
- Falha em testes por cache: rode `npx jest --clearCache` e execute `npm test` novamente.

## Observacoes

- Tema Angular Material prebuilt configurado no `angular.json`.
- O projeto nao depende de token GitHub para leitura basica, mas pode sofrer rate limit da API publica.
