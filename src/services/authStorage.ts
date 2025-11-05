export type AuthRole = 'admin' | 'user';
export type TransactionStatus = 'Aprovado' | 'Reprovado' | 'Em avaliação';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AuthRole;
}

export interface AuthResult {
  token: string;
  user: StoredUser;
}

export interface StoredTransaction {
  id: number;
  userId: string;
  cpf: string;
  description: string;
  transactionDate: string;
  points: number;
  amount: number;
  status: TransactionStatus;
}

interface AuthSession {
  userId: string;
  token: string;
  createdAt: number;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: AuthRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

type TransactionStore = Record<string, StoredTransaction[]>;

const USERS_KEY = 'er.auth.users';
const SESSION_KEY = 'er.auth.session';
const CURRENT_USER_KEY = 'er.auth.currentUser';
const TOKEN_KEY = 'token';
const TRANSACTIONS_KEY = 'er.data.transactions';
const TRANSACTION_SEQ_KEY = 'er.data.transactionSequence';

const DEFAULT_ADMIN: StoredUser = {
  id: 'admin-0001',
  name: 'Administrador Elevate',
  email: 'admin@elevaterewards.com',
  password: 'admin123',
  role: 'admin',
};

let bootstrapped = false;

const isClient = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Erro ao ler dados de autenticação do armazenamento local.', error);
    return fallback;
  }
};

const readUsersRaw = (): StoredUser[] => {
  if (!isClient()) return [];
  return safeParse<StoredUser[]>(window.localStorage.getItem(USERS_KEY), []);
};

const writeUsers = (users: StoredUser[]) => {
  if (!isClient()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readTransactionStoreRaw = (): TransactionStore => {
  if (!isClient()) return {};
  return safeParse<TransactionStore>(window.localStorage.getItem(TRANSACTIONS_KEY), {});
};

const writeTransactionStore = (store: TransactionStore) => {
  if (!isClient()) return;
  window.localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(store));
};

const readSessionRaw = (): AuthSession | null => {
  if (!isClient()) return null;
  return safeParse<AuthSession | null>(window.localStorage.getItem(SESSION_KEY), null);
};

const getTransactionSequence = () => {
  if (!isClient()) return 1000;
  const raw = window.localStorage.getItem(TRANSACTION_SEQ_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : 1000;
  return Number.isFinite(parsed) ? parsed : 1000;
};

const setTransactionSequence = (value: number) => {
  if (!isClient()) return;
  window.localStorage.setItem(TRANSACTION_SEQ_KEY, value.toString());
};

const nextTransactionId = () => {
  const current = getTransactionSequence();
  const next = current + 1;
  setTransactionSequence(next);
  return next;
};

const toISODate = (date: Date) => {
  const clone = new Date(date.getTime());
  return clone.toISOString();
};

const generateCpf = (seed: number) => {
  const digits = Math.abs(seed).toString().padStart(11, '0').slice(-11);
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const dateDaysAgo = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
};

const sampleTemplates: Array<{
  description: string;
  amount: number;
  points: number;
  status: TransactionStatus;
  daysAgo: number;
}> = [
  {
    description: 'Compra em parceiros Elevate',
    amount: 3200,
    points: 1280,
    status: 'Aprovado',
    daysAgo: 6,
  },
  {
    description: 'Campanha interna - Bônus',
    amount: 1500,
    points: 900,
    status: 'Em avaliação',
    daysAgo: 3,
  },
  {
    description: 'Ajuste de performance',
    amount: 800,
    points: 0,
    status: 'Reprovado',
    daysAgo: 14,
  },
  {
    description: 'Venda consultiva',
    amount: 5400,
    points: 2160,
    status: 'Aprovado',
    daysAgo: 18,
  },
];

const createSampleTransactions = (user: StoredUser): StoredTransaction[] =>
  sampleTemplates.map((template, index) => {
    const id = nextTransactionId();
    return {
      id,
      userId: user.id,
      cpf: generateCpf(id + index),
      description: template.description,
      transactionDate: toISODate(dateDaysAgo(template.daysAgo + index)),
      points: template.points,
      amount: template.amount,
      status: template.status,
    };
  });

const ensureUserTransactions = (
  user: StoredUser,
  store?: TransactionStore,
): TransactionStore => {
  if (!isClient()) return {};
  const currentStore = store ?? readTransactionStoreRaw();
  if (!currentStore[user.id]) {
    currentStore[user.id] = createSampleTransactions(user);
    if (!store) {
      writeTransactionStore(currentStore);
    }
  }
  return currentStore;
};

const ensureBootstrap = () => {
  if (bootstrapped || !isClient()) return;

  let users = readUsersRaw();
  let usersMutated = false;

  users = users.map((user) => {
    const expectedRole = user.email === DEFAULT_ADMIN.email ? 'admin' : user.role ?? 'user';
    if (user.role !== expectedRole) {
      usersMutated = true;
      return { ...user, role: expectedRole as AuthRole };
    }
    if (!user.role) {
      usersMutated = true;
      return { ...user, role: 'user' };
    }
    return user;
  });

  const hasDefaultAdmin = users.some(
    (candidate) => candidate.email === DEFAULT_ADMIN.email,
  );

  if (!hasDefaultAdmin) {
    users = [...users, DEFAULT_ADMIN];
    usersMutated = true;
  }

  if (usersMutated) {
    writeUsers(users);
  }

  let transactions = readTransactionStoreRaw();
  let transactionsMutated = false;

  users.forEach((user) => {
    if (!transactions[user.id]) {
      transactions = ensureUserTransactions(user, transactions);
      transactionsMutated = true;
    }
  });

  if (transactionsMutated) {
    writeTransactionStore(transactions);
  }

  bootstrapped = true;
};

const ensureStorageReady = () => {
  if (!isClient()) {
    throw new Error('Armazenamento local indisponível no ambiente atual.');
  }
  ensureBootstrap();
};

const createUserId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const base64UrlEncode = (value: string) => {
  if (typeof window === 'undefined') return value;
  return window
    .btoa(value)
    .replace(/=+$/u, '')
    .replace(/\+/gu, '-')
    .replace(/\//gu, '_');
};

const createTokenForUser = (user: StoredUser) => {
  const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
    }),
  );
  return `${header}.${payload}.`;
};

