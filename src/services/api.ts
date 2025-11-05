import {
  appendTransactionsForUser,
  createTransactionRecord,
  getActiveSession,
  getAllTransactions,
  getTransactionsForUser,
  StoredTransaction,
  TransactionStatus,
} from './authStorage';

type RequestParams = Record<string, string | number | undefined>;

type RequestConfig = {
  params?: RequestParams;
  headers?: Record<string, string>;
};

type ApiResponse<T> = {
  data: T;
};

const toStartOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const toEndOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

const parseDateParam = (value?: unknown): Date | undefined => {
  if (!value) return undefined;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const parseNumberParam = (value?: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeText = (value?: string) => (value ?? '').trim().toLowerCase();

const normalizeCpf = (value?: string) => (value ?? '').replace(/\D+/g, '');

const isMatchingStatus = (
  status: TransactionStatus,
  filterValue?: string,
): boolean => {
  if (!filterValue) return true;
  return status === filterValue;
};

const matchesAdminFilters = (
  transaction: StoredTransaction,
  params: RequestParams,
) => {
  const productFilter = normalizeText(
    typeof params.product === 'string' ? params.product : undefined,
  );
  const cpfFilter = normalizeCpf(
    typeof params.cpf === 'string' ? params.cpf : undefined,
  );
  const minAmount = parseNumberParam(params.minAmount);
  const maxAmount = parseNumberParam(params.maxAmount);

  if (productFilter) {
    const description = normalizeText(transaction.description);
    if (!description.includes(productFilter)) {
      return false;
    }
  }

  if (cpfFilter) {
    const transactionCpf = normalizeCpf(transaction.cpf);
    if (!transactionCpf.includes(cpfFilter)) {
      return false;
    }
  }

  if (minAmount !== undefined && transaction.amount < minAmount) {
    return false;
  }

  if (maxAmount !== undefined && transaction.amount > maxAmount) {
    return false;
  }

  return true;
};

const filterTransactions = (
  transactions: StoredTransaction[],
  params: RequestParams | undefined,
  scope: 'user' | 'admin',
) => {
  if (!params) {
    return [...transactions].sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime(),
    );
  }

  const statusFilter =
    typeof params.status === 'string' ? params.status : undefined;
  const startDate = parseDateParam(params.startDate);
  const endDate = parseDateParam(params.endDate);
  const startBoundary = startDate ? toStartOfDay(startDate) : undefined;
  const endBoundary = endDate ? toEndOfDay(endDate) : undefined;

  return [...transactions]
    .filter((transaction) => {
      if (!isMatchingStatus(transaction.status, statusFilter)) {
        return false;
      }

      const transactionDate = new Date(transaction.transactionDate);
      if (startBoundary && transactionDate < startBoundary) {
        return false;
      }

      if (endBoundary && transactionDate > endBoundary) {
        return false;
      }

      if (scope === 'admin') {
        return matchesAdminFilters(transaction, params);
      }

      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime(),
    );
};

const buildWalletSummary = (transactions: StoredTransaction[]) => {
  const approvedPoints = transactions
    .filter((transaction) => transaction.status === 'Aprovado')
    .reduce((acc, transaction) => acc + transaction.points, 0);

  return { approvedPoints };
};

const processUpload = <T>(userId: string): ApiResponse<T> => {
  const statusCycle: TransactionStatus[] = ['Aprovado', 'Em avaliação', 'Reprovado'];
  const allTransactions = getAllTransactions();
  const uniqueUserIds = Array.from(
    new Set(allTransactions.map((transaction) => transaction.userId)),
  );

  const targetUserIds = uniqueUserIds.length > 0 ? uniqueUserIds : [userId];

  targetUserIds.forEach((targetId, index) => {
    const points = 600 + index * 120;
    const amount = Math.round(points * 2.5);
    const status = statusCycle[index % statusCycle.length];
    const hoursOffset = index * 2;
    const transactionDate = new Date();
    transactionDate.setHours(transactionDate.getHours() - hoursOffset);

    const transaction = createTransactionRecord({
      userId: targetId,
      description: 'Crédito via upload administrativo',
      transactionDate: transactionDate.toISOString(),
      points,
      amount,
      status,
    });

    appendTransactionsForUser(targetId, transaction);
  });

  return {
    data: { message: 'Arquivo processado com sucesso.' } as T,
  };
};

const api = {
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const session = getActiveSession();
    if (!session) {
      throw new Error('Usuário não autenticado.');
    }

    switch (url) {
      case '/transactions/user': {
        const transactions = getTransactionsForUser(session.user.id);
        const filtered = filterTransactions(
          transactions,
          config?.params,
          'user',
        );
        return { data: filtered as T };
      }
      case '/wallet': {
        const transactions = getTransactionsForUser(session.user.id);
        const summary = buildWalletSummary(transactions);
        return { data: summary as T };
      }
      case '/admin/report': {
        if (session.user.role !== 'admin') {
          throw new Error('Operação permitida apenas para administradores.');
        }
        const transactions = getAllTransactions();
        const filtered = filterTransactions(transactions, config?.params, 'admin');
        return { data: filtered as T };
      }
      default:
        throw new Error(`Endpoint GET não suportado: ${url}`);
    }
  },

  async post<T>(
    url: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const session = getActiveSession();
    if (!session) {
      throw new Error('Usuário não autenticado.');
    }

    void body;
    void config;

    switch (url) {
      case '/upload': {
        if (session.user.role !== 'admin') {
          throw new Error('Operação permitida apenas para administradores.');
        }
        return processUpload<T>(session.user.id);
      }
      default:
        throw new Error(`Endpoint POST não suportado: ${url}`);
    }
  },
};

export default api;
