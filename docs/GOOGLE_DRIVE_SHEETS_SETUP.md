# Google Drive & Google Sheets Integration Guide for Vision Week

This guide explains how to connect your **Vision Week 2026 Registration Form** so that student submissions automatically populate a Google Spreadsheet inside your **Google Drive** in real-time.

---

## Step 1: Create a Google Spreadsheet in Google Drive

1. Go to your [Google Drive](https://drive.google.com).
2. Click **New** → **Google Sheets** (or open an existing spreadsheet).
3. Name it: `CSI KKWIEER - Vision Week 2026 Registrations`.
4. In **Row 1**, add the following column headers:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **Timestamp** | **Full Name** | **Email** | **Phone** | **College** | **Department** | **Year** | **PRN** | **Track** |

---

## Step 2: Add the Google Apps Script Webhook

1. Inside your Google Sheet, click on **Extensions** in the top menu → **Apps Script**.
2. Delete any default code in the editor, and paste this script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Append row to Google Sheet
    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.college || "",
      data.department || "",
      data.year || "",
      data.prn || "",
      data.track || "",
      data.comments || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "success": true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "success": false, "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Step 3: Deploy as a Web App

1. In the top right corner of the Apps Script window, click the blue **Deploy** button → **New deployment**.
2. Click the gear icon (Select type) next to "Select type" and choose **Web app**.
3. Fill in the fields:
   - **Description:** `Vision Week Webhook`
   - **Execute as:** `Me (your email)`
   - **Who has access:** **`Anyone`** *(Important: Must be "Anyone" so the website can post registrations without login)*
4. Click **Deploy**.
5. Copy the generated **Web App URL** (it looks like: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## Step 4: Add URL to the Project

Open (or create) your `.env.local` file in the project root and add:

```bash
GOOGLE_SCRIPT_WEBAPP_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

*Note: Even without this URL set, every student registration is automatically saved safely in your **MongoDB Atlas** database in the `event_registrations` collection!*
