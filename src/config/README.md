# Google API Config

You will need to provide your own `google-config.json` in this folder. You will need to provide the `apiKey`, `clientId` and `sheetId`. Speak to me (Rowell) and I'll provide you the `apiKey` and `clientId`.

```json
{
  "api": {
    "apiKey": "<API-KEY-HERE>",
    "clientId": "<CLIENT-ID-HERE>",
    "discoveryDocs": [
      "https://sheets.googleapis.com/$discovery/rest?version=v4"
    ],
    "scope": "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile"
  },
  "sheetId": "<GOOGLE-SHEET-ID-HERE>"
}
```