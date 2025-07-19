<template>
  <div class="account-management">
    <div v-if="showSuccessMessage" class="success-message">
      {{ successMessage }}
    </div>
    
    <div class="header">
      <h1>Account Management</h1>
      <button @click="addAccount" class="add-button">
        <span>+</span>
      </button>
    </div>

    <div class="hint-section">
      <div class="hint-icon">?</div>
      <p>To specify multiple labels for one login/password pair, use the separator ;</p>
    </div>

    <div class="account-list">
      <div class="account-header">
        <div class="header-cell">Labels</div>
        <div class="header-cell">Record Type</div>
        <div class="header-cell">Login</div>
        <div class="header-cell">Password</div>
        <div class="header-cell actions">Actions</div>
      </div>

      <div 
        v-for="account in accounts" 
        :key="account.id" 
        class="account-row"
      >
        <div class="cell">
          <input
            v-model="account.labels"
            @blur="updateAccount(account.id, { labels: account.labels })"
            type="text"
            placeholder="Enter labels"
            maxlength="50"
            class="input-field"
          />
        </div>
        
        <div class="cell">
          <select
            v-model="account.recordType"
            @change="handleRecordTypeChange(account)"
            class="select-field"
          >
            <option value="Local">Local</option>
            <option value="LDAP">LDAP</option>
          </select>
        </div>
        
        <div class="cell">
          <input
            v-model="account.login"
            @input="validateOnChange(account)"
            @blur="validateAndUpdate(account)"
            type="text"
            placeholder="Enter login"
            maxlength="100"
            :class="['input-field', { 'error': !isValid(account.id).login }]"
          />
        </div>
        
        <div class="cell">
          <div v-if="account.recordType === 'Local'" class="password-container">
            <input
              v-model="account.password"
              @input="validateOnChange(account)"
              @blur="validateAndUpdate(account)"
              :type="passwordVisible[account.id] ? 'text' : 'password'"
              placeholder="Enter password"
              maxlength="100"
              :class="['input-field password-input', { 'error': !isValid(account.id).password }]"
            />
            <button 
              @click="togglePasswordVisibility(account.id)" 
              class="password-toggle"
              type="button"
            >
              <span>{{ passwordVisible[account.id] ? '🙈' : '👁️' }}</span>
            </button>
          </div>
        </div>
        
        <div class="cell actions">
          <button @click="deleteAccount(account.id)" class="delete-button">
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAccountStore } from '@/stores/accountStore'
import type { Account, AccountValidation } from '@/types/account'

const accountStore = useAccountStore()
const accounts = computed(() => accountStore.accounts)
const validations = ref<Record<string, AccountValidation>>({})
const passwordVisible = ref<Record<string, boolean>>({})
const isLoading = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

const addAccount = () => {
  accountStore.addAccount()
  showSuccess('Account added successfully!')
}

const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const togglePasswordVisibility = (id: string) => {
  passwordVisible.value[id] = !passwordVisible.value[id]
}

const handleRecordTypeChange = (account: Account) => {
  if (account.recordType === 'LDAP') {
    account.password = null
  } else if (account.recordType === 'Local' && !account.password) {
    account.password = ''
  }
  
  updateAccount(account.id, { recordType: account.recordType, password: account.password })
  validateOnChange(account)
}

const updateAccount = (id: string, data: any) => {
  accountStore.updateAccount(id, data)
}

const deleteAccount = (id: string) => {
  if (confirm('Are you sure you want to delete this account?')) {
    accountStore.deleteAccount(id)
  }
}

const validateAndUpdate = (account: Account) => {
  const validation: AccountValidation = {
    login: account.login.trim().length > 0,
    password: account.recordType === 'LDAP' || !!(account.password && account.password.trim().length > 0)
  }
  
  validations.value[account.id] = validation
  
  if (validation.login && validation.password) {
    updateAccount(account.id, {
      login: account.login,
      password: account.password
    })
  }
}

const validateOnChange = (account: Account) => {
  const validation: AccountValidation = {
    login: account.login.trim().length > 0,
    password: account.recordType === 'LDAP' || !!(account.password && account.password.trim().length > 0)
  }
  
  validations.value[account.id] = validation
}

const isValid = (id: string) => {
  return validations.value[id] || { login: true, password: true }
}
</script>

<style scoped>
.account-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.success-message {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
}

.add-button {
  background: #42b883;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-button:hover {
  background: #369870;
}

.hint-section {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hint-icon {
  background: #6c757d;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.hint-section p {
  margin: 0;
  color: #6c757d;
}

.account-list {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.account-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 80px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.header-cell {
  padding: 15px;
  font-weight: bold;
  color: #495057;
}

.account-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 80px;
  border-bottom: 1px solid #e9ecef;
}

.account-row:last-child {
  border-bottom: none;
}

.cell {
  padding: 15px;
  display: flex;
  align-items: center;
}

.input-field, .select-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.input-field:focus, .select-field:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.2);
}

.input-field.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.input-field.error::placeholder {
  color: #dc3545;
}

.password-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.password-input {
  flex: 1;
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}

.password-toggle:hover {
  background: #f8f9fa;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}

.delete-button:hover {
  background: #f8f9fa;
}

.actions {
  justify-content: center;
}
</style> 