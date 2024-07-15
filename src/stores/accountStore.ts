import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { Account, AccountUpdate } from "@/types/types";

export const useAccountStore = defineStore("account", () => {
  const accounts = ref<Account[]>([]);

  const createEmptyAccount = (): Account => ({
    id: uuidv4(),
    tags: [],
    type: "Локальная",
    login: "",
    password: "",
  });

  const addAccount = () => {
    accounts.value.push(createEmptyAccount());
    saveAccounts();
  };

  const updateAccount = (
    id: string,
    updatedAccount: Partial<AccountUpdate>
  ) => {
    const index = accounts.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      accounts.value[index] = {
        ...accounts.value[index],
        ...updatedAccount,
        password:
          updatedAccount.type === "LDAP"
            ? null
            : updatedAccount.password ?? accounts.value[index].password,
      };
      saveAccounts();
    }
  };

  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter((a) => a.id !== id);
    saveAccounts();
  };

  const saveAccounts = () => {
    localStorage.setItem("accounts", JSON.stringify(accounts.value));
  };

  const loadAccounts = () => {
    const savedAccounts = localStorage.getItem("accounts");
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts);
    }
  };

  return { accounts, addAccount, updateAccount, deleteAccount, loadAccounts };
});
