import lockr from 'lockr';
import Logdown from 'logdown';
import {
  convertSnakeToCamel, convertCamelToSnake, serialize, deepCopy,
} from '@/util';
import router from '@/router';

const urlPrefix = `${process.env.VUE_APP_API_URL || '/api'}/`;
const logger = new Logdown('app:api');

// const EXPENSES_DATA = lockr.rm('expenses') || ExpensesData;
//
// window.EXPENSES_DATA = EXPENSES_DATA;
//
// function getExpensesMaxId() {
//   return EXPENSES_DATA.reduce((max, expense) => Math.max(expense.id, max), 0);
// }
// migration to server expenses
lockr.rm('expenses');

const DEFAULT_CREDENTIALS = {
  tokenType: '',
  accessToken: '',
};

export function getCredentials() {
  return lockr.get('credentials') || {
    ...DEFAULT_CREDENTIALS,
  };
}

export function clearCredentials() {
  lockr.set('credentials', {
    ...DEFAULT_CREDENTIALS,
  });
}

export function setCredentials(data) {
  lockr.set('credentials', data);

  return data;
}

async function handleErrors(response) {
  if (!response.ok) {
    const rawData = await response.json();

    if (rawData) {
      const responseData = convertSnakeToCamel(rawData);

      if (responseData.error) {
        if (responseData.error.fields) {
          const firstField = Object.keys(responseData.error.fields)[0];
          const error = { error: responseData.error.fields[firstField].code };

          throw error;
        }

        const error = { error: responseData.error.code };

        if (responseData.error.code === 'auth_expired') {
          clearCredentials();
          router.push('/user/signin');
        }

        throw error;
      }
    }

    const internalError = { error: 'internal_error' };

    throw internalError;
  }

  return response;
}

async function handleUnreachableError(err) {
  logger.error(err);

  const unreachableError = { error: 'server_is_unreachable' };

  throw unreachableError;
}

export function Endpoint(path, method = 'get', { skipAuth, doNotConvert, isCollection } = {}) {
  const url = `${urlPrefix}${path.startsWith('v2/') ? path : `v1/${path}`}`;
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Cache-Control': 'no-cache',
  };

  return (data) => {
    if (typeof data === 'object') {
      data = deepCopy(data);
    }

    const { tokenType, accessToken } = getCredentials();

    if (accessToken && !skipAuth) {
      headers.Authorization = `${tokenType} ${accessToken}`;
    } else {
      delete headers.Authorization;
    }

    let requestUrl = url;

    if (method === 'get' && data) {
      if (typeof data === 'number' || typeof data === 'string') {
        requestUrl = requestUrl.replace('/:id', `/${data}`);
      } else if (typeof data === 'object' && Object.keys(data).length) {
        requestUrl += `?${serialize(data)}`;
      }
    }

    if (method === 'delete' && (typeof data === 'number' || typeof data === 'string')) {
      requestUrl = requestUrl.replace('/:id', `/${data}`);
    }

    if (method === 'post') {
      if (data && data.id) {
        requestUrl = requestUrl.replace('/:id', `/${data.id}`);

        /* eslint-disable no-param-reassign */
        delete data.id;
      } else {
        requestUrl = requestUrl.replace('/:id', '');
      }
    }

    return fetch(requestUrl, {
      headers,
      method,
      body: method === 'post' ? JSON.stringify(doNotConvert ? data : convertCamelToSnake(data)) : undefined,
    }).then(handleErrors, handleUnreachableError)
      .then(response => response.json())
      .then(json => convertSnakeToCamel(json))
      .then((parsedData) => {
        if (isCollection) {
          return parsedData.collection;
        }

        return parsedData;
      });
  };
}

