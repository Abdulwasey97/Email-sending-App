<template>
  <div class="container py-5 fade-in">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-7">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="card-header bg-gradient-primary text-white p-4">
            <h4 class="mb-0 fw-bold"><i class="bi bi-file-earmark-richtext-fill me-2"></i> Default Template</h4>
            <p class="mb-0 opacity-75 small">Manage your default email template</p>
          </div>
          <div class="card-body p-4 p-md-5 bg-white">
            
            <!-- Custom Success Alert -->
            <transition name="fade">
              <div v-if="successMessage" class="alert custom-alert alert-success d-flex align-items-center role-alert">
                <i class="bi bi-check-circle-fill fs-4 me-3"></i>
                <div>
                  <strong>Success!</strong> {{ successMessage }}
                </div>
                <button type="button" class="btn-close ms-auto" @click="successMessage = ''"></button>
              </div>
            </transition>

            <!-- Custom Error Alert -->
             <transition name="fade">
              <div v-if="errorMessage" class="alert custom-alert alert-danger d-flex align-items-center role-alert">
                <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                <div>
                  <strong>Error!</strong> {{ errorMessage }}
                </div>
                <button type="button" class="btn-close ms-auto" @click="errorMessage = ''"></button>
              </div>
            </transition>

            <form @submit.prevent="saveTemplate" class="needs-validation">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="email" class="form-control" id="fromEmail" v-model="form.from" required placeholder="name@example.com">
                    <label for="fromEmail"><i class="bi bi-person me-1"></i> From Email</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="senderName" v-model="form.sender_name" placeholder="John Doe">
                    <label for="senderName"><i class="bi bi-person-badge me-1"></i> Sender Name</label>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="companyName" v-model="form.company_name" placeholder="Your Company">
                    <label for="companyName"><i class="bi bi-building me-1"></i> Your Company Name</label>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-floating">
                    <input type="text" class="form-control" id="companyWebsite" v-model="form.company_website" placeholder="www.example.com">
                    <label for="companyWebsite"><i class="bi bi-globe me-1"></i> Your Company Website</label>
                  </div>
                </div>
                
                <div class="col-12">
                   <div class="form-floating">
                    <input type="text" class="form-control" id="subject" v-model="form.subject" placeholder="Subject">
                    <label for="subject"><i class="bi bi-chat-text me-1"></i> Subject</label>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-floating">
                    <textarea class="form-control" id="message" placeholder="Leave a message here" style="height: 400px" v-model="form.message"></textarea>
                    <label for="message"><i class="bi bi-text-paragraph me-1"></i> Template Content</label>
                  </div>
                </div>

                <div class="col-12 mt-4">
                  <button class="btn btn-primary btn-lg w-100 send-btn position-relative overflow-hidden" type="submit" :disabled="isSaving">
                    <div class="d-flex align-items-center justify-content-center">
                        <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-if="!isSaving" class="me-2"><i class="bi bi-save"></i></span>
                        <span>{{ isSaving ? 'Saving...' : 'Save Template' }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import initialTemplateData from '../data/template.json';

const form = reactive({
  from: '',
  sender_name: '',
  subject: '',
  company_name: '',
  company_website: '',
  message: ''
});

const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Load data from LocalStorage or fallback to JSON file
onMounted(() => {
  const savedData = localStorage.getItem('emailTemplateConfig');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    form.from = parsed.from;
    form.sender_name = parsed.sender_name || '';
    form.subject = parsed.subject;
    form.company_name = parsed.company_name || '';
    form.company_website = parsed.company_website || '';
    form.message = parsed.message;
  } else {
    // Fallback to the imported JSON file
    form.from = initialTemplateData.from;
    form.sender_name = initialTemplateData.sender_name || '';
    form.subject = initialTemplateData.subject;
    form.company_name = initialTemplateData.company_name || '';
    form.company_website = initialTemplateData.company_website || '';
    form.message = initialTemplateData.message;
  }
});

const saveTemplate = async () => {
  isSaving.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save to LocalStorage to simulate "Saving to JSON" persistence
    const dataToSave = {
      from: form.from,
      sender_name: form.sender_name,
      subject: form.subject,
      company_name: form.company_name,
      company_website: form.company_website,
      message: form.message
    };
    localStorage.setItem('emailTemplateConfig', JSON.stringify(dataToSave));
    
    // Log for demonstration
    console.log('Saved to JSON (simulated):', JSON.stringify(dataToSave, null, 2));

    successMessage.value = `Template saved successfully!`;

  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to save template. Please try again.";
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.form-control:focus {
    border-color: #764ba2;
    box-shadow: 0 0 0 0.25rem rgba(118, 75, 162, 0.25);
}

.form-floating label {
    color: #6c757d;
}

.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label {
    color: #764ba2;
}

.send-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
}

.send-btn:disabled {
    background: #a2a3b7;
}

.custom-alert {
    border: none;
    border-radius: 10px;
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
