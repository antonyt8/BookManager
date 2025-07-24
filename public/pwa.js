// PWA Manager - Gerencia service worker, instalação e notificações
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  async init() {
    await this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupNotifications();
    this.checkOnlineStatus();
    this.setupOfflineSync();
  }

  // Registrar Service Worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado:', registration);
        
        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.log('Erro ao registrar Service Worker:', error);
      }
    }
  }

  // Setup para prompt de instalação
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      this.showToast('BookManager instalado com sucesso!', 'success');
    });
  }

  // Mostrar botão de instalação
  showInstallButton() {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
      installBtn.style.display = 'block';
      installBtn.addEventListener('click', () => this.installApp());
    } else {
      // Criar botão dinamicamente se não existir
      this.createInstallButton();
    }
  }

  // Criar botão de instalação
  createInstallButton() {
    const button = document.createElement('button');
    button.id = 'install-btn';
    button.className = 'btn btn-primary position-fixed';
    button.style.cssText = `
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      border-radius: 50px;
      padding: 12px 20px;
      box-shadow: 0 4px 12px rgba(0,123,255,0.3);
    `;
    button.innerHTML = '<i class="fas fa-download me-2"></i>Instalar App';
    button.addEventListener('click', () => this.installApp());
    document.body.appendChild(button);
  }

  // Instalar app
  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
      } else {
        console.log('Usuário rejeitou a instalação');
      }
      
      this.deferredPrompt = null;
    }
  }

  // Esconder botão de instalação
  hideInstallButton() {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  // Setup de notificações
  async setupNotifications() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permissão de notificação concedida');
      }
    }
  }

  // Enviar notificação
  sendNotification(title, options = {}) {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body: options.body || '',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          ...options
        });
      });
    }
  }

  // Verificar status online/offline
  checkOnlineStatus() {
    const updateOnlineStatus = () => {
      const status = navigator.onLine ? 'online' : 'offline';
      document.body.classList.toggle('offline', !navigator.onLine);
      
      if (!navigator.onLine) {
        this.showToast('Você está offline. Algumas funcionalidades podem estar limitadas.', 'warning');
      } else {
        this.showToast('Conexão restaurada!', 'success');
        this.syncOfflineData();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }

  // Setup de sincronização offline
  setupOfflineSync() {
    // Interceptar formulários para salvar offline
    document.addEventListener('submit', (e) => {
      if (!navigator.onLine) {
        e.preventDefault();
        this.saveOfflineData(e.target);
        this.showToast('Dados salvos offline. Serão sincronizados quando voltar online.', 'info');
      }
    });
  }

  // Salvar dados offline
  saveOfflineData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Salvar no localStorage (em produção, usar IndexedDB)
    const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
    offlineData.push({
      id: Date.now(),
      action: form.action,
      method: form.method,
      data: data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('offlineData', JSON.stringify(offlineData));
  }

  // Sincronizar dados offline
  async syncOfflineData() {
    const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
    
    for (const item of offlineData) {
      try {
        await fetch(item.action, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });
        
        // Remover item sincronizado
        const updatedData = offlineData.filter(d => d.id !== item.id);
        localStorage.setItem('offlineData', JSON.stringify(updatedData));
      } catch (error) {
        console.log('Erro ao sincronizar:', error);
      }
    }
  }

  // Mostrar notificação de atualização
  showUpdateNotification() {
    if (confirm('Nova versão disponível! Deseja atualizar?')) {
      window.location.reload();
    }
  }

  // Mostrar toast
  showToast(message, type = 'info') {
    // Remover toast anterior se existir
    const existingToast = document.getElementById('pwa-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'pwa-toast';
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 1050;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    toast.innerHTML = `
      ${message}
      <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }
}

// Inicializar PWA quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.pwaManager = new PWAManager();
});

// Exportar para uso global
window.PWAManager = PWAManager;
