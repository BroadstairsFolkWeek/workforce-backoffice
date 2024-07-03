@description('Name of the environment these provisioned resources relate to. Will be incoporated into resource names.')
@allowed(['dev', 'prod'])
param environmentName string

@description('Common part of the name of the resources to be created')
param resourceBaseName string

@description('Client ID of the application registration in Azure AD that represents the Azure Functions app. This is used to authenticate requests to the Azure Functions app.')
param aadAppClientId string
@description('Client secret of the application registration in Azure AD that represents the Azure Functions app. This is used to authenticate requests to the Azure Functions app.')
@secure()
param aadAppClientSecret string
@description('Tenant ID of the Azure AD tenant that the Azure Functions app is registered in.')
param aadAppTenantId string
@description('Authority host of the Azure AD tenant that the Azure Functions app is registered in.')
param aadAppOauthAuthorityHost string

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

param location string = resourceGroup().location

@description('Tags to be applied to all resources in this deployment')
param tags object = {
  application: 'workforce-backoffice'
  environment: environmentName
}

module frontEnd 'modules/azure-frontend.bicep' = {
  name: 'azure-frontend'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    tags: tags
  }
}

@description('Application ID URI of the Azure AD application that represents the Azure Functions app. Must match the identifierUris property in aad.manifest.json.')
var aadApplicationIdUri = 'api://${frontEnd.outputs.siteDomain}/${aadAppClientId}'

module azureFunctions 'modules/azure-functions.bicep' = {
  name: 'azure-functions'
  params: {
    resourceBaseName: resourceBaseName
    location: location
    tags: tags
    allowedOrigins: [frontEnd.outputs.tabEndpoint]
    aadAppTenantId: aadAppTenantId
    aadAppClientId: aadAppClientId
    aadAppClientSecret: aadAppClientSecret
    aadAppOauthAuthorityHost: aadAppOauthAuthorityHost
    aadApplicationIdUri: aadApplicationIdUri
    groupId: groupId
    wfApiUrl: wfApiUrl
    wfApiClientAuthAuthority: wfApiClientAuthAuthority
    wfApiClientAuthClientId: wfApiClientAuthClientId
    wfApiClientAuthClientSecret: wfApiClientAuthClientSecret
    wfApiClientAuthScope: wfApiClientAuthScope
    frontEndStorageId: frontEnd.outputs.storageId
    frontEndStorageName: frontEnd.outputs.storageName
    frontEndStorageApiVersion: frontEnd.outputs.storageApiVersion
  }
}

// If this bicep script has been run using the 'teamsapp provision command', then the following outputs will be written
// to the ./env/.env.@envname} file. The .env file should be committed to source control so that it can be used by
// other teamsapp commands.
// See https://aka.ms/teamsfx-actions/arm-deploy
output TAB_AZURE_STORAGE_RESOURCE_ID string = frontEnd.outputs.storageId
output TAB_DOMAIN string = frontEnd.outputs.siteDomain
output TAB_ENDPOINT string = frontEnd.outputs.tabEndpoint
output API_FUNCTION_ENDPOINT string = azureFunctions.outputs.apiEndpoint
output API_FUNCTION_RESOURCE_ID string = azureFunctions.outputs.functionsId
