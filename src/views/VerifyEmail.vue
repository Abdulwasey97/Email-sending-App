```vue
<template>
  <div class="container py-5 fade-in">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
      <div class="card-header bg-gradient-success text-white p-4 d-flex justify-content-between align-items-center">
        <h4 class="mb-0 fw-bold"><i class="bi bi-shield-lock-fill me-2"></i> Email Verifier Dashboard</h4>
        <span class="badge bg-white text-success rounded-pill px-3 py-2">{{ users.length }} Contacts</span>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-muted small text-uppercase fw-bold">
              <tr>
                <th class="ps-4 py-3">Name</th>
                <th class="py-3">Email</th>
                <th class="py-3">Company</th>
                <th class="py-3">Location</th>
                <th class="py-3">City</th>
                <th class="py-3">Country</th>
                <th class="py-3">Website</th>
                <th class="py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.email">
                <td class="ps-4 fw-semibold text-dark">{{ user.name }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    {{ user.email }}
                    <span v-if="verificationResults[user.email]" class="ms-2">
                       <i v-if="verificationResults[user.email].isValid" class="bi bi-check-circle-fill text-success"></i>
                       <i v-else class="bi bi-x-circle-fill text-danger" :title="verificationResults[user.email].reason"></i>
                    </span>
                  </div>
                </td>
                <td>{{ user.company }}</td>
                <td>{{ user.location }}</td>
                <td>{{ user.city }}</td>
                <td>{{ user.country }}</td>
                <td><a :href="'https://' + user.website" target="_blank" class="text-decoration-none text-info">{{ user.website }}</a></td>
                <td class="text-center pe-4">
                  <div class="d-flex gap-2 justify-content-center">
                    <button 
                      @click="verifyEmail(user.email)" 
                      class="btn btn-sm btn-outline-success rounded-pill px-3" 
                      :disabled="isVerifying === user.email"
                    >
                      <span v-if="isVerifying === user.email" class="spinner-border spinner-border-sm me-1" role="status"></span>
                      {{ isVerifying === user.email ? 'Verifying' : 'Verify' }}
                    </button>
                    <button 
                      @click="openEmailModal(user)" 
                      class="btn btn-sm btn-primary rounded-pill px-3"
                    >
                      <i class="bi bi-envelope-fill me-1"></i> Send
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pagination Controls -->
      <div class="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
        <div class="small text-muted">
            Showing {{ itemsStart }} to {{ itemsEnd }} of {{ users.length }} entries
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li 
                v-for="page in totalPages" 
                :key="page" 
                class="page-item" 
                :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(currentPage + 1)">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Email Modal -->
    <div class="modal fade" id="emailModal" tabindex="-1" aria-hidden="true" ref="emailModalRef">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header bg-primary text-white p-4 border-0">
            <h5 class="modal-title fw-bold"><i class="bi bi-envelope-paper-fill me-2"></i> Send Email to {{ selectedUser?.name }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4 bg-light">
             <div class="mb-3">
                <label class="form-label text-muted small fw-bold text-uppercase">To</label>
                <div class="form-control-plaintext border-bottom">{{ selectedUser?.email }}</div>
             </div>
             <div class="mb-3">
                <label class="form-label text-muted small fw-bold text-uppercase">Subject</label>
                <div class="form-control fw-bold">{{ emailSubject }}</div>
             </div>
             <div class="mb-3">
                <label class="form-label text-muted small fw-bold text-uppercase">Message</label>
                <textarea class="form-control" rows="12" v-model="emailBody"></textarea>
             </div>
          </div>
          <div class="modal-footer border-0 p-4 bg-light">
            <button type="button" class="btn btn-light text-muted fw-bold" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary px-4 rounded-pill shadow-sm" @click="sendEmail" :disabled="isSending">
                <span v-if="isSending" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isSending ? 'Sending...' : 'Send Email' }} <i class="bi bi-send-fill ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import initialTemplateData from '../data/template.json';

// Extended dummy data for pagination demonstration
const users = ref([
  { name: 'John Doe', email: 'john@example.com', company: 'TechCorp', location: 'North America', city: 'New York', country: 'USA', website: 'techcorp.com' },
  { name: 'Jane Smith', email: 'jane.invalid@test.com', company: 'DesignHub', location: 'Europe', city: 'London', country: 'UK', website: 'designhub.io' },
  { name: 'Alex Rivera', email: 'alex.error@company.org', company: 'SoftSystems', location: 'South America', city: 'Sao Paulo', country: 'Brazil', website: 'softsys.org' },
  { name: 'Sarah Chen', email: 'sarah@global.net', company: 'Global Logistics', location: 'Asia', city: 'Singapore', country: 'Singapore', website: 'globallogistics.sg' },
  { name: 'Michael Brown', email: 'michael@fintech.io', company: 'FinTech Sol', location: 'North America', city: 'San Francisco', country: 'USA', website: 'fintech.io' },
  { name: 'Emily Davis', email: 'emily@creative.net', company: 'Creative Minds', location: 'Europe', city: 'Paris', country: 'France', website: 'creativeminds.fr' },
  { name: 'David Wilson', email: 'david@cloud.com', company: 'Cloud Nine', location: 'Australia', city: 'Sydney', country: 'Australia', website: 'cloudnine.au' },
  { name: 'Lisa Taylor', email: 'lisa@medtech.org', company: 'MedTech Inc', location: 'North America', city: 'Toronto', country: 'Canada', website: 'medtech.ca' },
  { name: 'Robert Miller', email: 'robert@auto.de', company: 'AutoWorks', location: 'Europe', city: 'Berlin', country: 'Germany', website: 'autoworks.de' },
  { name: 'Emma Wilson', email: 'emma@retail.co.uk', company: 'Retail Giant', location: 'Europe', city: 'Manchester', country: 'UK', website: 'retailgiant.co.uk' },
  { name: 'James Anderson', email: 'james@cyber.net', company: 'CyberSec', location: 'North America', city: 'Austin', country: 'USA', website: 'cybersec.net' },
  { name: 'Sophia Martinez', email: 'sophia@arch.es', company: 'Architectura', location: 'Europe', city: 'Madrid', country: 'Spain', website: 'architectura.es' }
]);

const isVerifying = ref(null);
const verificationResults = ref({});

// Pagination Logic
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return users.value.slice(start, end);
});

const itemsStart = computed(() => ((currentPage.value - 1) * itemsPerPage) + 1);
const itemsEnd = computed(() => Math.min(currentPage.value * itemsPerPage, users.value.length));

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const verifyEmail = async (email) => {
  isVerifying.value = email;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const emailLower = email.toLowerCase();
    if (emailLower.includes('error')) {
      verificationResults.value[email] = { isValid: false, reason: "Simulated verification failure." };
    } else if (emailLower.includes('invalid')) {
      verificationResults.value[email] = { isValid: false, reason: "Domain does not exist." };
    } else {
      verificationResults.value[email] = { isValid: true };
    }
  } catch (error) {
    console.error(error);
  } finally {
    isVerifying.value = null;
  }
};

// Email Sending Logic
const emailModalRef = ref(null);
let emailModalInstance = null;
const selectedUser = ref(null);
const emailSubject = ref('');
const emailBody = ref('');
const isSending = ref(false);

onMounted(() => {
  emailModalInstance = new Modal(emailModalRef.value);
});

const getTemplateData = () => {
    const savedData = localStorage.getItem('emailTemplateConfig');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return initialTemplateData;
};

const openEmailModal = (user) => {
    selectedUser.value = user;
    const template = getTemplateData();
    
    emailSubject.value = template.subject;
    
    // Dynamic replacement
    let message = template.message;
    message = message.replace(/{{name}}/g, user.name);
    message = message.replace(/{{company}}/g, user.company);
    
    // Mock Sender Data replacement
    message = message.replace(/{{calendly_link}}/g, 'https://calendly.com/demo-user');
    message = message.replace(/{{sender_name}}/g, template.sender_name || 'Alex Admin');
    message = message.replace(/{{sender_title}}/g, 'Account Executive');
    
    emailBody.value = message;
    
    emailModalInstance.show();
};

const sendEmail = async () => {
    isSending.value = true;
    try {
        // Mock API latency
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        emailModalInstance.hide();
        alert(`Email successfully sent to ${selectedUser.value.email}!`);
        
    } catch (e) {
        alert('Failed to send email.');
    } finally {
        isSending.value = false;
    }
};

</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.bg-gradient-success {
    background: linear-gradient(135deg, #42e695 0%, #3bb2b8 100%);
}

.table thead th {
  border-top: none;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: rgba(66, 230, 149, 0.05);
}

.btn-outline-success {
  border-color: #42e695;
  color: #3bb2b8;
}

.btn-outline-success:hover {
  background: linear-gradient(135deg, #42e695 0%, #3bb2b8 100%);
  border-color: transparent;
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  filter: brightness(110%);
}


/* Pagination Styling Override */
.page-link {
    color: #3bb2b8;
    border: none;
    margin: 0 2px;
    border-radius: 5px;
}

.page-link:hover {
    color: #2a8f94;
    background-color: #e6f7f8;
}

.page-item.active .page-link {
    background-color: #3bb2b8;
    border-color: #3bb2b8;
    color: white;
}

.page-item.disabled .page-link {
    color: #ccc;
    background-color: transparent;
}
</style>
```
