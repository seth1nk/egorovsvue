<template>
  <div class="app-container">
    <h1 class="page-title">Просмотр услуги ремонта</h1>
    <div v-if="loading" class="loading-message">Загрузка данных...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else-if="repairService" class="repair-service-details">
      <div class="product-image-container">
        <img v-if="repairService.photo" :src="`${backendUrl}${repairService.photo}`" alt="Repair Service Photo" class="product-image" />
        <span v-else>Нет изображения</span>
      </div>
      <div class="repair-service-info">
        <p><strong>ID:</strong> {{ repairService.id || 'N/A' }}</p>
        <p><strong>Название:</strong> {{ repairService.name || 'N/A' }}</p>
        <p><strong>Описание:</strong> {{ repairService.description || 'N/A' }}</p>
        <p><strong>Стоимость:</strong> {{ repairService.cost ? `${repairService.cost} руб.` : 'N/A' }}</p>
        <p><strong>Категория:</strong> {{ repairService.category || 'N/A' }}</p>
        <p><strong>Время выполнения:</strong> {{ repairService.durationMinutes ? `${repairService.durationMinutes} мин.` : 'N/A' }}</p>
        <p>
          <strong>Доступна:</strong>
          <span :class="['status', getStatusClass(repairService.isAvailable)]">
            {{ repairService.isAvailable ? 'Доступна' : 'Недоступна' }}
          </span>
        </p>
        <p><strong>Требуемые инструменты:</strong> {{ repairService.requiredTools || 'N/A' }}</p>
        <p><strong>Уровень сложности:</strong> {{ repairService.difficultyLevel || 'N/A' }}</p>
      </div>
      <div class="action-buttons">
        <button class="btn-secondary" @click="$router.push('/repair-services')">Вернуться к списку</button>
      </div>
    </div>
    <div v-else class="error-message">Не удалось загрузить данные об услуге ремонта.</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      repairService: null,
      loading: true,
      errorMessage: null,
      backendUrl: 'http://localhost:3000',
    };
  },
  async created() {
    const serviceId = this.$route.params.id;
    if (!/^\d+$/.test(serviceId)) {
      this.errorMessage = 'Некорректный ID';
      this.loading = false;
      return;
    }
    await this.fetchRepairService(serviceId);
  },
  methods: {
    async fetchRepairService(serviceId) {
      try {
        const response = await fetch(`${this.backendUrl}/api/view-repair-service/${serviceId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/login');
            return;
          }
          if (response.status === 404) {
            throw new Error('Услуга ремонта не найдена');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.repairService = data;
      } catch (err) {
        console.error('Ошибка при получении данных услуги ремонта:', err);
        this.errorMessage = err.message;
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(isAvailable) {
      return isAvailable ? 'available' : 'unavailable';
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
  background: linear-gradient(135deg, #0d9488, #1e40af); /* Сине-зеленый градиент */
  color: #e0e0e0; /* Светло-серый текст */
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
  color: #fef08a; /* Золотисто-желтый */
  background: linear-gradient(90deg, #047857, #1e40af); /* Зелено-синий градиент */
  padding: 12px;
  border-radius: 12px;
}

.repair-service-details {
  background: rgba(6, 182, 212, 0.1); /* Полупрозрачный бирюзовый фон */
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
  border: 2px solid #e0f7fa; /* Светло-бирюзовый бордер */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.repair-service-info {
  text-align: center;
  width: 100%;
  word-wrap: break-word;
}

.repair-service-info p {
  margin: 10px 0;
  color: #e0e0e0; /* Светло-серый текст */
  font-size: 1.25rem;
}

.repair-service-info strong {
  color: #e0e0e0; /* Светло-серый текст */
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
  background: #047857; /* Темно-зеленый */
  color: #ffffff;
}

.status.unavailable {
  background: #dc2626; /* Темно-красный */
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
  color: #1e293b; /* Темно-синий текст */
  background: rgba(16, 185, 129, 0.2); /* Полупрозрачный изумрудный фон */
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: rgba(16, 185, 129, 0.3); /* Чуть темнее при наведении */
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.loading-message,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  color: #e0e0e0; /* Светло-серый текст */
}

@media (max-width: 768px) {
  .repair-service-details {
    padding: 15px;
  }

  .product-image-container .product-image {
    max-width: 120px;
    max-height: 120px;
  }

  .repair-service-info p {
    font-size: 1rem;
  }
}
</style>