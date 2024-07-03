param resourceBaseName string
param location string
param tags object

param storageSKU string = 'Standard_LRS'

// Static website storage
resource storage 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  kind: 'StorageV2'
  location: location
  name: resourceBaseName
  properties: {
    supportsHttpsTrafficOnly: true
  }
  sku: {
    name: storageSKU
  }
  tags: tags
}

var siteDomain = replace(replace(storage.properties.primaryEndpoints.web, 'https://', ''), '/', '')

output siteDomain string = siteDomain
output tabEndpoint string = 'https://${siteDomain}'
output storageId string = storage.id
output storageName string = storage.name
output storageApiVersion string = storage.apiVersion
