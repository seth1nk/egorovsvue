<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <div class="app-container">
      <h1 class="page-title">Список продаж</h1>
      <div class="table-container">
        <table class="styled-table sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя клиента</th>
              <th>Комментарий</th>
              <th>Адрес доставки</th>
              <th>Способ оплаты</th>
              <th>Год продажи</th>
              <th>Подтверждена</th>
              <th>Номер заказа</th>
              <th>Фото</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in sales" :key="item.id">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ item.customerName || 'N/A' }}</td>
              <td>{{ item.notes || 'N/A' }}</td>
              <td>{{ item.deliveryAddress || 'N/A' }}</td>
              <td>{{ item.paymentMethod || 'N/A' }}</td>
              <td>{{ item.saleYear || 'N/A' }}</td>
              <td>
                <span :class="['status', getStatusClass(item.isConfirmed)]">
                  {{ item.isConfirmed ? 'Подтверждена' : 'Не подтверждена' }}
                </span>
              </td>
              <td>{{ item.orderNumber || 'N/A' }}</td>
              <td>
                <img v-if="item.photo" :src="`${backendUrl}${item.photo}`" alt="Sale Photo" class="product-image" />
                <span v-else>N/A</span>
              </td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/view-sales/${item.id}`" class="action-btn view-icon"><i class="fas fa-eye"></i></router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!sales.length" class="no-data">Нет продаж</p>
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
      sales: [],
      currentPage: 1,
      totalPages: 0,
      pageSize: 10,
      backendUrl: 'http://localhost:3000',
    };
  },
  async created() {
    await this.fetchSales();
  },
  methods: {
    async fetchSales() {
      try {
        const response = await fetch(`${this.backendUrl}/api/sales?page=${this.currentPage}`, {
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
        this.sales = data.sales || [];
        this.totalPages = data.totalPages || 0;
        this.currentPage = data.currentPage || 1;
      } catch (err) {
        console.error('Ошибка при получении продаж:', err);
        this.sales = [];
        this.totalPages = 0;
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchSales();
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchSales();
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

.table-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: auto;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.styled-table.sales-table {
  width: 100%;
  min-width: 800px;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
}

.styled-table.sales-table th,
.styled-table.sales-table td {
  padding: 10px 8px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  border-right: 1px solid rgba(6, 182, 212, 0.3);
  white-space: normal;
  word-break: break-word;
  color: #e0e0e0;
  font-size: 0.85rem;
}

.styled-table.sales-table th {
  background: rgba(16, 185, 129, 0.3);
  color: #e0e0e0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.styled-table.sales-table th:last-child,
.styled-table.sales-table td:last-child {
  border-right: none;
}

.styled-table.sales-table tbody tr:last-child td {
  border-bottom: none;
}

.styled-table.sales-table tbody tr:nth-child(even) {
  background: rgba(6, 182, 212, 0.05);
}

.styled-table.sales-table tbody tr:hover {
  background: rgba(6, 182, 212, 0.2);
  transition: background 0.3s ease;
}

.styled-table.sales-table th:nth-child(1),
.styled-table.sales-table td:nth-child(1) { /* ID */
  width: 5%;
  min-width: 40px;
  max-width: 60px;
}

.styled-table.sales-table th:nth-child(2),
.styled-table.sales-table td:nth-child(2) { /* Имя клиента */
  width: 15%;
  min-width: 80px;
  max-width: 120px;
}

.styled-table.sales-table th:nth-child(3),
.styled-table.sales-table td:nth-child(3) { /* Комментарий */
  width: 20%;
  min-width: 100px;
  max-width: 150px;
}

.styled-table.sales-table th:nth-child(4),
.styled-table.sales-table td:nth-child(4) { /* Адрес доставки */
  width: 15%;
  min-width: 80px;
  max-width: 120px;
}

.styled-table.sales-table th:nth-child(5),
.styled-table.sales-table td:nth-child(5) { /* Способ оплаты */
  width: 10%;
  min-width: 60px;
  max-width: 100px;
}

.styled-table.sales-table th:nth-child(6),
.styled-table.sales-table td:nth-child(6) { /* Год продажи */
  width: 8%;
  min-width: 60px;
  max-width: 80px;
}

.styled-table.sales-table th:nth-child(7),
.styled-table.sales-table td:nth-child(7) { /* Подтверждена */
  width: 10%;
  min-width: 80px;
  max-width: 120px;
}

.styled-table.sales-table th:nth-child(8),
.styled-table.sales-table td:nth-child(8) { /* Номер заказа */
  width: 12%;
  min-width: 70px;
  max-width: 100px;
}

.styled-table.sales-table th:nth-child(9),
.styled-table.sales-table td:nth-child(9) { /* Фото */
  width: 8%;
  min-width: 60px;
  max-width: 80px;
}

.styled-table.sales-table th:nth-child(10),
.styled-table.sales-table td:nth-child(10) { /* Действия */
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
  border: 2px solid #e0f7fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-data {
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
  color: #e0e0e0;
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
  background: #22d3ee;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.pagination button:disabled {
  background: #6b7280;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination button:hover:not(:disabled) {
  background: #06b6d4;
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.pagination span {
  color: #e0e0e0;
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
  background: #22d3ee;
  color: #ffffff;
  font-size: 1rem;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  background: #06b6d4;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.view-icon:hover {
  background: #047857;
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

  .styled-table.sales-table th,
  .styled-table.sales-table td {
    padding: 6px;
    font-size: 0.8rem;
  }

  .sales-table th,
  .sales-table td {
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