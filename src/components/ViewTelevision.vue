<template>
  <div class="app-container">
    <h1 class="page-title">Просмотр телевизора</h1>
    <div v-if="loading" class="loading-message">Загрузка данных...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else-if="television" class="television-details">
      <div class="product-image-container">
        <img v-if="television.photo" :src="`${backendUrl}${television.photo}`" alt="Television Photo" class="product-image" />
        <span v-else>Нет изображения</span>
      </div>
      <div class="television-info">
        <p><strong>ID:</strong> {{ television.id || 'N/A' }}</p>
        <p><strong>Название модели:</strong> {{ television.name || 'N/A' }}</p>
        <p><strong>Описание:</strong> {{ television.description || 'N/A' }}</p>
        <p><strong>Бренд:</strong> {{ television.brand || 'N/A' }}</p>
        <p><strong>Тип экрана:</strong> {{ television.screenType || 'N/A' }}</p>
        <p><strong>Год выпуска:</strong> {{ television.releaseYear || 'N/A' }}</p>
        <p>
          <strong>В наличии:</strong>
          <span :class="['status', getStatusClass(television.isInStock)]">
            {{ television.isInStock ? 'В наличии' : 'Нет в наличии' }}
          </span>
        </p>
        <p><strong>Цена:</strong> {{ formatPrice(television.price) }}</p>
      </div>
      <div class="action-buttons">
        <button class="btn-secondary" @click="$router.push('/televisions')">Вернуться к списку</button>
      </div>
    </div>
    <div v-else class="error-message">Не удалось загрузить данные о телевизоре.</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      television: null,
      loading: true,
      errorMessage: null,
      backendUrl: 'http://localhost:3000',
    };
  },
  async created() {
    const televisionId = this.$route.params.id;
    if (!/^\d+$/.test(televisionId)) {
      this.errorMessage = 'Некорректный ID';
      this.loading = false;
      return;
    }
    await this.fetchTelevision(televisionId);
  },
  methods: {
    async fetchTelevision(televisionId) {
      try {
        const response = await fetch(`${this.backendUrl}/api/view-television/${televisionId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/login');
            return;
          }
          if (response.status === 404) {
            throw new Error('Телевизор не найден');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Данные телевизора с сервера:', data); // Логирование для отладки
        this.television = data;
      } catch (err) {
        console.error('Ошибка при получении данных телевизора:', err);
        this.errorMessage = err.message;
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      // Безопасное форматирование цены
      return typeof price === 'number' && !isNaN(price) ? price.toFixed(2) : '0.00';
    },
    getStatusClass(isInStock) {
      return isInStock ? 'available' : 'unavailable';
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

.television-details {
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

.television-info {
  text-align: center;
  width: 100%;
  word-wrap: break-word;
}

.television-info p {
  margin: 10px 0;
  color: #e0e0e0;
  font-size: 1.25rem;
}

.television-info strong {
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
  .television-details {
    padding: 15px;
  }

  .product-image-container .product-image {
    max-width: 120px;
    max-height: 120px;
  }

  .television-info p {
    font-size: 1rem;
  }
}
</style>