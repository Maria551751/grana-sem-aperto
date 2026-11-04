# Login e ranking do Desafio GSA (Supabase)

O jogo (`pages/jogar.html`) funciona sem nada disso: sem configuração, o progresso fica salvo no navegador e o ranking aparece como "Em breve". Siga os passos abaixo para ligar o login (Google e link por e-mail) e o ranking.

## 1. Criar o projeto

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto novo. Na região, escolha **South America (São Paulo)**.
2. Guarde a senha do banco num lugar seguro (o site não usa essa senha).

## 2. Criar as tabelas e as regras

1. No painel, abra **SQL Editor → New query**.
2. Cole todo o conteúdo de [`schema.sql`](schema.sql) e clique em **Run**.

Pode rodar de novo sempre que o arquivo mudar. Ele cria:

| O quê | Para quê |
|---|---|
| `perfis` | apelido, XP e sequência de dias de cada jogador |
| `conclusoes` | lições feitas por dia (cada lição rende XP uma vez por dia) |
| `registrar_licao` | única forma de ganhar XP; o cálculo é feito no servidor |
| `obter_ranking` | top 20 da semana ou geral, só com apelido e XP |
| `excluir_minha_conta` | apaga login, perfil e histórico (direito de exclusão da LGPD) |

## 3. Endereços do site

Em **Authentication → URL Configuration**:

- **Site URL:** `https://grana-sem-aperto.vercel.app` (ou o domínio onde o site estiver)
- **Redirect URLs:** adicione `https://grana-sem-aperto.vercel.app/**`

Sem isso, o Google e o link do e-mail não conseguem voltar para o jogo.

## 4. Login por link no e-mail

Em **Authentication → Sign In / Providers → Email**, deixe o provedor ligado. O jogo usa o link mágico, sem senha.

O e-mail padrão do Supabase serve para testar, mas envia poucas mensagens por hora. Antes de divulgar o jogo, configure um SMTP próprio em **Authentication → Emails → SMTP Settings** (Resend, Brevo e similares têm plano grátis).

## 5. Login com Google

1. No [Google Cloud Console](https://console.cloud.google.com/apis/credentials), crie um projeto e configure a **tela de consentimento OAuth** (tipo Externo, nome "GSA").
2. Em **Credenciais → Criar credenciais → ID do cliente OAuth**, escolha **Aplicativo da Web**.
3. Em **URIs de redirecionamento autorizados**, cole o endereço que o Supabase mostra em **Authentication → Sign In / Providers → Google** (algo como `https://SEU-PROJETO.supabase.co/auth/v1/callback`).
4. Copie o **Client ID** e o **Client Secret** do Google para essa mesma tela do Supabase e ative o provedor.

## 6. Ligar o site ao projeto

1. No Supabase, abra **Project Settings → API Keys** (ou **API**) e copie a **Project URL** e a chave pública (**anon** ou **publishable**).
2. Cole as duas em [`assets/js/supabase-config.js`](../assets/js/supabase-config.js):

```js
window.GSA_SUPABASE = {
    url: 'https://SEU-PROJETO.supabase.co',
    anonKey: 'sua-chave-publica'
};
```

A chave pública pode ficar no site: quem protege os dados são as regras do `schema.sql`. **Nunca** coloque a `service_role` (ou `secret`) nesse arquivo nem em nenhum outro do site.

## 7. Testar

1. Publique o site e abra `/pages/jogar.html`.
2. Clique em **Entrar**, entre com o Google ou peça o link no e-mail.
3. Escolha um apelido, faça uma lição e confira se você aparece no ranking.

## Privacidade (LGPD)

- No ranking aparecem só o apelido e o XP; o e-mail fica no Supabase Auth e não é exposto.
- A janela de login avisa para que serve o e-mail e pede que menores de 18 anos combinem com um responsável.
- Cada pessoa pode excluir a própria conta pelo menu do apelido.
- Como o site passa a guardar dados pessoais (e-mail), vale publicar uma página de política de privacidade antes de divulgar o login.
