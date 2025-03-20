export const updateTable = async (authToken: string, baseUrl: string, tableName: string) =>
  fetch(`${baseUrl}/earn/api/update-tables-data`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      tablesToUpdate: [tableName],
    }),
  }).then((res) => res.json())
