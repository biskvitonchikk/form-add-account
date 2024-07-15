<template>
  <q-form class="account-form q-pa-md">
    <div class="row items-center q-mb-md">
      <h2 class="text-h6 q-my-none">Учетные записи</h2>
      <q-btn
        flat
        round
        color="primary"
        icon="add"
        @click="addNewAccount"
        class="q-ml-sm"
      />
    </div>

    <q-banner class="bg-blue-1 text-black q-mb-md">
      <template v-slot:avatar>
        <q-icon name="info" color="primary" />
      </template>
      Для указания нескольких меток для одной пары логин/пароль используйте
      разделитель ;
    </q-banner>

    <div v-for="account in accounts" :key="account.id" class="q-mb-md">
      <AccountItem :account="account" />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAccountStore } from "@/stores/accountStore";
import AccountItem from "@/components/AccountItem.vue";

const store = useAccountStore();
const { accounts } = storeToRefs(store);

const addNewAccount = () => {
  store.addAccount();
};

onMounted(() => {
  store.loadAccounts();
});
</script>

<style lang="scss" scoped>
.account-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
