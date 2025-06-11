# Campaign Data API Endpoints

## Get Campaign Quest Status

Retrieves quest completion status for specific campaigns. Quests must be completed sequentially -
each quest depends on the completion of all previous quests.

**Endpoint:** `/api/campaigns/{campaign}/{questNumber}/{walletAddress}`  
**Method:** GET

**Path Parameters:**

- `campaign`: Campaign identifier (currently supported: `okx`)
- `questNumber`: Quest number to check up to (1-4)
- `walletAddress`: Ethereum wallet address to check

**Response:**

```json
{
  "code": 0,
  "data": boolean  // true if ALL requested quests are completed
}
```

## Notes

- Quests must be completed in sequential order (1 → 2 → 3 → 4)
- If any quest is incomplete, all subsequent quests are automatically considered incomplete
- The `data` field returns `true` only if ALL quests up to the specified number are completed
