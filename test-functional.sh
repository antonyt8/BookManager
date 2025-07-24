#!/bin/bash

# Script para testar funcionalidades do BookManager
echo "🧪 Testando funcionalidades do BookManager..."

# Iniciar servidor em background
echo "🚀 Iniciando servidor para testes..."
PORT=3001 npm start &
SERVER_PID=$!

# Aguardar servidor iniciar
sleep 5

# Função para fazer requisições
test_endpoint() {
    local url=$1
    local expected_status=${2:-200}
    local description=$3
    
    echo "🔍 Testando: $description"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001$url)
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ $description - Status: $response"
        return 0
    else
        echo "❌ $description - Esperado: $expected_status, Recebido: $response"
        return 1
    fi
}

# Aguardar um pouco mais
sleep 3

# Testar endpoints principais
echo -e "\n📡 TESTANDO ENDPOINTS"

test_endpoint "/" 200 "Página inicial"
test_endpoint "/usuarios/login" 200 "Página de login"
test_endpoint "/usuarios/cadastro" 200 "Página de cadastro"
test_endpoint "/api-docs" 200 "Documentação da API"

# Testar PWA
echo -e "\n📱 TESTANDO PWA"
test_endpoint "/manifest.json" 200 "PWA Manifest" || echo "⚠️  PWA não configurado"
test_endpoint "/sw.js" 200 "Service Worker" || echo "⚠️  Service Worker não encontrado"

# Testar API
echo -e "\n🔌 TESTANDO API"
test_endpoint "/api/register" 405 "API Register (método não permitido)"

# Parar servidor
echo -e "\n🛑 Parando servidor de teste..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo -e "\n✅ Testes funcionais concluídos!"
