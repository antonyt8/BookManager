const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Criar SVG base (emoji de livro)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#007bff" rx="128"/>
  <text x="256" y="340" font-family="Arial, sans-serif" font-size="300" text-anchor="middle" fill="white">📚</text>
</svg>`;

// Tamanhos necessários para PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const iconsDir = path.join(__dirname, 'public', 'icons');
  
  // Criar diretório se não existir
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Salvar SVG temporário
  const tempSvgPath = path.join(iconsDir, 'temp.svg');
  fs.writeFileSync(tempSvgPath, svgIcon);

  try {
    // Gerar cada tamanho
    for (const size of sizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(tempSvgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Ícone ${size}x${size} gerado`);
    }

    // Remover SVG temporário
    fs.unlinkSync(tempSvgPath);
    
    console.log('🎉 Todos os ícones PWA foram gerados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
