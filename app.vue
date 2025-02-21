<template>
  <main class="app-wrapper">
    <h1 class="main-title">Cooking Assistant</h1>
    <div class="page-wrapper">
      <nuxt-page />
    </div>
  </main>
</template>

<style>
main {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.app-wrapper{
  width: 64vw;
  justify-self: center;
}

.page-wrapper{
  background-image: url(./public/images/pngtree-kitchen-in-an-animated-movie-picture-image_3269619.jpg);
  display: flex;
  justify-content: center;
  height: 72vh;
  background-size: cover;
}

  .main-title{
    width: 100vw;
  }
</style>

