<template>
  <main>
    <div class="container">
      <h1 class="page-title">О магазине телевизоров</h1>

      <!-- Блок 1: Широкий ассортимент -->
      <div class="content-block fade-in" ref="block1">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="md:w-1/2 text-block">
            <h2 class="text-2xl font-bold mb-4">Широкий ассортимент</h2>
            <p class="fs-5">
              Мы предлагаем телевизоры различных брендов, размеров и технологий для любых потребностей.
            </p>
          </div>
          <div class="md:w-1/2 image-block">
            <img src="/images/11.png" alt="Широкий ассортимент" class="img-block">
          </div>
        </div>
      </div>

      <!-- Блок 2: Высокое качество продукции -->
      <div class="content-block fade-in" ref="block2">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="md:w-1/2 image-block order-2 md:order-1">
            <img src="/images/22.png" alt="Высокое качество продукции" class="img-block">
          </div>
          <div class="md:w-1/2 text-block order-1 md:order-2">
            <h2 class="text-2xl font-bold mb-4">Высокое качество продукции</h2>
            <p class="fs-5">
              Все телевизоры проходят проверку качества и имеют официальную гарантию.
            </p>
          </div>
        </div>
      </div>

      <!-- Блок 3: Индивидуальный подход -->
      <div class="content-block fade-in" ref="block3">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="md:w-1/2 text-block">
            <h2 class="text-2xl font-bold mb-4">Индивидуальный подход</h2>
            <p class="fs-5">
              Наши консультанты помогут выбрать телевизор, учитывая ваши предпочтения и бюджет.
            </p>
          </div>
          <div class="md:w-1/2 image-block">
            <img src="/images/33.jpg" alt="Индивидуальный подход" class="img-block">
          </div>
        </div>
      </div>

      <!-- Блок 4: Быстрая доставка -->
      <div class="content-block fade-in" ref="block4">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="md:w-1/2 image-block order-2 md:order-1">
            <img src="/images/44.png" alt="Быстрая доставка" class="img-block">
          </div>
          <div class="md:w-1/2 text-block order-1 md:order-2">
            <h2 class="text-2xl font-bold mb-4">Быстрая доставка</h2>
            <p class="fs-5">
              Доставка и установка телевизоров в кратчайшие сроки для вашего удобства.
            </p>
          </div>
        </div>
      </div>

      <!-- Блок 5: Поддержка клиентов -->
      <div class="content-block fade-in" ref="block5">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="md:w-1/2 text-block">
            <h2 class="text-2xl font-bold mb-4">Поддержка клиентов</h2>
            <p class="fs-5">
              Мы предоставляем консультации и поддержку на всех этапах покупки.
            </p>
          </div>
          <div class="md:w-1/2 image-block">
            <img src="/images/55.jpg" alt="Поддержка клиентов" class="img-block">
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'AboutPage',
  mounted() {
    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      this.$el.querySelectorAll('.fade-in').forEach((el) => {
        observer.observe(el);
      });
    } catch (err) {
      console.error('Error setting up IntersectionObserver:', err);
    }
  }
}
</script>

<style scoped>
body {
  background: #e5e7eb;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.fs-5 {
  font-size: 1.25rem;
  color: #4b5563;
}

.text-center {
  text-align: center;
}

.content-block {
  margin-bottom: 3rem;
}

.text-block {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.text-2xl {
  font-size: 1.5rem;
  color: #1f2937;
}

.font-bold {
  font-weight: 700;
}

.mb-4 {
  margin-bottom: 1rem;
}

.image-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.img-block {
  max-width: 500px;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .img-block {
    max-width: 120px;
  }

  .fs-5 {
    font-size: 1rem;
  }

  .text-2xl {
    font-size: 1.25rem;
  }
}
</style>