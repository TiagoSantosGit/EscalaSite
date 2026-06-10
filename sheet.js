/*
  sheet.js
  - Cria uma planilha no Google Sheets
  - Salva no Google Drive do usuário logado no navegador
  - Requer configurar GOOGLE_CLIENT_ID e GOOGLE_API_KEY
  - Precisa incluir <script src="https://apis.google.com/js/api.js"></script>
*/

const SHEETS_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
}

function loadGoogleApi() {
  return new Promise((resolve, reject) => {
    if (window.gapi && window.gapi.client) {
      return resolve(window.gapi)
    }

    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      gapi.load('client:auth2', () => resolve(gapi))
    }
    script.onerror = () => reject(new Error('Falha ao carregar a API do Google'))
    document.head.appendChild(script)
  })
}

function initializeGoogleClient() {
  return loadGoogleApi().then(gapi => {
    if (gapi.client && gapi.client.init) {
      return gapi.client.init({
        apiKey: SHEETS_CONFIG.apiKey,
        clientId: SHEETS_CONFIG.clientId,
        discoveryDocs: SHEETS_CONFIG.discoveryDocs,
        scope: SHEETS_CONFIG.scope
      })
    }
    throw new Error('gapi.client não está disponível')
  })
}

function signInGoogleUser() {
  return initializeGoogleClient().then(() => {
    const authInstance = gapi.auth2.getAuthInstance()
    return authInstance.signIn()
  })
}

function ensureSignedIn() {
  return initializeGoogleClient().then(() => {
    const authInstance = gapi.auth2.getAuthInstance()
    if (!authInstance.isSignedIn.get()) {
      return authInstance.signIn()
    }
    return authInstance.currentUser.get()
  })
}

function createGoogleSheet(title = 'Nova Planilha') {
  return ensureSignedIn().then(() => {
    return gapi.client.sheets.spreadsheets.create({
      resource: {
        properties: {
          title
        }
      }
    })
  }).then(response => {
    const spreadsheet = response.result
    return {
      spreadsheetId: spreadsheet.spreadsheetId,
      spreadsheetUrl: spreadsheet.spreadsheetUrl
    }
  })
}

function createGoogleSheetWithValues(title = 'Nova Planilha', values = [[]]) {
  return createGoogleSheet(title).then(sheet => {
    if (!Array.isArray(values) || values.length === 0) {
      return sheet
    }

    return gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: sheet.spreadsheetId,
      range: 'Planilha!A1',
      valueInputOption: 'RAW',
      resource: {
        values
      }
    }).then(() => sheet)
  })
}

function createSheetFromArray(title, rowData) {
  const values = Array.isArray(rowData) ? rowData : []
  return createGoogleSheetWithValues(title, values)
}

function showSheetResult(result) {
  console.log('Planilha criada:', result)
  return result
}

function handleSheetError(error) {
  console.error('Erro ao criar planilha Google:', error)
  throw error
}

window.createSheetFromArray = function (title, rowData) {
  return createSheetFromArray(title, rowData)
    .then(showSheetResult)
    .catch(handleSheetError)
}

window.createSheet = function (title) {
  return createGoogleSheet(title)
    .then(showSheetResult)
    .catch(handleSheetError)
}
