async function introspect() {
  const q = `
  query {
    __type(name: "MarketPositionOrderBy") {
      name
      enumValues { name }
    }
  }
  `;
  const res = await fetch('https://api.morpho.org/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q })
  });
  const data = await res.json();
  console.log('orderBy values:', JSON.stringify(data.data.__type.enumValues, null, 2));
}
introspect();
