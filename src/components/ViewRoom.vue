<template>
  <div class="app-container">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <h1 class="page-title">Просмотр номера</h1>
    <div v-if="loading" class="loading-message">Загрузка данных...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else-if="room" class="room-details">
      <div class="product-image-container">
        <img v-if="room.photoPath" :src="`${backendUrl}${room.photoPath}`" alt="Room Photo" class="product-image" />
        <span v-else>Нет изображения</span>
      </div>
      <div class="room-info">
        <p><strong>ID:</strong> {{ room.id || 'N/A' }}</p>
        <p><strong>Номер комнаты:</strong> {{ room.roomNumber || 'N/A' }}</p>
        <p><strong>Тип номера:</strong> {{ room.roomType || 'N/A' }}</p>
        <p><strong>Вместимость:</strong> {{ room.capacity || 'N/A' }}</p>
        <p><strong>Цена за ночь:</strong> {{ room.pricePerNight || 'N/A' }}</p>
        <p>
          <strong>Доступен:</strong>
          <span :class="['status', getStatusClass(room.isAvailable)]">
            {{ room.isAvailable ? 'Доступен' : 'Недоступен' }}
          </span>
        </p>
        <p><strong>Описание:</strong> {{ room.description || 'N/A' }}</p>
        <p><strong>Этаж:</strong> {{ room.floor || 'N/A' }}</p>
      </div>
      <div class="action-buttons">
        <button class="btn-secondary" @click="$router.push('/rooms')">Вернуться к списку</button>
      </div>
    </div>
    <div v-else class="error-message">Не удалось загрузить данные о номере.</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      room: null,
      loading: true,
      errorMessage: null,
      backendUrl: 'https://egorovdnode.onrender.com',
    };
  },
  async created() {
    const roomId = this.$route.params.id;
    if (!/^\d+$/.test(roomId)) {
      this.errorMessage = 'Некорректный ID';
      this.loading = false;
      return;
    }
    await this.fetchRoom(roomId);
  },
  methods: {
    async fetchRoom(roomId) {
      try {
        const response = await fetch(`${this.backendUrl}/api/view-room/${roomId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/login');
            return;
          }
          if (response.status === 404) {
            throw new Error('Номер не найден');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.room = data;
      } catch (err) {
        console.error('Ошибка при получении данных номера:', err);
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
  font-family: 'Roboto Mono', monospace;
  background: linear-gradient(135deg, #800020, #400020) !important;
  color: #ffffff !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ffffff !important;
  background: linear-gradient(135deg, #c70039, #800040) !important;
  padding: 12px;
  border-radius: 16px;
}

.room-details {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  border: 2px solid #ffc107 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-image-container .product-image:hover {
  border-color: #e0a800 !important;
  transform: scale(1.03);
}

.room-info {
  text-align: center;
  width: 100%;
  word-wrap: break-word;
}

.room-info p {
  margin: 10px 0;
  color: #ffffff !important;
  font-size: 1.25rem;
}

.room-info strong {
  color: #ffffff !important;
  font-weight: bold;
}

.status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  min-width: 100px;
  color: #ffffff !important;
}

.status.available {
  background: #32a852 !important;
}

.status.unavailable {
  background: #c70039 !important;
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
  font-weight: bold;
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.loading-message,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  color: #ffffff !important;
}

@media (max-width: 768px) {
  .room-details {
    padding: 15px;
  }

  .product-image-container .product-image {
    max-width: 120px;
    max-height: 120px;
  }

  .room-info p {
    font-size: 1rem;
  }
}
</style>
