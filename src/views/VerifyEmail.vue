```vue
<template>
  <div class="container py-5 fade-in">
    <!-- Top Search Card (API Search) -->
    <div class="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden">
      <div class="card-body p-4 bg-white">
        <div class="row align-items-center">
          <div class="col-md-auto mb-2 mb-md-0">
            <h5 class="mb-0 fw-bold text-dark d-flex align-items-center">
              <i class="bi bi-search text-success me-2"></i> Find External Leads
            </h5>
            <p class="small text-muted mb-0">Search new leads by industry using our lookup API</p>
          </div>
          <div class="col-md">
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-building text-muted"></i>
              </span>
              <input 
                type="text" 
                id="searchIndustry" 
                v-model="searchIndustry" 
                class="form-control border-start-0 border-end-0 bg-light" 
                placeholder="Enter industry (e.g. IT, Real Estate, Healthcare)"
                @keyup.enter="searchLeads"
              >
              <select 
                v-model="searchSource" 
                class="form-select border-start-0 bg-light" 
                style="width: 200px; flex: 0 0 auto;"
              >
                <option value="" disabled selected hidden>Select Source</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <button 
                @click="searchLeads" 
                class="btn btn-success px-4 fw-bold shadow-sm d-flex align-items-center"
                :disabled="isSearchingLeads"
              >
                <span v-if="isSearchingLeads" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-cloud-arrow-down-fill me-2"></i>
                {{ isSearchingLeads ? 'Searching...' : 'Search Leads' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leads Dashboard Card -->
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
      <div class="card-header bg-gradient-success text-white p-4">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0 fw-bold"><i class="bi bi-shield-lock-fill me-2"></i> Leads Dashboard</h4>
            <p class="mb-0 small opacity-75">Manage and verify your collected leads</p>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="local-filter d-none d-lg-block">
              <div class="input-group input-group-sm rounded-pill overflow-hidden bg-white bg-opacity-10 border border-white border-opacity-25">
                <span class="input-group-text bg-transparent border-0 text-white">
                  <i class="bi bi-funnel"></i>
                </span>
                <input 
                  type="text" 
                  v-model="tableSearch" 
                  class="form-control bg-transparent border-0 text-white placeholder-white-50" 
                  placeholder="Filter table..."
                  style="width: 200px;"
                >
                <span v-if="tableSearch" @click="tableSearch = ''" class="input-group-text bg-transparent border-0 text-white cursor-pointer">
                  <i class="bi bi-x-circle-fill"></i>
                </span>
              </div>
            </div>
            <span class="badge bg-white text-success rounded-pill px-3 py-2">
              {{ tableSearch ? filteredUsers.length + ' / ' : '' }}{{ users.length }} Leads
            </span>
          </div>
        </div>
      </div>

      <div class="card-body p-0">
        <!-- Mobile Table Filter (Only visible on small screens) -->
        <div class="p-3 bg-light border-bottom d-lg-none">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0 text-muted">
              <i class="bi bi-funnel"></i>
            </span>
            <input 
              type="text" 
              v-model="tableSearch" 
              class="form-control border-start-0" 
              placeholder="Filter leads by email or industry..."
            >
          </div>
        </div>

        <div v-if="loading" class="text-center p-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Fetching leads...</p>
        </div>
        <div v-else-if="error" class="text-center p-5 text-danger">
            <i class="bi bi-exclamation-triangle-fill fs-1"></i>
            <p class="mt-2">{{ error }}</p>
            <button @click="fetchLeads" class="btn btn-outline-danger btn-sm mt-3">Retry</button>
        </div>
        <div v-else class="table-responsive">
          <table v-if="filteredUsers.length > 0" class="table table-hover align-middle mb-0">
            <thead class="bg-light text-muted small text-uppercase fw-bold">
              <tr>
                <th class="ps-4 py-3">Email</th>
                <th class="py-3">Platform</th>
                <th class="py-3">Industry</th>
                <th class="py-3">Stage</th>
                <th class="py-3">Added On</th>
                <th class="py-3">Source</th>
                <th class="py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.email">
                <td class="ps-4">
                  <div class="d-flex align-items-center fw-semibold text-dark">
                    {{ user.email }}
                    <span v-if="verificationResults[user.email]" class="ms-2">
                       <i v-if="verificationResults[user.email].isValid" class="bi bi-check-circle-fill text-success"></i>
                       <i v-else class="bi bi-x-circle-fill text-danger" :title="verificationResults[user.email].reason"></i>
                    </span>
                  </div>
                </td>
                <td><span class="badge bg-light text-dark border">{{ user.platform }}</span></td>
                <td>{{ user.industry }}</td>
                <td>
                    <span class="badge" :class="getStageBadgeClass(user.leadStage)">{{ user.leadStage }}</span>
                </td>
                <td class="small text-muted">{{ formatDate(user.addedOn) }}</td>
                <td>
                    <a v-if="user.sourceUrl" :href="user.sourceUrl" target="_blank" class="btn btn-sm btn-light border" title="View Source">
                        <i class="bi bi-link-45deg"></i> Link
                    </a>
                </td>
                <td class="text-center pe-4">
                  <div class="d-flex gap-2 justify-content-center">
                    <button 
                      v-if="shouldShowVerify(user.leadStage)"
                      @click="verifyEmail(user.email)" 
                      class="btn btn-sm btn-outline-success rounded-pill px-3" 
                      :disabled="isVerifying === user.email"
                    >
                      <span v-if="isVerifying === user.email" class="spinner-border spinner-border-sm me-1" role="status"></span>
                      {{ isVerifying === user.email ? 'Verifying' : 'Verify' }}
                    </button>
                    <button 
                      v-if="shouldShowSend(user.leadStage)"
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
          <div v-else class="text-center p-5">
            <i class="bi bi-search fs-1 text-muted"></i>
            <p class="mt-2 text-muted">No leads match your search criteria.</p>
            <button @click="tableSearch = ''" class="btn btn-link text-success">Clear Filter</button>
          </div>
        </div>
      </div>
      
      <!-- Pagination Controls -->
      <div v-if="!loading && !error && users.length > 0" class="card-footer bg-white p-3 d-flex justify-content-between align-items-center border-top">
        <div class="small text-muted">
            Showing {{ itemsStart }} to {{ itemsEnd }} of {{ filteredUsers.length }} entries
            <span v-if="tableSearch"> (filtered from {{ users.length }})</span>
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li 
                v-for="page in displayedPages" 
                :key="page" 
                class="page-item" 
                :class="{ active: currentPage === page, disabled: page === '...' }"
            >
              <a class="page-link" href="#" @click.prevent="page !== '...' && changePage(page)">{{ page }}</a>
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
            <h5 class="modal-title fw-bold"><i class="bi bi-envelope-paper-fill me-2"></i> Send Email to Lead</h5>
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

    <!-- Toast Container -->
    <div id="toastContainer" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Modal } from 'bootstrap';
import initialTemplateData from '../data/template.json';
// Import email styles as a string
import emailStyles from '../data/email.css?inline';

const users = ref([]);
const loading = ref(true);
const error = ref(null);

const isVerifying = ref(null);
const verificationResults = ref({});

const searchIndustry = ref('');
const searchSource = ref('');
const tableSearch = ref('');
const isSearchingLeads = ref(false);

// Pagination Logic
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredUsers = computed(() => {
  if (!tableSearch.value.trim()) return users.value;
  
  const query = tableSearch.value.toLowerCase().trim();
  return users.value.filter(user => {
    return (
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.platform && user.platform.toLowerCase().includes(query)) ||
      (user.industry && user.industry.toLowerCase().includes(query)) ||
      (user.leadStage && user.leadStage.toLowerCase().includes(query))
    );
  });
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const itemsStart = computed(() => filteredUsers.value.length === 0 ? 0 : ((currentPage.value - 1) * itemsPerPage) + 1);
const itemsEnd = computed(() => Math.min(currentPage.value * itemsPerPage, filteredUsers.value.length));

const displayedPages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = current - delta; i <= current + delta; i++) {
        if (i < total && i > 1) {
            range.push(i);
        }
    }

    if (total > 1) {
        range.push(total);
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
});


const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getStageBadgeClass = (stage) => {
    switch (stage?.toLowerCase()) {
        case 'new': return 'bg-info bg-opacity-10 text-info border border-info';
        case 'contacted': return 'bg-warning bg-opacity-10 text-warning border border-warning';
        case 'qualified': return 'bg-success bg-opacity-10 text-success border border-success';
        case 'lost': return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
        default: return 'bg-light text-dark border';
    }
};

const shouldShowVerify = (stage) => {
    const lowerStage = stage?.toLowerCase() || '';
    return lowerStage !== 'verified' && lowerStage !== 'contacted';
};

const shouldShowSend = (stage) => {
    const lowerStage = stage?.toLowerCase() || '';
    return lowerStage !== 'contacted';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const fetchLeads = async () => {
    loading.value = true;
    error.value = null;
    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        
        const response = await fetch(`${baseUrl}/api/Lead/v1/GetLeadsFromSheet`);
        if (!response.ok) {
            throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data && data.leads) {
            users.value = data.leads;
        } else {
            users.value = [];
        }
    } catch (err) {
        console.error("Error fetching leads:", err);
        error.value = err.message || "An unexpected error occurred.";
    } finally {
        loading.value = false;
    }
};

// Watch tableSearch to reset pagination
watch(tableSearch, () => {
    currentPage.value = 1;
});

const searchLeads = async () => {
    if (!searchIndustry.value.trim()) {
        showToast('Please enter an industry to search', 'warning');
        return;
    }
    
    if (!searchSource.value) {
        showToast('Please select a source', 'warning');
        return;
    }

    isSearchingLeads.value = true;
    try {
        const response = await fetch('/api/Lead/v1/LookingUp_Leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                industry: searchIndustry.value.trim(),
                source: searchSource.value
            })
        });

        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Display API response message and total emails in toaster
        const toastMsg = `${data.Reason || 'Successfully Searched Leads'} (Total Emails: ${data.totalEmails ?? 0})`;
        showToast(toastMsg, data.Status === 'Success' ? 'success' : 'info');
    } catch (err) {
        console.error("Error searching leads:", err);
        showToast(err.message || "An error occurred during search", 'danger');
    } finally {
        isSearchingLeads.value = false;
    }
};

const verifyEmail = async (email) => {
  isVerifying.value = email;
  
  try {
    // Using relative path to leverage the Vite proxy configured in vite.config.js
    const response = await fetch('/api/Lead/v1/Verify_Email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Assuming the API expects the email in the body with key 'Email'
        body: JSON.stringify({ Email: email })
    });
    
    if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check if Classification is 'Deliverable'
    if (data.Status === 'Error') {
        showToast(data.Reason || 'An error occurred during verification', 'danger');
        verificationResults.value[email] = { isValid: false, reason: data.Reason };
        return;
    }

    const isValid = data.Classification === 'Deliverable';
    
    verificationResults.value[email] = { 
        isValid: isValid, 
        reason: isValid ? 'Valid email' : (data.Reason || data.Classification || 'Invalid')
    };
    
    if (isValid) {
        showToast(`Email ${email} verified successfully`, 'success');
    } else if (data.Classification === 'Undeliverable') {
        showToast(`Email ${email} is Undeliverable`, 'warning');
    } else {
        showToast(`Email ${email} is ${data.Classification || 'Invalid'}`, 'warning');
    }

  } catch (error) {
    console.error("Error verifying email:", error);
    verificationResults.value[email] = { isValid: false, reason: "Verification error" };
    showToast(error.message, 'danger');
  } finally {
    isVerifying.value = null;
  }
};

const showToast = (message, type = 'info') => {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0 show`;
    toastEl.role = 'alert';
    toastEl.ariaLive = 'assertive';
    toastEl.ariaAtomic = 'true';
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
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
  fetchLeads();
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
    
    const processReplacements = (text) => {
        let processed = text;
        // Basic Lead Info
        processed = processed.replace(/{{name}}/g, user.name || '');
        processed = processed.replace(/{{company}}/g, user.company || user.industry || 'Your Company');
        
        // Sender/Company Info
        processed = processed.replace(/{{calendly_link}}/g, 'https://calendly.com/demo-user');
        processed = processed.replace(/{{sender_name}}/g, template.sender_name || 'Alex Admin');
        processed = processed.replace(/{{sender_title}}/g, 'Account Executive');
        
        const companyName = template.company_name || 'Prime Cloud Technology';
        const companyWebsite = template.company_website || '#';
        
        processed = processed.replace(/{{company_name}}/g, companyName);
        processed = processed.replace(/{{our_company_name}}/g, companyName); // User requested variation
        
        processed = processed.replace(/{{company_website}}/g, companyWebsite);
        processed = processed.replace(/{{our_company_website}}/g, companyWebsite); // User requested variation
        
        return processed;
    };

    emailSubject.value = processReplacements(template.subject);
    emailBody.value = processReplacements(template.message);
    
    emailModalInstance.show();
};

