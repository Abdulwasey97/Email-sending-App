<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Page Content -->
    <div id="page-content-wrapper" class="flex-grow-1">
       <!-- Toggle button for mobile could be added here if needed, but sidebar handles it mostly or we hide it on mobile -->
      <div class="container-fluid p-0">
        <router-view />
      </div>
    </div>
  </div>

</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style>
#wrapper {
  overflow-x: hidden;
  height: 100vh; /* Ensure full height */
  display: flex; /* Ensure sidebar and content are side-by-side */
}

#page-content-wrapper {
  overflow-y: auto; /* Allow content to scroll independently */
  height: 100vh;
}
</style>
