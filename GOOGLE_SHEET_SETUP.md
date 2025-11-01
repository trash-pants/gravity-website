# Google Sheets Integration Setup Guide

Follow these steps to connect your newsletter form to a Google Sheet:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "Gravity Newsletter Subscriptions")
4. Copy the Sheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - Copy the `YOUR_SHEET_ID` part

## Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the code from `google-apps-script.js` into the editor
5. Replace `'YOUR_SHEET_ID'` on line 16 with your actual Sheet ID
6. If your sheet name is not "Sheet1", change `'Sheet1'` on line 17

## Step 3: Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Click the gear icon (⚙️) next to "Select type"
3. Choose "Web app"
4. Configure:
   - **Description**: "Newsletter form handler" (optional)
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. Click "Deploy"
6. Click "Authorize access" and grant permissions
7. **Copy the Web App URL** - you'll need this!

## Step 4: Update Your Website

1. Open `form-handler.js`
2. Replace `'YOUR_WEB_APP_URL'` on line 8 with the Web App URL you copied
3. Save the file

## Step 5: Test

1. Open your website
2. Enter an email in the newsletter form
3. Submit the form
4. Check your Google Sheet - the email and timestamp should appear!

## Troubleshooting

- **CORS errors**: Make sure you set "Who has access" to "Anyone" when deploying
- **Sheet not updating**: Double-check the Sheet ID is correct
- **404 errors**: Verify the Web App URL is correct in `form-handler.js`
- **Permission errors**: Make sure you authorized the script when deploying

## Optional: Customize Column Headers

The script automatically creates "Email" and "Timestamp" headers. To change them, edit line 26 in `google-apps-script.js`.