const API = {
  Auth: {
    signIn: (() => {
      const endpoint = Endpoint('users/login', 'post', { doNotConvert: true });
      const adminEndpoint = Endpoint('admin/users/:id/become', 'post', { doNotConvert: true });

      return async (...args) => {
        const currentEndpoint = args[0] && args[0].admin ? adminEndpoint : endpoint;

        if (args[0]) {
          delete args[0].admin;
        }

        const data = await (currentEndpoint)(...args);
        const { auth } = data;

        delete data.auth;

        setCredentials(auth);

        return data.auth;
      };
    })(),
    signUp: (() => {
      const endpoint = Endpoint('users', 'post', { skipAuth: true, doNotConvert: true });

      return async (...args) => {
        const data = await endpoint(...args);
        const { auth } = data;

        delete data.auth;

        setCredentials(auth);

        return data.auth;
      };
    })(),
    getRestoreCode: Endpoint('users/reset-password', 'post', { doNotConvert: true }),
    changePassword: Endpoint('users/reset-password', 'post', { doNotConvert: true }),
  },
  Products: {
    getAll: Endpoint('products', 'get', { isCollection: true }),
    getCategories: Endpoint('products/categories', 'get', { isCollection: true }),
    get: Endpoint('products/:id', 'get'),
    add: Endpoint('products/:id', 'post', { doNotConvert: true }),
    delete: Endpoint('products/:id', 'delete'),
    update: Endpoint('products/:id', 'post', { doNotConvert: true }),
    setActuals: Endpoint('products/:id/actuals', 'post', { doNotConvert: true }),
    actualizeAll: Endpoint('products/actuals', 'post', { doNotConvert: true }),
    getByAsin: Endpoint('amazon/products', 'post', { doNotConvert: true }),
  },
  Pnl: {
    getAll: Endpoint('pnl', 'get'),
  },
  Expenses: {
    getAll: Endpoint('expenses', 'get', { isCollection: true }),
    get: Endpoint('expenses/:id', 'get'),
    add: Endpoint('expenses/:id', 'post', { doNotConvert: true }),
    delete: Endpoint('expenses/:id', 'delete'),
    update: Endpoint('expenses/:id', 'post', { doNotConvert: true }),
  },
  // Expenses: {
  //   getAll: async () => deepCopy(EXPENSES_DATA),
  //   get: async id => deepCopy(EXPENSES_DATA.find(expense => expense.id === id)),
  //   add: async (data) => {
  //     data.id = getExpensesMaxId() + 1;
  //
  //     EXPENSES_DATA.push(data);
  //
  //     lockr.set('expenses', EXPENSES_DATA);
  //
  //     return deepCopy(data);
  //   },
  //   delete: async (data) => {
  //     const expenses = EXPENSES_DATA.filter(expense => expense.id !== data.id);
  //
  //     EXPENSES_DATA.splice(0);
  //
  //     EXPENSES_DATA.push(...expenses);
  //
  //     lockr.set('expenses', EXPENSES_DATA);
  //   },
  //   update: async (data) => {
  //     const expense = EXPENSES_DATA.find(exp => exp.id === data.id);
  //
  //     Object.assign(expense, data);
  //
  //     lockr.set('expenses', EXPENSES_DATA);
  //
  //     return deepCopy(expense);
  //   },
  // },
  AmazonSellerAccounts: {
    getAll: Endpoint('amazon/accounts', 'get', { isCollection: true }),
    get: Endpoint('amazon/accounts/:id', 'get'),
    update: Endpoint('amazon/accounts/:id', 'post', { doNotConvert: true }),
    add: Endpoint('amazon/accounts', 'post', { doNotConvert: true }),
  },
  AmazonAdvertisingAccounts: {
    getAll: Endpoint('amazon/ads-accounts', 'get', { isCollection: true }),
    add: Endpoint('amazon/ads-accounts', 'post', { doNotConvert: true }),
  },
  Stats: {
    get: Endpoint('dashboard', 'get'),
    getItems: Endpoint('items', 'get', { isCollection: true }),
  },
  Admin: {
    getUsers: Endpoint('admin/users', 'get', { isCollection: true }),
  },
  Billing: {
    update: Endpoint('users/billing', 'post', { doNotConvert: true }),
    saveCard: Endpoint('users/billing/card', 'post', { doNotConvert: true }),
    getCard: Endpoint('users/billing/card', 'get'),
    removeCard: Endpoint('users/billing/card', 'delete'),
    get: Endpoint('users/billing'),
    applyCoupon: Endpoint('users/billing', 'post', { doNotConvert: true }),
    // async get() {
    //   const profile = API.User.getProfile();
    //
    //   return {
    //     periodStart: '2019-09-21',
    //     periodEnd: '2019-10-20',
    //     status: profile.subscription.status,
    //     plan: profile.subscription.plan,
    //     ends: profile.subscription.ends,
    //     tier: '',
    //   };
    // },
  },
  User: {
    getProfile: (() => {
      const endpoint = Endpoint('v2/users/profile', 'get');

      return async (...args) => {
        let data;

        try {
          data = await endpoint(...args);
        } catch (e) {
          data = {};
        }

        lockr.set('profile', data);

        return data;
      };
    })(),
    updateProfile: Endpoint('v2/users/profile/:id', 'post', { doNotConvert: true }),
  },
};

export default API;
