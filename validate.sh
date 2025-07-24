#!/bin/bash

# Script de validação para verificar se o app está pronto para deploy
echo "🔍 Validando configurações do BookManager..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASS=0
FAIL=0

check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo -e "\n${BLUE}📋 VERIFICAÇÃO DE ARQUIVOS${NC}"

# 1. Verificar arquivos essenciais
if [ -f "package.json" ]; then
    check_pass "package.json existe"
else
    check_fail "package.json não encontrado"
fi

if [ -f "server.js" ]; then
    check_pass "server.js existe"
else
    check_fail "server.js não encontrado"
fi

if [ -f "app.js" ]; then
    check_pass "app.js existe"
else
    check_fail "app.js não encontrado"
fi

# 2. Verificar arquivos de deploy
if [ -f "Dockerfile" ]; then
    check_pass "Dockerfile existe"
else
    check_fail "Dockerfile não encontrado"
fi

if [ -f "fly.toml" ]; then
    check_pass "fly.toml existe"
else
    check_fail "fly.toml não encontrado"
fi

if [ -f ".dockerignore" ]; then
    check_pass ".dockerignore existe"
else
    check_warn ".dockerignore não encontrado"
fi

echo -e "\n${BLUE}📦 VERIFICAÇÃO DE DEPENDÊNCIAS${NC}"

# 3. Verificar node_modules
if [ -d "node_modules" ]; then
    check_pass "node_modules instalado"
else
    check_fail "node_modules não encontrado - execute: npm install"
fi

# 4. Verificar scripts npm
if npm run | grep -q "start"; then
    check_pass "Script 'start' configurado"
else
    check_fail "Script 'start' não encontrado"
fi

if npm run | grep -q "build"; then
    check_pass "Script 'build' configurado"
else
    check_fail "Script 'build' não encontrado"
fi

echo -e "\n${BLUE}🗄️ VERIFICAÇÃO DE BANCO${NC}"

# 5. Verificar configuração de banco
if [ -f "config/database.js" ]; then
    check_pass "Configuração de banco existe"
else
    check_fail "config/database.js não encontrado"
fi

# 6. Verificar models
if [ -d "models" ] && [ "$(ls -A models)" ]; then
    check_pass "Models definidos"
else
    check_fail "Diretório models vazio ou não existe"
fi

echo -e "\n${BLUE}🔐 VERIFICAÇÃO DE SEGURANÇA${NC}"

# 7. Verificar arquivo .env
if [ -f ".env" ]; then
    check_warn ".env existe (não será incluído no deploy)"
    
    if grep -q "SESSION_SECRET" .env; then
        check_pass "SESSION_SECRET configurado no .env"
    else
        check_fail "SESSION_SECRET não encontrado no .env"
    fi
else
    check_warn ".env não encontrado"
fi

# 8. Verificar se .env está no .gitignore
if [ -f ".gitignore" ] && grep -q ".env" .gitignore; then
    check_pass ".env está no .gitignore"
else
    check_fail ".env não está no .gitignore"
fi

echo -e "\n${BLUE}🌐 VERIFICAÇÃO PWA (se aplicável)${NC}"

# 9. Verificar PWA (se na branch PWA)
if [ -f "public/manifest.json" ]; then
    check_pass "PWA manifest.json existe"
    
    if [ -f "public/sw.js" ]; then
        check_pass "Service Worker configurado"
    else
        check_warn "Service Worker não encontrado"
    fi
    
    if [ -d "public/icons" ] && [ "$(ls -A public/icons)" ]; then
        check_pass "Ícones PWA existem"
    else
        check_warn "Ícones PWA não encontrados"
    fi
else
    check_warn "PWA não configurado (opcional)"
fi

echo -e "\n${BLUE}🧪 TESTE DE SINTAXE${NC}"

# 10. Verificar sintaxe do Node.js
if node -c server.js 2>/dev/null; then
    check_pass "server.js tem sintaxe válida"
else
    check_fail "server.js tem erro de sintaxe"
fi

if node -c app.js 2>/dev/null; then
    check_pass "app.js tem sintaxe válida"
else
    check_fail "app.js tem erro de sintaxe"
fi

# 11. Verificar package.json
if node -e "JSON.parse(require('fs').readFileSync('package.json'))" 2>/dev/null; then
    check_pass "package.json é válido"
else
    check_fail "package.json tem erro de sintaxe"
fi

echo -e "\n${BLUE}🚀 VERIFICAÇÃO FLY.IO${NC}"

# 12. Verificar se fly CLI está disponível
if command -v fly &> /dev/null; then
    check_pass "Fly CLI instalado"
    
    # Verificar se está logado
    if fly auth whoami &> /dev/null; then
        check_pass "Autenticado no Fly.io"
    else
        check_warn "Não autenticado no Fly.io - execute: fly auth login"
    fi
else
    check_warn "Fly CLI não instalado - instale em: https://fly.io/install.sh"
fi

echo -e "\n${BLUE}📊 RESUMO${NC}"
echo -e "✅ Passou: ${GREEN}$PASS${NC}"
echo -e "❌ Falhou: ${RED}$FAIL${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "\n${GREEN}🎉 TUDO PRONTO PARA DEPLOY!${NC}"
    echo -e "Execute: ${BLUE}./deploy.sh${NC} ou ${BLUE}fly deploy${NC}"
    exit 0
else
    echo -e "\n${RED}🔧 CORRIJA OS PROBLEMAS ANTES DO DEPLOY${NC}"
    exit 1
fi
