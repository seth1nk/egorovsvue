<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <div class="app-container">
      <h1 class="page-title">Список услуг ремонта</h1>
      <div class="table-container">
        <table class="styled-table repair-services-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Стоимость</th>
              <th>Категория</th>
              <th>Время (мин.)</th>
              <th>Доступна</th>
              <th>Инструменты</th>
              <th>Сложность</th>
              <th>Фото</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in repairServices" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.name || 'N/A' }}</td>
              <td>{{ item.description ? item.description.slice(0, 50) + (item.description.length > 50 ? '...' : '') : 'N/A' }}</td>
              <td>{{ item.cost ? `${item.cost} руб.` : 'N/A' }}</td>
              <td>{{ item.category || 'N/A' }}</td>
              <td>{{ item.durationMinutes || 'N/A' }}</td>
              <td>
                <span :class="['status', getStatusClass(item.isAvailable)]">
                  {{ item.isAvailable ? 'Доступна' : 'Недоступна' }}
                </span>
              </td>
              <td>{{ item.requiredTools ? item.requiredTools.slice(0, 30) + (item.requiredTools.length > 30 ? '...' : '') : 'N/A' }}</td>
              <td>{{ item.difficultyLevel || 'N/A' }}</td>
              <td>
                <img v-if="item.photo" :src="`${backendUrl}${item.photo}`" alt="Repair Service Photo" class="product-image" />
                <span v-else>N/A</span>
              </td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/view-repair-services/${item.id}`" class="action-btn view-icon"><i class="fas fa-eye"></i></router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!repairServices.length" class="no-data">Нет услуг ремонта</p>
        <div class="pagination" v-if="totalPages > 1">
          <button @click="prevPage" :disabled="currentPage === 1">← Предыдущая</button>
          <span>Страница {{ currentPage }} из {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Следующая →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      repairServices: [],
      currentPage: 1,
      totalPages: 0,
      pageSize: 10,
      backendUrl: 'http://localhost:3000',
    };
  },
  async created() {
    await this.fetchRepairServices();
  },
  methods: {
    async fetchRepairServices() {
      try {
        const response = await fetch(`${this.backendUrl}/api/repair-services?page=${this.currentPage}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/login');
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.repairServices = data.repairServices || [];
        this.totalPages = data.totalPages || 0;
        this.currentPage = data.currentPage || 1;
      } catch (err) {
        console.error('Ошибка при получении услуг ремонта:', err);
        this.repairServices = [];
        this.totalPages = 0;
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchRepairServices();
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchRepairServices();
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

.table-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: auto;
  background: rgba(6, 182, 212, 0.1); /* Полупрозрачный бирюзовый фон */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.styled-table.repair-services-table {
  width: 100%;
  min-width: 900px;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
}

.styled-table.repair-services-table th,
.styled-table.repair-services-table td {
  padding: 10px 8px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid rgba(6, 182, 212, 0.3); /* Бирюзовый бордер */
  border-right: 1px solid rgba(6, 182, 212, 0.3);
  white-space: normal;
  word-break: break-word;
  color: #e0e0e0; /* Светло-серый текст */
  font-size: 0.85rem;
}

.styled-table.repair-services-table th {
  background: rgba(16, 185, 129, 0.3); /* Полупрозрачный изумрудный фон */
  color: #e0e0e0; /* Светло-серый текст */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.styled-table.repair-services-table th:last-child,
.styled-table.repair-services-table td:last-child {
  border-right: none;
}

.styled-table.repair-services-table tbody tr:last-child td {
  border-bottom: none;
}

.styled-table.repair-services-table tbody tr:nth-child(even) {
  background: rgba(6, 182, 212, 0.05); /* Очень легкий бирюзовый фон */
}

.styled-table.repair-services-table tbody tr:hover {
  background: rgba(6, 182, 212, 0.2); /* Легкий бирюзовый фон при наведении */
  transition: background 0.3s ease;
}

.styled-table.repair-services-table th:nth-child(1),
.styled-table.repair-services-table td:nth-child(1) { /* ID */
  width: 5%;
  min-width: 40px;
  max-width: 60px;
}

.styled-table.repair-services-table th:nth-child(2),
.styled-table.repair-services-table td:nth-child(2) { /* Название */
  width: 12%;
  min-width: 80px;
  max-width: 120px;
}

.styled-table.repair-services-table th:nth-child(3),
.styled-table.repair-services-table td:nth-child(3) { /* Описание */
  width: 18%;
  min-width: 100px;
  max-width: 150px;
}

.styled-table.repair-services-table th:nth-child(4),
.styled-table.repair-services-table td:nth-child(4) { /* Стоимость */
  width: 8%;
  min-width: 60px;
  max-width: 90px;
}

.styled-table.repair-services-table th:nth-child(5),
.styled-table.repair-services-table td:nth-child(5) { /* Категория */
  width: 10%;
  min-width: 60px;
  max-width: 100px;
}

.styled-table.repair-services-table th:nth-child(6),
.styled-table.repair-services-table td:nth-child(6) { /* Время */
  width: 8%;
  min-width: 50px;
  max-width: 80px;
}

.styled-table.repair-services-table th:nth-child(7),
.styled-table.repair-services-table td:nth-child(7) { /* Доступна */
  width: 10%;
  min-width: 80px;
  max-width: 120px;
}

.styled-table.repair-services-table th:nth-child(8),
.styled-table.repair-services-table td:nth-child(8) { /* Инструменты */
  width: 15%;
  min-width: 80px;
  max-width: 130px;
}

.styled-table.repair-services-table th:nth-child(9),
.styled-table.repair-services-table td:nth-child(9) { /* Сложность */
  width: 8%;
  min-width: 60px;
  max-width: 90px;
}

.styled-table.repair-services-table th:nth-child(10),
.styled-table.repair-services-table td:nth-child(10) { /* Фото */
  width: 8%;
  min-width: 60px;
  max-width: 80px;
}

.styled-table.repair-services-table th:nth-child(11),
.styled-table.repair-services-table td:nth-child(11) { /* Действия */
  width: 8%;
  min-width: 60px;
  max-width: 80px;
}

.product-image {
  max-width: 50px;
  max-height: 50px;
  border-radius: 8px;
  object-fit: cover;
  vertical-align: middle;
  border: 2px solid #e0f7fa; /* Светло-бирюзовый бордер */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-data {
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
  color: #e0e0e0; /* Светло-серый текст */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
  padding: 20px 0;
}

.pagination button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: #22d3ee; /* Бирюзовый фон */
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.pagination button:disabled {
  background: #6b7280; /* Серый */
  cursor: not-allowed;
  box-shadow: none;
}

.pagination button:hover:not(:disabled) {
  background: #06b6d4; /* Темно-бирюзовый */
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.pagination span {
  color: #e0e0e0; /* Светло-серый текст */
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #22d3ee; /* Бирюзовый фон */
  color: #ffffff;
  font-size: 1rem;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  background: #06b6d4; /* Темно-бирюзовый */
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.view-icon:hover {
  background: #047857; /* Темно-зеленый */
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

@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .table-container {
    padding: 10px;
  }

  .styled-table.repair-services-table th,
  .styled-table.repair-services-table td {
    padding: 6px;
    font-size: 0.8rem;
  }

  .repair-services-table th,
  .repair-services-table td {
    min-width: 30px;
  }

  .product-image {
    max-width: 40px;
    max-height: 40px;
  }

  .pagination button {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>