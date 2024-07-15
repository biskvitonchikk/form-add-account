<template>
  <q-card flat class="account-item q-mb-md">
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-input
            v-model="localTags"
            label="Метки"
            dense
            outlined
            :rules="[(val) => val.length <= 50 || 'Максимум 50 символов']"
            @blur="updateAccount"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            v-model="localAccount.type"
            :options="['LDAP', 'Локальная']"
            label="Тип записи"
            dense
            outlined
            @update:model-value="updateAccount"
          />
        </div>
        <div
          :class="
            localAccount.type === 'LDAP'
              ? 'col-12 col-sm-6 col-md-6'
              : 'col-12 col-sm-6 col-md-3'
          "
        >
          <q-input
            v-model="localAccount.login"
            label="Логин"
            dense
            outlined
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 100 || 'Максимум 100 символов',
            ]"
            @blur="updateAccount"
          />
        </div>
        <div
          v-if="localAccount.type === 'Локальная'"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-input
            v-model="localAccount.password"
            :type="isPwdVisible ? 'text' : 'password'"
            label="Пароль"
            dense
            outlined
            :rules="[
              (val) => !!val || 'Обязательное поле',
              (val) => val.length <= 100 || 'Максимум 100 символов',
            ]"
            @blur="updateAccount"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdVisible = !isPwdVisible"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6 col-md-1">
          <q-btn flat round color="grey" icon="delete" @click="deleteAccount" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useAccountStore } from "@/stores/accountStore";
import { Account, AccountUpdate } from "@/types/types";

const props = defineProps<{
  account: Account;
}>();

const store = useAccountStore();

const localAccount = ref<AccountUpdate>({
  tags: props.account.tags,
  type: props.account.type,
  login: props.account.login,
  password: props.account.password,
});

const localTags = ref(props.account.tags.map((tag) => tag.text).join(";"));
const isPwdVisible = ref(false);

watch(
  () => props.account,
  (newAccount) => {
    localAccount.value = {
      tags: newAccount.tags,
      type: newAccount.type,
      login: newAccount.login,
      password: newAccount.password,
    };
    localTags.value = newAccount.tags.map((tag) => tag.text).join(";");
  },
  { deep: true }
);

const updateAccount = () => {
  const updatedAccount: Partial<AccountUpdate> = {
    tags: localTags.value
      .split(";")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")
      .map((tag) => ({ text: tag })),
    type: localAccount.value.type,
    login: localAccount.value.login,
    password:
      localAccount.value.type === "Локальная"
        ? localAccount.value.password
        : null,
  };

  store.updateAccount(props.account.id, updatedAccount);
};

const deleteAccount = () => {
  store.deleteAccount(props.account.id);
};
</script>

<style lang="scss" scoped>
.account-item {
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  }
}
.q-card__section--vert {
  padding: 0;
}
.row {
  padding: 0;
}
</style>
