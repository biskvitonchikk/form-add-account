export interface AccountTag {
  text: string;
}

export type AccountType = "LDAP" | "Локальная";

export interface Account {
  id: string;
  tags: AccountTag[];
  type: AccountType;
  login: string;
  password: string | null;
}

export type AccountUpdate = Omit<Account, "id">;
