param resourceBaseName string
param location string
param tags object

@description('Client ID of the application registration in Azure AD that represents the Azure Functions app. This is used to authenticate requests to the Azure Functions app.')
param aadAppClientId string
@description('Tenant ID of the Azure AD tenant that the Azure Functions app is registered in.')
param aadAppTenantId string
@description('Authority host of the Azure AD tenant that the Azure Functions app is registered in.')
param aadAppOauthAuthorityHost string
@description('Client secret of the application registration in Azure AD that represents the Azure Functions app. This is used to authenticate requests to the Azure Functions app.')
@secure()
param aadAppClientSecret string

@description('Application ID URI of the Azure AD application that represents the Azure Functions app. Must match the identifierUris property in aad.manifest.json.')
param aadApplicationIdUri string

@description('Array of origin URLs that are allowed to make requests to the function app')
param allowedOrigins array

@description('URL of the Workforce Services API')
param wfApiUrl string
@description('Authority host of the Workforce Services API client')
param wfApiClientAuthAuthority string
@description('Client ID to authenticate as when accessing the Workforce Services API')
param wfApiClientAuthClientId string
@description('Client secret to authenticate with when accessing the Workforce Services API')
@secure()
param wfApiClientAuthClientSecret string
@description('Scope to request when authenticating with the Workforce Services API')
param wfApiClientAuthScope string

@description('ID of the Microsoft 365 group which holds workforce services data (SharePoint lists and libraries)')
param groupId string

@description('Resource ID of the storage account that hosts the frontend')
param frontEndStorageId string
@description('Name of the storage account that hosts the frontend')
param frontEndStorageName string
@description('API version of the storage account that hosts the frontend')
param frontEndStorageApiVersion string

@description('Resource ID of the Log Analytics workspace to be used by Application Insights')
param logAnalyticsWorkspaceId string

param functionStorageName string = '${resourceBaseName}api'
param functionStorageSKU string = 'Standard_LRS'

var oauthAuthority = uri(aadAppOauthAuthorityHost, aadAppTenantId)

var teamsMobileOrDesktopAppClientId = '1fec8e78-bce4-4aaf-ab1b-5451cc387264'
var teamsWebAppClientId = '5e3ce6c0-2b1f-4285-8d4b-75ee78787346'
var officeWebAppClientId1 = '4345a7b9-9a63-4910-a426-35363201d503'
var officeWebAppClientId2 = '4765445b-32c6-49b0-83e6-1d93765276ca'
var outlookDesktopAppClientId = 'd3590ed6-52b3-4102-aeff-aad2292ab01c'
var outlookWebAppClientId = '00000002-0000-0ff1-ce00-000000000000'
var officeUwpPwaClientId = '0ec893e0-5785-4de6-99da-4ed124e5296c'
var outlookOnlineAddInAppClientId = 'bc59ab01-8403-45c6-8796-ac3ef710b3e3'
var authorizedClientApplicationIds = '${teamsMobileOrDesktopAppClientId};${teamsWebAppClientId};${officeWebAppClientId1};${officeWebAppClientId2};${outlookDesktopAppClientId};${outlookWebAppClientId};${officeUwpPwaClientId};${outlookOnlineAddInAppClientId}'
var allowedClientApplications = '"${teamsMobileOrDesktopAppClientId}","${teamsWebAppClientId}","${officeWebAppClientId1}","${officeWebAppClientId2}","${outlookDesktopAppClientId}","${outlookWebAppClientId}","${officeUwpPwaClientId}","${outlookOnlineAddInAppClientId}"'

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: resourceBaseName
  location: location
  tags: tags
  kind: 'other'
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Bluefield'
    Request_Source: 'CustomDeployment'
    WorkspaceResourceId: logAnalyticsWorkspaceId
  }
}

// Azure Storage is required when creating Azure Functions instance
resource functionStorage 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: functionStorageName
  kind: 'StorageV2'
  location: location
  sku: {
    name: functionStorageSKU // You can follow https://aka.ms/teamsfx-bicep-add-param-tutorial to add functionStorageSKUproperty to provisionParameters to override the default value "Standard_LRS".
  }
}

// Compute resources for Azure Functions
resource serverfarms 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: resourceBaseName
  kind: 'functionapp'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {}
  tags: tags
}

// Azure Functions that hosts your function code
resource functionApp 'Microsoft.Web/sites@2021-02-01' = {
  name: resourceBaseName
  kind: 'functionapp'
  location: location
  properties: {
    serverFarmId: serverfarms.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: true
      cors: {
        allowedOrigins: allowedOrigins
      }
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: ' AzureWebJobsDashboard'
          value: 'DefaultEndpointsProtocol=https;AccountName=${functionStorage.name};AccountKey=${functionStorage.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}' // Azure Functions internal setting
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${functionStorage.name};AccountKey=${functionStorage.listKeys().keys[0].value};EndpointSuffix=${environment().suffixes.storage}' // Azure Functions internal setting
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4' // Use Azure Functions runtime v4
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node' // Set runtime to NodeJS
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${frontEndStorageName};AccountKey=${listKeys(frontEndStorageId, frontEndStorageApiVersion).keys[0].value};EndpointSuffix=${environment().suffixes.storage}' // Azure Functions internal setting
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1' // Run Azure Functions from a package file
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~18' // Set NodeJS version to 18.x
        }
        {
          name: 'ALLOWED_APP_IDS'
          value: authorizedClientApplicationIds
        }
        {
          name: 'M365_CLIENT_ID'
          value: aadAppClientId
        }
        {
          name: 'M365_CLIENT_SECRET'
          value: aadAppClientSecret
        }
        {
          name: 'M365_TENANT_ID'
          value: aadAppTenantId
        }
        {
          name: 'M365_AUTHORITY_HOST'
          value: aadAppOauthAuthorityHost
        }
        {
          name: 'M365_APPLICATION_ID_URI'
          value: aadApplicationIdUri
        }
        {
          name: 'WEBSITE_AUTH_AAD_ACL'
          value: '{"allowed_client_applications": [${allowedClientApplications}]}'
        }
        { name: 'WF_API_URL', value: wfApiUrl }
        { name: 'WF_API_CLIENT_AUTH_AUTHORITY', value: wfApiClientAuthAuthority }
        { name: 'WF_API_CLIENT_AUTH_CLIENT_ID', value: wfApiClientAuthClientId }
        { name: 'WF_API_CLIENT_AUTH_CLIENT_SECRET', value: wfApiClientAuthClientSecret }
        { name: 'WF_API_CLIENT_AUTH_SCOPE', value: wfApiClientAuthScope }
        { name: 'GROUP_ID', value: groupId }
      ]
      ftpsState: 'FtpsOnly'
    }
  }
}

resource authSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  parent: functionApp
  name: 'authsettings'
  properties: {
    enabled: true
    defaultProvider: 'AzureActiveDirectory'
    clientId: aadAppClientId
    issuer: '${oauthAuthority}/v2.0'
    allowedAudiences: [
      aadAppClientId
      aadApplicationIdUri
    ]
  }
}

output functionsId string = functionApp.id
output apiEndpoint string = 'https://${functionApp.properties.defaultHostName}'
