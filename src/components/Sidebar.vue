<template>
  <div class="d-flex flex-column flex-shrink-0 p-3 sidebar-container" :class="{ 'collapsed': isCollapsed }">
    <div class="logo-area d-flex align-items-center mb-4 text-white text-decoration-none">
      <div class="icon-wrapper d-flex align-items-center justify-content-center bg-gradient-primary shadow-lg rounded-circle">
          <i class="bi bi-envelope-open-heart-fill fs-5"></i>
      </div>
      <div class="app-name ms-3 fw-bold" v-if="!isCollapsed">
        <span class="text-primary-light">Send </span>Email
      </div>
    </div>
    
    <ul class="nav nav-pills flex-column mb-auto gap-2">
      <li class="nav-item">
        <router-link to="/send" class="nav-link d-flex align-items-center" active-class="active" :title="isCollapsed ? 'Default Template' : ''">
          <i class="bi bi-file-earmark-richtext-fill icon-fixed"></i>
          <span class="ms-3 label-text" v-if="!isCollapsed">Default Template</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/verify" class="nav-link d-flex align-items-center" active-class="active" :title="isCollapsed ? 'Verify Email' : ''">
          <i class="bi bi-shield-check-fill icon-fixed"></i>
          <span class="ms-3 label-text" v-if="!isCollapsed">Leads</span>
        </router-link>
      </li>
    </ul>

    <div class="toggle-area mt-auto">
      <button class="btn btn-toggle w-100 d-flex align-items-center justify-content-center p-2" @click="toggleSidebar">
        <i class="bi bi-chevron-left toggle-icon" :class="{ 'rotated': isCollapsed }"></i>
        <span class="ms-2 small text-uppercase fw-bold letter-spacing-1" v-if="!isCollapsed"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
/* Variables */
:root {
  --sidebar-width: 260px;
  --sidebar-width-collapsed: 80px;
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --sidebar-bg: #1e1e2d;
  --sidebar-bg-secondary: #2a2a3c;
  --active-color: #ffffff;
  --text-muted: #a2a3b7;
}

.sidebar-container {
  width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  background-color: #1e1e2d;
  background-image: linear-gradient(to bottom, #1e1e2d, #151521);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-container.collapsed {
  width: 90px;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

/* Logo Area */
.logo-area {
  height: 60px;
  overflow: hidden;
  white-space: nowrap;
}

.icon-wrapper {
  width: 45px;
  height: 45px;
  min-width: 45px;
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
  color: white;
  transition: transform 0.3s ease;
}

.sidebar-container:not(.collapsed) .icon-wrapper:hover {
    transform: rotate(10deg) scale(1.1);
}

.app-name {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
  color: #fff;
  opacity: 1;
  transition: opacity 0.3s ease 0.1s;
}

.text-primary-light {
    color: #4facfe;
}

/* Nav Link Styling */
.nav-link {
  color: #a2a3b7;
  padding: 12px 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.nav-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.nav-link.active {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
  transform: translateX(0);
}

.icon-fixed {
  font-size: 1.3rem;
  width: 24px;
  text-align: center;
  display: inline-block;
}

.label-text {
    font-weight: 500;
}

/* Toggle Button */
.btn-toggle {
    color: #a2a3b7;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: all 0.3s ease;
}

.btn-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.toggle-icon {
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toggle-icon.rotated {
    transform: rotate(180deg);
}

.letter-spacing-1 {
    letter-spacing: 1px;
}

/* Collapsed State Overrides */
.sidebar-container.collapsed .app-name,
.sidebar-container.collapsed .label-text,
.sidebar-container.collapsed .small {
  opacity: 0;
  width: 0;
  display: none;
}

.sidebar-container.collapsed .nav-link {
    justify-content: center;
    padding: 12px 0;
}

.sidebar-container.collapsed .nav-link:hover {
    transform: none; /* Disable shift on collapsed for cleaner look */
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