const persistSession = (user: StoredUser, token: string) => {
  const session: AuthSession = {
    userId: user.id,
    token,
    createdAt: Date.now(),
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(TOKEN_KEY, token);
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const loginUserInternal = (user: StoredUser): AuthResult => {
  ensureStorageReady();
  ensureUserTransactions(user);
  const token = createTokenForUser(user);
  persistSession(user, token);
  return { token, user };
};

export const registerUser = ({
  name,
  email,
  password,
  role,
}: RegisterPayload): AuthResult => {
  ensureStorageReady();

  const trimmedName = name.trim();
  const normalizedEmail = normalizeEmail(email);

  const users = readUsersRaw();
  const emailAlreadyRegistered = users.some(
    (existing) => existing.email === normalizedEmail,
  );

  if (emailAlreadyRegistered) {
    throw new Error('O email informado já está cadastrado.');
  }

  const assignedRole: AuthRole = role ?? 'admin';

  const newUser: StoredUser = {
    id: createUserId(),
    name: trimmedName,
    email: normalizedEmail,
    password,
    role: assignedRole,
  };

  writeUsers([...users, newUser]);
  ensureUserTransactions(newUser);

  return loginUserInternal(newUser);
};

export const authenticateUser = ({
  email,
  password,
}: LoginPayload): AuthResult => {
  ensureStorageReady();

  const normalizedEmail = normalizeEmail(email);
  const users = readUsersRaw();
  const matchedUser = users.find((user) => user.email === normalizedEmail);

  if (!matchedUser || matchedUser.password !== password) {
    throw new Error('Credenciais inválidas. Verifique os dados informados.');
  }

  return loginUserInternal(matchedUser);
};

export const getActiveSession = (): AuthResult | null => {
  if (!isClient()) return null;
  ensureBootstrap();

  const session = readSessionRaw();
  if (!session) return null;

  const users = readUsersRaw();
  const user = users.find((candidate) => candidate.id === session.userId);
  if (!user) {
    clearSession();
    return null;
  }

  return { user, token: session.token };
};

export const getCurrentUser = (): StoredUser | null => {
  if (!isClient()) return null;
  ensureBootstrap();
  return safeParse<StoredUser | null>(
    window.localStorage.getItem(CURRENT_USER_KEY),
    null,
  );
};

export const clearSession = () => {
  if (!isClient()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
};

export const getTransactionsForUser = (userId: string): StoredTransaction[] => {
  ensureStorageReady();
  const store = readTransactionStoreRaw();
  const entries = store[userId] ?? [];
  return entries.map((transaction) => ({ ...transaction }));
};

export const setTransactionsForUser = (
  userId: string,
  transactions: StoredTransaction[],
) => {
  ensureStorageReady();
  const store = readTransactionStoreRaw();
  store[userId] = transactions.map((transaction) => ({ ...transaction }));
  writeTransactionStore(store);
};

export const appendTransactionsForUser = (
  userId: string,
  transactions: StoredTransaction | StoredTransaction[],
) => {
  ensureStorageReady();
  const entries = Array.isArray(transactions) ? transactions : [transactions];
  const store = readTransactionStoreRaw();
  const current = store[userId] ?? [];
  const merged = [...current, ...entries].sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime(),
  );
  store[userId] = merged.map((transaction) => ({ ...transaction }));
  writeTransactionStore(store);
};

export const getAllTransactions = (): StoredTransaction[] => {
  ensureStorageReady();
  const store = readTransactionStoreRaw();
  return Object.values(store)
    .flat()
    .map((transaction) => ({ ...transaction }));
};

export const createTransactionRecord = ({
  userId,
  description,
  transactionDate,
  points,
  amount,
  status,
  cpf,
}: {
  userId: string;
  description?: string;
  transactionDate?: string;
  points?: number;
  amount?: number;
  status?: TransactionStatus;
  cpf?: string;
}): StoredTransaction => {
  ensureStorageReady();
  const id = nextTransactionId();
  return {
    id,
    userId,
    cpf: cpf ?? generateCpf(id),
    description: description ?? 'Transação Elevate',
    transactionDate: transactionDate ?? new Date().toISOString(),
    points: points ?? 0,
    amount: amount ?? 0,
    status: status ?? 'Em avaliação',
  };
};
