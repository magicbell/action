export function withInputs(inputs: Record<string, string>) {
  const obj = Object.keys(inputs).reduce(
    (acc, key) =>
      Object.assign(acc, {
        [`INPUT_${key.replace(/ /g, '_').toUpperCase()}`]: inputs[key],
      }),
    {},
  );

  // clear current inputs on process.env
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('INPUT_')) {
      delete process.env[key];
    }
  }

  // transfer new inputs to process.env
  for (const key of Object.keys(obj)) {
    process.env[key] = obj[key];
  }

  return obj;
}
