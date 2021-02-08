const fetch = require('node-fetch');
require('dotenv').config();

const { API_URL } = process.env;

describe(`${API_URL}/routes/generate`, () => {
  test('POST@/routes/generate responds with a 200 status code and JSON body with a stopsOrder property when sending valid lats and lngs', async () => {
    expect.assertions(2);

    const stops = [
      { lat: -2.01235, lng: 29.37785 },
      { lat: -1.66882, lng: 30.58386 },
      { lat: -1.53757, lng: 29.77286 },
    ];

    const res = await fetch(`${API_URL}/routes/generate`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ stops }),
    });
    const { status: statusCode } = res;
    const data = await res.json();

    const expectedData = {
      orderedStops: expect.arrayContaining([
        {
          lat: expect.any(Number),
          lng: expect.any(Number),
        },
      ]),
    };

    expect(statusCode).toBe(200);
    expect(data).toEqual(expectedData);
  });

  test('POST@/routes/generate with just one stop responds with a 422 status and an error', async () => {
    expect.assertions(2);

    const stops = [{ lat: -2.01235, lng: 29.37785 }];

    const res = await fetch(`${API_URL}/routes/generate`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ stops }),
    });
    const { status: statusCode } = res;
    const data = await res.json();

    const expectedData = {
      message: expect.any(String),
      stack: expect.any(String),
    };

    expect(statusCode).toBe(422);
    expect(data).toEqual(expectedData);
  });

  test('POST@/routes/generate with invalid lat and/or lng responds with a 422 status code and an error', async () => {
    expect.assertions(2);

    const stops = [
      { lat: -2.01235, lng: 30.37785 },
      { lat: -1.66882, lng: 30.58386 },
      { lat: -100.53757, lng: 29.77286 },
    ];

    const res = await fetch(`${API_URL}/routes/generate`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ stops }),
    });
    const { status: statusCode } = res;
    const data = await res.json();

    const expectedData = {
      message: expect.any(String),
      stack: expect.any(String),
    };

    expect(statusCode).toBe(422);
    expect(data).toEqual(expectedData);
  });
});
