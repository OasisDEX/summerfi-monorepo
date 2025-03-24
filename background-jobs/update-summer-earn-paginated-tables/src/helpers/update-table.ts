export const updateTable = async (authToken: string, baseUrl: string, tableName: string) =>
  fetch(`${baseUrl}/earn/api/update-tables-data`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      tablesToUpdate: [tableName],
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to update table: ${res.status} ${res.statusText}`)
    }
    return res.json()
  })
