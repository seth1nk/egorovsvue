<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <div class="app-container">
      <h1 class="page-title">Список бронирований</h1>
      <div class="table-container">
        <table class="styled-table bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID номера</th>
              <th>Имя гостя</th>
              <th>Дата заезда</th>
              <th>Дата выезда</th>
              <th>Общая стоимость</th>
              <th>Подтверждено</th>
              <th>Контактный телефон</th>
              <th>Фото</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in bookings" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.roomId || 'N/A' }}</td>
              <td>{{ item.guestName || 'N/A' }}</td>
              <td>{{ item.checkInDate || 'N/A' }}</td>
              <td>{{ item.checkOutDate || 'N/A' }}</td>
              <td>{{ item.totalPrice || 'N/A' }}</td>
              <td>
                <span :class="['status', getStatusClass(item.isConfirmed)]">
                  {{ item.isConfirmed ? 'Подтверждено' : 'Не подтверждено' }}
                </span>
              </td>
              <td>{{ item.guestPhone || 'N/A' }}</td>
              <td>
                <img v-if="item.photo" :src="`${backendUrl}${item.photo}`" alt="Booking Photo" class="product-image" />
                <span v-else>N/A</span>
              </td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/view-bookings/${item.id}`" class="action-btn view-icon"><i class="fas fa-eye"></i></router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!bookings.length" class="no-data">Нет бронирований</p>
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
      bookings: [],
      currentPage: 1,
      totalPages: 0,
      pageSize: 10,
      backendUrl: 'https://egorovdnode.onrender.com',
    };
  },
  async created() {
    await this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      try {
        const response = await fetch(`${this.backendUrl}/api/bookings?page=${this.currentPage}`, {
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
        this.bookings = data.bookings || [];
        this.totalPages = data.totalPages || 0;
        this.currentPage = data.currentPage || 1;
      } catch (err) {
        console.error('Ошибка при получении бронирований:', err);
        this.bookings = [];
        this.totalPages = 0;
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchBookings();
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchBookings();
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

.table-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 15px;
}

.styled-table.bookings-table {
  width: 100%;
  min-width: 800px;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.styled-table.bookings-table th,
.styled-table.bookings-table td {
  padding: 10px 8px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
  white-space: normal;
  word-break: break-word;
  color: #ffffff !important;
  font-size: 0.85rem;
}

.styled-table.bookings-table th {
  background: linear-gradient(135deg, #c70039, #800040) !important;
  color: #ffffff !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.styled-table.bookings-table th:last-child,
.styled-table.bookings-table td:last-child {
  border-right: none;
}

.styled-table.bookings-table tbody tr:last-child td {
  border-bottom: none;
}

.styled-table.bookings-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.05) !important;
}

.styled-table.bookings-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transition: background 0.3s ease;
}

.styled-table.bookings-table th:nth-child(1),
.styled-table.bookings-table td:nth-child(1) { /* ID */
  width: 5%;
  min-width: 40px;
  max-width: 60px;
}

.styled-table.bookings-table th:nth-child(2),
.styled-table.bookings-table td:nth-child(2) { /* ID номера */
  width: 8%;
  min-width: 60px;
  max-width: 80px;
}

.styled-table.bookings-table th:nth-child(3),
.styled-table.bookings-table td:nth-child(3) { /* Имя гостя */
  width: 15%;
  min-width: 80px;
  max-width: 120px;
}

.styled-table.bookings-table th:nth-child(4),
.styled-table.bookings-table td:nth-child(4) { /* Дата заезда */
  width: 12%;
  min-width: 70px;
  max-width: 100px;
}

.styled-table.bookings-table th:nth-child(5),
.styled-table.bookings-table td:nth-child(5) { /* Дата выезда */
  width: 12%;
  min-width: 70px;
  max-width: 100px;
}

.styled-table.bookings-table th:nth-child(6),
.styled-table.bookings-table td:nth-child(6) { /* Общая стоимость */
  width: 10%;
  min-width: 60px;
  max-width: 80px;
}

.styled-table.bookings-table th:nth-child(7),
.styled-table.bookings-table td:nth-child(7) { /* Подтверждено */
  width: 10%;
  min-width: 80px;
  max-width: 120px;
}

.styled-table.bookings-table th:nth-child(8),
.styled-table.bookings-table td:nth-child(8) { /* Контактный телефон */
  width: 12%;
  min-width: 70px;
  max-width: 100px;
}

.styled-table.bookings-table th:nth-child(9),
.styled-table.bookings-table td:nth-child(9) { /* Фото */
  width: 8%;
  min-width: 60px;
  max-width: 80px;
}

.styled-table.bookings-table th:nth-child(10),
.styled-table.bookings-table td:nth-child(10) { /* Действия */
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
  border: 2px solid #ffc107 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-image:hover {
  border-color: #e0a800 !important;
  transform: scale(1.03);
}

.no-data {
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
  color: #ffffff !important;
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
  font-weight: bold;
  color: #ffffff !important;
  background: linear-gradient(135deg, #ffc107, #e0a800) !important;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.pagination button:disabled {
  background: #6b7280 !important;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination button:hover:not(:disabled) {
  background: linear-gradient(135deg, #e0a800, #b38800) !important;
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.pagination span {
  color: #ffffff !important;
  font-weight: bold;
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
  background: linear-gradient(135deg, #ffc107, #e0a800) !important;
  color: #ffffff !important;
  font-size: 1rem;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  background: linear-gradient(135deg, #e0a800, #b38800) !important;
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.view-icon:hover {
  background: #17a2b8 !important;
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

  .styled-table.bookings-table th,
  .styled-table.bookings-table td {
    padding: 6px;
    font-size: 0.8rem;
  }

  .bookings-table th,
  .bookings-table td {
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
