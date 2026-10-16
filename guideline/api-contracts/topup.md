# Top up — API contract (sample)

> Sample contract for the template. The HTTP adapters follow it; the mock adapters return data in the same raw shape and pass it through the same mappers.

| Key | Value |
|---|---|
| Base path | `/topup/v1` (prefixed with `API_BASE_URL`) |
| Auth | Bearer token from the `access_token` cookie |
| Envelope | `{ status: { code, message }, data }` |
| Success codes | HTTP `200`/`201`; business `TOP20000` (OK), `TOP20101` (created) |

## GET `/topup/v1/banks` — banks available for top up

**Response sample (success)**

```json
{
  "status": { "code": "TOP20000", "message": "OK" },
  "data": [
    { "bank_code": "BCA", "bank_name": "Bank Central Asia", "active": "Y", "other": false, "logo": null },
    { "bank_code": "OTHER", "bank_name": "Other bank", "active": "Y", "other": true, "logo": null }
  ]
}
```

| Field | Type | Always present? | Notes |
|---|---|---|---|
| `bank_code` | string | yes | Required; missing → whole response treated as invalid |
| `bank_name` | string \| null | no | Falls back to `bank_code` |
| `active` | `"Y"` \| `"N"` | yes | Case-insensitive (migrated rows send `"y"`) |
| `other` | boolean | no | Default `false`; shown last |
| `logo` | string \| null | no | URL |

## POST `/topup/v1/invoices` — create a top-up invoice

**Request body**

```json
{ "bank_code": "BCA", "amount": 50000 }
```

**Response sample (success)**

```json
{
  "status": { "code": "TOP20101", "message": "Created" },
  "data": { "invoice_id": "INV-1", "bank_code": "BCA", "amount": 50000, "va_number": "8808000050000", "expired_at": "2026-10-21T08:00:00Z" }
}
```

Every `data` field is required; any missing or malformed field → invalid response.

## Errors

| HTTP | Business code | Meaning | AppError type |
|---|---|---|---|
| 400 | `TOP40001` | Invalid amount or bank | `validation` |
| 404 | `TOP40401` | No banks configured | `not_found` |
| 409 | `TOP40901` | Bank temporarily unavailable | `conflict` |
| 500 | `TOP50001` | Server error | `server` |
