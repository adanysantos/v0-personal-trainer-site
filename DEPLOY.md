# 🚀 Guia de Deploy - Personal Trainer Site

## Pré-requisitos

1. ✅ Conta no GitHub (você já tem)
2. ✅ Conta no Vercel (gratuita)
3. ✅ Integração Supabase configurada

## Passos para Deploy

### 1. Executar Scripts SQL no Supabase

Antes de fazer o deploy, você precisa executar os scripts SQL para criar as tabelas:

1. Clique em "Run Script" nos scripts abaixo (na interface do v0):
   - `scripts/001_create_tables.sql`
   - `scripts/002_create_profile_trigger.sql`

### 2. Push para o GitHub

O código já está sincronizado com seu repositório GitHub. Para enviar as últimas alterações:

\`\`\`bash
git add .
git commit -m "Integração completa com Supabase"
git push origin main
\`\`\`

### 3. Deploy no Vercel

#### Opção A: Deploy direto do v0 (Recomendado)
1. Clique no botão **"Publish"** no canto superior direito do v0
2. Siga as instruções para conectar com o Vercel
3. As variáveis de ambiente do Supabase serão automaticamente configuradas

#### Opção B: Deploy manual no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório `v0-personal-trainer-site`
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (opcional, apenas para dev)
5. Clique em "Deploy"

### 4. Configurar Redirect URLs no Supabase

Após o deploy, você precisa adicionar a URL de produção no Supabase:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Authentication** → **URL Configuration**
3. Adicione suas URLs em **Redirect URLs**:
   - `https://trainer-site.app/auth/callback`
   - `https://trainer-site.app`
   - `https://www.trainer-site.app/auth/callback` (se usar www)
   - `https://www.trainer-site.app` (se usar www)

### 5. Configurar Domínio Customizado no Vercel

1. No Vercel Dashboard, vá em **Settings** → **Domains**
2. Adicione `trainer-site.app` e `www.trainer-site.app`
3. Configure os registros DNS conforme instruções do Vercel
4. Aguarde a propagação do DNS (pode levar até 48h)

### 6. Testar a Aplicação

1. Acesse https://trainer-site.app
2. Crie uma conta de instrutor
3. Crie uma conta de aluno (use outro email)
4. Faça login como instrutor e crie um plano de treino
5. Faça login como aluno e visualize o plano

## 🎯 Funcionalidades

### Para Instrutores:
- ✅ Criar planos de treino personalizados
- ✅ Adicionar múltiplos exercícios com detalhes
- ✅ Editar e excluir planos existentes
- ✅ Visualizar estatísticas de alunos

### Para Alunos:
- ✅ Visualizar planos de treino atribuídos
- ✅ Ver detalhes completos de cada exercício
- ✅ Acompanhar progresso

## 🔒 Segurança

- ✅ Row Level Security (RLS) ativado
- ✅ Autenticação via Supabase Auth
- ✅ Middleware protegendo rotas
- ✅ Validação de tipos de usuário

## 📱 Responsivo

O site é totalmente responsivo e funciona perfeitamente em:
- 📱 Mobile
- 💻 Tablet
- 🖥️ Desktop

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se os scripts SQL foram executados
2. Confirme que as variáveis de ambiente estão corretas
3. Verifique os logs no Vercel Dashboard
4. Teste a conexão com o Supabase
5. Confirme que as Redirect URLs estão configuradas no Supabase

---

**Desenvolvido com ❤️ usando Next.js, Supabase e Tailwind CSS**