const sendEmail = async () => {
    isSending.value = true;
    try {
        // Construct full HTML body with styles
        const fullHtmlBody = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${emailStyles}
</style>
</head>
<body>
${emailBody.value}
</body>
</html>`;

        // Using relative path to leverage the Vite proxy
        const response = await fetch('/api/Lead/Sending_Email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ToEmail: selectedUser.value.email,
                Subject: emailSubject.value,
                Body: fullHtmlBody
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to send email: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Assuming API returns a success indicator, if not explicitly check, rely on 200 OK
        // Adjust this check based on actual API response structure if needed
        if (data.Status === 'Error') {
             throw new Error(data.Reason || 'Email sending failed');
        }

        emailModalInstance.hide();
        showToast(`Email successfully sent to ${selectedUser.value.email}!`, 'success');
        
    } catch (e) {
        console.error("Error sending email:", e);
        showToast(e.message || 'Failed to send email.', 'danger');
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

.cursor-pointer {
    cursor: pointer;
}

.placeholder-white-50::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.local-filter .form-control:focus {
    box-shadow: none;
    background-color: rgba(255, 255, 255, 0.2) !important;
}

/* Fix Input Group Focus Outline */
.input-group:focus-within {
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
    border-radius: 0.5rem;
    transition: all 0.2s ease-in-out;
    z-index: 10;
}

.input-group:focus-within .input-group-text,
.input-group:focus-within .form-control,
.input-group:focus-within .form-select,
.input-group:focus-within .btn {
    border-color: #0f5132 !important; /* Darker green for better contrast */
    z-index: 1 !important;
}

.form-control:focus, .btn:focus {
    box-shadow: none !important;
    outline: none !important;
}

/* Header Filter Focus Fix (On Green/Teal Gradient) */
.local-filter .input-group:focus-within {
    box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.4);
    border-color: #ffffff !important; /* Solid white border for maximum contrast */
    background-color: rgba(255, 255, 255, 0.15) !important;
}

.local-filter .input-group:focus-within .input-group-text,
.local-filter .input-group:focus-within .form-control {
    border-color: #ffffff !important;
    color: #ffffff !important;
}
</style>

```
