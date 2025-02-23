import { api } from './lib/apit';

test('Deve apresentar erro caso as credenciais estejam invalidas', async function () {
  async function ThrowLoginError() {
    const responseGetToken = await api.post('/login', {
      email: 'tms.working@gmail.com',
      password: 'kkkkkkk',
    });
    return responseGetToken;
  }

  expect(ThrowLoginError).rejects.toThrowErrorMatchingSnapshot();
});

test('Deve fazer login', async function () {
  const responseGetToken = await api.post('/login', {
    email: 'tms.working@gmail.com',
    password: 'teste123',
  });

  const outputGetToken = responseGetToken.data;

  expect(outputGetToken).toHaveProperty('accessToken');
  expect(outputGetToken).toHaveProperty('refreshToken');
});

test('Deve mostrar o access token e o refresh token', async function () {
  const responseGetToken = await api.post('/me');

  const outputGetToken = responseGetToken.data;
  expect(outputGetToken).toHaveProperty('accessToken');
  expect(outputGetToken).toHaveProperty('refreshToken');
});
