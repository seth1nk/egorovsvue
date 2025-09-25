<template>
  <div class="app-container">
    <h1 class="page-title">Просмотр продажи</h1>
    <div v-if="loading" class="loading-message">Загрузка данных...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else-if="sale" class="sale-details">
      <div class="product-image-container">
        <img v-if="sale.photo" :src="`${backendUrl}${sale.photo}`" alt="Sale Photo" class="product-image" />
        <span v-else>Нет изображения</span>
      </div>
      <div class="sale-info">
        <p><strong>ID:</strong> {{ sale.id || 'N/A' }}</p>
        <p><strong>Имя клиента:</strong> {{ sale.customerName || 'N/A' }}</p>
        <p><strong>Комментарий:</strong> {{ sale.notes || 'N/A' }}</p>
        <p><strong>Адрес доставки:</strong> {{ sale.deliveryAddress || 'N/A' }}</p>
        <p><strong>Способ оплаты:</strong> {{ sale.paymentMethod || 'N/A' }}</p>
        <p><strong>Год продажи:</strong> {{ sale.saleYear || 'N/A' }}</p>
        <p>
          <strong>Подтверждена:</strong>
          <span :class="['status', getStatusClass(sale.isConfirmed)]">
            {{ sale.isConfirmed ? 'Подтверждена' : 'Не подтверждена' }}
          </span>
        </p>
        <p><strong>Номер заказа:</strong> {{ sale.orderNumber || 'N/A' }}</p>
      </div>
      <div class="action-buttons">
        <button class="btn-secondary" @click="$router.push('/sales')">Вернуться к списку</button>
      </div>
    </div>
    <div v-else class="error-message">Не удалось загрузить данные о продаже.</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sale: null,
      loading: true,
      errorMessage: null,
      backendUrl: 'http://localhost:3000',
    };
  },
  async created() {
    const saleId = this.$route.params.id;
    if (!/^\d+$/.test(saleId)) {
      this.errorMessage = 'Некорректный ID';
      this.loading = false;
      return;
    }
    await this.fetchSale(saleId);
  },
  methods: {
    async fetchSale(saleId) {
      try {
        const response = await fetch(`${this.backendUrl}/api/view-sale/${saleId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/login');
            return;
          }
          if (response.status === 404) {
            throw new Error('Продажа не найдена');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.sale = data;
      } catch (err) {
        console.error('Ошибка при получении данных продажи:', err);
        this.errorMessage = err.message;
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(isConfirmed) {
      return isConfirmed ? 'available' : 'unavailable';
    },
  },
};
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #0d9488, #1e40af);
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fef08a;
  background: linear-gradient(90deg, #047857, #1e40af);
  padding: 12px;
  border-radius: 12px;
}

.sale-details {
  background: rgba(6, 182, 212, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.product-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.product-image-container .product-image {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e0f7fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.sale-info {
  text-align: center;
  width: 100%;
  word-wrap: break-word;
}

.sale-info p {
  margin: 10px 0;
  color: #e0e0e0;
  font-size: 1.25rem;
}

.sale-info strong {
  color: #e0e0e0;
  font-weight: 600;
}

.status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  min-width: 100px;
}

.status.available {
  background: #047857;
  color: #ffffff;
}

.status.unavailable {
  background: #dc2626;
  color: #ffffff;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  background: rgba(16, 185, 129, 0.2);
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: rgba(16, 185, 129, 0.3);
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.loading-message,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  color: #e0e0e0;
}

@media (max-width: 768px) {
  .sale-details {
    padding: 15px;
  }

  .product-image-container .product-image {
    max-width: 120px;
    max-height: 120px;
  }

  .sale-info p {
    font-size: 1rem;
  }
}
</style>